<template>
  <div class="box">
    <p>count:{{ count }}</p>
    <p>doubleCount:{{ doubleCount }}</p>
    <van-button type="primary" @click="increment">anniu</van-button>
  </div>
</template>

<script setup lang="ts">
import { getShopGroupList } from '@/service/test'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

showToast('anc')
async function getList() {
  await getShopGroupList()
}
getList()
const store = useCounterStore()
const { count, doubleCount } = storeToRefs(store)
const { increment } = store
</script>
<style scoped>
.box {
  width: 10rem;
  text-align: center;
}
</style>
