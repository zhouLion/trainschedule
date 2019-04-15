<template>
  <div>
    <Applications
      apptitle="我的申请"
      :loading="onloading"
      :data="applicationFromMe"
    >
      <v-btn icon @click="fetchApplications" slot="headerAction">
        <v-icon>refresh</v-icon>
      </v-btn>
      <!-- <div slot="action" slot-scope="{ props, array }">
        <v-btn flat icon small color="orange" @click="settingBack(props)">
          <v-icon>settings_backup_restore</v-icon>
        </v-btn>
        <v-btn flat icon small color="red" @click="showProps(props, array)">
          <v-icon>delete</v-icon>
        </v-btn>
      </div> -->
    </Applications>
  </div>
</template>

<script>
import Applications from "../../components/table/Applications";
import apply from "../../api/applications";

export default {
  name: "",
  components: {
    Applications
  },
  data() {
    return {
      applicationFromMe: [],
      onloading: false
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    showProps(props, project) {
      let index = project.findIndex(item => props.item.id == item.id);
      project.splice(index, 1);
    },
    settingBack(props, project) {},
    fetchApplications() {
      this.onloading = true;
      apply
        .getApplyFromUser({
          username: "me"
        })
        .then(data => {
          this.applicationFromMe = data.data;
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