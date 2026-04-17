# logicOr

`OR` logic for signals.

## Usage

```tsx
import { logicOr } from '@lazyqwik/math';
import { useSignal } from '@builder.io/qwik';

const a = useSignal(true);
const b = useSignal(false);
const c = useSignal(true);
const d = logicOr(a, b, c); // Signal<true>
```
