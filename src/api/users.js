import request from "../utils/request"

let Post = request.post
let Get = request.get
export default {
  /**
   * 个人信息获取
   */
  getUserInfo() {
    return Get("users/info")
  },

  /**
   * 个人信息设置
   * @param {*} {RealName, stringDuties, Company, Phone, Address} 
   */
  postUserInfo({
    RealName, Duties, Company, Phone, Address
  }) {
    return Post({
      RealName, Duties, Company, Phone, Address
    })
  },
}