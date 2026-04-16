# useSum

Calculates the sum of the given numbers reactively.

## Usage

```tsx
import { useSum } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(2);
const c = useSignal(3);

const x = useSum(a, b, c); // Signal<6>
```

```tsx
import { useSum } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(2);
const c = useSignal(3);

const x = useSum([a, b, c]); // Signal<6>
```
