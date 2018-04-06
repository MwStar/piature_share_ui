import React from 'react';
import { Button, Row, Col , Upload, Icon, message} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';
import {config} from '../../../utils/config';
import UploadMaps from '../../../components/StationSite/UploadMaps'
const Dragger = Upload.Dragger;

@connect(state => ({
  quicksite: state.quicksite,
}))
class UploadMap extends React.Component{
  constructor(props){
      super(props);
  }
  onPrev =()=>{
    const {dispatch,stationId} = this.props;
    dispatch(routerRedux.push('/station/quicksite/'+stationId+'/device'));
  }
  onFinish = () =>{
    const {dispatch,stationId} = this.props;
    var urls =[];
    this.state.fileList.map((item)=>{
        urls.push(item.response.data.url);
    })
    dispatch({type:'quicksite/uploadMap',payload:{stationId:stationId,mapPath:this.state.filePath}})
  }
render(){
    const {quicksite} = this.props;
   return(
      <div className={styles.wrapper}>
        <UploadMaps stationId = {this.props.stationId} quicksite={quicksite}/>
      <Row style={{marginTop:30}}>
        <Col span={10}></Col>
        <Col span={14}>
          <Button type="primary" onClick={this.onFinish}>
          完成
        </Button>
        <Button onClick={this.onPrev} style={{
                marginLeft: 8
            }}>
          上一步
        </Button>
        </Col>
      </Row>
      </div>
    )
}
}
export default UploadMap;

