import request from "../utils/request"

let Post = request.post
let Get = request.get

export default {
  /**
   * 登录
   * @param {*} params 
   */
  login({ UserName, Password, VerifyCode }) {
    return Post("account/login", {
      UserName,
      Password,
      VerifyCode
    })
  },

  /**
   * 个人信息设置
   */
  postAccountInfo({ RealName, Duties, Phone, Address }) {
    return Post("account/info", { RealName, Duties, Phone, Address })
  },

  /**
   * 个人信息获取
   */
  getAccountInfo() {
    return Get("account/info")
  },

  /**
   * 个人权限
   */
  getAccountPermission() {
    return Get("account/permission")
  }
}
