import React from 'react';
import { Form, Input, Button, Alert, Divider,Tree, Table, Icon, Modal ,message,Popconfirm,Row,Col} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { digitUppercase } from '../../../utils/utils';

// import EditModal from '../../../components/StationSite/EditModal';
// import DirTree from '../../../components/StationSite/DirTree';
// import MircoModal from '../../../components/StationSite/MircoModal';
// import EditableCell from '../../../components/StationSite/EditCell';
import styles from './style.less';
import {setDeviceTree,getIds} from '../../../utils/utils';
const Search = Input.Search;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;


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
            type:"dtu",




        };

    }
    componentWillMount(){
        const {dispatch,params,quicksite} = this.props;
        dispatch({type:"quicksite/getDeviceRelationList",payload:{id:params}});
        //dispatch({type:'quicksite/getDTUList',payload:{id:params}});


    }
    componentDidMount(){
      this.setState({expendAll:true});
    }

//新增DTU
    newDtu=() => {
        const {dispatch} = this.props;
        const stationId = this.props.params;
        //dispatch({type:'quicksite/getDTUList',payload:{id:stationId}});
        dispatch({type:'quicksite/saveStep2',payload:{DtuVisible:true}})
    }

    onCancelDtu=(flag) => {
        const {dispatch} = this.props;
        dispatch({type:'quicksite/saveStep2',payload:{DtuVisible:false}})
    }
    OkBindDTU =(values,form)=>{
        const {dispatch} = this.props;
        const stationId = this.props.params;
        const mirco = values.mirco.replace(/[\r\n]/g, ",");
       const payload = {stationId:stationId,dtuDTO:{dtuSn:values.dtu},repeaterDTO:{repeaterSn:values.repeater},miSns:mirco}


        dispatch({type:'quicksite/bindRelation',payload:{payload,payload,form:form}});
    }
    deleteDtu=(record)=>{
      const {dispatch} = this.props;
      dispatch({type:'quicksite/deleteDtu',
      payload:{dtuId:record.key,dtuSn:record.name,stationId: this.props.params}})
    }
    //中继器
    newRepeater =(record)=>{
       const {dispatch} = this.props;
        //dispatch({type:'quicksite/getCanBindRepeaterByDtuSn',payload:{dtuSn:record.name,stationId:Number(this.props.params)}});
        //this.setState({repeaterVisible:true,record:record});
        dispatch({type:'quicksite/saveStep2',payload:{repeaterVisible:true}});
        this.setState({record:record});

    }
    onCancelRepeater =()=>{
        const {dispatch} = this.props;
        dispatch({type:'quicksite/saveStep2',payload:{repeaterVisible:false}});
    }
    onOkRepeater =(value)=>{
        const {dispatch} = this.props;
       const stationId = this.props.params;
       let len = value.length,arr=[],DtuDto={};
       for(var i =0;i<len;i++){
            let targetArr = value[i].split("-");
            arr.push({repeaterId:targetArr[0],repeaterSn:targetArr[1]});
       }

        DtuDto={dtuId:this.state.record.key,dtuSn:this.state.record.name}

       let payload = {dtuDTO:DtuDto,stationId:stationId,repeaterList:arr};
       dispatch({type:'quicksite/bindRelation',payload:payload});
    }
    deleteRepeater=(record)=>{
      const {dispatch} = this.props;
      dispatch({type:'quicksite/deleteRepeater',
      payload:{dtuId: record.dtuId,repeaterId: record.key,repeaterSn:record.name,stationId: this.props.params}})
    }

    onCnacelMirco =()=>{
        const {dispatch} = this.props;
        dispatch({type:'quicksite/saveStep2',payload:{mircoVisible:false}});
    }
    onOkMirco =(value)=>{
        const {dispatch} = this.props;
       const stationId = this.props.params;
       let len = value.length,arr=[],DtuDto={},repeaterDTO={};
       for(var i =0;i<len;i++){
            let targetArr = value[i].split("-");
            arr.push({miId:targetArr[0],miSn:targetArr[1]});
       }
       console.log("this.state.record:",this.state.record);
       if(this.state.record.type === 3){
            DtuDto={dtuId:this.state.record.key,dtuSn:this.state.record.name}
       }else if(this.state.record.type === 2){
           DtuDto={dtuId:this.state.record.dtuId,dtuSn:this.state.record.dtuSn}
           repeaterDTO={
            dtuId: this.state.record.dtuId,
            dtuSn: this.state.record.dtuSn,
            repeaterId: this.state.record.key,
            repeaterSn: this.state.record.name};
       }
       let payload = {dtuDTO:DtuDto,stationId:stationId,miList:arr,repeaterDTO:repeaterDTO};
       dispatch({type:'quicksite/bindRelation',payload:payload});

    }
    deleteMi=(record)=>{
      const {dispatch} = this.props;
      dispatch({type:'quicksite/deleteMi',payload:{id:record.key,stationId:this.props.params}})
    }
    onPrev=()=>{
        const {dispatch} = this.props;
        const params = this.props.params;
        dispatch(routerRedux.push('/station/quicksite/'+params));
    }
    onNext=()=>{
        const {dispatch} = this.props;
        const params = this.props.params;

        dispatch({type:'quicksite/submitStep2',payload:{id:params}});
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

      const value = e.target.value;

      const {step2} = this.props.quicksite;
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

    //end
    //替换设备序列号
    onUpdateDevice = (record) => {

     // this.setState({type:"edit"});
      const {step2} = this.props.quicksite;
      const {dispatch} = this.props;
      // let deviceRecord = step2.deviceRecord;
      // deviceRecord.operate = "edit";
      // dispatch({type:"quicksite/saveStep2",payload:{deviceRecord:deviceRecord}});
      //this.getContentByType("edit",step2.deviceRecord);
      return (value) => {


       // const target = dataSource.find(item => item.key === record.key);

       // console.log("target:",target[dataIndex]);
        console.log("record:",record);
       // if (target) {
         // target[dataIndex] = value;
         switch(record.type) {
           case 3:
             //dispatch({type:"quicksite/updateDTUSn",payload:{dtuId:record.key,dtuSn:value,stationId:this.props.params}})
             break;
           case 2:
            //dispatch({type:"quicksite/updateRepeaterSn",payload:{dtuId:record.dtuId,repeaterId:record.key,repeaterSn:value,stationId:this.props.params}})
             break;
           case 1:
             // dispatch({type:"quicksite/updateMiSn",
             // payload:{dtuId:record.dtuId,miId:record.key,miSn:value,repeaterId:record.repeaterId,stationId:this.props.params}})
             break;
         }
         // dispatch({type:"quicksite/saveStep2",payload:{record:record}});
       // }
      };
    }
    //右边内容切换
    getContentByType =(type,obj)=>{
      let content =null;
      const {step2} = this.props.quicksite;

      switch(type) {
        case 'dtu':

          break;
        case 'edit':

          break;
      }
      return content;
    }
    handleDelete =(item)=>{

    }
    handleTreeNode =(item)=>{

    return (<span><a><Icon onClick={this.onUpdateDevice(item)} type="edit" /></a>&nbsp;&nbsp;<a><Icon type="delete" /></a></span>)


    }
    onSelectTree =(key)=>{
      const {step2} = this.props.quicksite;
      const {dispatch} = this.props;
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
    render() {
        const {step2} = this.props.quicksite;
        console.log("step2:",step2);
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

        return (
          <div>
           <Row  style={{marginTop:'30px'}} >
              <Col span={8}>

                <div className={styles.equickBox}>
                  {/*< <DirTree data={step2.dataSource} onAdd={(record)=>{

                  }} onEdit={(record)=>{

                  }} onDel={function(){}} onClick={function(){}}
                           onExpand={this.onExpand}
                  onSearch={this.onChangeSearch} option={this.state.searchValue}/>
                Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />


                <Tree
                showLine
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}

                >
                  {this.getTreeNode(step2.dataSource)}
                </Tree>*/}
                </div>
              </Col>
              <Col span={16}>
                <div className={styles.equickBox} style={{marginLeft:60}}>
                  <DTUModal onOk={this.OkBindDTU} deviceRelation={step2.deviceRecord}/>
                </div>
              </Col>


           </Row>
           <Form.Item
            style={{
                marginBottom: 8,
                marginTop: 20
            }}
            wrapperCol={{
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 24,
                    offset: 0
                },
            }}
            label=""
            >
        <Button type="primary" onClick={this.onNext}>
          下一步
        </Button>
        <Button onClick={this.onPrev} style={{
                marginLeft: 8
            }}>
          上一步
        </Button>
      </Form.Item>
           </div>

        )
    }
}
export default Equipment;
