<template>
  <div class="slider-verify">
    <div class="sv_holder sv_float" style="touch-action: none;">
      <div class="sv_widget sv_clean" :class="moving ? 'sv_show' : 'sv_hide'">
        <div class="sv_holder_top"></div>
        <div class="sv_box_holder" style="height: 116px;">
          <div class="sv_box">
            <div class="sv_loading">
              <div class="sv_loading_icon"></div>
              <div class="sv_loading_text">加载中...</div>
            </div>
            <a
              class="sv_curtain"
              :class="moving ? 'sv_show' : 'sv_hide'"
              style="background-image: none;"
            >
              <div class="sv_curtain_bg_wrap">
                <div class="sv_curtain_bg">
                  <div class="sv_cut_curtain"></div>
                </div>
              </div>
              <div
                class="sv_curtain_button"
                :class="moving ? 'sv_show' : 'sv_hide'"
              ></div>
            </a>
            <a class="sv_box_tips" style="display: none;"></a>
          </div>
          <div class="sv_info" :class="moving ? 'sv_show' : 'sv_hide'">
            <div class="sv_info_tip sv_fail">
              <div class="sv_info_icon"></div>
              <div class="sv_info_text">
                <span class="sv_info_type">验证失败:</span
                ><span class="sv_info_content">拖动滑块将悬浮图像正确拼合</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sv_bottom">
          <a class="sv_refresh_button">
            <div class="sv_refresh_tips">刷新验证</div>
          </a>
          <a class="sv_help_button" href="" target="_blank">
            <div class="sv_help_tips">帮助反馈</div>
          </a>
          <a class="sv_logo_button sv_no_logo"></a>
        </div>
      </div>
      <div class="sv_slider" ref="sv_slider">
        <div class="sv_guide_tip" :class="moving ? 'sv_hide' : 'sv_show'">
          按住左边滑块，拖动完成上方拼图
        </div>
        <div
          class="sv_slider_knob sv_show"
          :class="{ sv_moving: moving }"
          @mousedown="onMoveSlider"
          :style="{ left: sliderLeft }"
        ></div>
        <div class="sv_curtain_tip sv_hide">
          点击上图按钮并沿道路拖动到终点处
        </div>
        <div class="sv_curtain_knob sv_hide">移动到此开始验证</div>
        <div class="sv_ajax_tip sv_ready"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      moving: false,
      startLeft: 0,
      sliderLeft: 0,
      timeOut: null,
      ajaxStatus: ["success", "lock", "ready", "fail", "forbiden", "error"]
    };
  },
  computed: {
    dragTime() {
      return this.endTime - this.startTime;
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
    }
  },
  methods: {
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
      this.sliderLeft = x_sx + "px";
    },
    onMoveEnd() {
      this.endTime = new Date().getTime();
      document.removeEventListener("mousemove", this.onMouseMoving);
      console.log("验证参数", {
        x: this.sliderLeft.replace("px", ""),
        time: this.dragTime
      });
      this.timeOut = setTimeout(() => {
        let num = 10 * Math.random();
        let flag = parseInt(num) % 2 == 0;
        this.verifyCallback(flag, "请求超时");
      }, 3000);
    },
    verifyCallback(flag, msg) {
      this.moving = false;
      // 清空定时器
      this.timeOut && clearTimeout(this.timeOut);
      this.$emit("verify", flag);
      this.sliderLeft = 0;
      document.removeEventListener("mouseup", this.onMoveEnd);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import url('./index.css');
</style>