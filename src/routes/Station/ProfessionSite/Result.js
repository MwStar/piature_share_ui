import React from 'react';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

class QuicksiteResult extends React.Component{

	
  onBack =()=>{
  	const {dispatch} = this.props;
  	dispatch(routerRedux.push('/station/list'));
  }
  onFinish =()=>{}
  actions = (
    <div>
      <Button type="primary" onClick={this.onFinish}>
        返回列表
      </Button>
      <Button>
        查看电站
      </Button>
    </div>
  );
	render(){
		return(
			 <Result
			      type="success"
			      title="操作成功"
			      description="电站创建成功，接下来可以在系统中查询监控电站生成数据。"
			      actions={this.actions}
			      className={styles.result}
			    />
			)
	}
}
export default QuicksiteResult;