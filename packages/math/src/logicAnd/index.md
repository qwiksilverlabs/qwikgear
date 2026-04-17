# logicAnd

`AND` logic for signals.

## Usage

```tsx
import { logicAnd } from '@lazyqwik/math';
import { useSignal } from '@builder.io/qwik';

const a = useSignal(true);
const b = useSignal(false);
const c = useSignal(true);
const d = logicAnd(a, b, c); // Signal<false>
```
