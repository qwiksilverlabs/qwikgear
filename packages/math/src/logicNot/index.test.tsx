import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { logicNot } from '.';
import { component$, useSignal } from '@builder.io/qwik';

const LogicNotTestComponent = component$<{ initial: boolean }>(({ initial }) => {
	const current = useSignal(initial);
	const result = logicNot(current);

	return (
		<div>
			<p id="result-text">{String(result.value)}</p>
			<button id="set-true" onClick$={() => (current.value = true)}>
				Set True
			</button>
			<button id="set-false" onClick$={() => (current.value = false)}>
				Set False
			</button>
		</div>
	);
});

const getResultText = (screen: HTMLElement) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

describe('logicNot', () => {
	describe('initial render', () => {
		it('should return false for a true input', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicNotTestComponent initial={true} />);
			expect(getResultText(screen)).toBe('false');
		});

		it('should return true for a false input', async () => {
			const { render, screen } = await createDOM();
			await render(<LogicNotTestComponent initial={false} />);
			expect(getResultText(screen)).toBe('true');
		});
	});

	describe('reactivity', () => {
		it('should update to false when signal changes from false to true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicNotTestComponent initial={false} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-true', 'click');
			expect(getResultText(screen)).toBe('false');
		});

		it('should update to true when signal changes from true to false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicNotTestComponent initial={true} />);
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-false', 'click');
			expect(getResultText(screen)).toBe('true');
		});

		it('should handle multiple sequential toggles correctly', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<LogicNotTestComponent initial={false} />);
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-true', 'click');
			expect(getResultText(screen)).toBe('false');

			await userEvent('#set-false', 'click');
			expect(getResultText(screen)).toBe('true');

			await userEvent('#set-true', 'click');
			expect(getResultText(screen)).toBe('false');
		});
	});
});
