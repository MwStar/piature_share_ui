import React from 'react';
import { Button, Row, Col , Upload, Icon, message, Modal} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';
import {config} from '../../utils/config';
const Dragger = Upload.Dragger;

class UploadMaps extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }
  componentDidMount (){
    const {quicksite} = this.props;
    this.setState({fileList:quicksite.data.stationInfo.stationMaps});
  }
  handleCancel = () =>{
    this.setState({ previewVisible: false })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {

    const {dispatch} = this.props;
   dispatch({type:"quicksite/saveMapData",payload:{fileList:fileList}})
    //this.setState({ fileList })
  }
  onPrev =()=>{
    const {dispatch,stationId} = this.props;
    dispatch(routerRedux.push('/station/quicksite/'+stationId+'/device'));
  }
  onFinish = () =>{
    const {dispatch,stationId} = this.props;
    const {mapData} = this.props.quicksite;
    var urls =[];
    mapData.fileList.map((item)=>{
      if(item.response){
        let obj ={uid:item.uid,url:item.response.data.url}
        urls.push(obj);
      }else{
        urls.push(item);
      }

    })
    dispatch({type:'quicksite/uploadMap',payload:{stationId:stationId,mapList:urls}})
  }
  render(){

    const { previewVisible, previewImage } = this.state;
    const {fileList} = this.props.quicksite.mapData;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return(
      <div className="clearfix" style={{marginTop:'30px'}}>
        <Upload
          action={config.UPLOAD_SERVER}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
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
export default UploadMaps
