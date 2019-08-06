import { parse } from 'qs';

/**
 *将穿梭框的数组格式化成以key，title为key的键值对
 *
 * @export
 * @param {Array} data (数组)
 * @param {String} key (对应的key)
 * @param {String} title (对应的key)
 * @returns
 */
export function formatTransfer(data,title,key) {
  let result = [];
  data.forEach(element => {
    if(element.children && element.children.length > 0){
      result.push({title:element[title], key:element[key], children:formatTransfer(element.children,key,title)})
    }else{
      result.push({title:element[title], key:element[key]})
    }
    ;
  });
  return result;
}
/**
 *将下拉框的数组的key格式化成以text，value为key的键值对
 *
 * @export
 * @param {Array} selsect (下拉框数组)
 * @param {String} tKey (text对应的key)
 * @param {String} vKey (value对应的key)
 * @returns
 */
export function formatSelect(selsect,tKey,vKey) {
  let result = [];
  selsect.forEach(element => {
    if(element.children && element.children.length > 0){
      result.push({text:element[tKey], value:element[vKey], children:formatSelect(element.children,tKey,vKey)})
    }else{
      result.push({text:element[tKey], value:element[vKey]})
    }
    ;
  });
  return result;
}
/**
 *将枚举值数组格式化成filter时需要的以text，value为key的键值对
 *
 * @export
 * @param {Array} map (枚举值数组，下标对应value)
 * @returns {Array} (目标格式为[{text:'状态1',value:1}])
 */
export function filterMap(map) {
  let filterMap = [];
  map.forEach((element, index)=> {
    if(element.length > 0){
      filterMap.push({text:element, value:Number(index)});
    }
  });
  return filterMap;
}
/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}