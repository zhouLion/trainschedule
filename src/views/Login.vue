<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <!-- <img
                    src="/static/m.png"
                    alt="干部休假登记审核系统"
                    width="120"
                    height="120"
                  /> -->
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
                    v-model="model.username"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="密码"
                    id="password"
                    type="password"
                    v-model="model.password"
                  ></v-text-field>
                  <v-input>
                    <SliderVerify
                      :duration="2000"
                      fg="img/verify/verify-ft.png"
                      bg="img/verify/verify-bg.png"
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
  </v-app>
</template>

<script>
import SliderVerify from "../components/plugin/SliderVerify/index.vue";
export default {
  components: {
    SliderVerify
  },
  data: () => ({
    loading: false,
    model: {
      username: "sumingyu@isok.com",
      password: "password"
    }
  }),
  methods: {
    login() {
      this.loading = true;
      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 1000);
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