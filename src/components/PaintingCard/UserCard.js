import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon,Card,Progress,Row,Col,Tooltip,Button,Avatar} from 'antd';
import styles from './UserCard.less';
import station_img from '../../assets/station_img.jpg';
import {routerRedux} from 'dva/router';
import {config} from '../../utils/config';


//一个用户

class UserCard extends PureComponent {
  state = {
    
  };


	render() {
		const {data} = this.props;
	    return ( 
	    	<div>	
		      	<Card bordered={false} className={styles.userCard}>
			      <div className={styles.avator}>
				    <a href={`#/owner/user/${data._id}`}>
				    	<Avatar size="big" className={styles.avatar} src={config.CHRCK_FILE+data.avatar} />
				    </a>
			      </div>
			      <h4>{data.name}</h4>
			      <p>{data.signature}</p>
			      <p>
			      	<span>原创图片：{data.img_count}</span>
			      	<span>画集：{data.paintings_count}</span>
			      </p>
			      
			    </Card>
			    
		    </div>
	    );
	}
}

export default UserCard;
