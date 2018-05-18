import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon,Card,Progress,Row,Col,Tooltip,Button} from 'antd';
import styles from './index.less';
import station_img from '../../assets/station_img.jpg';
import {routerRedux} from 'dva/router';
import EditPainging from'../EditPainting/index';
import {config} from '../../utils/config';


//用户---一个画集

class PaintingCard extends PureComponent {
  state = {
    
  };

  //编辑画集
  edit = () => {
  	const {data} = this.props;
  	const {dispatch} = this.props;
  	dispatch({ type: 'paintingsuser/savePaintingInfo', payload: data });
  	dispatch({ type: 'paintingsuser/modalStatus', modal: true });
  }


	render() {
		const {data} = this.props;
	    return ( 
	    	<div>	
		      	<Card bordered={false} className={styles.stationCard}>
			      <div className={styles.stationImg}>
				    <a href={`#/owner/painting/${data._id}`}>
				    	{data.cover_path?<img src={config.CHRCK_FILE+data.cover_path}/>:<img src={station_img}/>}
				    </a>
			      </div>
			      <h4>{data.title}</h4>
			      <div><Button style={{"width":"100%"}} onClick={this.edit}>编辑</Button></div>
			    </Card>

			    
		    </div>
	    );
	}
}

export default PaintingCard;
