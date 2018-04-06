const menuData = [{
    name: '首页',
    path: '/owner/view',
}, {
    name: '发现',
    path: '/owner/discover',
}, {
    name: '最新',
    path: '/owner/new',
},{
    name: '画集',
    path: '/owner/paintings',
},
];

function formatter(data, parentPath = '') {
    const list = [];
    data.forEach((item) => {       
            list.push({
                ...item,
                path: `${parentPath}${item.path}`,
            });
    });
    return list;
}

export const getMenuData = () => formatter(menuData);
