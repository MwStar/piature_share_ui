
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PictureCard from '../../components/PaintingCard/PictureCard.js';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Choose from '../../components/PaintingCard/ChoosePaintings';
 import Masonry from 'react-masonry-component';
 import User from './User';

var masonryOptions = {
    transitionDuration: 0
};
/**
 *
 类说明：用户采集的图片（包含原创图片）
 @class 类名 Pictures
 @constructor
 */


 @connect(state => ({
  pictureuser: state.pictureuser,
  pictures:state.pictures,
}))
 @Form.create()

 export default class  Gather extends Component {
    state = {
    data:{},//一张图片的信息
  }
  componentDidMount() {
       const {dispatch} = this.props;
       const { location: {pathname} } = this.props;
       if(pathname === "/owner/paintings"){
        dispatch({type:"pictureuser/getAllPicture"});
       }
        else{
        const id = this.props.match.params.id;
        dispatch({type:"pictureuser/getAllPicture",payload:{id:id}});
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
    const { list } = this.props.pictureuser;
    const { location: {pathname} } = this.props;
    console.log("path---",pathname);
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
          
              {
                list.length > 0 ?
                list.map((item)=>{
                return (
                  <div style={{"width":"25%","padding":"10px"}} onClick={()=>{this.pictureClick(item)}}>
                    {pathname === "/owner/paintings"?
                    <PictureCard data={item}></PictureCard>
                    : 
                    <PictureCardIndex data={item}></PictureCardIndex>
                    }
                  </div>
                  )
                })
                :
              <div className={styles.no}>还没有采集呐<a href="#/owner/view">去逛逛</a></div>
              }
            
        </Masonry>
        <ViewPicture picture={picture}></ViewPicture>
        <Choose></Choose>
      </div>
    );
  }
}
