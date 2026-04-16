import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useTrunc } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseTrunkTestProps {
	value: number;
}

const UseTrunkTestComponent = component$<UseTrunkTestProps>(({ value }) => {
	const signal = useSignal(value);
	const trunkResult = useTrunc(signal);
	return (
		<div>
			<p id="result-text">{trunkResult.value}</p>
			<button id="set-positive-decimal" onClick$={() => (signal.value = 4.9)}>
				Set Positive Decimal
			</button>
			<button id="set-negative-decimal" onClick$={() => (signal.value = -4.9)}>
				Set Negative Decimal
			</button>
			<button id="set-integer" onClick$={() => (signal.value = 7)}>
				Set Integer
			</button>
			<button id="set-zero" onClick$={() => (signal.value = 0)}>
				Set Zero
			</button>
		</div>
	);
});

const getResultText = (screen: ParentNode) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

const DEFAULT_VALUE = 3.7;

const renderDefault = async (value = DEFAULT_VALUE) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseTrunkTestComponent value={value} />);
	return { screen, userEvent };
};

describe('useTrunk', () => {
	describe('initial render', () => {
		it('should truncate a positive decimal toward zero', async () => {
			const { screen } = await renderDefault(4.9);
			expect(getResultText(screen)).toBe('4');
		});

		it('should truncate a negative decimal toward zero', async () => {
			const { screen } = await renderDefault(-4.9);
			expect(getResultText(screen)).toBe('-4');
		});

		it('should return an integer unchanged', async () => {
			const { screen } = await renderDefault(7);
			expect(getResultText(screen)).toBe('7');
		});

		it('should return zero for zero', async () => {
			const { screen } = await renderDefault(0);
			expect(getResultText(screen)).toBe('0');
		});

		it('should truncate a value between 0 and 1', async () => {
			const { screen } = await renderDefault(0.99);
			expect(getResultText(screen)).toBe('0');
		});

		it('should truncate a value between -1 and 0', async () => {
			const { screen } = await renderDefault(-0.99);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle large decimal values', async () => {
			const { screen } = await renderDefault(1234567.89);
			expect(getResultText(screen)).toBe('1234567');
		});
	});

	describe('reactivity', () => {
		it('should update when signal changes to a positive decimal', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-positive-decimal', 'click');
			expect(getResultText(screen)).toBe('4');
		});

		it('should update when signal changes to a negative decimal', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-negative-decimal', 'click');
			expect(getResultText(screen)).toBe('-4');
		});

		it('should update when signal changes to an integer', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-integer', 'click');
			expect(getResultText(screen)).toBe('7');
		});

		it('should update when signal changes to zero', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-zero', 'click');
			expect(getResultText(screen)).toBe('0');
		});

		it('should update correctly across multiple transitions', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#set-positive-decimal', 'click');
			expect(getResultText(screen)).toBe('4');

			await userEvent('#set-negative-decimal', 'click');
			expect(getResultText(screen)).toBe('-4');

			await userEvent('#set-integer', 'click');
			expect(getResultText(screen)).toBe('7');

			await userEvent('#set-zero', 'click');
			expect(getResultText(screen)).toBe('0');
		});
	});
});
