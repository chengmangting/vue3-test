<!-- 仿钉钉跳转H5 -->

<template>
  <div class="page">
    <van-loading type="spinner" color="#1989fa" vertical class="box">正在登录中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import { getCompanyInfo } from '@/service/test'
import { useRoute } from 'vue-router'
const route = useRoute()
// 获取appid
const getGotoUrl = async () => {
  window.localStorage.clear()
  let { company_code } = route.query
  console.log('获取company_code:::::', company_code)
  let res = await getCompanyInfo({ company_code })
  company_code && window.localStorage.setItem('company_code', company_code as string)

  let REDIRECT_URI = encodeURIComponent(`${window.location.protocol}//${window.location.host}/home`)
  let gourl = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${res.data.app_key}&response_type=code&scope=snsapi_auth&state=STATE&redirect_uri=${REDIRECT_URI}`
  window.location.href = gourl
}

getGotoUrl()
</script>

<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 20%;
}
</style>
