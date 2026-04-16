import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@lazyqwik/shared';

export function useTrunc(value: MaybeSignal<number>) {
	return useComputed$(() => Math.trunc(toValue(value)));
}
