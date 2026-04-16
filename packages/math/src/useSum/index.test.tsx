import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useSum } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseSumTestProps {
	a: number;
	b: number;
}

interface UseSumThreeTestProps {
	a: number;
	b: number;
	c: number;
}

const UseSumTestComponent = component$<UseSumTestProps>(({ a, b }) => {
	const value1 = useSignal(a);
	const value2 = useSignal(b);
	const sumResult = useSum(value1, value2);
	return (
		<div>
			<p id="result-text">{sumResult.value}</p>
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

const UseSumThreeTestComponent = component$<UseSumThreeTestProps>(({ a, b, c }) => {
	const value1 = useSignal(a);
	const sumResult = useSum(value1, b, c);
	return (
		<div>
			<p id="result-text">{sumResult.value}</p>
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
	await render(<UseSumTestComponent a={a} b={b} />);
	return { screen, userEvent };
};

const renderThree = async (a: number, b: number, c: number) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseSumThreeTestComponent a={a} b={b} c={c} />);
	return { screen, userEvent };
};

describe('useSum', () => {
	describe('initial render', () => {
		it('should return the sum of two equal values', async () => {
			const { screen } = await renderDefault(5, 5);
			expect(getResultText(screen)).toBe('10');
		});

		it('should return the sum of two different values', async () => {
			const { screen } = await renderDefault(10, 20);
			expect(getResultText(screen)).toBe('30');
		});

		it('should return the sum of two negative values', async () => {
			const { screen } = await renderDefault(-10, -20);
			expect(getResultText(screen)).toBe('-30');
		});

		it('should return the sum of a negative and a positive', async () => {
			const { screen } = await renderDefault(-10, 10);
			expect(getResultText(screen)).toBe('0');
		});

		it('should return the sum when one value is zero', async () => {
			const { screen } = await renderDefault(0, 20);
			expect(getResultText(screen)).toBe('20');
		});

		it('should return zero when both values are zero', async () => {
			const { screen } = await renderDefault(0, 0);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle floating-point values', async () => {
			const { screen } = await renderDefault(1.5, 2.5);
			expect(getResultText(screen)).toBe('4');
		});

		it('should return the sum of three values', async () => {
			const { screen } = await renderThree(10, 20, 30);
			expect(getResultText(screen)).toBe('60');
		});
	});

	describe('reactivity', () => {
		it('should update the sum when a signal changes', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('40');
		});

		it('should return the original sum when signal is reset', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#increment-a', 'click');
			await userEvent('#reset-a', 'click');
			expect(getResultText(screen)).toBe('30');
		});

		it('should handle signal set to zero', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-a-zero', 'click');
			expect(getResultText(screen)).toBe('20');
		});

		it('should update correctly across multiple transitions', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('40');

			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('50');

			await userEvent('#reset-a', 'click');
			expect(getResultText(screen)).toBe('30');

			await userEvent('#set-a-zero', 'click');
			expect(getResultText(screen)).toBe('20');
		});

		it('should update sum when signal changes in a three-value call', async () => {
			const { screen, userEvent } = await renderThree(10, 20, 30);
			await userEvent('#increment-a', 'click');
			expect(getResultText(screen)).toBe('90');
		});
	});
});
