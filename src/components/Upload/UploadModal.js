/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input,Tree ,Checkbox,Row,Col,Upload, Icon, message,Select ,Button} from 'antd';
 import styles from './UploadModal.less';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import {setLocalStorage, getLocalStorage , setMenuTree} from '../../utils/utils';
 import UploadImg from './Upload';
 import {config} from '../../utils/config';
 import EditPainging from '../EditPainting/index';
 import InputArray from './InputArray';
 const Dragger = Upload.Dragger;
 const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;
 const TreeNode = Tree.TreeNode;
 const token = getLocalStorage("Token");
 const uploadUrl = config.UPLOAD_SERVER;
 const checkUrl = config.CHRCK_FILE;
/**
 *
 类说明：上传图片Modal
 @class 类名 UploadModal
 @constructor
 */

@connect(state => ({
  user: state.user,
}))
@Form.create()


 class UploadModal extends Component {
  state = {
    previewVisible: false,
    previewImage: '',//预览文件
    fileList: [],//文件列表
    fileListForSubmit: [],//需要提交的文件列表
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type:"paintingsuser/getAllPaintings"});
    const id = this.props.match.params.id?this.props.match.params.id:'';
    const paintings_id = this.props.match.params.paintingsId?this.props.match.params.paintingsId:'';
    if(id){dispatch({type: 'paintingsuser/viewPicture',payload:{id:id}});}
  }

