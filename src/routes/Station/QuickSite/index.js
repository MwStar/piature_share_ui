import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StationBasicInfo from '../../../components/StationSite/StationBasicInfo';
import DeviceRelation from '../../../components/StationSite/DeviceRelation';
import UploadMaps from '../../../components/StationSite/UploadMaps';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import styles from './style.less';

const { Step } = Steps;
@connect(state => ({
  quicksite: state.quicksite,
}))
@Form.create()
class QuickSite extends PureComponent {
  constructor(props){
    super(props);
    this.state ={
      moduleType:"",
      mouleNum:0,
    }
  }
  componentWillMount(){
    const {dispatch}  = this.props;
    dispatch({type:"quicksite/reload"});
    const params = this.props.match.params.id;
   // console.log("params:",params);
    if(params!=0){
      dispatch({type:'quicksite/queryStationInfoById',payload:{id:params}});
    }else{
       dispatch({type:'quicksite/saveData',payload:{stationInfo:{},places:{},markers:[],equipeCapacitor:0,moduleNum:0}});
    }

  }
  getCurrentStep() {
    const { location,quicksite } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const len = pathList.length;
    let pathType="quicksite";
    if(pathList.join(",").indexOf('device')!=-1){
      pathType="device";
    }else if(pathList.join(",").indexOf('diagram')!=-1){
      pathType="diagram";
    }

  //  let pathType = pathList[pathList.length - 2];
   // console.log("pathType:",pathType);
    // if(quicksite.data.stationInfo){
    //   const status = quicksite.data.stationInfo;
    //     if(status == 10){
    //       pathType = "quicksite";
    //     }else if(status == 20){
    //       pathType = "device";
    //     }else if(status == 30){
    //       pathType = "diagram";
    //     }
    // }
    switch (pathType) {
      case 'quicksite': return 0;
      case 'device': return 1;
      case 'diagram': return 2;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: StationBasicInfo,
      1: DeviceRelation,
      2: UploadMaps,
    };
    return componentMap[this.getCurrentStep()];
  }
  render() {

    const { form, stepFormData, submitting, dispatch, quicksite} = this.props;

    const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const CurrentComponent = this.getCurrentComponent();
    const stationdId = this.props.match.params.id;
    // console.log("this props:",this.props);
    // console.log("params:",params);
    return (
      <PageHeaderLayout title="快速建站" >
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="基础信息" />
              <Step title="设备关联" />
              <Step title="上传安装图" />
            </Steps>
            <CurrentComponent
              formItemLayout={formItemLayout}
              form={form}
              dispatch={dispatch}
              quicksite={quicksite}
              submitting={submitting}
              stationId={stationdId}
              buildType={1}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
 //  stepFormData: state.form.step,
 // submitting: state.form.stepFormSubmitting,
}))(QuickSite);
