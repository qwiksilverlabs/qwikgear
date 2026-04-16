import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@lazyqwik/shared';

export function useFloor(value: MaybeSignal<number>) {
	return useComputed$(() => Math.floor(toValue(value)));
}
