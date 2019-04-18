export let User = class User {
  constructor() {
    this.permissionCompanies = [];
    this.address = "";
    this.phone = "";
    this.duties = "";
    this.about = "";
    this.webSite = "";
    this.mutuals = [];
    this.followings = [];
    this.followers = [];
    this.realName = "";
    this.userName = "";
    this.avatar = "";
    this.date = "";
    this.gender = 1;
    this.confirmed = true;
    this.followed = false;
    this.blocked = false;
    this.privateAccount = true;
    this.iBlocked = true;
    this.privilege = 0;
    this.company = {
      "id": "0Bd11B1d-4699-39FB-0f1C-9fDd2fF1DbEE",
      "name": "人力资源科",
      "path": "Root/事业部/人力资源科",
      "isParent": false,
      "members": ""
    }
  }
}

var user = new User()
user.company