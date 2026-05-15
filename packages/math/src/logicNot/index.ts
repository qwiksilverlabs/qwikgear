import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function logicNot(value: MaybeSignal<any>) {
	return useComputed$(() => !toValue(value));
}
