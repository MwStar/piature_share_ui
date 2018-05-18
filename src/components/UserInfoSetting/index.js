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
    
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type:'setting/isDisabled',disabled:true});
    dispatch({type:'setting/setKey',key:1});
    dispatch({type:'setting/fetch'});
    
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
                <Row>
                  <Col span={2} push={22}>
                    {disabled?<Button type='primary' onClick ={this.edit}>修改</Button>:''}
                    {!disabled?<Button type='primary' onClick ={this.handleOk}>保存</Button>:''}
                  </Col>
                </Row>
                <div className={styles.userinfo}>
                  <Form onSubmit={(e)=>{e.stopPropagation();this.handleSearch();}}>
                  <Row>
                  
                    <Col span={24}>
                      <FormItem {...formItemLayout} label="用户名">
                        {getFieldDecorator('loginname', {
                          initialValue:info.loginname==null?'':info.loginname,
                        })(
                          <Input disabled/>
                            )}
                      </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem  {...formItemLayout} label="昵称:">
                          {getFieldDecorator('name', {
                            initialValue:info.name==null?'':info.name,
                          })(
                                <Input placeholder="请输入昵称" disabled={disabled}/>
                              )}
                        </FormItem>
                    </Col>
                    
                    <Col span={24}>
                        <FormItem  {...formItemLayout} label="签名:">
                          {getFieldDecorator('signature', {
                            initialValue:info.signature==null?'':info.signature,
                          })(
                                <Input placeholder="请输入签名" disabled={disabled}/>
                              )}
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
            </TabPane>
            <TabPane tab="修改密码" key="2">
                <PasswordForm></PasswordForm>
            </TabPane>
          </Tabs>
	      		
	      	</div>
    );
  }
}
