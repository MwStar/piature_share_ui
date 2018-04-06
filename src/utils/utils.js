import moment from 'moment';
import { message, Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export function setLocalStorage(key, vaule) {
  return localStorage[key] = JSON.stringify(vaule);
}

export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage[key]);
  } catch (err) { return null; }
}
export function getLanguage() {
  const localStorageLanguage = getLocalStorage('language');
  let languageWithoutRegionCode = localStorageLanguage;
  if (!localStorageLanguage) {
    const navLanguage = (navigator.languages && navigator.languages[0]) ||
                       navigator.language ||
                       navigator.userLanguage;

    const language = navLanguage.toLowerCase().split(/[_-]+/)[0];
    languageWithoutRegionCode = language;
    if (language != 'zh' || language != 'en') {
      languageWithoutRegionCode = 'en';
    }
  }
  return languageWithoutRegionCode;
}


/**
   *
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
export function setCheckobxData(datajsons) {
  const len = datajsons.length;
  const arr = [];
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    newJson.label = json.nameCn;
    newJson.value = json.id.toString();
    arr.push(newJson);
  }
  return arr;
}


// 根据key值返回object
export function getAllNode(json, array) {
  const len = json.length;
  const arrLen = array.length;
  const result = [];
  const checkList = [];
  for (let i = 0; i < arrLen; i++) {
    result.push(...getNode(json, [], array[i]));
    checkList.push(parseInt(array[i]));
  }
  result.push(...checkList);
  // console.log(result);
  const arr = new Set(result);
  return [...arr];
}

/**
     * 根据NodeID查找当前节点以及父节点
     *
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
function getNode(json, arr, nodeId) {
  const len = json.length;
  const result = [];
  for (let i = 0; i < len; i++) {
    if (json[i].id === parseInt(nodeId)) {
      const parentId = parseInt(json[i].pid);

      if (parentId != 0) {
        arr.push(parentId);
        getNode(json, arr, parentId);
      }
    }
  }
  return arr;
}


/**
   * 机构数据组装selectTree数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
export function setOfficeSelectTree(datajsons, rejson, pid) {
  const len = datajsons.length;
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    if (json.parentId == pid) {
      newJson.key = json.id;
      newJson.value = json.id;
      newJson.label = json.name;
      newJson.type = json.type;
      rejson.push(newJson);
      const data = setOfficeSelectTree(datajsons, [], json.id);
      if (data.length > 0) {
        newJson.children = data;
      }
    }
  }
  return rejson;
}/**
   * 菜单数据组装Tree数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
export function setMenuTree(datajsons, rejson, pid) {
  const len = datajsons.length;
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    if (json.pid == pid) {
      newJson.name = json.nameCn;
      newJson.path = json.resourceUrl;
      newJson.icon = json.menuIcon;
      newJson.pid = json.pid;
      rejson.push(newJson);
      const data = setMenuTree(datajsons, [], json.id);
      if (data.length > 0) {
        newJson.children = data;
      }
    }
  }
  return rejson;
}
/**
   * 设备关系数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
export function setDeviceTree(datajsons, rejson, pid) {
  const len = datajsons.length;
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    if (json.pid == pid) {
      newJson.key = json.id;
      newJson.value = `${json.id}`;
      newJson.name = json.sn;
      if (json.type == 2) { // 中继器
        newJson.dtuId = json.pid;
        newJson.dtuSn = datajsons.find(item => item.id === json.pid).sn;
      } else if (json.type == 1) { // 微逆
        const obj = datajsons.find(item => item.id === json.pid);

        if (obj.type === 3) { // DTU
          newJson.dtuId = obj.id;
          newJson.dtuSn = obj.sn;
        } else if (obj.type === 2) { // 中继器
          const dtuObj = datajsons.find(item => item.id === obj.pid);
          newJson.dtuId = dtuObj.id;
          newJson.dtuSn = dtuObj.sn;
          newJson.reapterId = obj.id;
          newJson.reapterSn = obj.sn;
        }
      }
      newJson.type = json.type;

      const data = setDeviceTree(datajsons, [], json.id);
      if (data.length > 0) {
        newJson.children = data;
      }

      rejson.push(newJson);
    }
  }

  return rejson;
}
export function getIds(datajsons) {
  const len = datajsons.length;
  const arr = [];
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    if (json.type == 2 || json.type == 3) {
      arr.push(`${json.id}`);
    }
  }
  return arr;
}
/**
   * 经销商数据组装selectTree数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
export function setAgencySelectTree(datajsons, rejson, pid) {
  const len = datajsons.length;
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];

    const newJson = {};
    if (json.parentId == pid) {
      newJson.key = json.id;
      newJson.value = `${json.id}`;
      newJson.label = json.name;
      if (json.type == '0') {
        rejson.push(newJson);
      }
      const data = setAgencySelectTree(datajsons, [], json.id);
      if (data.length > 0) {
        newJson.children = data;
      }
    }
  }
  return rejson;
}
/** 根据经销商id 获取相应的业主信息* */
export function getOwnerByAgencyId(data, id) {
  const arr = [];
  data.map((item) => {
    if (item.parentId == id && item.type == '2') {
      arr.push(item);
    }
  });
  return arr;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

/**
   * 机构数据组装成table树形数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
*/
export function setOfficeDataTree(datajsons, rejson, pid) {
  const len = datajsons.length;
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    if (json.parentId == pid) {
      newJson.key = json.id;
      newJson.name = json.name;
      newJson.firstName = json.firstName;
      newJson.lastName = json.lastName;
      newJson.logoPath = json.logoPath;
      newJson.type = json.type;
      newJson.remarks = json.remarks;
      newJson.parentId = json.parentId;
      newJson.master = json.master;
      newJson.address = json.address;
      newJson.phone = json.phone;
      newJson.parentIds = json.parentIds;
      newJson.areaId = json.areaId;
      rejson.push(newJson);
      const data = setOfficeDataTree(datajsons, [], json.id);
      if (data.length > 0) {
        newJson.children = data;
      }
    }
  }
  return rejson;
}
function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      key: `${path}${item}`,
      path: `${path}${item}`,
      component: routerData[`${path}${item}`].component,
      exact,
    };
  });
  return renderRoutes;
}
// 错误信息提示
export function alertMessage(msg, type) {
  message.destroy();
  switch (type) {
    case 'success':
      message.success(msg);
      break;
    case 'warning':
      message.warning(msg);
      break;
    case 'error':
      message.error(msg);
      break;
    default:
  }
}

/**
   * 组装微逆详情树形数据
   * @param datajsons
   * @param rejson
   * @returns {*}
   */
export function setMicroDetailTree(datajsons, rejson, type) {
  const len = datajsons.length;
  const microTreeList = [];
  for (let i = 0; i < len; i++) {
    const json = datajsons[i];
    const newJson = {};
    if (type == '0') {
      newJson.key = json.miId;
      newJson.name = json.miSn;
      rejson.push(newJson);
    } else {
      newJson.key = json.miPort;
      newJson.miId = json.miId;
      newJson.miName = json.miSn;
      newJson.name = json.sn;
      rejson.push(newJson);
    }
  }
  rejson.forEach((item) => {
    microTreeList.push(<TreeNode key={item.key} title={item.name} />);
  });
  return microTreeList;
}
