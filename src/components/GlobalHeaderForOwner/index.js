import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar , message ,Breadcrumb,Row,Col} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import {routerRedux} from 'dva/router';
import { Link } from 'dva/router';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import styles from './index.less';
import UserPassword from '../../components/ModifiPassword/index';
import logo from '../../assets/logo.svg';
import { getMenuData } from '../../common/menuOwner';
import {getLocalStorage,setLocalStorage } from '../../utils/utils';
import {config} from '../../utils/config';
import defaultAvatar from '../../assets/avatarDefault.png';

const token = getLocalStorage("Token");
const menuData = getMenuData();

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  language = getLocalStorage('language');
   constructor(props) {
    super(props);
    //this.menus = getMenuData();
    this.state={
      language:this.language,
    }
  }
  /*componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }*/
  //获取消息
  getNoticeData() {
    const { notices ,currentUser } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { };
      if (notice.create_at) {
        newNotice.create_at = moment(notice.create_at).fromNow();
      }
      // transform id to item key
      if (notice._id) {
        newNotice.key = notice._id;
      }
      if(notice.type === '1'){
        newNotice.title = notice.master.name+"评论了你的"+"'"+notice.img.title+"'"+"图片";
        newNotice.imgId = notice.img._id;
        newNotice.description = notice.reply.content;
      }
      else if(notice.type === '1'){
        newNotice.title = notice.master.name+"在图片"+notice.img.title+"回复了你";
        newNotice.imgId = notice.img._id;
        newNotice.description = notice.reply.content;
      }
      else{
        newNotice.title = notice.master.name+"关注了你";
      }
      if(notice.master.avatar){newNotice.avatar = notice.master.avatar;}
      else{newNotice.avatar = defaultAvatar;}

      newNotice.master = notice.master;
      newNotice.level = notice.type;
      newNotice.type = '消息';
      /*if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }*/
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  //清空消息
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  //
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  ItemClick = (item, tabProps) => {
    console.log(item, tabProps);
    const {dispatch} = this.props;
    if(item.level === '1'|| item.level === '2'){
      dispatch({type:'pictures/viewPicture',payload:{id:item.imgId}})
      .then(()=>{    
      dispatch({type:'pictures/modalStatus',modal:true});
      })
    }
    else{
      dispatch(routerRedux.push('/owner/user/'+item.master._id));
    }
    this.props.dispatch({
      type: 'global/clearOneNotices',
      payload: {id:item.key},
    });
  }

  handleMenuClick = ({ key }) => {
    const {dispatch} = this.props;
    switch(key){
      //个人中心
      case "userInfo":
        dispatch(routerRedux.push({ pathname: '/owner/paintings' }));
        break;
        //设置
      case "Password":
        dispatch(routerRedux.push({ pathname: '/owner/setting' }));
        break;
        //登出
      case "logout":
        dispatch({type: 'login/logout'});
        break;
    }
  }

  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
        keys.push(item.path);
    });
    return keys;
  }

  getSelectedMenuKeys = (path) => {
    const menus = this.props.menuList.length>0?this.props.menuList:menuData;
    const flatMenuKeys = this.getFlatMenuKeys(menus);

    /*if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
      return [path.replace(/^\//, '')];
    }
    if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
      return [path.replace(/^\//, '').replace(/\/$/, '')];
    }*/
    return flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      //return itemRegExp.test(path.replace(/^\//, ''));
      return itemRegExp.test(path);
    });
  }

  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path && item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      }  
      return
        (
          <Menu.Item key={item.key || item.path}>
              <a href={itemPath} target={item.target}>
                  <span>{item.name}</span>
              </a>
          </Menu.Item>
        );
    });
  }

  handleLanguage = (language) => {
      setLocalStorage("language",language);
      window.location.reload()
  };

  menuClick = (e) => {
    if(e.key === '/owner/paintings' && !token){
      message.info('请先登录！');
    }
  }

  /*disabled = (path) => {
    if(path === '/owner/paintings' && !token){
      return true;
    }
    else{
      return false;
    }
  }*/

  render() {
    const {language} = this.state;
    const {currentUser, fetchingNotices,notices} = this.props;
    const { pathname } = this.props.location;
//    const pathname = hash?hash.match(/\/[a-zA-Z]+\/[a-zA-Z]+/);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item key="userInfo"><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item key="Password"><Icon type="lock" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const menus = this.props.menuList.length>0?this.props.menuList:menuData;
    const noticeData = this.getNoticeData();
    //const menus = getMenuData();
    return (
      <Header className={styles.header}>
        <div>
          <Row>
            <Col span={2}>
              <span className={styles.logo}>
                <a href="/owner/view">
                  <img src={logo} alt="logo" />
                </a>
                {/*<span className={styles.logoname}>Colorful</span>*/}
              </span>
            </Col>
            <Col span={8} offset={2}>
            	<Menu
    		        mode="horizontal"
                onClick={this.menuClick}
    		        selectedKeys={this.getSelectedMenuKeys(pathname)}
    		        style={{ lineHeight: '64px' }}
    		      >
    		      	{menus.map((item)=>{
                  return (
                    <Menu.Item key={item.key || item.path} /*disabled={this.disabled(item.path)}*/>
                            <a href={`#${item.path}`}>
                                <span>{item.name}</span>
                            </a>
                    </Menu.Item>
                          )
                })}
    		     </Menu>
            </Col>
            <Col span={12}>
              <span className={styles.right}>
                {currentUser.name?<NoticeIcon
                  className={styles.action}
                  count={notices.length}
                  onItemClick={this.ItemClick}
                  onClear={this.handleNoticeClear}
                  onPopupVisibleChange={this.handleNoticeVisibleChange}
                  loading={fetchingNotices}
                  popupAlign={{ offset: [20, -16] }}
                >
                  <NoticeIcon.Tab
                    list={noticeData['消息']}
                    title="消息"
                    emptyText="你已查看所有通知"
                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                  />
                </NoticeIcon>:''}
                {currentUser.name ? (
                  <Dropdown overlay={menu}>
                    <span className={`${styles.action} ${styles.account}`}>
                      <Avatar size="small" className={styles.avatar} src={currentUser.avatar?config.CHRCK_FILE+currentUser.avatar:defaultAvatar} />
                      {currentUser.name}
                    </span>
                  </Dropdown>
                ) : <span><a href="#/user/register" style={{marginRight:"10px"}}>注册</a><a href="#/user/login">登录</a></span>}
                {/*<span className={styles.language}>
                    {(language==="en-us")?<a onClick={()=>{this.handleLanguage("zh-cn")}}>中文</a>
                    :<a onClick={()=>{this.handleLanguage("en-us")}}>English</a>}
                </span>*/}
              </span>
            </Col>  
          </Row>
        </div>
        <UserPassword></UserPassword>
      </Header>
    );
  }
}
