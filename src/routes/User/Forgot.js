import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import {setLocalStorage } from '../../utils/utils';
import { FormattedMessage,FormattedDate ,FormattedNumber} from 'react-intl'; 
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert,Breadcrumb ,Modal} from 'antd';
import styles from './Forgot.less';
const forge = require('node-forge');

const FormItem = Form.Item;
const { TabPane } = Tabs;
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
const validateCodeLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 7}
  }
};

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Forgot extends Component {
  state = {
    count: 0,
    validateCode:false,
    validateCodechange:"获取验证码",
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  //提交表单
  handleSubmit = (e) => {
    const {dispatch} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //MD5加密
        let md = forge.md.md5.create();
        md.update(values.userPwd);
        let password = md.digest().toHex();

        let param = {};
        param["userName"] = values.userName;
        param["validateCode"] = values.validateCode;
        param["newPassword"] = password;
        param["uniqueId"] = "314590bf56e130ceb3f34fcea88ff9d9";
        dispatch({type:'login/getBackPassword',param});
      }
    });
  };

  /**
   *方法说明：确认密码输入失去焦点事件
   *@method handleConfirmBlur
   *@param {e}  事件
   */
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
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
    if (value && value !== form.getFieldValue('userPwd')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }

  //验证码发送成功
  renderSuccessMessage = () => {
    Modal.success({
      title: '已向邮箱hemai@163.com发送验证码成功',
      content: '请尽快前往邮箱获取验证码',
    });
  }

  //用户没有绑定邮箱，发送失败
  renderErrorMessage = () => {
    Modal.error({
      title: '当前用户名没有绑定邮箱',
      content: '请联系经销商',
    });
  }


  //返回登录
  back = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({ pathname: '/user/login' }));
  }
  //验证码倒数
  count = () => {
    let count = 59;
    this.setState({validateCode:true});
    this.setState({count:count});
    this.interval = setInterval(()=>{
      count=count-1;
      this.setState({ count });
      if(count==0){
        this.setState({validateCode:false});
        this.setState({validateCodechange:"重新获取"});
        clearInterval(this.interval);
      }
    },1000);
  }

  //点击获取验证码
  forgot = () => {
    const _this = this;
    const {dispatch} = this.props;
    let userName = this.props.form.getFieldValue("userName"); 
        let param = {};
        param["userName"] = userName?userName:'';
        param["uniqueId"] = "314590bf56e130ceb3f34fcea88ff9d9";
        dispatch({type:'login/getValidateCode',param});

    let timer1 = window.setTimeout(function(){

      const {codeStatus} = _this.props.login; 
      window.clearTimeout(timer1);
      if(codeStatus){
        _this.count();
      }
    },1000);

  }
  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type ,validateCodechange} = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h2>重置密码</h2>
          <span>未绑定邮箱或收不到验证码请联系经销商</span>
          <a href="javascript:void(0)" onClick={this.back}>返回登录</a>
        </div>
          <Form onSubmit={this.handleSubmit}>

                  <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请填入用户名' }],
                })(
                  <Input placeholder = "请输入要找回密码的用户名"
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} id="userName"/>}
                  />
                    )}
                  </FormItem>

                  <FormItem>
                {getFieldDecorator('validateCode', {
                  rules: [{ required: true, message: '请输入验证码' }],
                })(
                  <Input  className={styles.validateCodeinput} placeholder="请输入验证码"/>
                    )}
                {(this.state.validateCode)?<a className={styles.validateCode} disabled><span>{count}</span>s后重新获取</a>
                :<a className={styles.validateCode} href="javascript:void(0)" onClick={this.forgot}>{validateCodechange}</a>}
                  </FormItem>   

                  <FormItem>
                    {getFieldDecorator('userPwd', {
                      rules: [
                        { required: true, message: '请输入新密码' },
                        {min:6, message:'最小长度为6'},
                        {max:20, message:'最大长度为20'},
                      ],
                    })(
                          <Input 
                          type="password" 
                          placeholder ="请输入新密码"
                          size="large"
                          maxLength = "20"
                          prefix={<Icon type="lock" className={styles.prefixIcon} />}
                          />
                        )}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('confirm', {
                      rules: [
                              { required: true, message: '请再次输入密码' },
                              {min:6, message:'最小长度为6'},
                              {max:20, message:'最大长度为20'},
                              {validator: this.checkPassword},
                           ],
                      })(
                      <Input 
                      type="password"  
                      placeholder="请确认密码"
                      size="large"
                      maxLength = "20"
                      prefix={<Icon type="lock" className={styles.prefixIcon} />} 
                      onBlur={this.handleConfirmBlur}/>
                    )}
                  </FormItem>

                  <FormItem>
                    <Button type="primary" className={styles.submit} htmlType="submit">找回密码</Button>
                  </FormItem>
            </Form>
       
      </div>
    );
  }
}
