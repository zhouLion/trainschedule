import request from "../utils/request"

let Post = request.post
let Get = request.get
let Delete = request.delete

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

  getApplyDetail: (id) => {
    return Get("apply/detail", {
      params: {
        id
      }
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
   * @param {{ username?:string ,page: int, pageSize: int }} param
   */
  getApplyFromUser: ({ username, page = 1, pageSize = 10 }) => {
    let data = {
      page,
      pageSize
    };
    if (username) {
      data.username = username;
    }
    return Get("apply/fromUser", {
      params: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
  },

  /**
   * 设置权限
   * @param {*} param 
   */
  postAuth: param => {
    return Post("apply/auth", {
      Param: param
    });
  },

  /**
   * #### 提交申请
   * @param {{request: {xjts:string, ltts: string},xjlb: string,stamp: {ldsj:string},to: Array<int>}
   * } Param 
   * @param {String} Reason
   * @param {String} Verify 
   * @param {Boolean} NotStart 
   */
  submitApply: (Param, Reason, Verify, NotStart) => {
    let headers = {
      "Content-Type": "application/json",
    };
    return Post("apply/submit", {
      Param,
      Reason,
      Verify,
      NotStart
    }, {
        headers
      })
  },

  withdraw(id) {
    return Post("apply/withdraw", {
      id
    })
  },

  removeApply(id) {
    return Delete("apply/remove", {
      params: {
        id
      }
    })
  }
}