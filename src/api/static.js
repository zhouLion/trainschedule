import request from "../utils/request"

let Get = request.get
// let Post = request.post

export default {
  // verify
  refreshVerify: () => {
    return Get("static/verify")
  }
}