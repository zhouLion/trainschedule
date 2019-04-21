<template>
  <div>
    <Applications
      apptitle="我的申请"
      :loading="onloading"
      :data="applicationFromMe"
      @requestMore="requestMoreData"
    >
      <template slot="headerAction" slot-scope="{ selected }">
        <v-tooltip bottom>
          <v-btn icon slot="activator">
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
          批量撤回
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            :disabled="!selected || selected.length == 0"
            @click="removeMany(selected)"
            icon
            slot="activator"
          >
            <v-icon color="error">delete</v-icon>
          </v-btn>
          批量删除
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon slot="activator" to="/addapplication">
            <v-icon>add</v-icon>
          </v-btn>
          新建申请
        </v-tooltip>
        <v-btn icon @click="fetchApplications(false)">
          <v-icon>refresh</v-icon>
        </v-btn>
      </template>
      <div slot="action" slot-scope="{ props, array }">
        <v-tooltip bottom>
          <v-btn
            flat
            icon
            slot="activator"
            small
            :loading="appliesOnHandle.includes(props.item)"
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
            :loading="appliesOnHandle.includes(props.item)"
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
import applications from "../../api/applications";

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
      appliesOnHandle: [],
      pageSize: 10
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    // 撤回操作
    withdraw({ item }) {
      this.appliesOnHandle.push(item);
      applications
        .withdraw(item.id)
        .then(d => {
          let indexItem = this.applicationFromMe.findIndex(
            apply => apply.id == item.id
          );
          // this.appliesOnHandle.push(item);
          this.applicationFromMe.splice(indexItem, 1);
          return this.$Message({
            message: "撤回成功"
          });
        })
        .finally(() => {
          this.removeHandleStatus(item);
        });
    },
    removeMany(selected) {
      console.log(selected);
    },
    // 删除操作
    removeApply({ item }) {
      this.appliesOnHandle.push(item);
      applications
        .removeApply(item.id)
        .then(d => {
          let indexItem = this.applicationFromMe.findIndex(
            apply => apply.id == item.id
          );
          this.applicationFromMe.splice(indexItem, 1);
          return this.$Message({
            message: "删除成功"
          });
        })
        .finally(() => {
          this.removeHandleStatus(item);
        });
    },
    removeHandleStatus(item) {
      let index = this.appliesOnHandle.findIndex(apply => apply.id == item.id);
      this.appliesOnHandle.splice(index, 1);
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
          this.page = this.page + 1;
          // 如果是append模式，则数据将叠加到源数组上
          if (append == true) {
            applies = this.applicationFromMe.concat(applies);
          }
          this.applicationFromMe = applies;
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