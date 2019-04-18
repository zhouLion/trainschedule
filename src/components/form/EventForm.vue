
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

    <v-dialog v-model="showSaveDialog" persistent :max-width="365">
      <v-card>
        <v-card-title class="subheading px-3 py-1">
          申请信息确认
          <v-spacer></v-spacer>
          <v-btn
            flat
            icon
            small
            color="error"
            @click.native="showSaveDialog = false"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-subheader>验证成功即可提交</v-subheader>
          <v-input>
            <SliderVerify
              :duration="2000"
              fg="img/verify/verify-ft.png"
              bg="img/verify/verify-bg.png"
              @verify="verify"
            />
          </v-input>
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
          清空重写
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
          <v-btn
            fab
            dark
            slot="activator"
            @click.native="showSaveDialog = true"
            small
            color="success"
          >
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
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex lg6 sm6>
              <v-select
                :items="['调休', '病假', '探亲', '出差', '年假']"
                v-model="params.xjlb"
                label="休假类别"
                required
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
                :return-value.sync="startDateMenu"
              >
                <v-text-field
                  slot="activator"
                  label="离队日期"
                  v-model="params.ldsj"
                  append-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="params.ldsj"
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
                    @click="$refs.statDate.save(params.ldsj)"
                    >确认</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex lg6 sm12>
              <v-text-field
                name="daysOnload"
                label="路途天数"
                v-model="params.ltts"
                type="number"
                id="id"
                min="0"
                step="0.5"
                required
              ></v-text-field>
            </v-flex>

            <v-flex lg6 sm12>
              <v-text-field
                name="holidays"
                :label="labelHoliday"
                type="number"
                min="0"
                step="0.5"
                v-model="params.xjts"
                id="id"
                required
              ></v-text-field>
            </v-flex>

            <v-flex lg12 sm12>
              <v-textarea
                outline
                required
                name="remark"
                label="备注说明"
                v-model="params.remark"
              ></v-textarea>
            </v-flex>

            <v-flex lg12 sm12 md12>
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
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import SliderVerify from "../plugin/SliderVerify/index";

export default {
  data: () => ({
    date: null,
    dialog: {
      color: "success",
      msg: "提交中",
      show: false
    },
    e6: 1,
    endDate: null,
    endDateMenu: false,
    endTime: null,
    endTimeMenu: false,
    fab: false,
    modal: false,
    params: {
      ldsj: "2019-01-01",
      ltts: 0,
      remark: "",
      xjlb: "探亲",
      xjts: 0
    },
    showSaveDialog: false,
    startDate: null,
    startDateMenu: false,
    startTime: null,
    startTimeMenu: false,
    title: null,
    valid: true
  }),
  components: {
    SliderVerify
  },
  computed: {
    labelHoliday() {
      let { xjlb } = this.params;
      return xjlb + "天数";
    }
  },
  methods: {
    closeDialog() {
      this.$parent.isActive = false;
    },
    viewMyApply() {
      this.$router.push({
        name: "myApplication"
      });
    },
    verify(flag, msg) {
      if (flag) {
        this.send();
      } else {
        this.$Message({
          message: "验证失败",
          type: "error",
          duration: 3 * 1000
        });
      }
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