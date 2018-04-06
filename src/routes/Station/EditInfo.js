import React from 'react';
import {
  Form,
  Card,
  } 
  from 'antd';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import BasicStationInfo from '../../components/StationSite/BasicInfo';


@connect(state => ({
  quicksite: state.quicksite,
}))

class EditStationInfo extends React.Component {

  
  componentWillMount(){
    const {dispatch}  = this.props;
    dispatch({type:"quicksite/reload"});
    const params = this.props.match.params.id;
    dispatch({type:'quicksite/queryStationInfoById',payload:{id:params}});


  }
  render() {

    const { form, stepFormData, submitting, dispatch, quicksite} = this.props;
    const stationdId = this.props.match.params.id;
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
    return (
      <div>
            <BasicStationInfo
              formItemLayout={formItemLayout}
              form={form}
              dispatch={dispatch}
              quicksite={quicksite}
              submitting={submitting}
              stationId={stationdId}
              buildType={1}
            />
      </div>
    )
  }

}

const EditInfo = Form.create({})(EditStationInfo);

export default EditInfo;
