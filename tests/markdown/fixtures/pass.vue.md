# test readme

```vue
<template>
    <SomeComponent>
        Hello world
        <undefined-component />

        <div v-for="i in 10">
            {{ i }}
        </div>
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
