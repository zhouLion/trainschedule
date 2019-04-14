<template>
  <div>
    <Applications apptitle="我的申请">
      <div slot="action" slot-scope="{ props, array }">
        <v-btn flat icon small color="orange" @click="settingBack(props)">
          <v-icon>settings_backup_restore</v-icon>
        </v-btn>
        <v-btn flat icon small color="red" @click="showProps(props, array)">
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </Applications>
  </div>
</template>

<script>
import Applications from "../../components/table/Applications";
export default {
  name: "",
  components: {
    Applications
  },
  data() {
    return {};
  },
  methods: {
    showProps(props, project) {
      let index = project.findIndex(item => props.item.id == item.id);
      project.splice(index, 1);
    },
    settingBack(props, project) {}
  }
};
</script>

<style lang="" scoped>
</style>