/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form,Tag} from 'antd';
 import Masonry from 'react-masonry-component';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import styles from './index.less';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex.js';

var masonryOptions = {
    transitionDuration: 0
};
 const Search = Input.Search;
 const TabPane = Tabs.TabPane;
/**
 *
 类说明：电站详情
 @class 类名 StationDetails
 @constructor
 */
 @connect(state => ({
  pictures:state.pictures,
}))
 @Form.create()

 export default class Station extends Component {
  state = {

  }

  componentDidMount() {
    /*const {dispatch} = this.props;
    dispatch({type: 'station/queryList',payload:{}});*/
  }



  
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
        <div>
          <div className={styles.banner}>
              <div className={styles.info}>
                <span className={styles.logoname}>Liangli12121</span>
                <Search
              placeholder="search by color"
              onSearch={value => console.log(value)}
              className={styles.search}
                />
                <div className={styles.tags}>
                  <Tag color="pink">pink</Tag>
                  <Tag color="red">red</Tag>
                  <Tag color="orange">orange</Tag>
                  <Tag color="green">green</Tag>
                  <Tag color="cyan">cyan</Tag>
                  <Tag color="blue">blue</Tag>
                  <Tag color="purple">purple</Tag>
                </div>  
              </div>
            </div>


            <div className={styles.main}>
              <div className={styles.main_img}>
                <Masonry
                    className={ styles.my_gallery} // default ''
                    elementType={'div'} // default 'div'
                    options={masonryOptions} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                >
                  <Row gutter={32}>
                    
                      {
                        list.map((item)=>{
                        return (
                          <Col xs={12} sm={8} md={6} lg={6} xl={6} style={{"paddingBottom":"20px"}}>
                            <PictureCardIndex data={item}></PictureCardIndex>
                          </Col>
                          )
                        })
                      }
                    
                  </Row>
                </Masonry>
              </div>
              {/*<Button onClick={this.getImg}>1111</Button>*/}
            </div>
        </div>
    )
  }
}
