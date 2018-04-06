import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, Row, Col, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@connect(state => ({
  agencyList: state.agencyList,
}))
  @Form.create()

export default class createAgency extends PureComponent {
state = {
  formValues: {},
};


  // 用户类型选择
  onSelect = (value, option) => {
    if (value === 1) {

    }
  }


// 新增确定事件
handleOk = () => {
  const { users: { modal } } = this.props;
  const { dispatch } = this.props;
  dispatch({ type: 'users/modalStatus', modal: false });
  // 获取form值
  const { form } = this.props;
  form.validateFields((err, fieldsValue) => {
    if (err) return;

    const values = {
      ...fieldsValue,
      updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
    };
    values.tenantId = 0;
    this.setState({
      formValues: values,
    });

    dispatch({ type: 'users/addUser', payload: values });
  });
};

  // 新增取消事件
  handleCancel = () => {
    const { agencyList: { modal } } = this.props;
    const { dispatch } = this.props;
    dispatch({ type: 'agencyList/modalStatus', modal: false });
  }


  render() {
    const { agencyList: { modal } } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="添加经销商"
        visible={modal}
        width={600}
        onOk={this.handleOk}
        maskClosable
        onCancel={this.handleCancel}
      >
        <Form onSubmit={(e) => { e.stopPropagation(); this.handleSearch(); }}>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="用户类型">
                {getFieldDecorator('userType', {
                      rules: [{ required: true, message: 'Please input the type of collection!' }],
                    })(
                      <Select placeholder="请选择用户类型" onSelect={this.onSelect}>
                        <Option value="0">平台商</Option>
                        <Option value="1">经销商</Option>
                        <Option value="2">业主</Option>
                      </Select>
                        )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="归属公司">
                {getFieldDecorator('companyName', {
                      rules: [{ required: true, message: 'Please input the company of collection!' }],
                    })(
                      <Select placeholder="请选择归属公司">
                        <Option value="141">禾迈</Option>
                        <Option value="11">12</Option>
                      </Select>
                        )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input the userName of collection!' }],
                })(
                  <Input />
                    )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="姓名">
                {getFieldDecorator('userFullName', {
                  rules: [{ required: true, message: 'Please input the name of collection!' }],
                })(
                  <Input />
                    )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('userPwd ', {
                  rules: [{ required: true, message: 'Please input the password of collection!' }],
                })(
                  <Input type="password" />
                    )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="确认密码">
                {getFieldDecorator('passwordok', {
                    rules: [{ required: true, message: 'Please input the passwordok of collection!' }],
                      })(
                        <Input type="password" />
                    )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="邮箱">
                {getFieldDecorator('email'), (<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="电话">
                {getFieldDecorator('phone'), (<Input />)}
              </FormItem>
            </Col>
          </Row>

        </Form>

      </Modal>
    );
  }
}
