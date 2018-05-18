
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Picture.less';
 import PictureCard from '../../components/PaintingCard/PictureCard.js';
 import ViewPicture from '../../components/ViewPictureModal/index';
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
  paintingsuser: state.paintingsuser,
  pictures:state.pictures,
}))
 @Form.create()

 export default class  Pictures extends Component {
    state = {
    data:{},//一张图片的信息
  }
  componentDidMount() {
       const {dispatch} = this.props;
       const id = this.props.match.params.id;
       dispatch({type:"paintingsuser/findPaintingById",payload: {id:id}});
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

  //返回
  back = () => {
    /*const { history } = this.props;
    history.go(-1);*/
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/owner/paintings'));
  }

  render() {
    const { pictureList } = this.props.paintingsuser;
    const id = this.props.match.params.id;
    const { picture } = this.props.pictures;
    return (
      <div className={styles.pictures}>
      <div onClick={this.back} className={styles.back}>返回画集</div>
      	<Masonry
            className={ styles.my_gallery} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
        <div className={styles.add}>
          <a onClick={this.add}>
          <i className="iconfont icon-add"></i>
          <p>上传图片</p>
          </a>
        </div>
          
              {
                pictureList.map((item)=>{
                return (
                  <div style={{"width":"25%","padding":"10px"}} onClick={()=>{this.pictureClick(item)}}>
                    <PictureCard data={item} id={id} match={this.props.match}></PictureCard>
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
