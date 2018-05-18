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
        component: dynamicWrapper(app, ['manage'], () => import('../routes/Picture/Check')),
      name:"图片审核",
    },
    '/picture/tag': {
        component: dynamicWrapper(app, ['tag'], () => import('../routes/Picture/Tag')),
      name:"图片标签",
    },
    '/picture/manage': {
        component: dynamicWrapper(app, ['manage'], () => import('../routes/Picture/Manage')),
      name:"图片管理",
    },
    '/picture/edit/:id': {
        component: dynamicWrapper(app, ['paintingsuser'], () => import('../components/Upload/UploadModal')),
      name:"图片信息修改",
    },
    '/picture/add': {
        component: dynamicWrapper(app, ['paintingsuser'], () => import('../components/Upload/UploadModal')),
      name:"上传图片",
    },
   

    
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
        component: dynamicWrapper(app, ['user', 'login','setting','paintingsuser','collectuser','focususer'], () => import('../layouts/OwnerLayout')),
      },
      //首页
    '/owner/view': {
      component: dynamicWrapper(app, ['pictures','allpicture','paintingsuser'], () => import('../routes/Owner/index')),
    },
    //发现
    '/owner/discover': {
      component: dynamicWrapper(app, ['pictures','paintings'], () => import('../routes/Owner/Discover')),
    },
    //发现----某画集详情
    '/owner/discover_p/:id': {
      component: dynamicWrapper(app, ['pictures','paintings'], () => import('../routes/Owner/PictureDiscover')),
    },
    //搜索
    '/owner/search/:name': {
      component: dynamicWrapper(app, ['pictures','search'], () => import('../routes/Owner/Search')),
    },
    //最新
    '/owner/new': {
      component: dynamicWrapper(app, ['pictures','new'], () => import('../routes/Owner/New')),
    },
    //别人用户---个人中心
    '/owner/user/:id': {
      component: dynamicWrapper(app, ['paintingsuser','pictures','pictureuser','collectuser','focususer'], () => import('../routes/Owner/User')),
    },
    //用户---个人中心
    '/owner/paintings': {
      component: dynamicWrapper(app, ['paintingsuser','pictures','pictureuser','collectuser','focususer'], () => import('../routes/Owner/User')),
    },
    //用户---某个画集
    '/owner/painting/:id': {
      component: dynamicWrapper(app, ['paintingsuser','pictures'], () => import('../routes/Owner/Pictures')),
    },
    //用户----设置资料
    '/owner/setting': {
      component: dynamicWrapper(app, ['setting','user'], () => import('../routes/Owner/Setting')),
    },
    //用户----上传图片
    '/owner/upload': {
      component: dynamicWrapper(app, ['paintingsuser','user'], () => import('../components/Upload/UploadModal')),
    },
    //用户----修改图片信息
    '/owner/pictureEdit/:paintingsId/:id': {
      component: dynamicWrapper(app, ['paintingsuser'], () => import('../components/Upload/UploadModal')),
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
