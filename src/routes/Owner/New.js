/**
 *  desc: 最新--图片
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form,Tag} from 'antd';
 import Masonry from 'react-masonry-component';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 import styles from './index.less';
 import PictureCardIndex from '../../components/PaintingCard/PictureCardIndex.js';
 import ViewPicture from '../../components/ViewPictureModal/index';

var masonryOptions = {
    transitionDuration: 0
};
 const Search = Input.Search;
 const TabPane = Tabs.TabPane;

 @connect(state => ({
  pictures:state.pictures,
  new:state.new,
}))
 @Form.create()

 export default class New extends Component {
  state = {
    data:{},//一张图片的信息
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'new/getAllPicture',payload:{}});
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    const { dispatch } = this.props;
    const { page :{pageNum, pageSize, total}, pullUpStatus} = this.props.new;
    let scTop=document.body.scrollTop||Math.round(document.documentElement.scrollTop);
    let clHeight=document.body.clientHeight;
    let scHeight=document.body.scrollHeight;
    if ( pullUpStatus != 4 ) {
             dispatch({type:'new/pullUpStatus',status:1});
        }
    if (pullUpStatus == 1 && scTop+clHeight>=scHeight) { // 发起了加载，那么更新状态
                dispatch({type: 'new/getPicture',
                  payload:{page:{pageNum: pageNum+1, total: total, pageSize: pageSize}}
                });
            }
  }

  pictureClick = (item) => {
    const { dispatch } = this.props;
    dispatch({type:'pictures/viewPicture',payload:{id:item._id}})
    .then(()=>{    
    dispatch({type:'pictures/modalStatus',modal:true});
    })
  }



  
  render() {
    const { list , pullUpStatus } = this.props.new;
    const { picture } = this.props.pictures;
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
                <Masonry
                    className={ styles.my_gallery} // default ''
                    elementType={'div'} // default 'div'
                    options={masonryOptions} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
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
            <ViewPicture picture={picture}></ViewPicture>
        </div>
    )
  }
}
