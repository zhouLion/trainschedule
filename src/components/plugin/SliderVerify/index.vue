<template>
  <div class="slider-verify">
    <div class="sv_holder sv_float" style="touch-action: none;">
      <div
        class="sv_widget sv_clean"
        :class="isShowCard ? 'sv_show' : 'sv_hide'"
      >
        <div class="sv_holder_top"></div>
        <div class="sv_box_holder">
          <div class="sv_box">
            <div class="sv_loading">
              <div class="sv_bg" v-show="fturl">
                <img :src="bgurl" class="sv_cut_bg" width="100%" alt="" />
                <img
                  :src="fturl"
                  class="sv_slice"
                  width="43px"
                  :style="{
                    backgroundImage: 'url(' + fturl + ')',
                    top: posY + 'px',
                    left: sliderLeft + 'px',
                    zIndex: 2
                  }"
                />
              </div>
              <div class="sv_loading_icon" v-show="!fturl"></div>
              <div class="sv_loading_text" v-show="!fturl">加载中...</div>
            </div>
            <!-- <a
              class="sv_curtain"
              :class="isShowCard ? 'sv_show' : 'sv_hide'"
              style="background-image: none;"
            >
              <div class="sv_curtain_bg_wrap">
                <div class="sv_curtain_bg">
                  <div class="sv_cut_curtain"></div>
                </div>
              </div>
              <div
                class="sv_curtain_button"
                :class="isShowCard ? 'sv_show' : 'sv_hide'"
              ></div>
            </a> -->
            <!-- <a class="sv_box_tips" style="display: none;"></a> -->
          </div>
          <!-- :class="isShowCard ? 'sv_show' : 'sv_hide'" -->
          <div class="sv_info sv_hide">
            <div class="sv_info_tip sv_fail">
              <div class="sv_info_icon"></div>
              <div class="sv_info_text">
                <span class="sv_info_type">验证失败:</span
                ><span class="sv_info_content">拖动滑块将悬浮图像正确拼合</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sv_bottom" @click="refreshVerify">
          <v-layout row wrap>
            <a class="sv_refresh_button" @click="refreshVerify">
              <div class="sv_refresh_tips">刷新验证</div>
            </a>
            <v-spacer></v-spacer>
            <v-icon
              @click="
                () => {
                  showcard = false;
                  moving = false;
                }
              "
              >clear</v-icon
            >
          </v-layout>
        </div>
      </div>
      <div class="sv_slider" ref="sv_slider">
        <div class="sv_guide_tip" :class="{ sv_hide: moving }">
          按住左边滑块，拖动完成上方拼图
        </div>
        <div
          class="sv_slider_knob sv_show"
          :class="{ sv_moving: moving }"
          @mouseover="onMoveOver"
          @mousedown="onMoveSlider"
          :style="{ left: sliderLeft + 'px' }"
        ></div>
        <div class="sv_curtain_tip sv_hide">
          点击上图按钮并沿道路拖动到终点处
        </div>
        <div class="sv_curtain_knob" :class="{ sv_hide: !moving }">
          {{ sliderText }}
        </div>
        <div class="sv_ajax_tip sv_ready"></div>
      </div>
    </div>
  </div>
</template>

<script>
import verify from "../../../api/static";
export default {
  name: "",
  data() {
    return {
      moving: false,
      onRefreshVerify: false,
      refreshVerifyTime: new Date().getTime(),
      startLeft: 0,
      sliderLeft: 0,
      timeOut: null,
      bgurl: "",
      fturl: "",
      posY: 0,
      showcard: false,
      ajaxStatus: ["success", "lock", "ready", "fail", "forbiden", "error"]
    };
  },
  computed: {
    dragTime() {
      return this.endTime - this.startTime;
    },
    isShowCard() {
      return this.showcard || this.moving;
    }
  },
  props: {
    duration: {
      type: Number,
      default: 3000
    },
    bg: {
      type: String,
      required: true,
      default: "img/verify/verify-bg.png"
    },
    fg: {
      type: String,
      required: true,
      default: "img/verify/verify-fg.png"
    },
    sliderText: {
      type: String,
      required: false,
      default: "移动到此开始验证"
    }
  },
  destroyed() {
    this.timeOut && clearTimeout(this.timeOut);
  },
  mounted() {
    this.refreshVerify(true);
  },
  methods: {
    onMoveOver() {
      this.showcard = true;
    },
    onMoveSlider(event) {
      if (this.moving == true) {
        return;
      }
      this.startTime = new Date().getTime();
      this.timeOut && clearTimeout(this.timeOut);
      this.moving = true;
      this.startLeft = event.x;
      // 尚无法兼容touch事件
      // document.addEventListener("touchmove", this.onMouseMoving);
      // document.addEventListener("touchend", this.onMoveEnd);
      document.addEventListener("mousemove", this.onMouseMoving);
      document.addEventListener("mouseup", this.onMoveEnd);
    },
    onMouseMoving(event) {
      let x_sx = event.x - this.startLeft;
      let sliderWidth = this.$refs.sv_slider.clientWidth - 46;
      if (x_sx > sliderWidth || x_sx < 0) {
        return false;
      }
      this.sliderLeft = x_sx;
    },
    onMoveEnd() {
      this.endTime = new Date().getTime();
      document.removeEventListener("mousemove", this.onMouseMoving);
      this.verifyCallback(true, this.sliderLeft);
      this.timeOut = setTimeout(() => {
        this.verifyCallback(false, "请求超时");
      }, 5000);
    },
    verifyCallback(flag, msg) {
      this.moving = false;
      this.showcard = false;
      // 清空定时器
      this.timeOut && clearTimeout(this.timeOut);
      this.$emit("verify", flag, msg, () => {
        this.sliderLeft = 0;
        document.removeEventListener("mouseup", this.onMoveEnd);
      });
    },

    /**
     * 刷新验证码
     * @param {Boolean?} force
     */
    async refreshVerify(force = false) {
      let curTime = new Date().getTime();
      if (!force) {
        if (this.onRefreshVerify == true) {
          return false;
        }
        if (curTime - this.refreshVerifyTime < 2000) {
          this.$Message({
            type: "warning",
            message: "刷新太频繁",
            duration: 1000
          });
          return false;
        }
      } else {
        this.refreshVerifyTime = curTime;
        this.onRefreshVerify = false;
        let result = await verify.refreshVerify();
        let bg = "https://trainschdule.mynatapp.cc/static/verify-bg.png";
        let ft = "https://trainschdule.mynatapp.cc/static/verify-ft.png";
        let { id, posY } = result;
        this.bgurl = bg + "?id=" + id;
        this.fturl = ft + "?id=" + id;
        this.posY = posY;
        return result;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import url('./index.css');

.bg-round {
  background-repeat: round;
}
</style>