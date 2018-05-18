
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import UserCard from '../../components/PaintingCard/UserCard';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Masonry from 'react-masonry-component';
 import User from './User';

var masonryOptions = {
    transitionDuration: 0
};
/**
 *
 类说明：用户关注的人
 @class 类名 Pictures
 @constructor
 */


 @connect(state => ({
  focususer: state.focususer,
  pictures:state.pictures,
}))
 @Form.create()

 export default class  Focus extends Component {
    state = {
    data:{},//一张图片的信息
  }
  componentDidMount() {
       const {dispatch} = this.props;
       const { location: {pathname} } = this.props;
       if(pathname === "/owner/paintings"){
        dispatch({type:"focususer/getFocus"});
       }
        else{
        const id = this.props.match.params.id;
        dispatch({type:"focususer/getFocus",payload:{id:id}});
      }
  }
  User = (item) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/owner/user/'+item._id));
  }


  render() {
    const { list } = this.props.focususer;
    return (
      <div className={styles.pictures}>
        <Row gutter={24}>
        	<Masonry
              className={ styles.my_gallery} // default ''
              elementType={'div'} // default 'div'
              options={masonryOptions} // default {}
              disableImagesLoaded={false} // default false
              updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          >
                {
                  list.length > 0 ?
                  list.map((item)=>{
                  return (
                    <Col xs={12} sm={8} md={6} lg={6} xl={6} style={{"paddingBottom":"20px"}} onClick={()=>{this.User(item)}}>
                      <UserCard data={item}></UserCard>
                    </Col>
                    )
                  })
                   :
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className={styles.no}>还没有关注呐</Col>
                }
              
            
          </Masonry>
        </Row>
      </div>
    );
  }
}
