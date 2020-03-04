import { request } from '../utils/http.js';

class REQ_INDEX {

  getStatis(data = {}) {
    return request({
      url: `/statis/indexStatis/getMyStatis`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',

    });
  }

  moduleList(data = {}) {
    return request({
      url: `/system/user/getModuleList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',

    });
  }
}

export const ReqIndex = new REQ_INDEX();