<template>
  <v-card flat class="pa-3">
    <v-toolbar card dense color="transparent">
      <v-toolbar-title
        ><h4>{{ apptitle }}</h4></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="关键词查询"
        @blur="showSearch = false"
        single-line
        hide-details
        outline
        class="pa-0 ma-0"
        small
        v-show="showSearch"
      ></v-text-field>
      <v-btn icon @click="showSearch = true" v-show="!showSearch">
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon @click="showTable = !showTable">
        <v-icon>{{ showTable ? "view_comfy" : "list" }}</v-icon>
      </v-btn>
      <v-btn icon @click="fetchApplications">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0" v-if="showTable">
      <v-container grid-list-md>
        <template>
          <v-data-table
            :headers="headers"
            :rows-per-page-items="rowsPerPageItems"
            :items="applications"
            :search="search"
            v-model="selected"
            :loading="onloading"
            select-all
            item-key="id"
            class="elevation-0"
          >
            <v-progress-linear
              v-slot:progress
              color="blue"
              indeterminate
            ></v-progress-linear>
            <template slot="items" slot-scope="props">
              <!-- <td>
              <v-avatar size="36px">
                <img :src="props.item.avatar" :alt="props.item.from" />
              </v-avatar>
            </td> -->
              <td>
                <v-checkbox
                  v-model="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td>{{ props.item.from }}</td>
              <td>{{ props.item.type }}</td>
              <td class="text-xs-left">{{ props.item.company }}</td>
              <td class="text-xs-left">
                <v-progress-linear
                  :value="props.item.status == 0 ? 40 : 99"
                  height="5"
                  :color="props.item.status == 0 ? 'orange' : 'success'"
                ></v-progress-linear>
              </td>
              <td class="text-xs-right">
                <slot
                  name="action"
                  v-bind="{
                    props: props,
                    array: applications
                  }"
                ></slot>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-container>
    </v-card-text>
    <v-card-text class="pa-0" v-if="!showTable">
      <v-container grid-list-md>
        <v-data-iterator
          :items="applications"
          item-key="name"
          :rows-per-page-items="rowsPerPageItems"
          content-tag="v-layout"
          row
          wrap
          :loading="onloading"
        >
          <template v-slot:item="props">
            <v-flex xs12 sm6 md4 lg3>
              <v-card class="elevation-1">
                <v-card-title>
                  <h4><v-icon>account_box</v-icon>{{ props.item.from }}</h4>
                  <v-spacer></v-spacer>
                  <v-chip class="pa-0" color="orange" small
                    >{{ props.item.type }}申请</v-chip
                  >
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-tile>
                    <v-list-tile-content>申请人:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      props.item.from
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>申请类型:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      props.item.type
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>所在单位:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      props.item.company
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>审批进度:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      <v-progress-linear
                        :value="props.item.status == 0 ? 40 : 99"
                        height="5"
                        :color="props.item.status == 0 ? 'orange' : 'success'"
                      ></v-progress-linear>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Sodium:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      <slot
                        name="action"
                        v-bind="{
                          props: props,
                          array: applications
                        }"
                      ></slot>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import apply from "../../api/applications";
export default {
  data() {
    return {
      onloading: true,
      search: "",
      showSearch: false,
      rowsPerPageItems: [10, 20, 50, 100],
      showTable: true,
      selected: [],
      headers: [
        // company: "林商以们状"
        // from: "梁军"
        // id: "13B9078f-aC33-ce19-cd78-664D2db1B8d1"
        // status: 0
        // type: "探亲"
        {
          text: "申请人",
          align: "left",
          value: "from"
        },
        {
          text: "申请类型",
          align: "left",
          value: "type"
        },
        { text: "所在单位", value: "company" },
        { text: "审批进度", value: "status" },
        { text: "操作", value: "", align: "right" }
      ],
      applications: []
    };
  },
  props: ["apptitle"],
  mounted() {
    this.fetchApplications();
  },
  methods: {
    fetchApplications() {
      this.onloading = true;
      apply
        .getAuth("")
        .then(data => {
          this.applications = data.data;
        })
        .finally(d => {
          this.onloading = false;
        });
    }
  }
};
</script>