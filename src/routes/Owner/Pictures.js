
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PictureCard from '../../components/PaintingCard/PictureCard.js';
 import Masonry from 'react-masonry-component';

var masonryOptions = {
    transitionDuration: 0
};
/**
 *
 类说明：图片
 @class 类名 Pictures
 @constructor
 */


 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class  Pictures extends Component {


  render() {
   	const list = [
    {"id":1,"title":"feddddd","path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":2,"title":"feddddd","path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":3,"title":"feddddd","path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":4,"title":"feddddd","path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":5,"title":"feddddd","cover_path":"https://images.pexels.com/photos/189536/pexels-photo-189536.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":6,"title":"feddddd","cover_path":"https://images.pexels.com/photos/189536/pexels-photo-189536.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":7,"title":"feddddd","cover_path":"https://images.pexels.com/photos/189536/pexels-photo-189536.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":8,"title":"feddddd","path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
    {"id":9,"title":"feddddd","cover_path":"https://images.pexels.com/photos/189536/pexels-photo-189536.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
   	];
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
                list.map((item)=>{
                return (
                  <Col xs={12} sm={8} md={6} lg={6} xl={6} style={{"paddingBottom":"20px"}}>
                    <PictureCard data={item}></PictureCard>
                  </Col>
                  )
                })
              }
            
          </Row>
        </Masonry>
      </div>
    );
  }
}
