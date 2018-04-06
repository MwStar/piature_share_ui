import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Transfer, Select, Popconfirm, Button, Icon, Alert, notification, InputNumber, Row, Col, message, Radio } from 'antd';
import style from './resourceManagerForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class ThirdTreeFrom extends React.Component {
  /**
   * 添加第三方资源提交
   * @param e
   */
  handleSubmit = (e) => {
    const { dispatch, selectTree, list } = this.props;
    if (list.length > 0) {
      this.props.form.setFieldsValue({ updateName: selectTree.nameCn });
      this.props.form.setFieldsValue({ updateNameEn: selectTree.nameEn });
    } else {
      this.props.form.setFieldsValue({ updateName: '1' });
      this.props.form.setFieldsValue({ updateNameEn: '1' });
    }


    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const param = {};
        param.nameCn = values.addName;
        param.nameEn = values.addNameEn;
        param.resourceUrl = values.addUrl;
        param.resourceMenuType = values.addType;
        param.resourceSort = values.addResourceSort;
        param.menuIcon = values.addIcon;
        if (list.length > 0) {
          param.pid = selectTree.id;
        } else {
          param.pid = 0;
        }

        dispatch({ type: 'thirdtreemodel/create', param });
        // 重置
        this.props.form.resetFields();
      }
    });
  };

  /**
   * 修改第三方资源
   * @param e
   */
  handleSubmitUpdate = (e) => {
    this.props.form.setFieldsValue({ addName: '1' });

    const { dispatch, selectTree } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const param = {};
        param.id = selectTree.id;
        param.nameCn = values.updateName;
        param.nameEn = values.updateNameEn;
        param.resourceUrl = values.updateUrl;
        param.resourceMenuType = values.updateType;
        param.menuIcon = values.updateIcon;
        param.resourceSort = values.updateResourceSort;

        dispatch({ type: 'thirdtreemodel/update', param });
        // 重置
        this.props.form.resetFields();
      }
    });
  };

  /**
   * 设置修改时回显数据
   */
  setUpdateFileValue = () => {
    const { dispatch, selectTree } = this.props;
    this.props.form.setFieldsValue({ updateName: selectTree.nameCn });
    this.props.form.setFieldsValue({ updateNameEn: selectTree.nameEn });
    this.props.form.setFieldsValue({ updateUrl: selectTree.resourceUrl });
    this.props.form.setFieldsValue({ updateType: selectTree.resourceMenuType });
    this.props.form.setFieldsValue({ "updateIcon": selectTree.menuIcon });
    this.props.form.setFieldsValue({ updateResourceSort: selectTree.resourceSort != null ? `${selectTree.resourceSort}` : '0' });
  };

  /**
   * 切换添加
   */
  taggleAdd = () => {
    const { dispatch, selectTree } = this.props;
    if (selectTree == null) {
      message.error('请先选择父资源！');
    } else {
      dispatch({ type: 'thirdtreemodel/setisAdd', isAdd: true });
      dispatch({ type: 'thirdtreemodel/setisUpdate', isUpdate: false });
    }
  };
  /**
   * 切换修改
   */
  taggleUpdate = () => {
    const { dispatch, selectTree } = this.props;
    if (selectTree == null) {
      message.error('请先选择需要修改的资源！');
    }/* else if(selectTree.pid == 0){
     message.error('顶级菜单不能修改！');
     } */ else {
      this.setUpdateFileValue();
      dispatch({ type: 'thirdtreemodel/setisUpdate', isUpdate: true });
      dispatch({ type: 'thirdtreemodel/setisAdd', isAdd: false });
    }
  };

  /**
   * 新增和修改的取消
   */
  addUpdateCancel=() => {
    const { dispatch } = this.props;
    dispatch({ type: 'thirdtreemodel/setisUpdate', isUpdate: false });
    dispatch({ type: 'thirdtreemodel/setisAdd', isAdd: false });
  };

  /**
   * 删除
   * @param e
   */
  deleteMenu = (e) => {
    const { dispatch, selectTree, list } = this.props;

    let isdel = false;
    let ids = [];
    if (selectTree == null) {
      message.error('请先选择需要删除的资源！');
    } else {
      // 得到选中的菜单和子菜单
      ids.push(selectTree.id);
      ids = this.pushTreeData(list, ids, selectTree.id);
      isdel = true;
    }

    if (isdel) {
      dispatch({ type: 'thirdtreemodel/delete', param: { ids: ids.join(',') } });
      // 初始化已经选择的
      dispatch({ type: 'thirdtreemodel/setSelectTree', selectTree: null });
      dispatch({ type: 'thirdtreemodel/setisUpdate', isUpdate: false });
      dispatch({ type: 'thirdtreemodel/setisAdd', isAdd: false });
    }
  };

  /**
   * 通过父id得到全部的子id
   * @param treeList     树列表数据
   * @param treeListIds  得到的ID集合
   * @param pid          父id
   */
  pushTreeData = (treeList, treeListIds, pid) => {
    for (let i = 0, len = treeList.length; i < len; i++) {
      if (treeList[i].pid == pid) {
        treeListIds.push(treeList[i].id);
        this.pushTreeData(treeList, treeListIds, treeList[i].id);
      }
    }
    return treeListIds;
  };

  menuUpdate = (e) => {
    this.handleSubmitUpdate(e);
  };

  menuAdd = (e) => {
    this.handleSubmit(e);
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectTree, isAdd, isUpdate, list } = this.props;
    const iconList = ["home","solution","pay-circle-o","contacts","database","hdd","bank","android","windows-o","chrome"];
    return (
      <div style={{ marginTop: (list.length > 0 ? '' : 20) }}>
        <Row>
          <Col span={4} />
          <Col span={20} className={list.length > 0 ? style.operationCol : 'display'}>
            <Button className="all-add-button" style={{ marginRight: 10 }} onClick={this.taggleAdd}>新增资源</Button>
            <span className="separate" />
            <Button className="all-add-button" style={{ marginRight: 10 }} onClick={this.taggleUpdate}>修改</Button>
            <span className="separate" />
            <Popconfirm placement="top" title="您确定要删除该资源及下属资源吗？" onConfirm={this.deleteMenu} okText="是" cancelText="否">
              <Button onClick={this.addUpdateCancel} className="all-add-button">删除</Button>
            </Popconfirm>
          </Col>
        </Row>
        <Form className={(list.length > 0 && !isAdd && !isUpdate) ? '' : style.isAdd}>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="序号">
                {getFieldDecorator('selectName1', {
                  initialValue: selectTree != null ? selectTree.resourceSort : '',
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源名称">
                {getFieldDecorator('selectName2', {
                  initialValue: selectTree != null ? selectTree.nameCn : '',
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源标识符">
                {getFieldDecorator('selectName3', {
                  initialValue: selectTree != null ? selectTree.nameEn : '',
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源URL">
                {getFieldDecorator('selectName4', {
                  initialValue: selectTree != null ? selectTree.resourceUrl : '',
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator('selectName5', {
                  initialValue: selectTree != null ? selectTree.resourceMenuType : '',
                })(
                  <Select disabled>
                    <Option value="0">菜单</Option>
                    <Option value="1">按钮</Option>
                    <Option value="2">功能</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={"菜单图标"}>
              {selectTree!=null?<Icon type={selectTree.menuIcon} style={{ fontSize: 25}}/>:''}
            </FormItem>
          </Col>
        </Row>
        </Form>

        <Form onSubmit={this.handleSubmit} className={(isAdd || list.length == 0) ? '' : style.isAdd}>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="序号">
                {getFieldDecorator('addResourceSort', {
                  initialValue: '0',
                  rules: [{ message: '请输入序号!' },
                    { type: 'string', pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数' }],
                })(
                  <Input placeholder="请输入正整数！" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源名称">
                {getFieldDecorator('addName', {
                  rules: [{ required: true, message: '请输入资源名称!' },
                    { max: 10, message: '资源中文名称最大长度不能超过10个字符' },
                    { type: 'string', pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '资源名称只能输入中文、英文和数字' }],
                })(
                  <Input placeholder="资源名称" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源标识符">
                {getFieldDecorator('addNameEn', {
                  rules: [{ required: false, message: '请输入资源标识符!' },
                    { max: 20, message: '资源英文名称最大长度不能超过20个字符' },
                    { type: 'string', pattern: /^[_a-zA-Z]+$/, message: '资源资源标识符只能输入英文和下划线' }],
                })(
                  <Input placeholder="资源英文名称" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源URL">
                {getFieldDecorator('addUrl', {
                  rules: [{ message: '请输入资源URL!' }],
                })(
                  <Input placeholder="资源URL" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator('addType', {
                  rules: [{ message: '请输入资源菜单类型!' }],
                })(
                  <Select>
                    <Option value="0">菜单</Option>
                    <Option value="1">按钮</Option>
                    <Option value="2">功能</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={"菜单图标"}>
              {getFieldDecorator('addIcon', {
                rules: [{ message: '请输入菜单图标!' }]
              })(
                <RadioGroup>
                  {
                    iconList.map(function (item, idx) {
                      return(<Radio value={item} key={item}><Icon type={item} style={{ fontSize: 25}}/></Radio>)
                    })
                  }
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
          <Row>
            <Col span={8} />
            <Col span={16}>
              <FormItem {...formItemLayout} label="">
                <Button className="all-cancel-button" onClick={this.addUpdateCancel} style={{ marginRight: 10 }}>取消</Button>
                <Button className="all-ok-button" onClick={this.menuAdd}>保存</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Form onSubmit={this.handleSubmitUpdate} className={isUpdate ? '' : style.isAdd}>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="序号">
                {getFieldDecorator('updateResourceSort', {
                  rules: [{ message: '请输入序号!' },
                    { type: 'string', pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数' }],
                })(
                  <Input placeholder="请输入正整数！" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源名称">
                {getFieldDecorator('updateName', {
                  rules: [{ required: true, message: '请输入资源名称!' },
                    { max: 10, message: '资源中文名称最大长度不能超过10个字符' },
                    { type: 'string', pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '资源中文名称只能输入中文、英文和数字' }],
                })(
                  <Input placeholder="资源名称" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源标识符">
                {getFieldDecorator('updateNameEn', {
                  rules: [{ required: false, message: '请输入资源标识符!' },
                    { max: 20, message: '资源名称最大长度不能超过20个字符' },
                    { type: 'string', pattern: /^[_a-zA-Z0-9]+$/, message: '资源标识符只能输入中文、英文和数字' }],
                })(
                  <Input placeholder="资源标识符" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源URL">
                {getFieldDecorator('updateUrl', {
                  rules: [{ message: '请输入资源URL!' }],
                })(
                  <Input placeholder="资源URL" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator('updateType', {
                  rules: [{ message: '请输入资源菜单类型!' }],
                })(
                  <Select>
                    <Option value="0">菜单</Option>
                    <Option value="1">按钮</Option>
                    <Option value="2">功能</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={"菜单图标"}>
              {getFieldDecorator('updateIcon', {
                rules: [{ message: '请输入菜单图标!' }]
              })(
                <RadioGroup>
                  {
                    iconList.map(function (item, idx) {
                      return(<Radio value={item} key={item}><Icon type={item} style={{ fontSize: 25}}/></Radio>)
                    })
                  }
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
          <Row>
            <Col span={8} />
            <Col span={16}>
              <FormItem {...formItemLayout} label="">
                <Button className="all-cancel-button" onClick={this.addUpdateCancel} style={{ marginRight: 10 }}>取消</Button>
                <Button className="all-ok-button" onClick={this.menuUpdate}>修改</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

ThirdTreeFrom.propTypes = {};
const ThirdTreeObjFrom = Form.create()(ThirdTreeFrom);
export default connect(({ thirdtreemodel }) => ({ thirdtreemodel }))(ThirdTreeObjFrom);
