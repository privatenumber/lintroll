# test readme

```js
import A from 'b'

const data = A({
    a: 1,
    b: 2
})

console.log(data)
```

```ts
import A from 'b'

type SomeType = {
    paddingRight?: number
    paddingLeft?: number
    paddingTop?: number
    paddingBottom?: number
}

const data = A({
    a: 1,
    b: 2
})

console.log(data)
```

```json5
{
    "name": "test"
}
```

```vue
<template>
    <SomeComponent>
        Hello world
        <undefined-component />
    </SomeComponent>
</template>

<script>
import SomeComponent from 'b'

console.log(SomeComponent)

export default {
    components: {
        SomeComponent
    }
}
</script>
```

```jsx
<CheckIcon style="fill: red" />
```
