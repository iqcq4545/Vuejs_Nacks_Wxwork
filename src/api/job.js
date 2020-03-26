import { request } from '../utils/http.js';

class REQ_JOB {
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


  getTeamList(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getWorkOrderListInRepairGroup`,
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
      url: `/repairInfo/cancelRepairInfo`,
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
      url: `/workOrder/workOrderFlow/getWorkOrderFlowListByBusinessSN`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  acceptJob(data = {}) {
    return request({
      url: `/workOrder/myWorkOrder/receiveWorkOrder`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  sparePart(data = {}) {
    return request({
      url: `/workOrder/myWorkOrder/rejectWorkOrder`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  sparePartList(data = {}) {
    return request({
      url: `/device/spareDevice/getSpareDeviceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getSupervisor(data = {}) {
    return request({
      url: `/repair/repairInfo/getManagerList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

}

export const ReqJob = new REQ_JOB();