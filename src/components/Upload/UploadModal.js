/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input,Tree ,Checkbox,Row,Col,Upload, Icon, message,Select} from 'antd';
 import styles from './UploadModal.less';
 import {connect} from 'dva';
 const Dragger = Upload.Dragger;
 const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;
 const TreeNode = Tree.TreeNode;
 import {config} from '../../utils/config';
/**
 *
 类说明：新增固件包的Modal
 @class 类名 UploadModal
 @constructor
 */
 class UploadModal extends Component {
  state = {
    file:{}
  }
/**
  *方法说明：提交表单
  *@method okHandler
  */
  okHandler = () => {
    const { firmware , dispatch} = this.props;
    const {formValues} = this.props.firmware;
    this.props.form.validateFields((err, values) => { 
      if (!err) {
        let value = values;
        value.name = this.state.file.fileName;
        value.path = this.state.file.filePath;
        value.size = this.state.file.fileSize;
        if(firmware.isFirmware){value.patchType = 2;formValues.patchType = 2;}
        else{value.patchType = 1;formValues.patchType = 1;}
        
          dispatch({
            type: 'firmware/insert',
            payload:value,
          });
          dispatch({type:'firmware/hideModal'});
          dispatch({
            type: 'firmware/List',
            payload:formValues
          });
     }
   });
       
  };
  //关闭modal
  close = ()=>{
    this.props.form.resetFields();
    const {dispatch} = this.props;
    dispatch({type:'firmware/hideModal'})
  }


 


  render() {
    const { firmware,record ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    const _this = this;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const list = [{id:"1",name:"DTU"},{id:"2",name:"中继器"},{id:"3",name:"微逆"},]

    const props = {
      name: 'file',
      action: config.UPLOAD_SERVER,
      onChange(info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          _this.setState({file:info.file.response.data});
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Modal
      title={(firmware.isFirmware)?'上传固件包':'上传配置文件'}
      visible={firmware.visible}
      onOk={this.okHandler}
      onCancel={this.close}
      maskClosable={true}
      width={700}        
      >
      
      <Form layout="horizontal" onSubmit={this.okHandler} className={styles['authority-modal-body']}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或拖动文件上传</p>
          <p className="ant-upload-hint">支持单个或批量上传，禁止上传保密数据</p>
        </Dragger>
        <FormItem
          {...formItemLayout}
          className={styles['form-modal']}
          label="版本号" hasFeedback
          >
          {
            getFieldDecorator('patchVer')(<Input placeholder="请填写版本号"/>)
          }
        </FormItem>
        {firmware.isFirmware?<FormItem 
        {...formItemLayout} 
        label="设备类型" >
              {getFieldDecorator('devType')(
                <Select placeholder="请选择设备类型">
                    {list.map((item) => {
                      return (
                        <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                      )
                    })}
                  </Select>
              )}
        </FormItem>:''}

      </Form>
    </Modal>
    );
  }
}
const mapPropsToFields = (props) => {
  let {record} = props.firmware;
 
  let a = {};


  a.patchVer = Form.createFormField({value: record.patchVer})

  return a
};
const onFieldsChange = (props, changedFields) => {

};
const onValuesChange = (props, values) => {
  let {record} = props.firmware;
    for(let key in values){
    
        record[key] = values[key];
     
       
     }
};
const UploadFile = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(UploadModal);
export default connect(({firmware})=>({firmware}))(UploadFile);