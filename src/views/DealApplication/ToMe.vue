<template>
  <Applications
    apptitle="待我审核"
    :loading="onloading"
    @requestMore="requestMoreData"
    :data="applicationToMe"
  >
    <template slot="headerAction" slot-scope="{ selected }">
      <v-tooltip bottom>
        <v-btn
          icon
          @click="authApply(selected, 0)"
          :disabled="!selected || selected.length == 0"
          slot="activator"
        >
          <v-icon>assignment_return</v-icon>
        </v-btn>
        批量驳回
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          :disabled="!selected || selected.length == 0"
          @click="authApply(selected, 1)"
          icon
          slot="activator"
        >
          <v-icon color="error">assignment_turned_in</v-icon>
        </v-btn>
        批量通过
      </v-tooltip>
      <v-btn icon @click="fetchApplications(false)">
        <v-icon>refresh</v-icon>
      </v-btn>
    </template>

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
    <v-dialog
      v-model="dialog"
      scrollable
      fullscreen
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      123
    </v-dialog>
  </Applications>
</template>

<script>
import Applications from "../../components/table/Applications";
import apply from "../../api/applications";
export default {
  name: "i_deal",
  components: {
    Applications
  },
  data() {
    return {
      dialog: false,
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
    returnAssign(props) {
      console.log(props);
    },
    turnInAssign(props) {},
    authApply(selected, type) {
      this.dialog = true;
    },
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
          this.page = this.page + 1;
          // 如果是append模式，则数据将叠加到源数组上
          if (append == true) {
            applies = this.applicationToMe.concat(applies);
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