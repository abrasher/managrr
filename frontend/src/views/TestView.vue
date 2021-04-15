<template>
  <div>
    {{ query.data.value }}
  </div>
</template>

<script lang="ts" setup>
import { GetSettingsDocument } from '../graphql/generated-types'
import { useQuery } from '@urql/vue'

const query = useQuery({ query: GetSettingsDocument })

query.then((res) => {
  res.pause()
})
</script>