/**
  *方法说明：提交表单
  *@method okHandler
  */
  okHandler = () => {
    const { user , dispatch} = this.props;
    const { oldPaintngs } = this.props.paintingsuser;
    const { fileListForSubmit , fileList} =this.state;
    const id = this.props.match.params.id?this.props.match.params.id:'';
    this.props.form.validateFields((err, values) => { 
      if (!err) {
        fileList.map((item)=>{
          let updateValue ={
              ...values,
              old_p:oldPaintngs,
              new_p:values.paintings_id,
              id: id,
          }

          if(id){
            if(values.title){
               dispatch({
                type: 'paintingsuser/updateImgInfo',
                payload:updateValue,
              });
            }
            else{
              dispatch({
                type: 'paintingsuser/updateToPaintings',
                payload:updateValue,
              });   
            }
          }
          else{
            let value ={
              ...values,
              path: item.response.data.paths.join(','),
          }
            dispatch({
              type: 'paintingsuser/uploadImgAndSave',
              payload:value,
            });       
          }
        })
     }
   });
       
  };
  //取消
  close = ()=>{
    this.props.form.resetFields();
    this.setState={}
    const { history } = this.props;
    history.go(-1);
  }

  //创建画集
  create = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'paintingsuser/modalStatus', modal: true });
  }

   //删除采集
  de_picture = () => {
    const { dispatch } = this.props;
    const id = this.props.match.params.id?this.props.match.params.id:'';
    const paintings_id = this.props.match.params.paintingsId?this.props.match.params.paintingsId:'';
    const value = {
      picture_id:id,
      paintings_id:paintings_id,
    }
    dispatch({ type: 'paintingsuser/de_gatherPicture', payload:value });
  }
  //
  filterOption = (inputValue, option) => {
    if(option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0){
      return true;
    }
    else{
      return false;
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ file, fileList }) => {

    this.setState({ fileList:fileList });
    if (file.status === 'done') {
    let newFileList = [];
    let length = fileList.length;
    fileList.map((file)=>{
      if(file.response){
        newFileList.push({
            fileName: file.response.data.titles.join(','),
            filePath: file.response.data.paths.join(','), 
        });
      } 
    })

    //title = fileList[length-1].response.data.titles.join(',');
    this.setState({ fileListForSubmit:newFileList });
    this.props.form.setFieldsValue({
      title: file.response.data.titles.join(','),
    });

    } else if (file.status === 'error') {
          message.error(`${file.name} file upload failed.`);
        }
  }
 


  render() {
    const userType = getLocalStorage("userType");
    const { dispatch , paintingsuser:{ oldPaintngs,painting , paintingsList , picture , picturePainting}} = this.props;
    const { previewVisible, previewImage, fileList} = this.state;
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props.user;
    const user_id = currentUser._id;
    const author_id = picture.author?picture.author._id:'';
    const path = this.props.location.pathname;
    const id = this.props.match.params.id?this.props.match.params.id:'';
    const paintings_id = this.props.match.params.paintingsId?this.props.match.params.paintingsId:'';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const list = config.TAGS;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传或拖拽上传</div>
      </div>
    );
    const headers = {authorization:token};
    if(id && this.state.fileList.length<1 && picture.title){
      let obj = {
        uid:-1,
        name:picture.title,
        status:'done',
        url:checkUrl+picture.path
      };
      this.state.fileList.push(obj);
    }
    return (
      <div>
      <Form layout="horizontal" onSubmit={this.okHandler} className={styles['authority-modal-body']}>

        <div className={`ant-row ${styles.upload}`}>
          <Upload
            name='image'
            action={uploadUrl}
            headers={headers}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}

          </Upload>
          
        </div>
        {author_id === user_id || path === "/owner/upload" || userType === '2'?
          <div>
            <FormItem
              {...formItemLayout}
              className={styles['form-modal']}
              label="标题" 
              >
              {
                getFieldDecorator('title',{
                  initialValue:picture.title==null?'':picture.title,
                  rules: [{ required: true, message: '请填写照片标题!' }],
                })
                (<Input placeholder="请填写照片标题"/>)
              }
            </FormItem>

            <FormItem 
            {...formItemLayout} 
            label="标签" >
                  {getFieldDecorator('tag',{
                    initialValue:picture.tag==null?[]:picture.tag,
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
            <FormItem
              {...formItemLayout}
              className={styles['form-modal']}
              label="描述" 
              >
              {
                getFieldDecorator('content',{
                  initialValue:picture.content==null?'':picture.content,
                })(<Input placeholder="请填写对照片的描述"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              className={styles['form-modal']}
              label="地址" 
              >
              {
                getFieldDecorator('address')(<Input placeholder="请填写照片地址"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              className={styles['form-modal']}
              label="照片参数" 
              >
              {
                getFieldDecorator('params',{
                  initialValue:picture.params==null?'':picture.params,
                })(
                  <Input />
                  )
              }
            </FormItem>
          </div>:
        <span style={{fontSize:"18px",fontWeight:"500"}}>{picture.title?picture.title:''}</span>
      }
        {userType != '2'?<FormItem
          {...formItemLayout}
          className={styles['form-modal']}
          label="所属画集" 
          >
          {
            getFieldDecorator('paintings_id',{
              initialValue:paintings_id?paintings_id:'',
              rules: [{ required: true, message: '请选择所属画集!' }],
            })(
              <Select 
                showSearch
                filterOption={this.filterOption}
                placeholder="请选择或创建画集"
                >
                    {paintingsList.map((item) => {
                      return (
                        <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                      )
                    })}
              </Select>
              )
          }
          <span><i className="iconfont icon-add_paintings"></i><a onClick={this.create}>创建画集</a></span>
          {id?<Button onClick={this.de_picture}><Icon type="minus-circle-o" />删除采集</Button>:''}
        </FormItem>:''}
        <FormItem
        className={styles.ok}
        >
          <Button onClick={this.okHandler}>确定</Button>
          <Button onClick={this.close}>取消</Button>
        </FormItem>


      </Form>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <EditPainging painting={painting}></EditPainging>
    </div>
    );
  }
}

const mapPropsToFields = (props) => {
  let {picture, picturePainting} = props.paintingsuser;
  let a = {};
  a.title = Form.createFormField({value: picture.title?picture.title:''});
  a.tag = Form.createFormField({value: picture.tag?picture.tag:[]});
  a.content = Form.createFormField({value: picture.content?picture.content:''});
  a.address = Form.createFormField({value: picture.address?picture.address:''});
  a.params = Form.createFormField({value: picture.params?picture.params:''});
  //a.paintings_id = Form.createFormField({value: picturePainting?picturePainting:''});

  return a
};
const onFieldsChange = (props, changedFields) => {
  //props.onChange(changedFields);
};
const onValuesChange = (props, values) => {
    let {picture} = props.paintingsuser;
    for(let key in values){
      if(key === 'paintings_id'){
        
      }
      else{
        picture[key] = values[key]; 
      }
     }
};

const UploadPicture = Form.create({mapPropsToFields, onFieldsChange, onValuesChange})(UploadModal);
export default connect(({paintingsuser})=>({paintingsuser}))(UploadPicture);
