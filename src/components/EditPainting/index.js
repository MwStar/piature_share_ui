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

//编辑画集信息

class EditPaintingModal extends PureComponent {
  state = {
      
    };



//修改确定事件
  handleOk = () => {
    const { id } = this.props.painting;
    const { paintings: { modal } } = this.props;
    const { dispatch } = this.props;    
    //获取form值  
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      
       if(id)
          { values.id = id;
            //更新
            dispatch({type:'paintings/update',payload:values});}
        else{
          //增加
          values.tenantId = 141;
          dispatch({type:'paintings/add',payload:values});}

    });
  };

  //编辑取消事件
  handleCancel = () => {
    const { paintings: { modal } } = this.props;
    const { dispatch } = this.props;
    dispatch({type:'paintings/modalStatus',modal:false});
  }

   

  render() {
  	const { paintings: { modal } } = this.props;
    const { paintings ,painting ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
          <Modal
            title={(!painting.id)?'新增':'修改'}
            visible={modal}
            width={600}
            onOk={this.handleOk}
            maskClosable={true}
            onCancel={this.handleCancel}
            width={700}
          >
            <Form onSubmit={(e)=>{e.stopPropagation();this.handleOk();}}>
              <Row>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="标题">
                    {getFieldDecorator('title', {
                      initialValue:painting.title==null?'':painting.title,
                      rules: [{ required: true, message: '请填入标题!' }],
                    })(
                      	<Input />
                        )}
                  </FormItem>
                </Col>
                
                <Col span={24}>
                  <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('description', {
                  initialValue:painting.description==null?'':painting.description,
                  rules: [{ required: true, message: '请填写对这个画集的描述' }],
                })(
                  <Input />
                    )}
                  </FormItem>
                </Col>

              </Row>
            </Form>

          </Modal>
    );
  }
};

const mapPropsToFields = (props) => {
  let {painting} = props.paintings;
  let a = {};
  a.title = Form.createFormField({value: painting.title?painting.title:''});
  a.description = Form.createFormField({value: painting.description?painting.description:''});

  return a
};
const onFieldsChange = (props, changedFields) => {
  //props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
	let {painting} = props.paintings;
    for(let key in values){
        painting[key] = values[key]; 
     }
};
const EditPainting = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(EditPaintingModal);
export default connect(({paintings})=>({paintings}))(EditPainting);
