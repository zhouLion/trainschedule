import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/dashboard',
      component: Main,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import(/* webpackChunkName: "home" */ './views/Dashboard.vue')
        }
      ]
    },
    {
      path: '/addapplication',
      component: Main,
      children: [
        {
          path: "",
          name: "addapplication",
          title: "新建申请",
          component: () => import(/* webpackChunkName: "AddApplication" */ './views/AddApplication.vue')
        }
      ]
    },
    {
      path: '/dealapplication',
      component: Main,
      children: [
        {
          name: 'DealApplication',
          path: '',
          title: "处理审批",
          redirect: "fromme",
          component: () => import(/* webpackChunkName: "DealApplication" */ './views/DealApplication.vue'),
          children: [
            {
              path: "fromme",
              name: "myApplication",
              title: "我的申请",
              component: () => import(/* webpackChunkName: "myApplication" */ './views/DealApplication/FromMe.vue')
            },
            {
              path: "tome",
              name: "requestedByMe",
              title: "待我审批",
              component: () => import(/* webpackChunkName: "requestedByMe" */ './views/DealApplication/ToMe.vue')
            },
            {
              path: "history",
              name: "applicationHistory",
              title: "审批记录",
              component: () => import(/* webpackChunkName: "applicationHistory" */ './views/DealApplication/History.vue')
            },
          ]
        }
      ],
    }
  ]
})
