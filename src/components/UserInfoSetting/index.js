/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs} from 'antd';
 import {connect} from 'dva';
   const forge = require('node-forge');
 import styles from './index.less';
 import PasswordForm from '../../components/ModifiPassword/PasswordForm';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 8}
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

 export default class UserInfoSetting extends Component {
  state = {
    value:{},//password的值
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type:'setting/isDisabled',disabled:true});
    dispatch({type:'setting/setKey',key:1});
    dispatch({type:'setting/fetch'});
    
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

	//修改按钮
  edit = () => {
    const {dispatch} = this.props;
    dispatch({type:'setting/isDisabled',disabled:false});
  }
  //保存修改信息
  handleOk = () => {
    const {dispatch} = this.props;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return; 

      //更新用户信息
        dispatch({type:'setting/setting',payload:fieldsValue});
    });
  }
  //保存修改的密码
  handlePasswordOk = () => {
    const { value } = this.state;
    const { dispatch } = this.props;
    //更新用户密码
    dispatch({type:'setting/setting',payload:value});
  }
  //tabs改变时，用来改变modal中的key值，好判断是修改个人信息还是密码
  handleTabs = (key) => {
    const {dispatch} = this.props;
    if(key==="1"){dispatch({type:'setting/setKey',key:1});}
    else{dispatch({type:'setting/setKey',key:2});}
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {info,disabled} = this.props.setting;
    const id = 1;
    return (
	      	<div>
          <Tabs defaultActiveKey="1"onChange={this.handleTabs}>
            <TabPane tab="个人资料" key="1">
              <div>
                <Row>
                  <Col span={2} push={22}>
                    {disabled?<Button type='primary' onClick ={this.edit}>修改</Button>:''}
                    {!disabled?<Button type='primary' onClick ={this.handleOk}>保存</Button>:''}
                  </Col>
                </Row>
                <div className={styles.userinfo}>
                  <h3>个人信息</h3>
                  <Form onSubmit={(e)=>{e.stopPropagation();this.handleSearch();}}>
                  <Row>
                    <Col span={24}>
                        <FormItem label="姓名:" className={styles.userLastName}>
                          {getFieldDecorator('userLastName', {
                            initialValue:info.userLastName==null?'':info.userLastName,
                          })(
                                <Input placeholder="名" disabled={disabled}/>
                              )}
                        </FormItem>
                        <FormItem className={styles.userFirstName}>
                          {getFieldDecorator('userFirstName', {
                            initialValue:info.userFirstName==null?'':info.userFirstName,
                          })(
                            <Input placeholder="姓" disabled={disabled}/>
                              )}
                      </FormItem>
                    </Col>

                    <Col span={24}>
                      <FormItem {...formItemLayout} label="用户名">
                        {getFieldDecorator('userFullName', {
                          initialValue:info.userName==null?'':info.userName,
                        })(
                          <Input disabled={disabled}/>
                            )}
                      </FormItem>
                    </Col>

                    <Col span={24}>
                      <FormItem {...formItemLayout} label="电话">
                        {getFieldDecorator('phone',{
                          initialValue:info.phone ==null?'':info.phone ,
                            rules: [
                              {
                                type: "string",
                                pattern: /^1\d{10}$/,
                                message: '必须填写正确的手机号(1开头的11位数字)'
                              }
                            ],})
                            (<Input disabled={disabled}/>)}
                      </FormItem>
                    </Col>

                    <Col span={24}>
                      <FormItem {...formItemLayout} label="邮箱">
                        {getFieldDecorator('email', {
                          initialValue:info.email ==null?'':info.email ,
                          })(
                          <Input disabled={disabled}/>
                        )}
                      </FormItem>
                    </Col>                
                  </Row>
                  </Form>
                </div>
                  <div className={styles.companyinfo}>
                    <h3>公司信息</h3>
                    <Row className={styles.company}>
                        <Col span={24}>
                          <p>公司名称：<span>{info.companyName?info.companyName:''}</span></p>
                        </Col>
                        <Col span={12}>
                          <p>国家地区：<span>{info.companyAreaName?info.companyAreaName:''}</span></p>
                        </Col>
                        <Col span={12}>
                          <p>详细地址：<span>{info.conpanyDetailAddr?info.conpanyDetailAddr:''}</span></p>
                        </Col>
                        <Col span={12}>
                          <p>联系人：<span>{info.companyMaterName?info.companyMaterName:''}</span></p>
                        </Col>
                        <Col span={12}>
                          <p>联系电话：<span>{info.companyMasterPhone?info.companyMasterPhone:''}</span></p>
                        </Col>
                    </Row>
                  </div>
              </div>
            </TabPane>
            <TabPane tab="修改密码" key="2">
              <div>
                <Row>
                  <Col span={2} push={22}>
                    <Button type='primary' onClick ={this.handlePasswordOk}>保存</Button>
                  </Col>
                </Row>
                <PasswordForm handlePassword={this.handlePassword}></PasswordForm>
              </div>
            </TabPane>
          </Tabs>
	      		
	      	</div>
    );
  }
}
