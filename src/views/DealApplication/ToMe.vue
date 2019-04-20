<template>
  <Applications
    apptitle="待我审核"
    :loading="onloading"
    @requestMore="requestMoreData"
    :data="applicationToMe"
  >
    <v-btn icon @click="fetchApplications(false)" slot="headerAction">
      <v-icon>refresh</v-icon>
    </v-btn>
    <div slot="action" slot-scope="{ props, array }">
      <v-tooltip top color="error">
        <v-btn
          slot="activator"
          flat
          :loading="prevId == props.item.id"
          icon
          small
          color="error"
          @click="returnAssign(props)"
        >
          <v-icon>assignment_return</v-icon>
        </v-btn>
        驳回
      </v-tooltip>
      <v-tooltip top color="success">
        <v-btn
          slot="activator"
          flat
          :loading="prevId == props.item.id"
          icon
          small
          color="success"
          @click="turnInAssign(props)"
        >
          <v-icon>assignment_turned_in</v-icon>
        </v-btn>
        通过
      </v-tooltip>
    </div>
  </Applications>
</template>

<script>
import Applications from "../../components/table/Applications";
import apply from "../../api/applications";
import { format } from "timeago.js";
export default {
  name: "i_deal",
  components: {
    Applications
  },
  data() {
    return {
      applicationToMe: [],
      onloading: false,
      page: 0,
      pageSize: 10,
      operate: null,
      prevId: null
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    returnAssign({ item }) {},
    turnInAssign({ item }) {},

    /**
     * 获取我的待处理申请
     */
    fetchApplications(append = false) {
      if (this.onloading == true) {
        return false;
      }
      if (append == false) {
        this.page = 0;
      }
      this.onloading = true;
      apply
        .getApplyFromUser({
          page: this.page,
          pageSize: this.pageSize
        })
        .then(data => {
          let { applies } = data;
          // 当加载的数据量小于预期值，表示数据加载结束
          if (applies.length < this.pageSize) {
            this.$Message({
              message: "加载完毕"
            });
          }
          applies.forEach(apply => {
            apply.create = format(apply.create, "zh_CN");
          });
          // 如果是append模式，则数据将叠加到源数组上
          if (append == true) {
            this.page = this.page + 1;
            return (this.applicationToMe = this.applicationToMe.concat(
              applies
            ));
          }
          return (this.applicationToMe = applies);
        })
        .finally(() => {
          this.onloading = false;
        });
    },

    /**
     * 子组件中加载更多
     */
    requestMoreData() {
      return this.fetchApplications(true);
    }
  }
};
</script>

<style lang="" scoped>
</style>