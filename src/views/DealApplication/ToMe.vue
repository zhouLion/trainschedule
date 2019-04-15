<template>
  <div>
    <Applications
      apptitle="待我审核"
      :loading="onloading"
      :data="applicationToMe"
    >
      <v-btn icon @click="fetchApplications" slot="headerAction">
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
    <v-snackbar top v-model="showSnackbar">
      {{ operate }}
      <v-btn flat color="primary" @click.native="rebackPrevOperate">撤销</v-btn>
    </v-snackbar>
  </div>
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
      applicationToMe: [],
      onloading: false,
      showSnackbar: false,
      operate: null,
      prevId: null
    };
  },
  mounted() {
    this.fetchApplications();
  },
  watch: {
    // showSnackbar(val) {
    //   let { operate, prevId } = this;
    //   if (val == false && prevId) {
    //     console.log("执行操作", { operate, prevId });
    //     setTimeout(() => {
    //       this.operate = null;
    //       this.prevId = null;
    //     }, 100);
    //   }
    // }
  },
  methods: {
    // rebackPrevOperate() {
    //   this.operate = null;
    //   this.prevId = null;
    //   this.showSnackbar = false;
    // },
    returnAssign({ item }) {
      // let prevId = item.id;
      // this.showSnackbar = false;
      // this.operate = "驳回操作";
      // this.prevId = prevId;
      // this.$nextTick(() => {
      //   this.showSnackbar = true;
      // });
    },
    turnInAssign({ item }) {
      // let prevId = item.id;
      // this.showSnackbar = false;
      // this.operate = "通过操作";
      // this.prevId = prevId;
      // this.$nextTick(() => {
      //   this.showSnackbar = true;
      // });
    },
    fetchApplications() {
      this.onloading = true;
      apply
        .getApplyFromCompany({
          path: "Root"
        })
        .then(data => {
          this.applicationToMe = data.data;
        })
        .finally(() => {
          this.onloading = false;
        });
    }
  }
};
</script>

<style lang="" scoped>
</style>