import { request } from '../utils/http.js';

class REQ_DISPATCH {
  constructor() {
  }
  signature(data = {}) {
    return request({
      url: `/corpWX/getSignature`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getUrgency(data = {}) {
    return request({
      url: `/common/level/getLevelList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getDevice(data = {}) {
    return request({
      url: `/device/device/getDevice`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  submit(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/distributeWorkOrder`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getStatus(data = {}) {
    return request({
      url: `/workOrder/workOrderStatus/getWorkOrderStatusList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getList(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getWorkOrderList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getCancel(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/cancelWorkOrder`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getProcess(data = {}) {
    return request({
      url: `/workOrder/workOrderFlow/getWorkOrderFlowList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }
  getWorkerList(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getRepairmanList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

}

export const ReqDispatch = new REQ_DISPATCH();