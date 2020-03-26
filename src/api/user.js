import { request } from '../utils/http.js';

class REQ_USER {

  getMessage(data = {}) {
    return request({
      url: `/message/message/getMessageList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  logout(data = {}) {
    return request({
      url: `/login/loginOut`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  postPassword(data = {}) {
    return request({
      url: `/user/updatePassword`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }


}

export const ReqUser = new REQ_USER();