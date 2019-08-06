import { message } from 'antd';
import { findOrderAnalysis,findOrderData } from '../../../../services/api';


export default {
  namespace: 'home',

  state: {
    OrderAnalysis: {},
    OrderData:{}
  },

  effects: {
    // 查找工单分析数据
    *findOrderAnalysis({ payload, callback }, { call, put }) {
      const response = yield call(findOrderAnalysis, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            OrderAnalysis:response.data
          },
        });
      } else {
        message.error(`获取数据失败，错误信息：${response.msg}`);
      }
      if (callback) callback(response);
    },
    // 查找工单统计图
    *findOrderData({ payload, callback }, { call, put }) {
      const response = yield call(findOrderData, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            OrderData:response.data
          },
        });
      } else {
        message.error(`获取数据失败，错误信息：${response.msg}`);
      }
      if (callback) callback(response);
    }
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
