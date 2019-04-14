// axios库
import axios from "axios";
// 顶部的一个加载中的动画
import NProgress from "nprogress";
// 加密解密方法
import { encryptByDESMode, decryptByDESMode } from "./crypto";
// 院本部的接口端点
import { MOBILE_URL, CMCC_URL } from "../config/apiUrl";

/**
 * 处理一些需要追加token的请求
 * @param {*} data
 */
function appendToken(data) {
  // 获取浏览器持久化localStorage中的app-token
  let token = localStorage.getItem("APP-TOKEN");
  if (token) {
    if (!data) data = {};
    data.token = token;
  }
  return data;
}

/**
 * 处理一些需要对参数进行加密的请求
 * @param {*} data
 */
function stringifyData(data) {
  let json = encryptByDESMode(JSON.stringify(data));
  return JSON.stringify({
    isSec: true,
    json: json
  });
}

/**
 * isAppendToken 是否需要追加token
 * @param {*} flag
 */
function isAppendToken(flag) {
  mobileSurvey.defaults.transformRequest = flag
    ? [appendToken, stringifyData]
    : [stringifyData];
}

/**
 * mobileSurvey, 对院本部的接口请求的预处理
 */
let mobileSurvey = axios.create({
  baseURL: MOBILE_URL,
  responseType: "json",
  transformRequest: [appendToken, stringifyData],
  transformResponse(data) {
    data.json = decryptByDESMode(data.json);
    return JSON.parse(data.json);
  }
});

let cmccSurvey = axios.create({
  baseURL: CMCC_URL,
  responseType: "json"
});

/**
 * 需要与管控对接的接口
 */
export const mobileApi = {
  /**
   * 登陆， 返回的是token
   * @param {*} param0
   */
  login({ usercode, password }) {
    isAppendToken(false);
    NProgress.start();
    return mobileSurvey
      .post("mobile/user/login", { usercode, password })
      .then(d => {
        NProgress.done();
        let { data } = d;
        if (data.flag == 0) {
          return null;
        } else {
          return data.token;
        }
      });
  },

  /**
   * 拉取数据字典
   * @param {*} param0
   */
  getAllDic({ inputTime = "1970" }) {
    isAppendToken(true);
    return mobileSurvey
      .post(
        "mobile/task/getAllDict",
        {
          inputTime
        },
        {
          /**
           * 数据字典经过了gzip压缩， 需要使用buffer读取
           * @param {*} data
           */
          transformResponse(data) {
            data.json = new Buffer(data.json, "base64").toString();
            return JSON.parse(data.json);
          }
        }
      )
      .then(d => d.data);
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey.post("mobile/user/getUserInfo").then(d => {
      NProgress.done();
      return d.data;
    });
  },

  /**
   * 拉取工单列表
   * @param {*} param
   */
  getWaitingHandleList(param = { inputTime: "1970" }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getWaitingHandleList", param)
      .then(d => {
        NProgress.done();
        let { data } = d;
        if (data.flag && data.flag == 1 && data.result) {
          return data.result;
        } else {
          return null;
        }
      });
  },

  /**
   * 获取工单下的资源类型列表
   * @param {*} param0
   */
  getResourceListByTaskId({ taskId }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getResourceListByTaskId", { taskId })
      .then(d => {
        NProgress.done();
        return d.data;
      });
  },

  /**
   * 获取工单下面的模版
   * @param {*} param0
   */
  getTemplatesByTaskId({ taskId }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getTemplatesByTaskId", { taskId })
      .then(d => {
        NProgress.done();
        let { data } = d;
        if (data.flag && data.flag == 1 && data.result) {
          return data.result;
        } else {
          return null;
        }
      });
  },

  /**
   * 获取工单的信息
   * @param {*} param
   */
  getSite(param) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey.post("mobile/task/getSite", param).then(d => {
      debugger
      NProgress.done();
      let { data } = d;
      if (data.flag && data.flag == 1 && data.result) {
        return data.result;
      } else {
        return null;
      }
    });
  },

  /**
   * 根据当前用户获取工单的详情
   * @param {{inputTime: String, tempalteIds: String}} param0
   */
  getTaskDefDataByUser({ inputTime, templateIds }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getTaskDefDataByUser", { inputTime, templateIds })
      .then(d => {
        NProgress.done();
        let { data } = d;
        if (data.flag && data.flag == 1 && data.template) {
          return data.template;
        } else {
          return null;
        }
      });
  },

  /**
   * 获取省市区县字典项
   */
  getDistrictWordbook() {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey.post("mobile/task/getDistrictWordbook").then(d => {
      NProgress.done();
      let { data } = d;
      if (data.flag && data.flag == 1) {
        return data;
      } else {
        return null;
      }
    });
  },

  /**
   * 查询单项下的工单列表，
   * @param {*} param0
   */
  getTaskListBySonProjectId({
    sonProjectId,
    // 页码
    pageNum,
    // 每页条数
    pageSize,
    // 查询条件
    search
  }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getTaskListBySonProjectId", {
        sonProjectId,
        pageNum,
        pageSize,
        search
      })
      .then(d => {
        debugger;
        NProgress.done();
        let { data } = d;
        if (data.flag && data.flag == 1) {
          return data.result;
        } else {
          return null;
        }
      });
  },

  authToken() {
    return axios.post(MOBILE_URL + "/SysLogin/authToken", false, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      transformRequest: [
        appendToken,
        function (data) {
          return JSON.stringify(data);
        }
      ]
    });
  },

  token() {
    return axios.post(MOBILE_URL + "/projectController/token", false, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      transformRequest: [
        // appendToken,
        function (data) {
          return JSON.stringify(data);
        }
      ]
    });
  },

  // mobile/task/getProjectsByUserAuth
  getProjectsByUserAuth({ projectName, sonProjectName }) {
    isAppendToken(true);
    NProgress.start();
    return mobileSurvey
      .post("mobile/task/getProjectsByUserAuth", {
        projectName,
        sonProjectName
      })
      .then(d => {
        NProgress.done();
        let { data } = d;
        if (data.flag && data.flag == 1) {
          return data.result;
        } else {
          return null;
        }
      });
  }
};

/**
 * 移动资源管理后台接口
 */
export const resourceApi = {
  uploadResourceByTaskId({
    lines = [],
    points = [],
    sets = [],
    attachs = [],
    coverUpdate = 1,
    taskiId
  }) {
    return cmccSurvey.post("uploadResourceByTaskId", {
      lines,
      points,
      sets,
      attachs,
      coverUpdate,
      taskiId
    });
  },
  getResourceByTaskid(taskId) {
    return cmccSurvey.get("getResourceByTaskid", {
      params: {
        taskId
      }
    });
  },
  uploadMediaFile() {
    return cmccSurvey.post("uploadMediaFile", {

    })
  }
};
