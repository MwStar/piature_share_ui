/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form,Tag} from 'antd';
 import Masonry from 'react-masonry-component';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import iScroll from "iscroll/build/iscroll-probe";
 import styles from './index.less';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex';
 import ViewPicture from '../../components/ViewPictureModal/index';
 import Choose from '../../components/PaintingCard/ChoosePaintings';
 import {config} from '../../utils/config';

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
  allpicture:state.allpicture,
}))
 @Form.create()

 export default class Index extends Component {
  state = {
    data:{},//一张图片的信息
  }
  
  //this.onScroll = this.onScroll.bind(this);
  //this.onScrollEnd = this.onScrollEnd.bind(this);

  componentDidMount() {
    const {dispatch} = this.props;
    /*const options = {
            // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
            preventDefault: true,
            // 禁止缩放
            zoom: false,
            // 支持鼠标事件，因为我开发是PC鼠标模拟的
            mouseWheel: true,
            // 滚动事件的探测灵敏度，1-3，越高越灵敏，兼容性越好，性能越差
            probeType: 3,
            // 拖拽超过上下界后出现弹射动画效果，用于实现下拉/上拉刷新
            bounce: true,
            // 展示滚动条
            scrollbars: false,
        };
        this.iScrollInstance = new iScroll('#wrapper', options);
        this.iScrollInstance.on('scroll', this.onScroll.bind(this));
        this.iScrollInstance.on('scrollEnd', this.onScrollEnd.bind(this));*/
    dispatch({type: 'allpicture/getAllPicture',payload:{}});
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  pictureClick = (item) => {
    const { dispatch } = this.props;
    dispatch({type:'pictures/viewPicture',payload:{id:item._id}})
    .then(()=>{    
    dispatch({type:'pictures/modalStatus',modal:true});
    })
    
  }
  handleScroll(event) {
    const { dispatch } = this.props;
    const { page :{pageNum, pageSize, total}, pullUpStatus} = this.props.allpicture;
    let scTop=document.body.scrollTop||Math.round(document.documentElement.scrollTop);
    let clHeight=document.body.clientHeight;
    let scHeight=document.body.scrollHeight;
    if ( pullUpStatus != 4 ) {
             dispatch({type:'allpicture/pullUpStatus',status:1});
        }
    if (pullUpStatus == 1 && scTop+clHeight+200>=scHeight) { // 发起了加载，那么更新状态
                dispatch({type: 'allpicture/getPicture',
                  payload:{page:{pageNum: pageNum+1, total: total, pageSize: config.PAGE_SIZE}}
                });
            }
  }
  onScroll() {
    const { dispatch } = this.props;
    const { pullUpStatus } = this.props.allpicture;
    if ( pullUpStatus != 4 && this.iScrollInstance.y <= this.iScrollInstance.maxScrollY + 5) {
             dispatch({type:'allpicture/pullUpStatus',status:1});
        }
  }
  onScrollEnd() {
    const { dispatch } = this.props;
    const { page :{pageNum, pageSize, total}, pullUpStatus} = this.props.allpicture;
    if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY) {
            if (pullUpStatus == 1) { // 发起了加载，那么更新状态
                dispatch({type: 'allpicture/getPicture',
                  payload:{page:{pageNum: pageNum+1, total: total, pageSize: pageSize}}
                });
            }
        }
  }

  search = (value) => {
    console.log("value---",value);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/owner/search/'+value));
  }



  
  render() {
    const { list ,pullUpStatus} = this.props.allpicture;
    const { picture } = this.props.pictures;
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
        <div>
          <div className={styles.banner}>
              <div className={styles.info}>
                <span className={styles.logoname}>Colorful</span>
                <Search
              placeholder="search for more pictures"
              onSearch={this.search}
              className={styles.search}
                />
                {/*<div className={styles.tags}>
                  <Tag color="pink">pink</Tag>
                  <Tag color="red">red</Tag>
                  <Tag color="orange">orange</Tag>
                  <Tag color="green">green</Tag>
                  <Tag color="cyan">cyan</Tag>
                  <Tag color="blue">blue</Tag>
                  <Tag color="purple">purple</Tag>
                </div>*/}  
              </div>
            </div>


            <div className={styles.main}>
              <div className={styles.main_img} id="wrapper">
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
              </div>
              <p ref="PullUp" id="#PullUp" className={styles.remind}>{pullUpTips[pullUpStatus]}</p>
            </div>
            <ViewPicture picture={picture}></ViewPicture>
            <Choose></Choose>
        </div>
    )
  }
}
