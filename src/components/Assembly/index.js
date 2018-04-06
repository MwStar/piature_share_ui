/**
 *  desc: 新增组件
 * author: ll
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input ,Checkbox,Row,Col, Icon, message} from 'antd';
 import styles from './index.less';
 import {connect} from 'dva';
 const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;

/**
 *
 类说明：新增组件的Modal
 @class 类名 AddModal
 @constructor
 */
 class AddModal extends Component {

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
          type: 'assembly/updateAssembly',
          payload: { id, values },
        });
       }else{
         dispatch({
          type: 'assembly/add',
          payload: values,
        });
       }
     }
   });
       
  };
  //关闭modal
  close = ()=>{
    const {dispatch} = this.props;
    dispatch({type:'assembly/hideModal'})
  }


 


  render() {
    const { assembly,record ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    if(assembly.isResetForm){
        this.props.form.resetFields();
        dispatch({type: 'assembly/resetForm',isResetForm:false})
      }
    return (
      <Modal
      title={(!assembly.record.id)?'新增':'修改'}
      visible={assembly.visible}
      onOk={this.okHandler}
      onCancel={this.close}
      maskClosable={true}
      width={700}        
      >
      
      <Form layout="horizontal" onSubmit={this.okHandler} className={styles['authority-modal-body']}>
        
        <FormItem 
        {...formItemLayout}
        label="组件型号" hasFeedback
        >
              {
                getFieldDecorator('model', {
                initialValue: record.model,
                rules: [
                { required: true, message: '请输入组件型号' },
                ]
              })(<Input />)
              }
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label="品牌" hasFeedback
        >
              {
                getFieldDecorator('brand', {
                initialValue: record.brand,
                rules: [
                { required: true, message: '请输入品牌' },
                ]
              })(<Input />)
              }
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label="生产厂商" hasFeedback
        >
              {
                getFieldDecorator('producer', {
                initialValue: record.producer,
                rules: [
                { required: true, message: '请输入生产厂商' },
                ]
              })(<Input />)
              }
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label="组件功率" hasFeedback
        >
              {
                getFieldDecorator('power', {
                initialValue: record.power,
                rules: [
                { required: true, message: '请输入组件功率' },
                ]
              })(<Input />)
              }
        </FormItem>

      </Form>
    </Modal>
    );
  }
}
const mapPropsToFields = (props) => {
  let {record} = props.assembly;
 
  let a = {};


  a.model = Form.createFormField({value: record.model?record.model:''});
  a.brand = Form.createFormField({value: record.brand?record.brand:''});
  a.producer = Form.createFormField({value: record.producer?record.producer:''});
  a.power = Form.createFormField({value: record.power?record.power:''});

  return a
};
const onFieldsChange = (props, changedFields) => {

};
const onValuesChange = (props, values) => {
  let {record} = props.assembly;
    for(let key in values){
    
        record[key] = values[key];
     
       
     }
};
const EditAssembly = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(AddModal);
export default connect(({assembly})=>({assembly}))(EditAssembly);