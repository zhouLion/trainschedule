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
    ### 登录
    | 字段名     | 类型   | 描述               |
    | ---------- | ------ | ------------------|
    | UserName   | string | 用户名             |
    | Password   | string | 密码               |
    | Verify | string | 经AES加密的x轴数值 |
   * @param {{ UserName:string, Password:string, Verify:string }} param0 
   */
  loginRest({ UserName, Password, Verify }) {
    return Post("account/login/rest", { UserName, Password, Verify })
  },

  /**
    ### 授权 
    | 字段名     | 类型   | 描述               |
    | ---------- | ------ | ------------------ |
    | UserName   | string | 授权目标             |
    | Path   | string | 权限路径             |
    |AuthCode|json|授权码，经有权限的账号为Key，使用GoogleAuth授权 {AuthUserName:string[用于授权的账号],AuthCode:string[授权账号的当前GoogleAuth授权码]}|
   * @param {*} param0 
   */
  postPermissionRest({ UserName, Path, AuthCode, AuthUserName }) {
    return Post("/account/permission/rest", { UserName, Path, AuthCode, AuthUserName })
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
