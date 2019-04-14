import Cookies from 'js-cookie'
import config from "../app.config"
const TOKEN_KEY = config.token_key;

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}