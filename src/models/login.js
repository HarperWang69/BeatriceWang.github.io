import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { findAccountDetail, login, getFakeCaptcha, updatePwd } from '@/services/api';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // Login successfully
      if (response.code === 200) {
        // 存登录信息
        sessionStorage.setItem('user', JSON.stringify(response.data) || '');
        sessionStorage.setItem('currentAuthority', response.data.genderId);
        // 匹配权限
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else {
        message.error(`${response.message}`);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },

    *updatePwd({ payload, callback }, { call }) {
      const response = yield call(updatePwd, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
