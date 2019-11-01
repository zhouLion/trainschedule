<template>
  <v-app
    class="primary"
    id="login"
  >
    <v-content>
      <v-container
        fill-height
        fluid
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            lg4
            md4
            sm8
            xs12
          >
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <h1 class="flex my-4 primary--text">干部休假登记审核系统</h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="person"
                    label="账号"
                    name="username"
                    type="text"
                    v-model="model.UserName"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    label="密码"
                    name="password"
                    type="password"
                    v-model="model.Password"
                  ></v-text-field>
                  <v-input>
                    <SliderVerify
                      :duration="2000"
                      @verify="verify"
                      bg="img/verify/verify-bg.jpg"
                      fg="img/verify/verify-ft.jpg"
                      sliderText="验证通过将自动登录"
                    />
                  </v-input>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  @click="login"
                  block
                  color="primary"
                >登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar v-model="snack.show">
      {{ snack.msg }}
      <v-btn
        @click.native="snack.show = false"
        color="primary"
        flat
      >关闭</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import SliderVerify from "../components/plugin/SliderVerify/index.vue";
import account from "../api/account";

export default {
  components: {
    SliderVerify
  },
  data: () => ({
    loading: false,
    model: {
      UserName: "",
      Password: ""
    },
    snack: {
      show: false,
      msg: "信息"
    }
  }),
  methods: {
    // 执行登录
    async login(x) {
      console.log(x);
      this.loading = true;
      let { UserName, Password } = this.model;
      await account.loginRest({
        UserName,
        Password,
        Verify: x
        // Verify: "201700816"
      });

      // let userInfo = await users.getUserInfo();
      this.$store.dispatch("Users/userGetInfo");
      // console.log(userInfo);
      this.$Message({
        message: "登录成功",
        type: "success",
        duration: 1 * 1000
      });
      this.$router.push("/addapplication");
    },

    // 验证
    verify(flag, msg, callback) {
      if (flag == true) {
        // this.$Message({
        //   message: "验证成功，等待登录",
        //   type: "success",
        //   duration: 1 * 1000
        // });
        this.login(msg);
        callback();
      }
    }
  }
};
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>