import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Tree } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ThirdTreeFrom from './resourceManagerForm';
import style from './resourceManager.less';

const TreeNode = Tree.TreeNode;


const resourceManager = ({ dispatch, thirdtreemodel }) => {
  const { list, selectTree, isAdd, isUpdate, editmodal, mockData } = thirdtreemodel;

  /**
   * 选择树节点
   * @param selectedKeys
   * @param info
   */
  const onSelect = (selectedKeys, info) => {
    const selectId = selectedKeys[0];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == selectId) {
        dispatch({ type: 'thirdtreemodel/setSelectTree', selectTree: list[i] });
        dispatch({ type: 'thirdtreemodel/setisUpdate', isUpdate: false });
        dispatch({ type: 'thirdtreemodel/setisAdd', isAdd: false });
      }
    }
  };

  // 测试数据
  /* const  treeData=[
    {id:1, name: '顶级菜单（无效）',url:'111.xx',icon:'aaa',parentId:0},
    {id:2, name: '首页',url:'222.xx',icon:'bbb',parentId:1},
    {id:3, name: '系统管理',url:'333.xx',icon:'ccc',parentId:1},
    {id:4, name: '菜单管理',url:'444.xx',icon:'ddd',parentId:3},
    {id:5, name: '资源管理',url:'555.xx',icon:'eee',parentId:3}
  ]; */

  /**
   * 组装树形数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
  const setDataTree = (datajsons, rejson, pid) => {
    for (let i = 0; i < datajsons.length; i++) {
      const json = datajsons[i];
      if (json.pid == pid) {
        const newJson = {};
        newJson.key = json.id;
        newJson.name = json.nameCn;
        newJson.children = setDataTree(datajsons, [], json.id);
        rejson.push(newJson);
      }
    }
    return rejson;
  };

  /**
   * 组装树节点
   * @param data
   */
  const loop = data => data.map((item) => {
    if (item.children.length > 0) {
      return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.key} title={item.name} />;
  });
  // 得到树形节点
  const treeNodes = loop(setDataTree(list, [], 0));

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <div style={{ marginBottom: 15, overflowY: 'hidden' }}>
          <Row className="navigation">
            <Col span={5} className={list.length > 0 ? style.treeContainer : style.isAdd} style={{ background: '#eff6f9', maxHeight: 640, minWidth: 250, padding: 10, borderRadius: 10, width: 'auto' }}>
              <Tree
                showLine
                onSelect={onSelect}
              >
                {treeNodes}
              </Tree>
            </Col>
            <Col span={15} style={{ maxWidth: 500 }}>
              <ThirdTreeFrom selectTree={selectTree} list={list} isAdd={isAdd} isUpdate={isUpdate} editmodal={editmodal} mockData={mockData} />
            </Col>
          </Row>
        </div>
      </Card>
    </PageHeaderLayout>
  );
};

export default connect(({ thirdtreemodel }) => ({ thirdtreemodel }))(resourceManager);
