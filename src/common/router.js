import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import {getLocalStorage } from '../utils/utils';
const menulist = getLocalStorage("menulist")?getLocalStorage("menulist"):getMenuData();
// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login','setting'], () => import('../layouts/BasicLayout')),
    },
    '/statistics': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Dashboard')),
      name:"统计",
    },
    '/picture/verify': {
        component: dynamicWrapper(app, ['station'], () => import('../routes/Station/Powerlist')),
      name:"图片审核",
    },
    '/picture/manage': {
        component: dynamicWrapper(app, ['station'], () => import('../routes/Station/Powerlist')),
      name:"图片管理",
    },
    /*'/station/quicksite/:id': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/QuickSite')),
    },
    '/station/quicksite/:id/device': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/QuickSite/Step2')),
    },
    '/station/quicksite/:id/diagram/': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/QuickSite/Step3')),
    },
    '/station/qucikResult/:id': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/QuickSite/Result')),
    },
    '/station/profession/:id': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/ProfessionSite')),
    },
    '/station/profession/:id/device': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/ProfessionSite')),
    },
    '/station/profession/:id/layout': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/ProfessionSite')),
    },
    '/station/profession/:id/upload': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/ProfessionSite')),
    },
    '/station/view/:id&:name': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Station/StationDetails')),
    },
    '/station/editInfo/:id': {
      component: dynamicWrapper(app, ['quicksite'], () => import('../routes/Station/EditInfo')),
    },*/
    
    '/setting': {
      component: dynamicWrapper(app, ['setting'], () => import('../routes/User/UserInfo')),
    },

    '/system/user': {
      component: dynamicWrapper(app, ['users'], () => import('../routes/System/Users')),
      name:"用户管理",
    },
    '/system/role': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/System/RoleManager')),
      name:"角色管理",
    },
    '/system/resource': {
      component: dynamicWrapper(app, ['resource'], () => import('../routes/ResourceManager/resourceManager')),
      name:"资源管理",
    },
    '/system/log': {
      component: dynamicWrapper(app, ['systemlog'], () => import('../routes/System/Syslog')),
      name:"系统日志",
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },

    '/owner': {
        component: dynamicWrapper(app, ['user', 'login','setting'], () => import('../layouts/OwnerLayout')),
      },
      //首页
    '/owner/view': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Owner/index')),
    },
    //首页--某张图详情
    '/owner/view/:id': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Owner/index')),
    },
    //发现
    '/owner/discover': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Owner/index')),
    },
    //发现----某画集详情
    '/owner/discover/:id': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Owner/index')),
    },
    //最新
    '/owner/new': {
      component: dynamicWrapper(app, ['view'], () => import('../routes/Owner/index')),
    },
    //画集
    '/owner/paintings': {
      component: dynamicWrapper(app, ['paintings'], () => import('../routes/Owner/User')),
    },
    //用户--某个画集
    '/owner/painting/:id': {
      component: dynamicWrapper(app, ['paintings'], () => import('../routes/Owner/Pictures')),
    },
    //用户---收藏
    '/owner/collect': {
      component: dynamicWrapper(app, ['paintings'], () => import('../routes/Owner/User')),
    },
    //用户---关注
    '/owner/focus': {
      component: dynamicWrapper(app, ['paintings'], () => import('../routes/Owner/User')),
    },
    //用户----设置资料
    '/owner/setting': {
      component: dynamicWrapper(app, ['paintings'], () => import('../routes/Owner/User')),
    },
    
    

    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/forgot': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Forgot')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  //const menuData = getFlatMenuData(getMenuData());
  const menuData = getFlatMenuData(menulist);
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
