import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon,Card,Progress,Row,Col,Tooltip,Button} from 'antd';
import styles from './index.less';
import station_img from '../../assets/station_img.jpg';
import {routerRedux} from 'dva/router';
import EditPainging from'../EditPainting/index';


//一个画集

class PaintingCard extends PureComponent {
  state = {
    
  };

  //编辑画集
  edit = () => {
  	const {data} = this.props;
  	const {dispatch} = this.props;
  	dispatch({ type: 'paintings/savePainting', painting: data });
  	dispatch({ type: 'paintings/modalStatus', modal: true });
  }


	render() {
		const {data} = this.props;
	    return ( 
	    	<div>	
		      	<Card bordered={false} className={styles.stationCard}>
			      <div className={styles.stationImg}>
				    <a href={`#/owner/painting/${data.id}`}>
				    	{data.cover_path?<img src={data.cover_path}/>:<img src={station_img}/>}
				    </a>
			      </div>
			      <h4>{data.title}</h4>
			      <div><Button style={{"width":"100%"}} onClick={this.edit}>编辑</Button></div>
			    </Card>
			    <EditPainging painting={data}></EditPainging>
		    </div>
	    );
	}
}

export default PaintingCard;
