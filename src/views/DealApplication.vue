<template>
  <v-layout column wrap>
    <v-tabs v-model="model">
      <v-tab to="/dealapplication/fromme">我的申请</v-tab>
      <v-tab to="/dealapplication/tome">待我审核</v-tab>
      <!-- <v-tab to="/dealapplication/history">历史记录</v-tab> -->
    </v-tabs>
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
  </v-layout>
</template>
<script>
export default {
  name: "DealApplication",
  components: {},
  data() {
    return {
      model: 1
    };
  }
};
</script>