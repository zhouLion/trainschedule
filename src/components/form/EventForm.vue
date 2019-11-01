
<template>
  <v-card flat>
    <v-dialog
      hide-overlay
      persistent
      v-model="dialog.show"
      width="300"
    >
      <v-card
        :color="dialog.color"
        dark
      >
        <v-card-text>
          {{ dialog.msg }}
          <v-progress-linear
            class="mb-0"
            color="white"
            indeterminate
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :max-width="365"
      persistent
      v-model="showSaveDialog"
    >
      <v-card>
        <v-card-title class="subheading px-3 py-1">
          申请信息确认
          <v-spacer></v-spacer>
          <v-btn
            @click.native="showSaveDialog = false"
            color="error"
            flat
            icon
            small
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>申请人名称:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                $store.getters["Users/realName"]
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>休假类别:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                params.xjlb
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>离队时间:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                params.ldsj
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>路途天数:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                params.ltts
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>休假天数:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                params.xjts
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>预计归队日期:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                comebackDate
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>备注说明:</v-list-tile-content>
              <v-list-tile-content class="align-end">
                {{
                params.reason
                }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>暂时不启动:</v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="params.NotStart"></v-switch>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-input>
            <SliderVerify
              :duration="2000"
              @verify="verify"
              bg="img/verify/verify-bg.jpg"
              fg="img/verify/verify-ft.jpg"
              sliderText="验证通过将自动提交"
            />
          </v-input>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-toolbar
      card
      color="primary"
      dark
      prominent
    >
      <v-toolbar-title class="subheading">干部休假探亲登记</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-tooltip bottom>
        <v-btn light slot="activator" @click="clearForm">
          <v-icon left>clear_all</v-icon>
          清空
        </v-btn>
        清空重写
      </v-tooltip>-->

      <v-tooltip bottom>
        <v-btn
          @click="viewMyApply"
          light
          slot="activator"
        >
          <v-icon left>card_membership</v-icon>我的申请
        </v-btn>查看我的申请记录
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          @click.native="beginSubmit"
          light
          slot="activator"
        >
          <v-icon left>send</v-icon>提交
        </v-btn>提交请假申请
      </v-tooltip>
      <!-- <v-fab-transition>
        <v-btn light fab absolute bottom right>
          <v-icon color="primary">save</v-icon>
        </v-btn>
      </v-fab-transition>-->
    </v-toolbar>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-container grid-list-md>
          <v-layout
            row
            wrap
          >
            <v-flex
              lg12
              sm6
            >
              <v-select
                :items="['正休', '病休', '事假']"
                :rules="[v => !!v || '休假类别必选']"
                label="休假类别"
                required
                v-model="params.xjlb"
              ></v-select>
            </v-flex>
            <v-flex
              lg3
              sm6
            >
              <v-menu
                :close-on-content-click="false"
                :nudge-bottom="-22"
                :return-value.sync="startDateMenu"
                class="pr-2"
                full-width
                lazy
                max-width="290px"
                offset-y
                ref="startDate"
                transition="scale-transition"
                v-model="startDateMenu"
              >
                <v-text-field
                  :rules="[v => !!v || '离队日期必填']"
                  append-icon="event"
                  label="离队日期"
                  readonly
                  slot="activator"
                  v-model="params.ldsj"
                ></v-text-field>
                <v-date-picker
                  locale="cn-ZH"
                  no-title
                  scrollable
                  v-model="params.ldsj"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="startDateMenu = false"
                    color="primary"
                    flat
                  >取消</v-btn>
                  <v-btn
                    @click="$refs.startDate.save(params.ldsj)"
                    color="primary"
                    flat
                  >确认</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex
              lg3
              sm12
            >
              <v-select
                :items="daysOnRoadItems"
                label="路途天数"
                v-model="params.ltts"
              ></v-select>
            </v-flex>

            <v-flex
              lg3
              sm12
            >
              <v-text-field
                :label="labelHoliday"
                :rules="[v => !!v > -1 || labelHoliday + '必填']"
                min="0"
                name="holidays"
                required
                step="1"
                type="number"
                v-model="params.xjts"
              ></v-text-field>
            </v-flex>

            <v-flex
              lg3
              sm12
            >
              <v-text-field
                disabled
                label="预计归队日期"
                v-model="comebackDate"
              ></v-text-field>
            </v-flex>

            <v-flex
              lg12
              sm12
            >
              <v-textarea
                :counter="140"
                :rules="[v => !!v.length < 140 || '说明字数过长']"
                label="备注说明"
                name="remark"
                outline
                required
                v-model="params.reason"
              ></v-textarea>
            </v-flex>

            <v-flex
              lg12
              sm12
            >
              <v-select
                :items="companyPathArray"
                :rules="[v => v.length > 0 || '至少选择一个审批部门']"
                chips
                label="选择审批部门"
                multiple
                outline
                v-model="params.to"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import SliderVerify from "../plugin/SliderVerify/index";
import applications from "../../api/applications";
import moment from "moment";
// applications.submitApply({
//   stamp: {
//     ldsj:
//   },
//   request: {
//     xjts:
//     ltts:
//   },
//   xjlb: ,
//   to: [1,2,3,4,5,6,7]
// })
export default {
  data() {
    return {
      date: null,
      dialog: {
        color: "success",
        msg: "提交中",
        show: false
      },
      e6: 1,
      fab: false,
      modal: false,
      daysOnRoadItems: [0, 1, 2, 3, 4, 5, 6, 7].map(d => ({
        value: d,
        text: d + "天"
      })),
      params: {
        ldsj: moment().format("YYYY-MM-DD"),
        ltts: 0,
        remark: "",
        xjlb: "正休",
        xjts: 0,
        to: [0],
        reason: "",
        NotStart: true
      },
      showSaveDialog: false,
      startDate: null,
      startDateMenu: false,
      startTime: null,
      startTimeMenu: false,
      title: null,
      valid: true,
      dataReversedPathArray: this.reversedPathArray
    };
  },

  components: {
    SliderVerify
  },
  computed: {
    labelHoliday() {
      let { xjlb } = this.params;
      return xjlb + "天数";
    },
    comebackDate() {
      let { ltts, xjts, ldsj } = this.params;
      return moment(ldsj)
        .add(ltts, "days")
        .add(xjts, "days")
        .format("YYYY-MM-DD");
    },
    // 倒序的人员部门
    companyPathArray() {
      let companyPathArray = this.$store.getters["Users/companyPathArray"];
      if (!companyPathArray) {
        return [];
      }
      let arr = companyPathArray.filter(d => d.toUpperCase() !== "ROOT");
      return arr.map((path, index) => {
        let obj = {
          disabled: false,
          value: index + 1,
          text: path
        };
        return obj;
      });
    }
  },
  methods: {
    clearForm() {
      this.$refs.form.reset();
    },
    closeDialog() {
      this.$parent.isActive = false;
    },
    viewMyApply() {
      this.$router.push({
        name: "myApplication"
      });
    },
    verify(flag, x, callback) {
      if (flag) {
        this.send(x);
        callback();
      }
    },
    beginSubmit() {
      let pass = this.$refs.form.validate();
      if (pass) {
        this.showSaveDialog = true;
      }
    },
    send(x) {
      let { xjlb, xjts, ltts, ldsj, to, reason, NotStart } = this.params;
      // 将0（ROOT）去除
      to = to.filter(t => t !== 0);
      applications
        .submitApply(
          {
            request: {
              xjts, //下拉框
              ltts //下拉框
            },
            xjlb,
            stamp: {
              ldsj,
              gdsj: this.comebackDate
            },
            to
          },
          reason,
          x,
          NotStart
        )
        .then()
        .finally();
    }
  }
};
</script>