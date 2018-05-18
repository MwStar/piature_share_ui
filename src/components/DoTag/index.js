/**
 *  desc: 打标签
 * author: ll
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input,Tree ,Checkbox,Row,Col,Upload, Icon, message,Select ,Button} from 'antd';
 import styles from './index.less';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import {setLocalStorage, getLocalStorage , setMenuTree} from '../../utils/utils';
 import {config} from '../../utils/config';

 const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;
 const TreeNode = Tree.TreeNode;
 const token = getLocalStorage("Token");
 const uploadUrl = config.UPLOAD_SERVER;
 const checkUrl = config.CHRCK_FILE;
/**
 *
 类说明：打标签Modal
 @class 类名 DoTag
 @constructor
 */

@connect(state => ({
  tag: state.tag,
}))
@Form.create()


 class DoTagModal extends Component {
  state = {
    
  }
//修改确定事件
  handleOk = () => {

    const { record } = this.props;
    const { dispatch } = this.props;    
    //dispatch({type:'users/editmodalStatus',editmodal:false});
    //获取form值  
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        id:record._id
      };

      dispatch({type:'tag/doTag',payload:values});
    });
  };

  //编辑取消事件
  handleCancel = () => {
    const { tag: { modal } } = this.props;
    const { dispatch } = this.props;
    dispatch({type:'tag/editmodalStatus',modal:false});
  }
  


  render() {
 	const { record } = this.props;
 	console.log("record----",record);
 	const { tag: { modal } } = this.props;
 	const { getFieldDecorator } = this.props.form;
 	const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const list = config.TAGS;
    return (
    	<Modal
            title='打标签'
            visible={modal}
            width={600}
            onOk={this.handleOk}
            maskClosable={true}
            onCancel={this.handleCancel}
          >
	      <Form layout="horizontal" className={styles['authority-modal-body']}>
	      	<div className={styles.picture}>
	      		<img src={config.CHRCK_FILE+record.path} style={{width:'100%'}}/>
	      		<p style={{textAlign:'center'}}>{record.title}</p>
	      	</div>
	      	<FormItem 
	            {...formItemLayout} 
	            label="标签" >
	                  {getFieldDecorator('tag',{
	                    initialValue:record.tag==null?[]:record.tag,
	                  })(
	                    <Select 
	                    mode="tags"
	                    placeholder="请选择标签或者输入你想创建的标签回车生成"
	                    onChange={this.handleChangeTag}
	                    >
	                        {list.map((item) => {
	                          return (
	                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
	                          )
	                        })}
	                      </Select>
	                  )}
	                  
	            </FormItem>

	      </Form>
	    </Modal>
    );
  }
}

const mapPropsToFields = (props) => {
  let {picture} = props.tag;
  let a = {};
  a.tag = Form.createFormField({value: picture.tag?picture.tag:[]});

  return a
};
const onFieldsChange = (props, changedFields) => {
  //props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
    let {picture} = props.tag;
    for(let key in values){
        picture[key] = values[key]; 
     }
};

const DoTag = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(DoTagModal);
export default connect(({tag})=>({tag}))(DoTag);

