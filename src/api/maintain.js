import { request } from '../utils/http.js';

class REQ_MAINTAIN {
  constructor() {
  }
  getMaintainInfo(data = {}) {
    return request({
      url: `/maintain/maintainTask/getMaintainTask`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }
  getWorkerList(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getMaintainerList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  complete(data = {}) {
    return request({
      url: `/workOrder/myWorkOrder/finishWorkOrder`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

}

export const ReqMaintain = new REQ_MAINTAIN();