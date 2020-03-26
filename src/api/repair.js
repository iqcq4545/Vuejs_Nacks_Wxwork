import { request } from '../utils/http.js';

class REQ_REPAIR {
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

  deviceList(data = {}) {
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

  getFault(data = {}) {
    return request({
      url: `/repair/faultType/getFaultTypeList`,
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
      url: `/repairInfo/addRepairInfo`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getList(data = {}) {
    return request({
      url: `/repairInfo/getRepairInfoList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getRepairInfo(data = {}) {
    return request({
      url: `/repairInfo/getRepairInfo`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

  getRepairImg(data = {}){
    return request({
      url: `/repairInfo/getPhotoList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getRepairIssue(data={}){
    return request({
      url: `/repair/repairInfo/getRepairQuestionList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
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

  postCancel(data = {}) {
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

  postAcceptance(data = {}) {
    return request({
      url: `/repair/repairInfo/checkPass`,
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
      url: `/workOrder/workOrderInfo/getSpareDeviceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  sparePartListPending(data = {}) {
    return request({
      url: `/workOrder/workOrderInfo/getLackSpareDeviceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }
}

export const ReqRepair = new REQ_REPAIR();