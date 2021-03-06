/**
 *  desc: 修改密码
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Modal,Form} from 'antd';
 import {connect} from 'dva';
 const forge = require('node-forge');
 import styles from './index.less'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12}
  }
};
/**
 *
 类说明：修改密码
 @class 类名 PasswordForm
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class PasswordForm extends Component {
  state = {
    
  }

  componentDidMount() {
    
    
  }
   /**
   *方法说明：在confirm 验证 password 是否一致
   *@method checkPassword
   *@param {rule} 验证规则
   *@param {value} 确认密码参数
   *@param {callback} 回调函数
   */
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPasswd')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }

  //保存修改的密码
  handlePasswordOk = () => {
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        oldPasswd:fieldsValue.oldPasswd?fieldsValue.oldPasswd:'',
        newPasswd:fieldsValue.newPasswd?fieldsValue.newPasswd:'',
      };
      

      if(fieldsValue.newPasswd!=fieldsValue.confirm){
          message.error('两次密码输入不一致!');
          return false;
        }
        /*//传给父组件
        if(values.newPasswd!=undefined){
            //MD5加密
            let md = forge.md.md5.create();
            md.update(values.newPasswd);
            let md1 = forge.md.md5.create();
            md1.update(values.oldPasswd);
            values.newPasswd = md.digest().toHex();
            values.oldPasswd = md1.digest().toHex();
          }*/
          dispatch({type:'setting/settingPass',payload:values});
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {visible} = this.props.setting;
    return (
                <div>
                <Row>
                  <Col span={2} push={22}>
                    <Button type='primary' onClick ={this.handlePasswordOk}>保存</Button>
                  </Col>
                </Row>
                <Form onSubmit={(e)=>{e.stopPropagation();this.handlePasswordOk();}}>
                  <Row>
                    <Col span={24}>
                      <FormItem {...formItemLayout} label="原密码">
                        {getFieldDecorator('oldPasswd', {
                          rules: [{ required: true, message: '请输入原密码' }],
                        })(
                          <Input type="password" placeholder ="请输入原密码"/>
                            )}
                      </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newPasswd', {
                      rules: [
                        { required: true, message: '请输入新密码' },
                        {min:6, message:'最小长度为6'},
                        {max:20, message:'最大长度为20'},
                      ],
                    })(
                          <Input 
                            type="password" 
                            placeholder ="请输入新密码" 
                            maxLength="20"
                          />
                        )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="确认密码">
                      {getFieldDecorator('confirm', {
                        rules: [
                              { required: true, message: '请再次输入密码' },
                              {min:6, message:'最小长度为6'},
                              {max:20, message:'最大长度为20'},
                              {validator: this.checkPassword},
                           ],
                        })(
                        <Input type="password" maxLength="20" placeholder="确认密码" onBlur={this.handleChange}/>
                      )}
                    </FormItem>
                  </Col>

                  </Row>
                </Form>
              </div>          
    );
  }
}
