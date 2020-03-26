import { request } from '../utils/http.js';

class REQ_TOOLS {
  getCalendar(data = {}) {
    return request({
      url: `/common/workCalendar/getWorkCalendarList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',

    });
  }

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

  getJobList(data = {}) {
    return request({
      url: `/workOrder/workJob/getWorkJobListWithReceiver`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  uploadFile(data = {}) {
    return request({
      url: `/common/file/uploadFile`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'POST',
    });
  }

}

export const ReqTools = new REQ_TOOLS();