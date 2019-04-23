
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
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>申请人名称:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                $store.getters["Users/realName"]
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>休假类别:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                params.xjlb
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>离队时间:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                params.ldsj
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>路途天数:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                params.ltts
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>休假天数:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                params.xjts
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>预计归队日期:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                comebackDate
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>备注说明:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{
                params.reason
              }}</v-list-tile-content>
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
              sliderText="验证通过将自动提交"
              fg="img/verify/verify-ft.png"
              bg="img/verify/verify-bg.png"
              @verify="verify"
            />
          </v-input>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-toolbar card prominent color="primary" dark>
      <v-toolbar-title class="subheading">干部休假探亲登记</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-tooltip bottom>
        <v-btn light slot="activator" @click="clearForm">
          <v-icon left>clear_all</v-icon>
          清空
        </v-btn>
        清空重写
      </v-tooltip> -->

      <v-tooltip bottom>
        <v-btn light slot="activator" @click="viewMyApply">
          <v-icon left>card_membership</v-icon>
          我的申请
        </v-btn>
        查看我的申请记录
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn light slot="activator" @click.native="beginSubmit">
          <v-icon left>send</v-icon>
          提交
        </v-btn>
        提交请假申请
      </v-tooltip>
      <!-- <v-fab-transition>
        <v-btn light fab absolute bottom right>
          <v-icon color="primary">save</v-icon>
        </v-btn>
      </v-fab-transition> -->
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex lg12 sm6>
              <v-select
                :items="['正休', '病休', '事假']"
                v-model="params.xjlb"
                label="休假类别"
                :rules="[v => !!v || '休假类别必选']"
                required
              ></v-select>
            </v-flex>
            <v-flex sm6 lg3>
              <v-menu
                class="pr-2"
                ref="startDate"
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
                  :rules="[v => !!v || '离队日期必填']"
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
                    @click="$refs.startDate.save(params.ldsj)"
                    >确认</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex lg3 sm12>
              <v-select
                :items="daysOnRoadItems"
                v-model="params.ltts"
                label="路途天数"
              ></v-select>
            </v-flex>

            <v-flex lg3 sm12>
              <v-text-field
                name="holidays"
                :label="labelHoliday"
                type="number"
                min="0"
                step="1"
                :rules="[v => !!v > -1 || labelHoliday + '必填']"
                v-model="params.xjts"
                required
              ></v-text-field>
            </v-flex>

            <v-flex lg3 sm12>
              <v-text-field
                label="预计归队日期"
                disabled
                v-model="comebackDate"
              ></v-text-field>
            </v-flex>

            <v-flex lg12 sm12>
              <v-textarea
                outline
                required
                name="remark"
                label="备注说明"
                :rules="[v => !!v.length < 140 || '说明字数过长']"
                :counter="140"
                v-model="params.reason"
              ></v-textarea>
            </v-flex>

            <v-flex lg12 sm12>
              <v-select
                v-model="params.to"
                :items="companyPathArray"
                chips
                :rules="[v => v.length > 0 || '至少选择一个审批部门']"
                label="选择审批部门"
                multiple
                outline
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
        .add(xjts,"days")
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