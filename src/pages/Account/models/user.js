import { message } from 'antd';
import { 
  fetchUserList, 
  addUser, 
  updateUser, 
  deleteUser, 
  findUserDetail, 
} from '../../../services/api';


export default {
  namespace: 'account',

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
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteUser, payload);
      if (callback) callback(response);
    },
    // 获取列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserList, payload);
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
      const response = yield call(findUserDetail, payload);
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
