import request from "../utils/request"

let Post = request.post
let Get = request.get

export default {
  /**
   * 获取所有的申请
   */
  getAllApply: () => {
    return Get("apply/all");
  },

  /**
   * 获取申请详情
   * @param {*} id 
   */
  getApply: id => {
    return Get("apply/apply", {
      data: {
        id
      }
    });
  },

  getApplyDetail: ({ id }) => {
    return Get("apply/detail", {
      id
    })
  },

  /**
   * 获取指定单位所有申请
   */
  getApplyFromCompany: ({
    path
  }) => {
    return Get("apply/fromCompany", {
      data: {
        path
      }
    });
  },

  /**
   * 获取指定用户所有申请
   */
  getApplyFromUser: () => {
    return Get("apply/fromUser");
  },

  /**
   * 设置权限
   * @param {*} param 
   */
  postAuth: param => {
    return Post("apply/auth", {
      Param: param
    });
  }
}