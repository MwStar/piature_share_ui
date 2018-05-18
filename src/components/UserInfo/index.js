
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Avatar} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 const forge = require('node-forge');
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import avatarDefault from '../../assets/avatarDefault.png';
 import { config } from '../../utils/config';
 import styles from './index.less'

  const FormItem = Form.Item;
/**
 *
 类说明：用户----用户信息
 @class 类名 UserInfo
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
  user: state.user,
}))
 @Form.create()

 export default class UserInfo extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    const {location:{pathname}} = this.props;
    if(pathname === "/owner/paintings"){
      dispatch({type: 'user/fetchCurrent'});
    }
    else{
      const id = this.props.match.params.id;
      dispatch({type: 'user/getUserById',payload:{id:id}});
    }
  }

  uploadImg = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'paintingsuser/savePictureInfo', payload: {} });
    dispatch(routerRedux.push('/owner/upload'));
  }
  render() {
    const { currentUser } = this.props.user;
    const {location:{pathname}} = this.props;
    return (
      <div className={styles.main}>
	      	<Avatar size="large" className={styles.avatar} src={currentUser.avatar?(config.CHRCK_FILE+currentUser.avatar):avatarDefault} />
          {/*<Upload
            className="avatar-uploader"
            name="avatar"
            showUploadList={false}
            action="//jsonplaceholder.typicode.com/posts/"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {
              imageUrl ?
                <img src={imageUrl} alt="" className="avatar" /> :
                <Icon type="plus" className="avatar-uploader-trigger" />
            }
          </Upload>*/}
          <h2>{currentUser.name}</h2>
	      	<p>{currentUser.signature}</p>
	      	{pathname === "/owner/paintings"?<Button onClick={this.uploadImg}>上传图片</Button>:''}
      </div>
    );
  }
}