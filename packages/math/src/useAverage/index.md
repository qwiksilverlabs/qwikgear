# useAverage

Calculates the average of the given numbers reactively.

## Usage

```tsx
import { useAverage } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(2);
const c = useSignal(3);

const x = useAverage(a, b, c); // Signal<2>
```

```tsx
import { useAverage } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(2);
const c = useSignal(3);

const x = useAverage([a, b, c]); // Signal<2>
```
