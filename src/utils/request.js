import axios from "axios";
import config from "../app.config"

const baseUrl = config.baseUrl;
let request = axios.create({
  baseURL: baseUrl,
  // transformRequest?: AxiosTransformer | AxiosTransformer[];
  // transformResponse?: AxiosTransformer | AxiosTransformer[];
  // responseType: "application/json",
  timeout: 7000,
  transformResponse(data) {
    try {
      let response = JSON.parse(data);
      if (response.status == 0) {
        return response.data;
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
})

export default request