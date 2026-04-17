import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { logicAnd } from '.';
import { component$, useSignal } from '@builder.io/qwik';

const LogicAndTestComponent = component$<{ a: boolean; b: boolean; c?: boolean }>(({ a, b, c }) => {
	const signalA = useSignal(a);
	const signalB = useSignal(b);
	const signalC = useSignal(c ?? true);
	const result = logicAnd(signalA, signalB, signalC);

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
			<button id="set-c-false" onClick$={() => (signalC.value = false)}>
				Set C False
			</button>
		</div>
	);
});

const TwoArgComponent = component$<{ a: boolean; b: boolean }>(({ a, b }) => {
	const signalA = useSignal(a);
	const signalB = useSignal(b);
	const result = logicAnd(signalA, signalB);

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
		</div>
	);
});

const getResultText = (screen: HTMLElement) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

describe('logicAnd', () => {
	describe('initial render', () => {
		it('should return true when all args are true', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={true} b={true} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return false when first arg is false', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={false} b={true} />);
			expect(getResultText(screen)).toBe('false');
		});

		it('should return false when second arg is false', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={true} b={false} />);
			expect(getResultText(screen)).toBe('false');
		});

		it('should return false when all args are false', async () => {
			const { render, screen } = await createDOM();
			await render(<TwoArgComponent a={false} b={false} />);
			expect(getResultText(screen)).toBe('false');
		});

		it('should return true when all multiple args are true', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicAndTestComponent a={true} b={true} c={true} />);
			expect(getResultText(screen)).toBe('true');
		});

		it('should return false when any of multiple args is false', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicAndTestComponent a={true} b={true} c={false} />);
			expect(getResultText(screen)).toBe('false');
		});
	});

	describe('reactivity', () => {
		it('should update to false when one signal changes from true to false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<TwoArgComponent a={true} b={true} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-a-false', 'click');
			expect(getResultText(screen)).toBe('false');
		});

		it('should update to true when all signals change to true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<TwoArgComponent a={false} b={true} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-a-true', 'click');
			expect(getResultText(screen)).toBe('true');
		});

		it('should remain false when only one of many false args turns true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicAndTestComponent a={false} b={false} c={true} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-a-true', 'click');
			expect(getResultText(screen)).toBe('false');
		});

		it('should become true only when all args are true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicAndTestComponent a={false} b={false} c={true} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-a-true', 'click');
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-b-true', 'click');
			expect(getResultText(screen)).toBe('true');
		});

		it('should become false again when a true arg is set to false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicAndTestComponent a={true} b={true} c={true} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-c-false', 'click');
			expect(getResultText(screen)).toBe('false');
		});
	});
});
