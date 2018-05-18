
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex.js';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Masonry from 'react-masonry-component';

var masonryOptions = {
    transitionDuration: 0
};
/**
 *
 类说明：发现---某一个画集
 @class 类名 PictureDiscover
 @constructor
 */


 @connect(state => ({
  pictures:state.pictures,
  paintings: state.paintings,
}))
 @Form.create()

 export default class  PictureDiscover extends Component {
    state = {
    data:{},//一张图片的信息
  }
  componentDidMount() {
       const {dispatch} = this.props;
       const id = this.props.match.params.id;
       dispatch({type:"paintings/findPaintingById",payload: {id:id}});
       dispatch({type:"paintings/getPaintingInfo",payload: {id:id}});
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


  render() {
    const { pictureList , painting } = this.props.paintings;
    const { picture } = this.props.pictures;
    return (
      <div className={styles.pictures}>
      <p>{painting.title}</p>
      <p>{painting.content}</p>
      	<Masonry
            className={ styles.my_gallery} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
              {
                pictureList.map((item)=>{
                return (
                  <div style={{"width":"25%","padding":"10px"}} onClick={()=>{this.pictureClick(item)}}>
                    <PictureCardIndex data={item}></PictureCardIndex>
                  </div>
                  )
                })
              }
            
        </Masonry>
        <ViewPicture picture={picture}></ViewPicture>
      </div>
    );
  }
}
