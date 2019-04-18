<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <h1 class="flex my-4 primary--text">
                    干部休假登记审核系统
                  </h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="person"
                    name="login"
                    label="账号"
                    type="text"
                    v-model="model.UserName"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="密码"
                    id="password"
                    type="password"
                    v-model="model.Password"
                  ></v-text-field>
                  <v-input>
                    <SliderVerify
                      :duration="2000"
                      fg="img/verify/verify-ft.png"
                      bg="img/verify/verify-bg.png"
                      @verify="verify"
                    />
                  </v-input>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login" :loading="loading"
                  >登录</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar v-model="snack.show">
      {{ snack.msg }}
      <v-btn flat color="primary" @click.native="snack.show = false"
        >关闭</v-btn
      >
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
      UserName: "11111111",
      Password: "11111111"
    },
    snack: {
      show: false,
      msg: "信息"
    }
  }),
  methods: {
    login() {
      this.loading = true;
      let { UserName, Password } = this.model;
      account
        .loginRest({
          UserName,
          Password,
          Verify: "201700816"
        })
        .then(res => {
          console.log(res);
          this.$Message({
            message: "登录成功",
            type: "success",
            duration: 1 * 1000
          });
          this.$router.push("/addapplication");
        });
    },
    verify(flag) {
      if (flag == true) {
        this.$Message({
          message: "验证成功，等待登录",
          type: "success",
          duration: 1 * 1000
        });
        this.login();
      } else {
        this.$Message({
          message: "验证失败",
          type: "error",
          duration: 1 * 1000
        });
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