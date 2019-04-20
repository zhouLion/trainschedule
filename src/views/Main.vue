<template>
  <v-app id="APPMAIN" :dark="isDark">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      :width="navWidth"
      :class="{ 'no-select': onMove }"
      app
    >
      <v-layout column justify-space-around fill-height>
        <v-list class="pa-1">
          <v-list-tile v-if="mini" @click.stop="mini = !mini">
            <v-list-tile-action>
              <v-icon>chevron_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img
                :src="
                  `https://trainschdule.mynatapp.cc${
                    $store.getters['Users/avatar']
                  }`
                "
              />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{
                $store.state.Users.userInfo.realName
              }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-card class="relative" flat v-show="!mini" v-if="showCalender">
          <v-date-picker
            :locale="localeCN ? 'cn-ZH' : 'en-us'"
            no-title
            :events="events"
            width="auto"
            scrollable
            @input="str => onClickDatePicker(str)"
            class="elevation-0"
          >
          </v-date-picker>
          <v-card-actions v-show="datePickMenu.show">
            <v-btn flat color="red" @click="datePickMenu.show = false" dark>
              <span>text</span>
              <v-icon>icon</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-list class="pt-0" dense>
          <v-list-tile v-for="item in items" :key="item.title" :to="item.to">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-spacer></v-spacer>

        <v-layout row wrap shrink>
          <v-flex
            class="flexbtn"
            @click="showCalender = !showCalender"
            :class="{ 'like-list-item': mini }"
          >
            <v-icon>event</v-icon>
          </v-flex>
          <v-flex
            class="flexbtn"
            @click="localeCN = !localeCN"
            :class="{ 'like-list-item': mini }"
          >
            <v-icon>translate</v-icon>
          </v-flex>

          <v-flex class="flexbtn" :class="{ 'like-list-item': mini }">
            <v-icon>help_outline</v-icon>
          </v-flex>
          <v-flex
            class="flexbtn"
            @click="isDark = !isDark"
            :class="{ 'like-list-item': mini }"
          >
            <v-icon>{{ isDark ? "brightness_4" : "brightness_7" }}</v-icon>
          </v-flex>
          <v-spacer v-show="!mini"></v-spacer>
          <v-flex
            class="flexbtn"
            @click="logout"
            :class="{ 'like-list-item': mini }"
          >
            <v-icon color="red">power_settings_new</v-icon>
          </v-flex>
        </v-layout>
      </v-layout>
      <div class="absolute" @mousedown="startMove"></div>
    </v-navigation-drawer>
    <v-toolbar app class="elevation-0">
      <v-btn icon @click="drawer = !drawer" :class="{ collapsed: drawer }">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid class="pa-0">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </v-container>
    </v-content>
    <v-footer></v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navWidth: 320,
      drawer: null,
      onMove: false,
      localeCN: true,
      isDark: false,
      showCalender: false,
      items: [
        { title: "请假申请", icon: "dashboard", to: "/addapplication" },
        { title: "请假审批", icon: "question_answer", to: "/dealapplication" }
      ],
      datePickMenu: {
        show: false,
        x: -1000,
        y: -1000
      },
      mini: false,
      right: null,
      events: [...Array(6)].map(() => {
        const day = Math.floor(Math.random() * 30);
        const d = new Date();
        d.setDate(day);
        return d.toISOString().substr(0, 10);
      })
    };
  },
  mounted() {
    this.isDark = JSON.parse(localStorage.getItem("isDark"));
    this.$watch("isDark", v => {
      localStorage.setItem("isDark", v);
    });
  },
  methods: {
    startMove(event) {
      this.onMove = true;
      document.addEventListener("mouseup", this.endMove);
    },
    endMove(event) {
      this.onMove = false;
      let navWidth = event.screenX < 320 ? 320 : event.screenX;
      navWidth = event.screenX > 408 ? 408 : navWidth;
      this.navWidth = navWidth;
      document.removeEventListener("mouseup", this.endMove);
    },
    logout() {
      this.$router.push("/login");
    },
    onClickDatePicker(str, evt) {
      // let { x, y } = evt;
      this.datePickMenu.x = 100;
      this.datePickMenu.y = 100;
      this.datePickMenu.show = true;
    }
  }
};
</script>

<style lang="stylus">
#APPMAIN {
  .collapsed {
    transform: rotateZ(90deg);
    transition: transform 0.2s ease;
  }

  .no-select {
    user-select: none;
  }

  .absolute {
    position: absolute;
    height: 100%;
    right: 0;
    width: 4px;
    top: 0;
  }

  .absolute:hover {
    background: grey;
    cursor: w-resize;
  }

  .flex.flexbtn {
    text-align: center;
    width: 0px;
    padding: 12px 0;
    cursor: pointer;

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    &.flex.like-list-item {
      width: 48px;
      height: 40px;
      padding: 0 28px;
      line-height: 46px;
    }
  }
}
</style>

