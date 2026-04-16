import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignalArgs, toValue, toValueArgs } from '@lazyqwik/shared';

export function useAverage(...values: MaybeSignalArgs<number>) {
	return useComputed$(() => {
		const arr = toValueArgs(values);
		const sum = arr.reduce((acc, val) => acc + val, 0);
		return toValue(sum) / values.length;
	});
}
