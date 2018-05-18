import React, { PureComponent } from 'react';
import moment from 'moment';
import {connect} from 'dva';
import findIndex from 'lodash/findIndex';
import { Icon,Card,Progress,Row,Col,Tooltip,Button,Avatar} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './PictureCardIndex.less';
import { config } from '../../utils/config';
import avatarDefault from '../../assets/avatarDefault.png';
import { download } from '../../services/download.js';
import {setLocalStorage, getLocalStorage } from '../../utils/utils';

//用户--一张图片

 @connect(state => ({
  user: state.user,
  collectuser: state.collectuser,
}))

class PictureCard extends PureComponent {
  state = {
    visible:false,//操作是否可见
  };

  //喜欢
  collect = () => {
    const token = getLocalStorage('Token');
    if(token){
    	const {data} = this.props;
    	const { dispatch } = this.props;
    	dispatch({type:'pictures/saveId',id:data._id});
    	dispatch({type:"pictures/collect"});
    }
    else{
      message.info('请先登录！');
    }
  }
  //取消喜欢
  de_collect = () => {
    const token = getLocalStorage('Token');
    if(token){
    	const {data} = this.props;
    	const { dispatch } = this.props;
    	dispatch({type:'pictures/saveId',id:data._id});
    	dispatch({type:"pictures/de_collect"});
      }
    else{
      message.info('请先登录！');
    }
  }
  //采集
  gather = () => {
    const token = getLocalStorage('Token');
    if(token){
    	const {data} = this.props;
    	const { dispatch } = this.props;
    	dispatch({type:'pictures/saveId',id:data._id}); 	
    	dispatch({type:'pictures/changeChoose',choosePaintings:true});
    }
    else{
      message.info('请先登录！');
    }
  }
  //作者
  user = () => {
  	const { dispatch } = this.props;
    const {data} = this.props;
    dispatch(routerRedux.push('/owner/user/'+data.author_id));
  }
  //下载
  downloadPicture = (id,url,name) => {
  	download(id,url,name);
  }
  //鼠标进入
  enter = () => {
    this.setState({visible:true});
  }
  //鼠标移出
  leave = () => {
    this.setState({visible:false});
  }

  //编辑
  edit = () => {
  	const { data ,id } = this.props;
  	const { dispatch } = this.props;
  	const value = {
  		...data,
  		paintings_id:id
  	}
  	dispatch({ type: 'paintingsuser/savePictureInfo', payload: value });
  	dispatch({ type: 'paintingsuser/saveOldPaingtings', id: id });
  	dispatch(routerRedux.push('/owner/pictureEdit/'+id+"/"+data._id));

  }

	render() {
		const {data} = this.props;
	    const { visible} = this.state;
	    const { currentUser } = this.props.user;
	    const avatar = data.author?data.author.avatar:'';
	    const name = data.author?data.author.name:'';
      const { list:collectList } = this.props.collectuser;
      const img_id = data._id?data._id:'';
      const collect = findIndex(collectList,{"_id":img_id});
	    return ( 	
	      	<Card bordered={false} className={styles.pictureCard}>
			      <div className={styles.pictureImg}>
				    <a>
				    	{data.path?<img src={config.CHRCK_FILE+data.path} onMouseEnter={this.enter} onMouseLeave={this.leave}/>:''}
				    </a>
			      </div>
            {visible?<div onMouseEnter={this.enter} onMouseLeave={this.leave}>
	            <div className={styles.actions}>
	  				      <div className={styles.left}><Button onClick={(e)=>{e.stopPropagation();this.gather()}}>采集</Button></div>
	                {collect === -1?<div className={styles.right} onClick={(e)=>{e.stopPropagation();this.collect()}}><Icon type="heart-o" className={styles.collect}/></div>
	  				      :<div className={styles.righttwo} onClick={(e)=>{e.stopPropagation();this.de_collect()}}><Icon type="heart" style={{"color":"#EE4D59","fontSize":"22px"}}/></div>
	  				      }
	            </div> 
	            
	            <div className={styles.actionscenter}>
	            	<Button onClick={(e)=>{e.stopPropagation();this.edit()}}>编辑</Button>
	            </div>

	            <div className={styles.actionsdown}>
	                <div className={styles.left}>
	  				      	<span onClick={(e)=>{e.stopPropagation();this.user()}}>
	  				      	{avatar?<Avatar size="default" className={styles.avatar} src={config.CHRCK_FILE+avatar} />
	  				      	:
	  				      	<Avatar size="small" className={styles.avatar} src={avatarDefault} />
	  				      	}
	  				      	<span className={styles.name}>{name}</span>
	  				      	</span>
	  				</div>
	  				<div className={styles.right}><i className="iconfont icon-download" onClick={(e)=>{e.stopPropagation();this.downloadPicture(data._id,data.path,data.title)}} ></i></div>  
  			   </div> 
  			</div>:''} 
			</Card>
	    );
	}
}

export default PictureCard;
