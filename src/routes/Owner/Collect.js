
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PictureCard from '../../components/PaintingCard/PictureCard.js';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Masonry from 'react-masonry-component';
 import User from './User';

var masonryOptions = {
    transitionDuration: 0
};
/**
 *
 类说明：用户喜欢的图片
 @class 类名 Pictures
 @constructor
 */


 @connect(state => ({
  collectuser: state.collectuser,
  pictures:state.pictures,
}))
 @Form.create()

 export default class  Collect extends Component {
    state = {
    data:{},//一张图片的信息
  }
  componentDidMount() {
       const {dispatch} = this.props;
       const { location: {pathname} } = this.props;
       if(pathname === "/owner/paintings"){
        dispatch({type:"collectuser/getPictureCollect"});
       }
        else{
        const id = this.props.match.params.id;
        dispatch({type:"collectuser/getPictureCollect",payload:{id:id}});
      }
  }

  //查看图片信息
  /*data---图片信息
  */
  pictureClick = (item) => {
    const { dispatch } = this.props;
    dispatch({type:'pictures/viewPicture',payload:{id:item._id}})
    .then(()=>{    
    dispatch({type:'pictures/modalStatus',modal:true});
    })
  }

  //上传图片
  add = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/owner/upload'));
  }

  render() {
    const { list } = this.props.collectuser;
    const { picture } = this.props.pictures;
    return (
      <div className={styles.pictures}>

      	<Masonry
            className={ styles.my_gallery} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          <Row gutter={16}>
              {
                list.length > 0 ?
                list.map((item)=>{
                return (
                  <Col xs={12} sm={8} md={6} lg={6} xl={6} style={{"paddingBottom":"20px"}} onClick={()=>{this.pictureClick(item)}}>
                    <PictureCardIndex dispatch={this.props.dispatch} data={item}></PictureCardIndex>
                  </Col>
                  )
                })
                :
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className={styles.no}>还没有喜欢呐<a href="#/owner/view">去逛逛</a></Col>
              }
            
          </Row>
        </Masonry>

        <ViewPicture picture={picture}></ViewPicture>
      </div>
    );
  }
}
