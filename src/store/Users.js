import account from '../api/account';
import users from '../api/users'

let userInfoContruct = {
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

let state = {
  userInfo: JSON.parse(JSON.stringify(userInfoContruct))
}

let actions = {
  async userLogin({ UserName, Password, VerifyCode }) {
    await account.loginRest({
      UserName, Password, VerifyCode
    });
  },
  async userGetInfo() {
    let result = await users.getUserInfo();
    console.log(result);
  }
}

let mutations = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations
};