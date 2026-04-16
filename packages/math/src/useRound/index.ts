import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@lazyqwik/shared';

export function useRound(value: MaybeSignal<number>) {
	return useComputed$(() => Math.round(toValue(value)));
}
