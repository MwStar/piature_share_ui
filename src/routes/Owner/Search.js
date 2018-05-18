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
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Choose from '../../components/PaintingCard/ChoosePaintings';

var masonryOptions = {
    transitionDuration: 0
};
 const Search = Input.Search;
 const TabPane = Tabs.TabPane;
/**
 *
 类说明:首页
 @class 类名 Index
 @constructor
 */
 @connect(state => ({
  pictures:state.pictures,
  search:state.search,
}))
 @Form.create()

 export default class Index extends Component {
  state = {
    data:{},//一张图片的信息
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const name = this.props.match.params.name;
    dispatch({type: 'search/getAllPicture',payload:{key:name}});
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    const { dispatch } = this.props;
    const { page :{pageNum, pageSize, total}, pullUpStatus} = this.props.search;
    let scTop=document.body.scrollTop||Math.round(document.documentElement.scrollTop);
    let clHeight=document.body.clientHeight;
    let scHeight=document.body.scrollHeight;
    if ( pullUpStatus != 4 ) {
             dispatch({type:'search/pullUpStatus',status:1});
        }
    if (pullUpStatus == 1 && scTop+clHeight>=scHeight) { // 发起了加载，那么更新状态
                dispatch({type: 'search/getPicture',
                  payload:{page:{pageNum: pageNum+1, total: total, pageSize: config.PAGE_SIZE}}
                });
            }
  }

  pictureClick = (data) => {
    const { dispatch } = this.props;
    this.setState({data:data},()=>{
    dispatch({type:'pictures/modalStatus',modal:true});
    });
  }



  
  render() {
    const { list ,pullUpStatus ,page} = this.props.search;
    const name = this.props.match.params.name;
    const imagesLoadedOptions = { background: '.my-bg-image-el' }
    const pullUpTips = {
            // 上拉状态（下滚）
            0: '滚动鼠标发起加载',
            1: '滚动即可加载',
            2: '正在加载',
            3: '加载成功',
            4: '到底啦！！没有可以加载的了',
        };
      return (
        <div className={styles.main_img}>
        	<div className={styles.count}>有关“{name}”的图片有{page.total}张</div>
            <Masonry
                className={ styles.my_gallery} // default ''
                elementType={'div'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                //updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={imagesLoadedOptions}
            >
                
                  {
                    list.map((item)=>{
                    return (
                      <div style={{"width":"25%","padding":"10px"}} onClick={()=>{this.pictureClick(item)}}>
                        <PictureCardIndex data={item} dispatch={this.props.dispatch}></PictureCardIndex>
                      </div>
                      )
                    })
                  }
                
            </Masonry>
            <p ref="PullUp" id="#PullUp" className={styles.remind}>{pullUpTips[pullUpStatus]}</p>
            <ViewPicture picture={this.state.data}></ViewPicture>
            <Choose></Choose>
        </div>
    )
  }
}
