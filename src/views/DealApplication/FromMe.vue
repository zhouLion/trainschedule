<template>
  <div>
    <Applications
      apptitle="我的申请"
      :loading="onloading"
      :data="applicationFromMe"
      @requestMore="requestMoreData"
    >
      <v-btn icon @click="fetchApplications(false)" slot="headerAction">
        <v-icon>refresh</v-icon>
      </v-btn>
      <div slot="action" slot-scope="{ props, array }">
        <v-tooltip bottom>
          <v-btn
            flat
            icon
            slot="activator"
            small
            color="orange"
            @click="withdraw(props)"
          >
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
          撤回
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            flat
            icon
            slot="activator"
            small
            color="error"
            @click="removeApply(props)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          删除
        </v-tooltip>
      </div>
    </Applications>
  </div>
</template>

<script>
import Applications from "../../components/table/Applications";
import apply from "../../api/applications";
import { format } from "timeago.js";

export default {
  name: "",
  components: {
    Applications
  },
  data() {
    return {
      applicationFromMe: [],
      onloading: false,
      page: 0,
      pageSize: 10
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    // 撤回操作
    withdraw() {
      return this.$Message({
        message: "功能开发中"
      });
    },
    // 删除操作
    removeApply() {
      return this.$Message({
        message: "功能开发中"
      });
    },
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
            return (this.applicationFromMe = this.applicationFromMe.concat(
              applies
            ));
          }
          return (this.applicationFromMe = applies);
        })
        .finally(() => {
          this.onloading = false;
        });
    },
    requestMoreData() {
      return this.fetchApplications(true);
    }
  }
};
</script>

<style lang="" scoped>
</style>