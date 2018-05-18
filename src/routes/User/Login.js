import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import {setLocalStorage } from '../../utils/utils';
import { FormattedMessage,FormattedDate ,FormattedNumber} from 'react-intl';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert,Breadcrumb } from 'antd';
import styles from './Login.less';
const forge = require('node-forge');

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (type) => {
    this.setState({ type });
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleLanguage = (language) => {
      setLocalStorage("language",language);
      window.location.reload()
  };
  handleSubmit = (e) => {
    const {dispatch} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //MD5加密
        /*let md = forge.md.md5.create();
        md.update(values.password);
        let password = md.digest().toHex();*/

        let param = {};
        param["name"] = values.userName;
        param["pass"] = values.password;
        //param["uniqueId"] = "314590bf56e130ceb3f34fcea88ff9d9";
        dispatch({type:'login/login',param});
      }
    });
  };

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  forgot = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({ pathname: '/user/forgot' }));
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
      {/*<div className={styles.language}>
        <Breadcrumb separator="|">
          <Breadcrumb.Item><a onClick={()=>{this.handleLanguage("zh-cn")}}>中文</a></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={()=>{this.handleLanguage("en-us")}}>English</a></Breadcrumb.Item>
        </Breadcrumb>
      </div>*/}
        <Form onSubmit={this.handleSubmit} style={{paddingTop:'70px'}}>

              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{
                    required: type === 'account', message: '请输入账户名！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="admin"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: type === 'account', message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="888888"
                  />
                )}
              </FormItem>

          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}><FormattedMessage id={'autoLogin'} /> </Checkbox>
            )}
            <a className={styles.forgot} href="javascript:void(0)" onClick={this.forgot}>忘记密码</a>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
            <Link className={styles.register} to="/user/register">
              去注册
            </Link>
          </FormItem>
        </Form>

      </div>
    );
  }
}
