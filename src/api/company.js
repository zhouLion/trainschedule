import request from "../utils/request"

let Post = request.post
let Get = request.get

export default {
  /**
   * 单位包含子单位
   * @param {*} path 
   */
  postCompany(path) {
    return Post("company/dic", {
      path
    })
  },

  /**
   * 单位包含职务
   * @param {*} path 
   */
  getComponyDuties(path) {
    return Get("company/duties", { path })
  },

  /**
   * 创建单位
   * @param {*} param0 
   */
  postComponyDuties({
    Name, ParentPath
  }) {
    return Post("company/duties", {
      Name, ParentPath
    })
  }
}
