import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { logicOr } from '.';
import { component$, useSignal } from '@builder.io/qwik';

const LogicOrTestComponent = component$<{ a: boolean; b: boolean; c?: boolean }>(({ a, b, c }) => {
	const signalA = useSignal(a);
	const signalB = useSignal(b);
	const signalC = useSignal(c ?? false);
	const result = logicOr(signalA, signalB, signalC);

	return (
		<div>
			<p id="result-text">{String(result.value)}</p>
			<button id="set-a-true" onClick$={() => (signalA.value = true)}>
				Set A True
			</button>
			<button id="set-a-false" onClick$={() => (signalA.value = false)}>
				Set A False
			</button>
			<button id="set-b-true" onClick$={() => (signalB.value = true)}>
				Set B True
			</button>
			<button id="set-b-false" onClick$={() => (signalB.value = false)}>
				Set B False
			</button>
			<button id="set-c-true" onClick$={() => (signalC.value = true)}>
				Set C True
			</button>
		</div>
	);
});

const TwoArgComponent = component$<{ a: boolean; b: boolean }>(({ a, b }) => {
	const signalA = useSignal(a);
	const signalB = useSignal(b);
	const result = logicOr(signalA, signalB);

	return (
		<div>
			<p id="result-text">{String(result.value)}</p>
			<button id="set-a-false" onClick$={() => (signalA.value = false)}>
				Set A False
			</button>
			<button id="set-b-false" onClick$={() => (signalB.value = false)}>
				Set B False
			</button>
		</div>
	);
});

const getResultText = (screen: HTMLElement) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

describe('logicOr', () => {
	describe('initial render', () => {
		it('should return true when all args are true', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={true} b={true} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return true when at least one arg is true', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={false} b={true} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return true when first arg is true and second is false', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={true} b={false} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return false when all args are false', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={false} b={false} />);
			expect(getResultText(screen)).toBe('false');
		});

		it('should return true when any of multiple args is true', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicOrTestComponent a={false} b={false} c={true} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return false when all multiple args are false', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicOrTestComponent a={false} b={false} c={false} />);
			expect(getResultText(screen)).toBe('false');
		});
	});

	describe('reactivity', () => {
		it('should update to false when all signals change to false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<TwoArgComponent a={true} b={false} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-a-false', 'click');
			expect(getResultText(screen)).toBe('false');
		});

		it('should update to true when one signal changes to true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<TwoArgComponent a={false} b={false} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-b-false', 'click'); // already false, still false
			expect(getResultText(screen)).toBe('false');
		});

		it('should remain true when one of many args turns false but others are still true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicOrTestComponent a={true} b={true} c={false} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-a-false', 'click');
			expect(getResultText(screen)).toBe('true');
		});

		it('should become false only when all args are false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicOrTestComponent a={true} b={true} c={false} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-a-false', 'click');
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-b-false', 'click');
			expect(getResultText(screen)).toBe('false');
		});

		it('should become true again when a false arg is set to true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicOrTestComponent a={false} b={false} c={false} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-c-true', 'click');
			expect(getResultText(screen)).toBe('true');
		});
	});
});
