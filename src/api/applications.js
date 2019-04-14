import request from "../utils/request"

let Post = request.post
let Get = request.get

export default {
  /**
   * 
   * @param {*} param0 
   */
  getAuth(path) {
    return Get("apply/auth", {
      data: {
        path
      }
    })
  },
  getApply(id) {
    return Get("apply/apply", {
      data: {
        id
      }
    })
  },
  postAuth(param) {
    return Post("apply/auth", {
      Param: param
    })
  },

}
