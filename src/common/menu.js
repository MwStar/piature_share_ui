const menuData = [{
    name: '统计',
    icon: 'codepen',
    path: '/statistics',
}, {
    name: '图片',
    path: '/picture',
    icon: 'profile',
    children: [{
        name: '图片审核',
        path: 'verify',
    }, {
        name: '图片管理',
        path: 'manage',
    }],

}, {
    name: '系统管理',
    path: '/system',
    icon: 'setting',
    children: [{
        name: '用户管理',
        path: 'user',
    }, {
        name: '角色管理',
        path: 'role',
    }, {
        name: '资源管理',
        path: 'resource',
    }, {
        name: '日志管理',
        path: 'log',
    }],
}];

function formatter(data, parentPath = '') {
    const list = [];
    if(data){data.forEach((item) => {
        if (item.children) {
            list.push({
                ...item,
                path: `${parentPath}${item.path}`,
                children: formatter(item.children, `${parentPath}${item.path}/`),
            });
        } else {
            list.push({
                ...item,
                path: `${parentPath}${item.path}`,
            });
        }
    });}
    return list;
}

export const getMenuData = () => formatter(menuData);
