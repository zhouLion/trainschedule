import account from '../api/account';
import users from '../api/users'
let userInfoFromLocalstorage = localStorage.getItem("userInfo");
let userInfoDefault = {
  "permissionCompanies": [],
  "address": "",
  "phone": "",
  "duties": "",
  "about": "",
  "webSite": "",
  "mutuals": [],
  "followings": [],
  "followers": [],
  "realName": "",
  "userName": "",
  "avatar": "",
  "date": "",
  "gender": 1,
  "confirmed": true,
  "followed": false,
  "blocked": false,
  "privateAccount": true,
  "iBlocked": true,
  "company": {
    "id": "0Bd11B1d-4699-39FB-0f1C-9fDd2fF1DbEE",
    "name": "人力资源科",
    "path": "Root/事业部/人力资源科",
    "isParent": false,
    "members": ""
  },
  "privilege": 0
}
let userInfo = userInfoFromLocalstorage ? JSON.parse(userInfoFromLocalstorage) : userInfoDefault;

let state = {
  userInfo: userInfo
}

let actions = {
  async userLogin({ state, commit }, { UserName, Password, VerifyCode }) {
    await account.loginRest({
      UserName, Password, VerifyCode
    });
  },
  async userGetInfo({ commit }) {
    try {
      let result = await users.getUserInfo();
      commit("setUserInfo", result);
    } catch (error) {
      console.log(error);
    }
  }
}

let mutations = {
  setUserInfo(state, userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    state.userInfo = userInfo;
  }
}

let getters = {
  // 用户头像
  avatar(state) {
    let { avatar } = state.userInfo;
    return avatar || "defaults/def-male-logo.png";
  },
  companyPath(state) {
    let { company } = state.userInfo;
    return company ? company.path : "";
  },
  // 用户部门层级
  companyPathArray(state, getters) {
    let { companyPath } = getters;
    let companyPathArray = companyPath.split("/");
    // companyPathArray.shift();
    return companyPathArray;
  },
  realName(state) {
    return state.userInfo.realName
  },
  permissionCompanies(state) {
    return state.userInfo.permissionCompanies;
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};