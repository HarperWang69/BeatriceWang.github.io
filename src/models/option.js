/* eslint-disable no-unused-vars */
import { formatTreeNodes,formatTransfer } from '@/utils/utils';
import {
  // 级联 
  fetchDepartTree,
  fetchRoleTree,
  fetchEventTypeTree,
  // 下拉选
  fetchGridLevelSelect,
  fetchGridShapeSelect,
  fetchGridTypeSelect,

  fetchEventEmergencyLevel,
  fetchEventStateSelect,

  fetchPositionSelect,
  fetchSuperSelect,
  fetchSubperSelect
 } from '@/services/api';
/** 
* 接口命名规范
* 获取Abc下拉框      fetchAbcSelect
* 获取Abc级联选择    fetchAbcTree
*/
export default {
  namespace: 'option',

  state: {
    // 级联 
    departTree:[], // 组织架构
    roleTree:[], // 角色
    eventTypeTree:[], // 事件类型
    // 下拉选
    gridLevelSelect: [], // 网格等级
    gridShapeSelect: [], // 网格形态
    gridTypeSelect: [], // 网格类型

    eventEmergencyLevel: [], // 事件紧急程度(等级)
    eventStateSelect: [], // 事件状态

    positionSelect: [], // 职位角色
    superSelect: [], // 上级
    subperSelect: [], // 下级


  },

  effects: {
    /* ***********************级联选择********************** */
    // 部门
    * fetchDepartTree({payload}, { call, put }) {
      const response = yield call(fetchDepartTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            departTree: response.data,
          }
        });
      }
    },
    // 角色
    * fetchRoleTree({payload}, { call, put }) {
      const response = yield call(fetchRoleTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            roleTree: response.data,
          }
        });
      }
    },
    // 事件类型
    * fetchEventTypeTree({payload}, { call, put }) {
      const response = yield call(fetchEventTypeTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            eventTypeTree: response.data,
          }
        });
      }
    },

    /* ***********************下拉框*********************** */
    // 网格等级
    * fetchGridLevelSelect({payload}, { call, put }) {
      const response = yield call(fetchGridLevelSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            gridLevelSelect: response.data,
          }
        });
      }
    },
    // 网格形态
    * fetchGridShapeSelect({payload}, { call, put }) {
      const response = yield call(fetchGridShapeSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            gridShapeSelect: response.data,
          }
        });
      }
    },
    // 网格类型
    * fetchGridTypeSelect({payload}, { call, put }) {
      const response = yield call(fetchGridTypeSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            gridTypeSelect: response.data,
          }
        });
      }
    },


    // 事件紧急程度
    * fetchEventEmergencyLevel({payload}, { call, put }) {
      const response = yield call(fetchEventEmergencyLevel, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            eventEmergencyLevel: response.data,
          }
        });
      }
    },
    // 事件状态
    * fetchEventStateSelect({payload}, { call, put }) {
      const response = yield call(fetchEventStateSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            eventStateSelect: response.data,
          }
        });
      }
    },


    // 职位角色
    * fetchPositionSelect({payload}, { call, put }) {
      const response = yield call(fetchPositionSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            positionSelect: response.data,
          }
        });
      }
    },
    // 上级
    * fetchSuperSelect({payload}, { call, put }) {
      const response = yield call(fetchSuperSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            superSelect: response.data,
          }
        });
      }
    },
    // 下级
    * fetchSubperSelect({payload}, { call, put }) {
      const response = yield call(fetchSubperSelect, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            subperSelect: response.data,
          }
        });
      }
    },
    
    // 清空弹窗数据
    *clear( _ , {put }) {
      yield put({
        type: 'save',
        payload: {
          departTree: [],
          roleTree:[],
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
}