import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, /*Avatar*/ message ,Breadcrumb,Row,Col} from 'antd';
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

//const menuData = getLocalStorage("menulist");
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
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  handleMenuClick = ({ key }) => {
    const {dispatch} = this.props;
    switch(key){
      //个人中心
      case "userInfo":
        dispatch(routerRedux.push({ pathname: '/owner/setting' }));
        break;
        //修改密码
      case "Password":
        dispatch({type:'setting/setKey',key:2});
        dispatch({type:'setting/isVisible',visible:true});
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

  render() {
    const {language} = this.state;
    const {currentUser, fetchingNotices,} = this.props;
    const { pathname } = this.props.location;
//    const pathname = hash?hash.match(/\/[a-zA-Z]+\/[a-zA-Z]+/);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item key="userInfo"><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item key="Password"><Icon type="lock" />修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const menus = this.props.menuList.length>0?this.props.menuList:menuData;
    //const menus = getMenuData();
    return (
      <Header className={styles.header}>
        <div>
          <Row>
            <Col span={2}>
              <span className={styles.logo}>
                <Link to="/">
                  <img src={logo} alt="logo" />
                </Link>
              </span>
            </Col>
            <Col span={8} offset={2}>
            	<Menu
    		        mode="horizontal"
    		        selectedKeys={this.getSelectedMenuKeys(pathname)}
    		        style={{ lineHeight: '64px' }}
    		      >
    		      	{menus.map((item)=>{
                  return (<Menu.Item key={item.key || item.path}>
                            <a href={`#${item.path}`}>
                                <span>{item.name}</span>
                            </a>
                          </Menu.Item>)
                })}
    		     </Menu>
            </Col>
            <Col span={12}>
              <span className={styles.right}>
                {currentUser.userFullName ? (
                  <Dropdown overlay={menu}>
                    <span className={`${styles.action} ${styles.account}`}>
                      {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} /> */}
                      {currentUser.userFullName}
                    </span>
                  </Dropdown>
                ) : <Spin size="small" style={{ marginLeft: 8 }} />}
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
