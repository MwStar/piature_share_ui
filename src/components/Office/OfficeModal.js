import React, { Component } from 'react';
import { Modal, Form, Input, Tree, Row, Col, TreeSelect, Select, Upload, Button, Icon } from 'antd';
import styles from './Office.css';
import { connect } from 'dva';
import { message } from 'antd';
import {config} from '../../utils/config'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
const Option = Select.Option;
const nameLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 11}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 13}
  }
};
/**
*
类说明：新增、修改机构信息的Modal
@class 类名 OfficeEditModal
@constructor
*/
class OfficeEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officeType: [],
      parentIds: '',
      visible:false,//业主姓名可见不可见
      logo:true,//logo
      domain:true,//域名
      fileList:[],//上传图片列表
      logoPath:'',//图片路径
      temp:true,//临时变量，用来判断logo图片是否显示
    };
  }


 // 选择上级机构，如何机构是部门，不允许创建公司
 onChange=(value, label, type) => {
   const office = this.getOffice(value);
   this.state.parentIds = `${office.parentIds + value},`;
   if (office.type == 1) {
     this.state.officeType = [{ id: 1, name: '部门' }, { id: 2, name: '业主' }];
   } else {
     this.state.officeType = [{ id: 0, name: '经销商' }, { id: 1, name: '部门' }, { id: 2, name: '业主' }, { id: 3, name: 'OEM商' }, { id: 4, name: '安装商' }];
   }
 }

