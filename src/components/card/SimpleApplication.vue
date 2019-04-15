<template>
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

        <v-list-tile-content class="align-end" v-if="header.value == 'oper'">
          <v-layout row wrap>
            <slot
              name="action"
              v-bind="{
                props: props,
                array: applications
              }"
            ></slot>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn slot="activator" flat icon color="primary" small>
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
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="" scoped>
</style>