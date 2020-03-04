import { request } from '../utils/http.js';

class REQ_LOGIN {
  userLogin(data = {}) {
    return request({
      url: `/login/userLogin`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',

    });
  }
}

export const ReqLogin = new REQ_LOGIN();