// 根据Id 获得机构详细信息
getOffice=(id) => {
  const officeList = this.props.office.data;
  let object = {};
  for (let i = 0, len = officeList.length; i < len; i++) {
    if (officeList[i].id == id) {
      object = officeList[i];
      break;
    }
  }
  return object;
}

  /**
 *方法说明：提交表单
 *@method okHandler
 */
 okHandler = () => {
   const { key } = this.props.record;
   const { dispatch } = this.props;
   this.props.form.validateFields((err, values) => {
     values.parentIds = this.state.parentIds;
     values.id = key;
     values.logoPath = this.state.logoPath;
     if(values.name==null){values.name = "eeee"}
     if (!err) {
       if (key) {
         dispatch({
           type: 'office/patch',
           payload: values,
         });
       } else {
         dispatch({
           type: 'office/create',
           payload: values,
         });
       }
     }
   });
 };

 // 关闭modal
 close = () => {
   this.props.form.resetFields();
   const { dispatch } = this.props;
   this.state.resourceIds = [];
   dispatch({ type: 'office/hideModal' });
 }

 //机构类型选择回调
 changeOfficeType = (value) => {
  switch(value){
    case "0":this.setState({logo:true,domain:false});break;
    case "3":this.setState({logo:true,domain:true});break;
    case "4":this.setState({logo:true,domain:false});break;
    default: this.setState({logo:false,domain:false});break;
  }
  if(value==2)
  {this.setState({visible:true});}
  else{this.setState({visible:false});}
 }

 //上传图片
 handleChange = ({ file,fileList }) => {
  console.log("fileList-----"+fileList);
  this.setState({ fileList });
  if(file.status === 'done'){
  this.setState({ logoPath: file.response.data.filePath,temp:true})
  }
}
  //移除图片时的回调
  handleRemove = () => {
    this.setState({fileList:[],logoPath:'',temp:false});
  }

 render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
   const { children, office, record } = this.props;
   const {visible,logo,domain,fileList} = this.state;
   const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 6 },
     wrapperCol: { span: 14 },
   };
   if (record.key) {
     this.state.parentIds = record.parentIds;
     this.onChange(record.parentId, '', '');
   }
   if(record.type==2){this.state.visible=true;}
   else{this.state.visible=false;}
   switch(record.type){
    case "3":this.state.logo=true,this.state.domain=true;break;
    case "4":this.state.logo=true,this.state.domain=false;break;
    default: this.state.logo=false,this.state.domain=false;break;
  }
  if(this.state.fileList.length<1&&record.logoPath&&this.state.temp){
    let obj = {
      uid:-1,
      name:'logoName',
      status:'done',
      url:config.CHRCK_FILE+record.logoPath
    };
    this.state.fileList.push(obj);
    this.state.logoPath = record.logoPath;
  }
  else{this.state.fileList=[]}

   return (
     <Modal
       title={(!office.record.key)? '新增' : '修改'}
       visible={office.visible}
       onOk={this.okHandler}
       onCancel={this.close}
       maskClosable={false}
       width={800}
     >
       <Form layout="horizontal" onSubmit={this.okHandler}>
         <Row gutter={16}>
           <Col span={12}>
             <FormItem
               {...formItemLayout}
               label="上级机构"
               hasFeedback
             >
               {
       getFieldDecorator('parentId', {
         initialValue: record.parentId,
         rules: [
         { required: true, message: '请选择上级机构' },
         ],
       })(
         <TreeSelect
           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
           treeData={office.selectTreeList}
           placeholder="请选择上级机构"
           treeDefaultExpandAll
           onChange={this.onChange}
         />
       )
     }
             </FormItem>

             <FormItem
               {...formItemLayout}
               label="机构类型"
               hasFeedback
             >
               {
               getFieldDecorator('type', {

                 rules: [
                 { required: true, message: '请选择机构类型' },
                 ],
               })(
                 <Select placeholder="请选择机构类型" 
                    onChange={this.changeOfficeType}
                 >
                   {this.state.officeType.map((item) => {
                 return (
                   <Option key={item.id}>{item.name}</Option>
                 );
               })}
                 </Select>
               )
              }
             </FormItem>
             {(!visible)?<FormItem
               {...formItemLayout}
               label="机构名称"
               hasFeedback
             >
               {
       getFieldDecorator('name', {

         rules: [
         { required: true, message: '请输入机构名称' },
         ],
       })(<Input />)
     }
             </FormItem>:''}


             {(visible)?<Row>
             <Col span={13}>
                <FormItem {...nameLayout} label="业主姓名:" className={styles.userLastName} hasFeedback>
              {getFieldDecorator('lastName', { 
                initialValue: record.lastName,
                rules: [{ required: true, message: '请填入名' }],
              })(
                    <Input placeholder="名"/>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem className={styles.userFirstName} hasFeedback>
              {getFieldDecorator('firstName', { 
                initialValue: record.firstName,
                rules: [{ required: true, message: '请填入姓' }],
              })(
                <Input placeholder="姓"/>
                  )}
                </FormItem>
              </Col>
            </Row>:''}

             
             <FormItem
               {...formItemLayout}
               label="国家/地区"
               hasFeedback
             >
               {
       getFieldDecorator('areaId', {

         rules: [
         { required: true, message: '请选择国家/地区' },
         ],
       })(
         <Select placeholder="请选择国家/地区" >
           {this.props.office.addressList.map((item) => {
         return (
           <Option key={item.id.toString()}>{`${item.districtLv1}/${item.districtLv2}/${item.districtLv3}/${item.districtLv4}`}</Option>
         );
       })}
         </Select>
       )
     }
             </FormItem>

             <FormItem
               {...formItemLayout}
               label="联系人"
               hasFeedback
             >
               {
       getFieldDecorator('master', {

         rules: [
         { required: true, message: '请输入联系人' },
         ],
       })(<Input placeholder="请输入联系人" />)
     }
             </FormItem>

             <FormItem
               {...formItemLayout}
               label="联系电话"
               hasFeedback
             >
               {
       getFieldDecorator('phone', {

         rules: [
         { required: true, message: '请输入联系电话' },
         ],
       })(<Input placeholder="请输入联系电话" />)
     }
             </FormItem>

             <FormItem
               {...formItemLayout}
               label="详细地址"
               hasFeedback
             >
               {
       getFieldDecorator('address', {

         rules: [
         { required: true, message: '请输入详细地址' },
         ],
       })(<Input placeholder="请输入详细地址" />)
     }
             </FormItem>

             
           </Col>
           <Col span={12}>
             {(logo)?<FormItem
               {...formItemLayout}
               label="LOGO"
               hasFeedback
             >
               {
                 <Upload
                  action={config.UPLOAD_SERVER}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                 
               }
             </FormItem>:''}
             {(domain)?<FormItem
               {...formItemLayout}
               label="域名"
               hasFeedback
             >
               {
                 getFieldDecorator('yuming', {

                   rules: [
                   ],
                 })(<Input />)
               }
             </FormItem>:''}
             <FormItem
               {...formItemLayout}
               label="备注"
               hasFeedback
             >
               {
                 getFieldDecorator('remarks', {

                   rules: [
                   ],
                 })(<TextArea rows={10} />)
               }
             </FormItem>
           </Col>
         </Row>
       </Form>
     </Modal>
   );
 }
}
const mapPropsToFields = (props) => {
  const { record } = props.office;
  const a = {};
  a.parentId = Form.createFormField({ value: record.parentId });
  a.name = Form.createFormField({ value: record.name ? record.name : '' });
  a.firstName = Form.createFormField({ value: record.firstName ? record.firstName : '' });
  a.lastName = Form.createFormField({ value: record.lastName ? record.lastName : '' });
  a.type = Form.createFormField({ value: record.type });
  a.remarks = Form.createFormField({ value: record.remarks });
  a.master = Form.createFormField({ value: record.master });
  a.address = Form.createFormField({ value: record.address });
  a.phone = Form.createFormField({ value: record.phone });
  a.areaId = Form.createFormField({ value: record.areaId });

  return a;
};
const onFieldsChange = (props, changedFields) => {
  // props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
  const { record } = props.office;
  for (const key in values) {
    record[key] = values[key];
  }
};
const officeForm = Form.create({ mapPropsToFields, onFieldsChange, onValuesChange })(OfficeEditModal);
export default connect(({ office }) => ({ office }))(officeForm);
