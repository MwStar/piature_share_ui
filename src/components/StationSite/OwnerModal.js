import React, { Component } from 'react';
import { Modal, Form, Input, Tree, AutoComplete,Row, Col, TreeSelect, Select, Upload, Button, Icon } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { message } from 'antd';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
const Option = Select.Option;
/**
*
类说明：新增DTU的Modal
@class 类名 DTUModal
@constructor
*/
class OwnerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


 handleOK =(e)=>{

  e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          const ownerId =values.ownerId;
           const {dispatch,quicksite} = this.props;
           const obj = quicksite.data.ownerList.find((item)=>{return item.id==ownerId});

         this.props.onOK(values.ownerId,obj);



      }
    });

 }

afterClose=()=>{

  this.props.form.resetFields();
}

 render() {

   const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 6 },
     wrapperCol: { span: 14 },
   };
   const initAgency =null;
   const initOwnerId=null;
   const {quicksite} = this.props;
   return (
     <Modal
       title='选择业主'
       visible={this.props.visible}
       onOk={this.handleOK}
       onCancel={this.props.onCancel}
       maskClosable={false}
       width={600}
       afterClose={this.afterClose}
     >

       <Form layout="horizontal" >


        <Form.Item
        {...formItemLayout}
        label="业主"
        hasFeedback
        >
          {getFieldDecorator('ownerId', {
            initialValue: initOwnerId,
            rules: [{
                required: true,
                message: '请选择业主'
            }],
        })(
            <Select
            style={{
                width: '100%'
            }}
            placeholder="请选择"
            >
              {quicksite.data.ownerList && quicksite.data.ownerList.map((item) => {
                return (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                )
            })}
            </Select>
        )}
                    </Form.Item>

       </Form>
     </Modal>
   );
 }

}

const OwnerForm = Form.create()(OwnerModal);
export default connect(({ quicksite }) => ({ quicksite }))(OwnerForm);
