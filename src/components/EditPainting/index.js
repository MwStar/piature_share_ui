import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal , Form , Select , Row ,Col, Input ,Checkbox,message ,Button} from 'antd';
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
    const { _id } = this.props.painting;
    const { paintingsuser: { modal } } = this.props;
    const { dispatch } = this.props;    
    //获取form值  
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      
       if(_id)
          { values.id = _id;
            //更新
            dispatch({type:'paintingsuser/updatePainting',payload:values});}
        else{
          //增加
          
          dispatch({type:'paintingsuser/createPaintings',payload:values});}

    });
  };

  //编辑取消事件
  handleCancel = () => {
    const { paintingsuser: { modal } } = this.props;
    const { dispatch } = this.props;
    dispatch({type:'paintingsuser/modalStatus',modal:false});
  }

  //删除采集
  de_paintings = () => {
    const { painting , dispatch } = this.props;
    dispatch({type:'paintingsuser/de_Painting',payload:{id:painting._id}});
  }

   

  render() {
  	const { paintingsuser: { modal } } = this.props;
    const { paintingsuser ,painting ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log("painting---",painting);
    return (
          <Modal
            title={(!painting._id)?'新增':'修改'}
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
                    {getFieldDecorator('paintings_title', {
                      initialValue:painting.title==null?'':painting.title,
                      rules: [{ required: true, message: '请填入标题!' }],
                    })(
                      	<Input />
                        )}
                  </FormItem>
                </Col>
                
                <Col span={24}>
                  <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('paintings_content', {
                  initialValue:painting.content==null?'':painting.content,
                  rules: [{ required: true, message: '请填写对这个画集的描述' }],
                })(
                  <Input />
                    )}
                  </FormItem>
                </Col>

                {painting._id? 
                  <Col span={24} offset={6}>
                    <FormItem {...formItemLayout}>
                      <Button onClick={this.de_paintings}>删除采集</Button>
                    </FormItem>
                  </Col>
                  :''
                }

              </Row>
            </Form>

          </Modal>
    );
  }
};

const mapPropsToFields = (props) => {
  let {painting} = props.paintingsuser;
  let a = {};
  a.paintings_title = Form.createFormField({value: painting.title?painting.title:''});
  a.paintings_content = Form.createFormField({value: painting.content?painting.content:''});

  return a
};
const onFieldsChange = (props, changedFields) => {
  //props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
	let {painting} = props.paintingsuser;
    for(let key in values){
        painting[key] = values[key]; 
     }
};
const EditPainting = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(EditPaintingModal);
export default connect(({paintingsuser})=>({paintingsuser}))(EditPainting);
