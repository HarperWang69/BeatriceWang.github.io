import { message } from 'antd';
import {
  fetchGridList,
  addGrid,
  updateGrid,
  deleteGrid,
  findGridDetail,
} from '../../../services/api';


export default {
  namespace: 'grid',

  state: {
    List: {
      list: [],
      pagination: {},
    },
    Detail: {},
  },

  effects: {
     // 添加
     *add({ payload, callback }, { call }) {
      const response = yield call(addGrid, payload);
      if (callback) callback(response);
    },
    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(updateGrid, payload);
      if (callback) callback(response);
    },
    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteGrid, payload);
      if (callback) callback(response);
    },
    // 获取列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchGridList, payload);
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
      const response = yield call(findGridDetail, payload);
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
