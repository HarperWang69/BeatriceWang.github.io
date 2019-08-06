import { stringify } from 'qs';
import request from '@/utils/request';

/** 
* 接口命名规范
* 获取Abc列表     ·············· fetchAbcList
* 添加Abc         ·············· addAbc
* 查找Abc详情     ·············· findAbcDetail
* 修改Abc         ·············· updateAbc
* 删除Abc         ·············· deleteAbc
* 获取Abc下拉框   ·············· fetchAbcSelect
* 获取Abc级联选择 ·············· fetchAbcTree
* 查询/筛选Abc
*   按时间        ·············· searchAbcByTime
*   按名称        ·············· searchAbcByName
*   模糊          ·············· searchAbc
*/


/* ****************上线部署请将此地址改为后台地址**************** */

// const baseUrl = 'http://192.168.2.39:8080/spms'; // 生产环境 部署地址

// const baseUrl = 'http://192.168.2.34:8080/tbh'; // 测试环境 本地服务器地址
const baseUrl = 'http://127.0.0.1:8080/tbh'; // 测试环境 本地服务器地址

// const baseUrl = '/api'; // mock数据接口地址

/* *********************************************************** */

// const baseUrl = 'http://192.168.2.113:8080'; // 杨臣


export default baseUrl;

/* *********************** 树形结构 *********************** */

/* *********************** 级联选择 *********************** */
// 组织架构
export async function fetchDepartTree() {
  return request(`${baseUrl}/select/fetchDepartTree`)
}
// 角色(单位/部门/网格/角色)
export async function fetchRoleTree() {
  return request(`${baseUrl}/select/fetchRoleTree`)
}
// 事件类型
export async function fetchEventTypeTree() {
  return request(`${baseUrl}/select/fetchEventTypeTree`)
}
/* *********************** 下拉选择 *********************** */


// 网格等级
export async function fetchGridLevelSelect() {
  return request(`${baseUrl}/select/fetchGridLevelSelect`)
}
// 网格形态
export async function fetchGridShapeSelect() {
  return request(`${baseUrl}/select/fetchGridShapeSelect`)
}
// 网格类型
export async function fetchGridTypeSelect() {
  return request(`${baseUrl}/select/fetchGridTypeSelect`)
}


// 事件紧急程度
export async function fetchEventEmergencyLevel() {
  return request(`${baseUrl}/select/fetchEventEmergencyLevel`)
}
// 事件状态
export async function fetchEventStateSelect() {
  return request(`${baseUrl}/select/fetchEventStateSelect`)
}


// 职位角色
export async function fetchPositionSelect() {
  return request(`${baseUrl}/select/fetchPositionSelect`)
}
// 上级
export async function fetchSuperSelect(params) {
  return request(`${baseUrl}/event/fetchReportorSelect?eventId=${params}`,{
    method:'POST',
  })
}
// 下级
export async function fetchSubperSelect(params) {
  return request(`${baseUrl}/event/fetchDispatchSelect?eventId=${params}`,{
    method:'POST',
  })
}

/* *********************** 人员管理 *********************** */
// 登录
export async function login(params) {
  return request(`${baseUrl}/user/login`,{
    method:'POST',
    body: params,
  });
}
// 退出
export async function logout() {
  return request(`${baseUrl}/user/logout`);
}
// 新增
export async function addUser(params) {
  return request(`${baseUrl}/user/addUser`,{
    method:'POST',
    body: params,
  });
}
// 修改
export async function updateUser(params) {
  return request(`${baseUrl}/user/updateUser`,{
    method:'POST',
    body: params,
  });
}
// 删除
export async function deleteUser(params) {
  return request(`${baseUrl}/user/deleteUser?userId=${params}`);
}
// 列表
export async function fetchUserList(params) {
  
  return request(`${baseUrl}/user/fetchUserList`,{
    method:'POST',
    body: params,
  });
}
// 详情
export async function findUserDetail(params) {
  return request(`${baseUrl}/user/findUserDetail?userId=${params.userId}`)
}
/* *********************** 网格管理 *********************** */
// 新增
export async function addGrid(params) {
  return request(`${baseUrl}/grid/addGrid`,{
    method:'POST',
    body: params,
  });
}
// 修改
export async function updateGrid(params) {
  return request(`${baseUrl}/grid/updateGrid`,{
    method:'POST',
    body: params,
  });
}
// 列表
export async function fetchGridList(params) {
  return request(`${baseUrl}/grid/fetchGridList`,{
    method:'POST',
    body: params,
  });
}
// 详情
export async function findGridDetail(params) {
  return request(`${baseUrl}/grid/findGridDetail?gridId=${params.gridId}`)
}
/* *********************** 事件管理 *********************** */
// 列表
export async function fetchEventList(params) {
  return request(`${baseUrl}/event/fetchEventList`,{
    method:'POST',
    body: params,
  });
}
// 详情
export async function fetchEventDetail(params) {
  return request(`${baseUrl}/event/fetchEventDetail?eventId=${params.eventId}`,{
    method:'POST',
  });
}
// 转交上级
export async function reportEvent(params) {
  return request(`${baseUrl}/event/reportEvent`,{
    method:'POST',
    body: params,
  });
}
// 下派工单
export async function subordEvent(params) {
  return request(`${baseUrl}/event/subordEvent`,{
    method:'POST',
    body: params,
  });
}
// 退回
export async function backEvent(params) {
  return request(`${baseUrl}/event/backEvent`,{
    method:'POST',
    body: params,
  });
}
// 确认完成
export async function finishEvent(params) {
  return request(`${baseUrl}/event/finishEvent`,{
    method:'POST',
    body: params,
  });
}
