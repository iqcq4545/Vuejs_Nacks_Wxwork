import { request } from '../utils/http.js';

class REQ_LIBRARY {
  constructor() {
  }

  knowledgeType(data = {}) {
    return request({
      url: `/knowledge/knowledgeType/getKnowledgeTypeList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  experienceType(data = {}) {
    return request({
      url: `/knowledge/experienceType/getExperienceTypeList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  regulationType(data = {}) {
    return request({
      url: `/knowledge/ruleSystemType/getRuleSystemTypeList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  documentType(data = {}) {
    return request({
      url: `/knowledge/documentType/getDocumentTypeList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getKnowledge(data = {}) {
    return request({
      url: `/knowledge/deviceKnowledge/getDeviceKnowledgeList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getExperience(data = {}) {
    return request({
      url: `/knowledge/experience/getExperienceList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getRegulation(data = {}) {
    return request({
      url: `/knowledge/ruleSystem/getRuleSystemList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getDocument(data = {}) {
    return request({
      url: `/knowledge/deviceDocument/getDeviceDocumentList`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getKnowledgeById(data = {}) {
    return request({
      url: `/knowledge/deviceKnowledge/getContent`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }

  getRegulationById(data = {}) {
    return request({
      url: `/knowledge/deviceKnowledge/getContent`,
      data: data,
      params: data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: 'GET',
    });
  }
}

export const ReqLibrary = new REQ_LIBRARY();