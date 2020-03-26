import { request } from '../utils/http.js';

class REQ_CHECK {
  constructor() {
  }

  submit(data = {}) {
    return request({
      url: `/checkTask/addCheckTaskByRepairer`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  submitMultiple(data = {}) {
    return request({
      url: `/checkTask/addCheckTask`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getCheckInfo(data = {}) {
    return request({
      url: `/check/checkTask/getCheckTask`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getCheckerList(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getCheckerList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getDeviceList(data = {}) {
    return request({
      url: `/check/checkTask/getCheckDeviceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  checkSubmit(data = {}) {
    return request({
      url: `/check/checkTask/updateCheckResult`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
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

export const ReqCheck = new REQ_CHECK();