
<template>
  <v-card flat>
    <v-dialog v-model="dialog.show" hide-overlay persistent width="300">
      <v-card :color="dialog.color" dark>
        <v-card-text>
          {{ dialog.msg }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-toolbar card prominent extended color="primary" dark="">
      <v-toolbar-title class="body-2">干部休假探亲登记</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-speed-dial v-model="fab" direction="left" bottom open-on-hover>
        <template v-slot:activator>
          <v-btn v-model="fab" color="green darken-2" dark fab>
            <v-icon>menu</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
        </template>
        <v-tooltip bottom>
          <v-btn fab dark slot="activator" small color="orange">
            <v-icon>clear_all</v-icon>
          </v-btn>
          清空充填
        </v-tooltip>

        <v-tooltip bottom>
          <v-btn
            fab
            light
            slot="activator"
            small
            color="yellow"
            @click="viewMyApply"
          >
            <v-icon>card_membership</v-icon>
          </v-btn>
          查看我的申请记录
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn fab dark slot="activator" small color="success" @click="send">
            <v-icon>send</v-icon>
          </v-btn>
          提交
        </v-tooltip>
      </v-speed-dial>
      <!-- <v-fab-transition>
        <v-btn light fab absolute bottom right>
          <v-icon color="primary">save</v-icon>
        </v-btn>
      </v-fab-transition> -->
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-layout row wrap>
          <v-flex lg12 sm12>
            <v-select
              :items="['调休', '病假', '探亲', '出差', '年假']"
              v-model="title"
              label="休假类别"
            ></v-select>
          </v-flex>
          <v-flex sm6 lg6>
            <v-menu
              class="pr-2"
              ref="statDate"
              lazy
              :close-on-content-click="false"
              v-model="startDateMenu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-bottom="-22"
              max-width="290px"
              :return-value.sync="startDate"
            >
              <v-text-field
                slot="activator"
                label="离队日期"
                v-model="startDate"
                append-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="startDate"
                no-title
                scrollable
                locale="cn-ZH"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="startDateMenu = false"
                  >取消</v-btn
                >
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.statDate.save(startDate)"
                  >确认</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex sm6 lg6>
            <v-menu
              ref="startTime"
              lazy
              :close-on-content-click="false"
              v-model="startTimeMenu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-bottom="-24"
              max-width="290px"
              :return-value.sync="startTime"
            >
              <v-text-field
                slot="activator"
                label="具体时间"
                v-model="startTime"
                append-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker v-model="startTime" locale="cn-ZH">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="startTimeMenu = false"
                  >取消</v-btn
                >
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.startTime.save(startTime)"
                  >确认</v-btn
                >
              </v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex sm6 lg6>
            <v-menu
              ref="endDate"
              lazy
              class="pr-2"
              :close-on-content-click="false"
              v-model="endDateMenu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-bottom="-22"
              min-width="290px"
              :return-value.sync="endDate"
            >
              <v-text-field
                slot="activator"
                label="归队日期"
                v-model="endDate"
                append-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                locale="cn-ZH"
                v-model="endDate"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="endDateMenu = false"
                  >取消</v-btn
                >
                <v-btn flat color="primary" @click="$refs.endDate.save(endDate)"
                  >确认</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex sm6 lg6>
            <v-menu
              ref="endTime"
              lazy
              :close-on-content-click="false"
              v-model="endTimeMenu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-bottom="-24"
              max-width="290px"
              :return-value.sync="endTime"
            >
              <v-text-field
                slot="activator"
                label="具体时间"
                v-model="endTime"
                append-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker locale="cn-ZH" v-model="endTime">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="endTimeMenu = false"
                  >取消</v-btn
                >
                <v-btn flat color="primary" @click="$refs.endTime.save(endTime)"
                  >确认</v-btn
                >
              </v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex lg12 sm12>
            <v-textarea
              outline
              name="remark"
              label="备注说明"
              value="为你我用了半年的积蓄，漂洋过海的来看你。"
            ></v-textarea>
          </v-flex>
          <v-flex lg12>
            <v-layout row wrap>
              <v-flex lg4 md12>
                <v-subheader>审批流程预览</v-subheader>
              </v-flex>
              <v-flex lg8 md12>
                <v-timeline align-top dense>
                  <v-timeline-item color="primary" small>
                    <v-layout pt-3>
                      <v-flex md3 sm12 xs12>
                        <strong>一级审核</strong>
                      </v-flex>
                      <v-flex sm12 md9 xs12>
                        <strong>直隶部门主管</strong>
                        <div class="caption">
                          由直属部门领导审批通过才能进入二级申请
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="primary lighten-3" small>
                    <v-layout wrap pt-3>
                      <v-flex md3 sm12>
                        <strong>二级审核</strong>
                      </v-flex>
                      <v-flex sm12 md9>
                        <strong>上级各主管</strong>
                        <div class="caption mb-2">需由上级各主管全部审批</div>
                        <v-avatar>
                          <v-img
                            src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                          ></v-img>
                        </v-avatar>
                        <v-avatar>
                          <v-img
                            src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Pale"
                          ></v-img>
                        </v-avatar>
                        <v-avatar>
                          <v-img
                            src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Tanned"
                          ></v-img>
                        </v-avatar>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="pink" small>
                    <v-layout pt-3>
                      <v-flex xs3>
                        <strong>最终审批</strong>
                      </v-flex>
                      <v-flex>
                        <strong>管理员</strong>
                        <div class="caption mb-2">
                          审批通过后将自动登记备案，且推送消息给申请人
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>
                </v-timeline>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    title: null,
    valid: true,
    date: null,
    fab: false,
    e6: 1,
    startDateMenu: false,
    startDate: null,
    startTimeMenu: false,
    startTime: null,
    endDateMenu: false,
    endDate: null,
    endTimeMenu: false,
    endTime: null,
    modal: false,
    dialog: {
      show: false,
      color: "success",
      msg: "提交中"
    }
  }),
  methods: {
    closeDialog() {
      this.$parent.isActive = false;
    },
    viewMyApply() {
      this.$router.push({
        name: "myApplication"
      });
    },
    send() {
      this.dialog.show = true;
      this.dialog.msg = "提交数据";
      this.dialog.color = "orange";
      setTimeout(() => {
        this.dialog.msg = "提交成功";
        this.dialog.color = "success";
        setTimeout(() => {
          this.dialog.show = false;
        }, 1000);
      }, 2000);
    }
  }
};
</script>