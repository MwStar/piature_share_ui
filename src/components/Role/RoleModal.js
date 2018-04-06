/**
 *  desc: 新增权限、修改权限组件
 * author: ylh
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input,Tree ,Checkbox,Row,Col} from 'antd';
 import styles from './RoleModal.less';
 import {connect} from 'dva';
 const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;
 const TreeNode = Tree.TreeNode;
/**
 *
 类说明：新增、修改权限信息的Modal
 @class 类名 AuthEditModal
 @constructor
 */
 class AuthEditModal extends Component {
  constructor(props) {
    super(props);

  }
/**
  *方法说明：提交表单
  *@method okHandler
  */
  okHandler = () => {
    const { id } = this.props.record;
    const { dispatch} = this.props;
    this.props.form.validateFields((err, values) => { 
      if (!err) {
        if(id){
         dispatch({
          type: 'role/updateUser',
          payload: { id, values },
        });
       }else{
         dispatch({
          type: 'role/addUser',
          payload: values,
        });
       }
      //this.props.form.resetFields();
     }
   });
       
  };
  //关闭modal
  close = ()=>{
    this.props.form.resetFields();
    const {dispatch} = this.props;
    dispatch({type:'role/hideModal'})
  }
  //获得选中的资源
  onCheck = (checkedKeys, info)=>{
    const {dispatch} = this.props;
     dispatch({
        type: 'role/checkResources',
        checkResoutcesList:checkedKeys,
    });
  }

  /**
   * 组装树形数据
   * @param datajsons
   * @param rejson
   * @param pid
   * @returns {*}
   */
   setDataTree =(datajsons,rejson,pid) =>{
    var len = datajsons.length;   
    for(var i = 0;i<len;i++){
      var json = datajsons[i];
      var newJson = {};
      if(json.pid == pid){    
        newJson["children"] = this.setDataTree(datajsons,[],json.id);
        newJson["key"]=json.id;
        newJson["name"]=json.nameCn;
        rejson.push(newJson);
      }
     
    }

    return rejson;
  }


   render() {
    const { children,role,record ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

      /**
   * 组装树节点
   * @param data
   */
  const loop = data => data.map((item) => {
    if (item.children && item.children.length>0) {
      return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.key} title={item.name} />;
  });
  //得到树形节点
  const treeNodes = loop(this.setDataTree(role.resourcesList,[],0));

  if(role.isResetForm){
      this.props.form.resetFields();
      dispatch({type: 'role/resetForm',isResetForm:false})
    }
  return (
    <Modal

    title={(!role.record.id)?'新增':'修改'}
    visible={role.visible}
    onOk={this.okHandler}
    onCancel={this.close}
    maskClosable={true}
    width={700}
    
  
    >
    <Form layout="horizontal" onSubmit={this.okHandler} className={styles['authority-modal-body']}>
    <FormItem
    {...formItemLayout}
    label="角色名称" hasFeedback
    >
    {
      getFieldDecorator('nameCn', {
        initialValue: record.nameCn,
        rules: [
        { required: true, message: '请输入角色名称' },
        { max: 20, message: '角色名称不能超过15个字符' },
        ]
      })(<Input />)
    }
    </FormItem>


    <Row>
      <Col span={6} className={styles.textRihght} >
          <label className={styles.label}>分配资源：</label>
      </Col>
      <Col span={14}>
      <div className="ant-form-item-control ">
      <Tree
          checkable={true}
          defaultExpandAll={true}
          checkedKeys={role.checkResoutcesList}
          onCheck={this.onCheck}
          >
          {treeNodes}
      </Tree>
      </div>
      </Col>
        </Row>
    </Form>
    </Modal>
    );
  }
}
const mapPropsToFields = (props) => {
  let {record} = props.role;
 
  let a = {};


  a.nameCn = Form.createFormField({value: record.nameCn})

  return a
};
const onFieldsChange = (props, changedFields) => {

};
const onValuesChange = (props, values) => {
  let {record} = props.role;
    for(let key in values){
    
        record[key] = values[key];
     
       
     }
};
const AuthForm = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(AuthEditModal);
export default connect(({role})=>({role}))(AuthForm);