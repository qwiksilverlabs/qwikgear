# useMax

Reactive `Math.max`.

## Usage

```ts
import { useMax } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(2);

const c = useMax(a, b); // Signal<2>
```
