import { $, QRL, ReadonlySignal, useSignal } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export type UseCounterOptions = {
	min?: number;
	max?: number;
};

export type UseCounterReturn = {
	counter: ReadonlySignal<number>;
	inc: QRL<(delta?: number) => void>;
	dec: QRL<(delta?: number) => void>;
	set: QRL<(value: number) => void>;
	reset: QRL<(resetTo?: number) => void>;
};

export function useCounter(
	initialValue: MaybeSignal<number> = 0,
	options: UseCounterOptions = {},
): UseCounterReturn {
	const resolvedInitial = toValue(initialValue) ?? 0;
	const state = useSignal(resolvedInitial);

	const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } = options;

	const inc = $((delta: number = 1) => {
		state.value = Math.max(Math.min(max, state.value + delta), min);
	});
	const dec = $((delta: number = 1) => {
		state.value = Math.min(Math.max(min, state.value - delta), max);
	});
	const set = $((value: number) => {
		state.value = Math.max(min, Math.min(max, value));
	});
	const reset = $(async (value?: number) => {
		await set(value ?? resolvedInitial);
	});

	return { counter: state, inc, dec, set, reset };
}
