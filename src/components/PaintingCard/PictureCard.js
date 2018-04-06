import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon,Card,Progress,Row,Col,Tooltip,Button} from 'antd';
import styles from './PictureCard.less';
import station_img from '../../assets/station_img.jpg';


//一张图片

class PictureCard extends PureComponent {
  state = {
    
  };



	render() {
		const {data} = this.props;
	    return ( 	
	      	<Card bordered={false} className={styles.pictureCard}>
		      <div className={styles.pictureImg}>
			    <a href={`#/owner/paintings/${data.id}`}>
			    	{data.path?<img src={data.path}/>:<img src={station_img}/>}
			    </a>
		      </div>
		      <h4>{data.title}</h4>
		      <div className={styles.actions}>
			      <div className={styles.right}><Button>编辑</Button></div>
			      <div className={styles.left}><Button>采集</Button></div>
		      </div>
		    </Card>
	    );
	}
}

export default PictureCard;
