<template>
  <v-card flat class="pa-3 applications">
    <v-toolbar card dense color="transparent">
      <v-toolbar-title>
        <h4>{{ apptitle }}</h4></v-toolbar-title
      >
      <v-layout row wrap>
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
        <slot name="headerAction"></slot>
      </v-layout>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0" v-if="showTable">
      <v-container grid-list-md>
        <template>
          <v-data-table
            :headers="headers"
            :rows-per-page-items="rowsPerPageItems"
            :items="data"
            :search="search"
            v-model="selected"
            :loading="loading"
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

              <td v-for="header in headers" :key="header.text">
                <template v-if="header.value == 'oper'">
                  <v-layout row wrap>
                    <slot
                      name="action"
                      v-bind="{
                        props: props,
                        array: data
                      }"
                    ></slot>

                    <v-tooltip bottom>
                      <v-btn
                        slot="activator"
                        @click="showDetail(props)"
                        flat
                        icon
                        color="primary"
                        small
                      >
                        <v-icon>more</v-icon>
                      </v-btn>
                      查看详情
                    </v-tooltip>
                  </v-layout>
                </template>
                <template v-else-if="header.text == '状态'">
                  <v-chip
                    class="pa-0"
                    dark
                    label
                    :color="formatterStatusColor(props.item.status)"
                    small
                    >{{ formatterStatus(props.item.status) }}
                  </v-chip>
                </template>
                <template v-else>
                  {{ props.item[header.value] }}
                </template>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-container>
    </v-card-text>
    <v-card-text class="pa-0" v-if="!showTable">
      <v-container grid-list-md>
        <v-data-iterator
          :items="data"
          item-key="name"
          :rows-per-page-items="rowsPerPageItems"
          content-tag="v-layout"
          row
          wrap
          :loading="loading"
        >
          <template v-slot:item="props">
            <v-flex xs12 sm6 md4 lg4 class="hover-shadow">
              <v-card class="elevation-1">
                <v-card-title>
                  <h4><v-icon>account_box</v-icon>{{ props.item.from }}</h4>
                  <v-spacer></v-spacer>
                  <v-chip
                    class="pa-0"
                    dark
                    :color="formatterStatusColor(props.item.status)"
                    small
                    >{{ formatterStatus(props.item.status) }}
                  </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-tile
                    class="v-table"
                    v-for="header in headers"
                    :key="header.text"
                    v-if="header.text !== '状态'"
                  >
                    <v-list-tile-content :style="{ width: '20%' }">
                      {{ header.text }}:
                    </v-list-tile-content>

                    <v-list-tile-content
                      class="align-end"
                      v-if="header.value == 'oper'"
                    >
                      <v-layout row wrap>
                        <slot
                          name="action"
                          v-bind="{
                            props: props,
                            array: data
                          }"
                        ></slot>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                          <v-btn
                            slot="activator"
                            flat
                            icon
                            color="primary"
                            small
                          >
                            <v-icon>more</v-icon>
                          </v-btn>
                          查看详情
                        </v-tooltip>
                      </v-layout>
                    </v-list-tile-content>

                    <v-list-tile-content
                      :style="{ width: header.width }"
                      class="align-end text-truncate text-lg-right caption"
                      v-else
                    >
                      <v-tooltip top :max-width="140">
                        <v-flex slot="activator">
                          {{ props.item[header.value] }}
                        </v-flex>
                        {{ props.item[header.value] }}
                      </v-tooltip>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-container>
    </v-card-text>
    <v-navigation-drawer
      :width="356"
      app
      right
      temporary
      v-model="showDetailCard"
    >
      <v-card flat height="100vh">
        <v-card-title>
          <v-icon left>
            twitter
          </v-icon>
          <span class="title font-weight-light">苏明玉</span>
        </v-card-title>
        <v-card-text class="card-text-mid">
          jsofdjaosidjflaskjfdl
        </v-card-text>
        <v-card-actions class="ps-absolute bottom">
          <v-btn flat icon color="primary" disabled>
            <v-icon>more</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<style lang="stylus">
.ps-absolute {
  position: absolute;

  &.bottom {
    bottom: 0;
  }
}

// .card-text-mid {
// height: calc(100vh - 100px);
// overflow-y: auto;
// }
.applications {
  .v-list__tile {
    &.theme--light:hover {
      background: #FAFAFA;
    }

    &.theme--dark:hover {
      background: #616161;
    }
  }
}
</style>


<script>
const statusDic = [
  {
    id: 0,
    color: "orange",
    text: "审核中"
  },
  {
    id: 1,
    color: "success",
    text: "通过所有审核"
  },
  {
    id: 2,
    color: "success lighten-1",
    text: "通过，待管理员审核"
  },
  {
    id: 4,
    color: "error",
    text: "驳回"
  }
];
export default {
  data() {
    return {
      search: "",
      showSearch: false,
      showDetailCard: false,
      rowsPerPageItems: [10, 20, 50, 100],
      showTable: true,
      selected: [],
      headers: [
        {
          text: "申请人",
          align: "left",
          width: "5%",
          value: "from"
        },
        { text: "申请人单位", value: "company", width: "20%" },
        { text: "申请时间", value: "create", width: "10%" },
        { text: "状态", value: "status", width: "10%" },
        { text: "候审单位", value: "current", width: "15%" },
        {
          text: "备注",
          value: "remark",
          width: "20%",
          sortable: false,
          class: "text-truncate"
        },
        {
          text: "操作",
          sortable: false,
          value: "oper",
          align: "center",
          width: "15%"
        }
      ]
      /**
       * []{
       * id:申请的id,
        from:申请人姓名,
        company:申请来源单位路径,
        create:申请创建的时间,
        status:申请的通过状态,//0:审核中 1:通过所有审核 2:通过，待管理员审核 4:驳回
        remark:如果已驳回或已通过，将存在，表示备注,
        current:当前申请所在层级
       * }
       */
    };
  },
  props: {
    apptitle: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 获取状态值对应的文本
     */
    formatterStatus(id) {
      let result = statusDic.find(status => status.id == id);
      return result ? result.text : "未知类型";
    },

    /**
     * 获得状态的颜色
     */
    formatterStatusColor(id) {
      let result = statusDic.find(status => status.id == id);
      return result ? result.color : "info";
    },

    showDetail() {
      this.showDetailCard = true;
    }
  }
};
</script>