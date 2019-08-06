import { message } from 'antd';
import {
  fetchEventList,
  fetchEventDetail,
  reportEvent,
  subordEvent,
  backEvent,
  finishEvent,
  
} from '../../../services/api';


export default {
  namespace: 'event',

  state: {
    List: {
      list: [],
      pagination: {},
    },
    Detail: {},
  },

  effects: {
    // 获取列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchEventList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            List: {
              list: response.data,
              pagination: response.page,
            }
          },
        });
      } else {
        message.error(`获取列表失败。错误信息：${response.msg}`);
      }
      if (callback) callback(response);
    },
    // 查找详情
    *findDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchEventDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            Detail:response.data
          },
        });
      } else {
        message.error(`查看详情失败，错误信息：${response.msg}`);
      }
      if (callback) callback(response);
    },
    // 转交上级
    *reportEvent({ payload, callback }, { call }) {
      const response = yield call(reportEvent, payload);
      if (callback) callback(response);
    },
    // 下派工单
    *subordEvent({ payload, callback }, { call }) {
      const response = yield call(subordEvent, payload);
      if (callback) callback(response);
    },
    // 退回
    *backEvent({ payload, callback }, { call }) {
      const response = yield call(backEvent, payload);
      if (callback) callback(response);
    },
    // 确认完成
    *finishEvent({ payload, callback }, { call }) {
      const response = yield call(finishEvent, payload);
      if (callback) callback(response);
    },

    // 清空弹窗数据
    *clear( _ , {put }) {
      yield put({
        type: 'save',
        payload: {
          Detail:{},
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
