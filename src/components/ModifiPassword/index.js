/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Modal,Form} from 'antd';
 import {connect} from 'dva';
  const forge = require('node-forge');
 import PasswordForm from './PasswordForm';
 import styles from './index.less';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12}
  }
};
/**
 *
 类说明：电站详情
 @class 类名 StationDetails
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class UserPassword extends Component {
  state = {
    value:{},//password的值
  }

  componentDidMount() {
  	const {dispatch} = this.props;
    dispatch({type:'setting/setKey',key:2});
    
  }
  //将子组件传过来的值password储存在state中;
  handlePassword = (values) => {
    if(values.newPasswd!=undefined){
          //MD5加密
          let md = forge.md.md5.create();
          md.update(values.newPasswd);
          let md1 = forge.md.md5.create();
          md1.update(values.oldPasswd);
          values.newPasswd = md.digest().toHex();
          values.oldPasswd = md1.digest().toHex();
        }
  	this.setState({value:values});
  }
  //修改密码确定事件
  handleOk = () => {
    const { value } = this.state;
    const { dispatch } = this.props;
        //更新用户密码
    dispatch({type:'setting/setting',payload:value});

  }

  //修改取消事件
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({type:'setting/isVisible',visible:false});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {visible} = this.props.setting;
    return (
	      	<Modal
		      	title='修改密码'
		        visible={visible}
		        width={600}
		        onOk={this.handleOk}
		        maskClosable={true}
		        onCancel={this.handleCancel}
	      	>
                  <PasswordForm handlePassword={this.handlePassword}></PasswordForm>   		
	      	</Modal>
    );
  }
}
