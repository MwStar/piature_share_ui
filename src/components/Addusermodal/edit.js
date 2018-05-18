import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal , Form , Select , Row ,Col, Input ,Checkbox,message ,TreeSelect} from 'antd';
const forge = require('node-forge');
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

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

/*@connect(state => ({
  users: state.users,
}))*/

class EdituserModal extends PureComponent {
  state = {
      formValues: {},
      userType: "",
      confirmDirty: false,
    };



//修改确定事件
  handleOk = () => {
  	const { user , formValues} = this.props;
    const { users: { editmodal } } = this.props;
    const { dispatch } = this.props;    
    //dispatch({type:'users/editmodalStatus',editmodal:false});
    //获取form值  
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      
      this.setState({
        formValues: values,
      });

      if(values.pass!=values.confirm){
          message.error('两次密码输入不一致!');
          return false;
        }
        i/*f(values.userPwd!=undefined){
          //MD5加密
          let md = forge.md.md5.create();
          md.update(values.userPwd);
          let md1 = forge.md.md5.create();
          md1.update(values.confirm);
          values.userPwd = md.digest().toHex();
          values.confirm = md1.digest().toHex();
        }*/
        if(user._id)
          { values.id = user.id;
            //values.userType = user.userType;
            //更新用户
            dispatch({type:'users/updateUser',payload:values});}
        else{
          //增加用户
          dispatch({type:'users/addUser',payload:values});}

    });
  };

  //编辑取消事件
  handleCancel = () => {
    const { users: { editmodal } } = this.props;
    const { dispatch } = this.props;
    dispatch({type:'users/editmodalStatus',editmodal:false});
  }

   /**
   *方法说明：复选框改变
   *@method onChange
   *@param {checkedValues} 选中值
   */
    onChange = (checkedValues) => {
    const {dispatch} = this.props;
    dispatch({type: 'users/savecheckRolesList',checkRolesList:checkedValues});
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
   *方法说明：在password 验证 confirm 是否一致
   *@method checkConfirm
   *@param {rule} 验证规则
   *@param {value} 确认密码参数
   *@param {callback} 回调函数
   */
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }


  render() {
  	const { users: { editmodal ,rolesList } } = this.props;
    const { users ,user ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    if(users.isResetForm){
      this.props.form.resetFields();
      dispatch({type: 'users/resetForm',isResetForm:false})
    }
    let disabled = false;
    if(user._id){
      disabled = true;
    }


    return (
          <Modal
            title={(!users.userList.id)?'新增':'修改'}
            visible={editmodal}
            width={600}
            onOk={this.handleOk}
            maskClosable={true}
            onCancel={this.handleCancel}
            width={700}
          >
            <Form onSubmit={(e)=>{e.stopPropagation();this.handleOk();}}>
              <Row>
                <Col span={24}>

                </Col>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="用户类型">
                    {getFieldDecorator('userType', {
                      initialValue:user.userType==null?'':user.userType,
                      
                    })(
                      <Select
                        placeholder="请选择用户类型"
                      >
                        <Option value="1">用户</Option>
                        <Option value="3">摄影师</Option>
                        <Option value="2">管理员</Option>
                      </Select>
                        )}
                  </FormItem>
                </Col>

                <Col span={24}>
                  <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('loginname', {
                  initialValue:user.loginname==null?'':user.loginname,
                  rules: [{ required: true, message: '请填入用户名' }],
                })(
                  <Input disabled={disabled}/>
                    )}
                  </FormItem>
                </Col>
                {(!user._id)?
                <Col span={24}>
                  <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('pass', {
                  initialValue:user.pass ==null?'':user.pass ,
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                      <Input type="password" />
                    )}
                  </FormItem>
                </Col>:''}
                {(!user._id)?
                <Col span={24}>
                  <FormItem {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirm', {
                      initialValue:user.pass ==null?'':user.pass ,
                      rules: [{ required: true, message: '请再次输入密码' },
                            {validator: this.checkPassword}
                           ],
                      })(
                      <Input type="password" maxLength="20" placeholder="确认密码(最大长度不超过20个字符)" onBlur={this.handleConfirmBlur}/>
                    )}
                  </FormItem>
                </Col>:''}

                <Col span={24}>
                  <FormItem {...formItemLayout} label="邮箱">
                    {getFieldDecorator('email',{
                    	initialValue:user.email ==null?'':user.email ,
                      	rules: [{type: 'email', message: '请输入有效的邮箱',}
                              ]
                    })
                    (<Input maxLength="50"/>)}
                  </FormItem>
                </Col>

              </Row>

            </Form>

          </Modal>
    );
  }
};

const mapPropsToFields = (props) => {
  let {userList} = props.users;
  let a = {};
  //a.organizationId = {value: userList.organizationId?userList.organizationId:''};
  a.loginname = Form.createFormField({value: userList.loginname?userList.loginname:''});
  a.pass =Form.createFormField({value :userList.pass?userList.pass:''});
  a.confirm = Form.createFormField({value :userList.pass?userList.pass:''});
  a.email =Form.createFormField({value :userList.email?userList.email:''});
  a.phone = Form.createFormField({value :userList.phone ?userList.phone:''});
  return a
};
const onFieldsChange = (props, changedFields) => {
  //props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
	let {userList} = props.users;
    for(let key in values){
        userList[key] = values[key]; 
     }
};
//const MsgForm = Form.create({mapPropsToFields})(EditMsgForm);
const Edituser = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(EdituserModal);
export default connect(({users})=>({users}))(Edituser);
