import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignalArgs, toValueArgs } from '@lazyqwik/shared';

export function useSum(...values: MaybeSignalArgs<number>) {
	return useComputed$(() => toValueArgs(values).reduce((sum, value) => sum + value, 0));
}
