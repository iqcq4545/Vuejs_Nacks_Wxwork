import { request } from '../utils/http.js';

class REQ_DEVICE {
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
      method: 'GET',
    });
  }

  getTeamId(data = {}) {
    return request({
      url: `/common/repairGroup/getRepairGroup`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
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
      method: 'GET',
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
      method: 'GET',
    });
  }

  getStatus(data = {}) {
    return request({
      url: `/repair/repairInfoStatus/getRepairInfoStatusList`,
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
      url: `/device/device/getDeviceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getDeviceInfo(data = {}) {
    return request({
      url: `/device/device/getDevice`,
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

  uploadImg(data = {}) {
    return request({
      url: `/common/upload/uploadDevicePic`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  updateImg(data = {}) {
    return request({
      url: `/device/device/updateDevicePic`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

}

export const ReqDevice = new REQ_DEVICE();