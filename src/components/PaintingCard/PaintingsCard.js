import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon,Card,Progress,Row,Col,Tooltip,Button} from 'antd';
import styles from './index.less';
import station_img from '../../assets/station_img.jpg';
import {routerRedux} from 'dva/router';
import EditPainging from'../EditPainting/index';
import {config} from '../../utils/config';


//发现---一个画集

class PaintingCardDiscover extends PureComponent {
  state = {
    
  };

	render() {
		const {data} = this.props;
	    return ( 
	    	<div>	
		      	<Card bordered={false} className={styles.painting}>
			      <div>
				    <a href={`#/owner/discover_p/${data._id}`}>
				    	{data.cover_path?<img src={config.CHRCK_FILE+data.cover_path}/>:<img src={station_img}/>}
				    </a>
			      </div>
			      <h4>{data.title}</h4>
			    </Card>

			    
		    </div>
	    );
	}
}

export default PaintingCardDiscover;
