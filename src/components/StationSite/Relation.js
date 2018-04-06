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
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const  formItemBtnLayout={
  wrapperCol: {
    xs: {
      span: 12,
      offset: 8
    },
    sm: {
      span: 12,
      offset: 8
    },
  }
}
class DTUModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowRepeater:true,
    };
  }
componentWillMount(){

}
onChangeDtu =(e)=>{
  var value = e.target.value;
  var patt = /^10[Ff][13]/;
  var flag = patt.test(value);
  if(flag){
    this.setState({isShowRepeater:true});
  }else{
     this.setState({isShowRepeater:false});
  }
}

 handleOK =(e)=>{
  e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        this.props.onOk(values,this.props.form);
      }
    });

 }
 //修改序列号好
 onUpdateSn =(e)=>{
   e.preventDefault();
   this.props.form.validateFieldsAndScroll((err, values) => {
     if (!err) {
       const {dispatch} = this.props;
       const {deviceRelation,option} = this.props;
       dispatch({type:"quicksite/updateSn",payload:{newSN:values.sn,oldId:deviceRelation.id,stationId:this.props.stationId,type:option}});
     }
   });

 }
onCancel =()=>{
  const {dispatch} = this.props;
  this.props.form.resetFields();
  dispatch({type:"quicksite/saveStep2",payload:{deviceRecord:{}}})

}
onChangeContent =(type)=>{console.log("onChangeContent type:",type);
  const { getFieldDecorator } = this.props.form;

  const {deviceRecord,option} = this.props;
  console.log("deviceRecord:",deviceRecord);
  console.log("deviceRe")
    let content=null;
    switch (type){
      case 0:
      content = <div>
        <FormItem
          {...formItemLayout}
          label="DTU"
        >
          {getFieldDecorator('dtu', {
            initialValue :deviceRecord.dtuSn,
            rules: [ {
              required: true, message: '请输入DTU',
            },{
              pattern:/^[a-zA-Z0-9]{12}$/,message:'只允许输入数字和字母,限制12个字符'
            }],
          })(
            <Input onChange={this.onChangeDtu} readOnly={deviceRecord.dtuSn?true:false}/>
          )}
        </FormItem>
        {this.state.isShowRepeater ? (
          <FormItem
            {...formItemLayout}
            label="中继器"
          >
            {getFieldDecorator('repeater', {
              initialValue:deviceRecord.repeaterSn,
              rules: [{
                required: true, message: '请输入中继器',
              },{
                pattern:/^[a-zA-Z0-9]{12}$/,message:'只允许输入数字和字母,限制12个字符'
              }],
            })(
              <Input readOnly={deviceRecord.repeaterSn?true:false}/>
            )}
          </FormItem>
        ):null}
        <FormItem
          {...formItemLayout}
          label="微逆列表"
        >
          {getFieldDecorator('mirco', {
            rules: [{
              required: true, message: '请输入微逆',
            },{
              pattern:/^[a-zA-Z0-9]{12}([\r\n][a-zA-Z0-9]{12})*$/,message:'微逆之间通过Enter分离，微逆只能输入12位数字和字母'
            }],
          })(
            <TextArea autosize/>
          )}
        </FormItem>
        <Form.Item
          style={{
            marginBottom: 8,
            marginTop: 20
          }}
          {...formItemBtnLayout}
          label=""
        >
          <Button type="primary" onClick={this.handleOK}>
            确定
          </Button>
          <Button onClick={this.onCancel} style={{
            marginLeft: 8
          }}>
            取消
          </Button>
        </Form.Item>
      </div>;

        break;
      case 1:
        content =<div>
            <FormItem
              {...formItemLayout}
              label="微逆"
            >
              {getFieldDecorator('sn', {
                initialValue:deviceRecord.sn,
                rules: [{
                  required: true, message: '请输入微逆',
                },{
                  pattern:/^[a-zA-Z0-9]{12}$/,message:'只允许输入数字和字母,限制12个字符'
                }],
              })(
                <Input />
              )}
            </FormItem>

          <Form.Item
            style={{
              marginBottom: 8,
              marginTop: 20
            }}
            {...formItemBtnLayout}
            label=""
          >
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>

          </Form.Item>
        </div>
        break;
      case 2:
        content =<div>

          <FormItem
            {...formItemLayout}
            label="中继器"
          >
            {getFieldDecorator('sn', {
              initialValue:deviceRecord.sn,
              rules: [{
                required: true, message: '请输入中继器',
              },{
                pattern:/^[a-zA-Z0-9]{12}$/,message:'只允许输入数字和字母,限制12个字符'
              }],
            })(
              <Input />
            )}
          </FormItem>

          <Form.Item
            style={{
              marginBottom: 8,
              marginTop: 20
            }}
            {...formItemBtnLayout}
            label=""
          >
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>

          </Form.Item>
        </div>
        break;
      case 3:
        content =<div>
          <FormItem
            {...formItemLayout}
            label="DTU"
          >
            {getFieldDecorator('sn', {
              initialValue:deviceRecord.sn,
              rules: [{
                required: true, message: '请输入DTU',
              },{
                pattern:/^[a-zA-Z0-9]{12}$/,message:'只允许输入数字和字母,限制12个字符'
              }],
            })(
              <Input />
            )}
          </FormItem>

          <Form.Item
            style={{
              marginBottom: 8,
              marginTop: 20
            }}
            {...formItemBtnLayout}
            label=""
          >
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>

          </Form.Item>
        </div>
        break
      default:
    }
    return content;
}
 render() {
   return (
     <Form >
         { this.onChangeContent(this.props.option)}
     </Form>
   );
 }
}

const dtuForm = Form.create()(DTUModal);
export default connect(({ quicksite }) => ({ quicksite }))(dtuForm);
