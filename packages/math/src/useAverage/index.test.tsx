import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useAverage } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseAverageTestProps {
	a: number;
	b: number;
}

interface UseAverageThreeTestProps {
	a: number;
	b: number;
	c: number;
}

const UseAverageTestComponent = component$<UseAverageTestProps>(({ a, b }) => {
	const value1 = useSignal(a);
	const value2 = useSignal(b);
	const averageResult = useAverage(value1, value2);
	return (
		<div>
			<p id="result-text">{averageResult.value}</p>
			<button id="increment-a" onClick$={() => (value1.value += 10)}>
				Increment A
			</button>
			<button id="reset-a" onClick$={() => (value1.value = a)}>
				Reset A
			</button>
			<button id="set-a-zero" onClick$={() => (value1.value = 0)}>
				Set A To Zero
			</button>
		</div>
	);
});

const UseAverageThreeTestComponent = component$<UseAverageThreeTestProps>(({ a, b, c }) => {
	const value1 = useSignal(a);
	const averageResult = useAverage(value1, b, c);
	return (
		<div>
			<p id="result-text">{averageResult.value}</p>
			<button id="increment-a" onClick$={() => (value1.value += 30)}>
				Increment A
			</button>
		</div>
	);
});

const getResultText = (screen: ParentNode) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

const DEFAULT_A = 10;
const DEFAULT_B = 20;

const renderDefault = async (a = DEFAULT_A, b = DEFAULT_B) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseAverageTestComponent a={a} b={b} />);
	return { screen, userEvent };
};

const renderThree = async (a: number, b: number, c: number) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseAverageThreeTestComponent a={a} b={b} c={c} />);
	return { screen, userEvent };
};

describe('useAverage', () => {
	describe('initial render', () => {
		it('should return the average of two equal values', async () => {
			const { screen } = await renderDefault(5, 5);
			expect(getResultText(screen)).toBe('5');
		});

		it('should return the average of two different values', async () => {
			const { screen } = await renderDefault(10, 20);
			expect(getResultText(screen)).toBe('15');
		});

		it('should return the average of two negative values', async () => {
			const { screen } = await renderDefault(-10, -20);
			expect(getResultText(screen)).toBe('-15');
		});

		it('should return the average of a negative and a positive', async () => {
			const { screen } = await renderDefault(-10, 10);
			expect(getResultText(screen)).toBe('0');
		});

		it('should return the average when one value is zero', async () => {
			const { screen } = await renderDefault(0, 20);
			expect(getResultText(screen)).toBe('10');
		});

		it('should return zero when both values are zero', async () => {
			const { screen } = await renderDefault(0, 0);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle floating-point values', async () => {
			const { screen } = await renderDefault(1.5, 2.5);
			expect(getResultText(screen)).toBe('2');
		});

		it('should return the average of three values', async () => {
			const { screen } = await renderThree(10, 20, 30);
			expect(getResultText(screen)).toBe('20');
		});
	});

	describe('reactivity', () => {
		it('should update the average when a signal changes', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('20');
		});

		it('should return the original average when signal is reset', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#increment-a', 'click');
			await userEvent('#reset-a', 'click');
			expect(getResultText(screen)).toBe('15');
		});

		it('should handle signal set to zero', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-a-zero', 'click');
			expect(getResultText(screen)).toBe('10');
		});

		it('should update correctly across multiple transitions', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('20');

			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('25');

			await userEvent('#reset-a', 'click');
			expect(getResultText(screen)).toBe('15');

			await userEvent('#set-a-zero', 'click');
			expect(getResultText(screen)).toBe('10');
		});

		it('should update average when signal changes in a three-value call', async () => {
			const { screen, userEvent } = await renderThree(10, 20, 30);
			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('30');
		});
	});
});
