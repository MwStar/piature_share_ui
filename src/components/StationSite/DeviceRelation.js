import React from 'react';
import { Form, Input, Button, Alert, Divider,Tree, Table,Upload, Icon,Modal ,message,Popconfirm,Row,Col} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';
const Dragger = Upload.Dragger;
const Search = Input.Search;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;

const  formItemBtnLayout={
  wrapperCol: {
    xs: {
      span: 12,
      offset: 4
    },
    sm: {
      span: 12,
      offset:4
    },
  }
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
@connect(state => ({
  quicksite: state.quicksite,
}))
class Equipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      expendAll:true,
      value: this.props.value,
      editable: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      isShowRepeater:true,
      visible:false,//上传excel 提示框
    };
    this.uploadProps={
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        console.log("info:",info);
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }
  }
  componentWillMount(){
    const {dispatch,stationId,quicksite} = this.props;
    dispatch({type:"quicksite/getDeviceRelationList",payload:{id:stationId}});
  }
  componentDidMount(){
    this.setState({expendAll:true});
  }
  OkBindRelation =(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        const stationId = this.props.stationId;
        const mirco = values.mirco.replace(/[\r\n]/g, ",");
        const payload = {stationId:stationId,dtuDTO:{dtuSn:values.dtu},repeaterDTO:{repeaterSn:values.repeater},miSns:mirco}
        dispatch({type:'quicksite/bindRelation',payload:{payload,payload,form:this.props.form}});
      }
    });

  }
  deleteSn=(record)=>{
    const {dispatch} = this.props;
    dispatch({type:'quicksite/deleteSn',
      payload:{oldId:record.key,type:record.type,stationId: this.props.stationId}})
  }
  /*****上一步***/
  onPrev=()=>{
    const {dispatch,buildType} = this.props;
    const stationId = this.props.stationId;

    if(buildType ===1){
      dispatch(routerRedux.push('/station/quicksite/'+stationId));
    }else if(buildType===2){
      //dispatch({type:"quicksite/saveData",payload:{modalVisible:false}});
      dispatch(routerRedux.push('/station/profession/'+stationId));
    }
  }
  /**下一步**/
  onNext=()=>{
    const {dispatch,buildType} = this.props;
    const stationId = this.props.stationId;
    const {dataSource } =this.props.quicksite.step2;
    if(dataSource.length ===0){
      message.destroy();
      message.warning("请设置设备关系");
      return false;
    }
    dispatch({type:'quicksite/submitStep2',payload:{id:stationId,buildType:buildType}});
  }
  //树节点 start
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key+"";
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children)+"";
        }
      }
    }
    return parentKey;
  };
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onChangeSearch = (e) => {
    const {step2} = this.props.quicksite;
    const value = e.target.value;
    const expandedKeys = step2.deviceRelationList.map((item) => {
      if (item.sn.indexOf(value) > -1) {
        return this.getParentKey(item.id, step2.dataSource);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  //替换设备序列号
  onUpdateDevice = (record) => {
    this.props.form.resetFields();
    const {step2} = this.props.quicksite;
    const {dispatch} = this.props;
    this.setState({isShowRepeater:true});
    dispatch({type:'quicksite/saveStep2',payload:{deviceRecord:{sn:record.name,type:record.type,id:record.key},oprateType:record.type}});
  }
  //修改序列号好
  onUpdateSn =(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        const {deviceRecord,oprateType} = this.props.quicksite.step2;
        dispatch({type:"quicksite/updateSn",payload:{newSN:values.sn,oldId:deviceRecord.id,stationId:this.props.stationId,type:oprateType}});
      }
    });

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
  onCancel =()=>{
    const {dispatch} = this.props;
    this.props.form.resetFields();
    dispatch({type:"quicksite/saveStep2",payload:{deviceRecord:{}}})
  }
  onChangeContent =(type)=>{
    const { getFieldDecorator } = this.props.form;
    const {deviceRecord} = this.props.quicksite.step2;
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
          <div className={styles.relationBtn}>
            <Button type="primary" onClick={this.OkBindRelation}>
              确定
            </Button>
            <Button onClick={this.onCancel} style={{marginLeft: 8}}>
              取消
            </Button>
            {this.props.buildType ==2?<span>
              <Button type="primary" style={{marginLeft: 8}} onClick={this.uploadModal}>
                上传
              </Button>
              <a style={{marginLeft: 8}}>模板</a>
            </span>:null}

          </div>
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

          <div className={styles.relationBtn}>
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>

          </div>
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

          <div className={styles.relationBtn}>
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>
          </div>
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

          <div className={styles.relationBtn}>
            <Button type="primary" onClick={this.onUpdateSn}>
              确定
            </Button>
          </div>
        </div>
        break
      default:
    }
    return content;
  }

  handleTreeNode =(item)=>{
    return (
      <div className={styles.treeIconBtn}>
        <a><Icon onClick={(e)=>{e.stopPropagation();this.onUpdateDevice(item)}} type="edit" />
        </a>&nbsp;&nbsp;<a><Icon onClick={(e)=>{e.stopPropagation();this.deleteSn(item)}}  type="delete" /></a>
      </div>
    )
  }
  onSelectTree =(key)=>{
    this.props.form.resetFields();
    const {step2} = this.props.quicksite;
    const {dispatch} = this.props;
    dispatch({type:"quicksite/saveStep2",payload:{oprateType:0}});
    if(key.length > 0){
      const obj = step2.deviceRelationList.find((item)=>item.id === Number(key[0]));
      if(obj.type===3){//Dtu
        dispatch({type:'quicksite/saveStep2',payload:{deviceRecord:{dtuSn:obj.sn,dtuId:obj.id}}});
      }else if(obj.type===2){//中继器
        const DtuObj = step2.deviceRelationList.find((item)=>item.id === obj.pid);
        this.setState({deviceRelation:{repeaterSn:obj.sn,dtuSn:DtuObj.sn,type:obj.type}});
        dispatch({type:'quicksite/saveStep2',payload:{deviceRecord:{repeaterSn:obj.sn,type:obj.type,repeaterId:obj.id,dtuSn:DtuObj.sn,dtuId:DtuObj.id}}});
      }
    }
  }
  getTreeNode =(data)=>{
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const  loop = data => data.map((item) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name = item.name.substr(index,searchValue.length+1);
      const title = index > -1 ? (
        <span >
        <span >
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
          </span>
          <span className={styles.editIcon}></span>
          {this.handleTreeNode(item)}
        </span>
      ) : <span ><span >{item.name}</span><span className={styles.editIcon}>{this.handleTreeNode(item)}</span></span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
    return loop(data);
  }
//上传excel
  uploadModal = ()=>{
    this.setState({visible:true});
  }

  render() {
    const {step2} = this.props.quicksite;
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{marginTop: '30px'}}>
            <Row >
              <Col span={8}>
                <div className={styles.equickBox}>
                  <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
                  <Tree
                    showLine
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={this.onSelectTree}
                  >
                    {this.getTreeNode(step2.dataSource)}
                  </Tree>
                </div>
              </Col>
              <Col span={1}/>
              <Col span={15}>
                <div className={styles.equickBox} >
                  <Form>
                    {this.onChangeContent(step2.oprateType)}
                  </Form>
                </div>
              </Col>
            </Row>
            <Row style={{
              marginBottom: 8,
              marginTop: 20
            }}><Col span={6}>
              <Button type="primary" onClick={this.onNext}>
                下一步
              </Button>
              <Button onClick={this.onPrev} style={{
                marginLeft: 8
              }}>
                上一步
              </Button>
            </Col></Row>
        <Modal title="上传设备关系"
               visible={this.state.visible}
        >
          <Upload>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
          <p>上传excel会清空已有的设备关系</p>
        </Modal>
          </div>
    )
  }
}
export default Equipment;
