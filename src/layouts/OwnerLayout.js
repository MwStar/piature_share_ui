import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import GlobalHeaderForOwner from '../components/GlobalHeaderForOwner';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class OwnerLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Hoymiles';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - hoymiles`;
    }
    return title;
  }
  render() {
    const {
      currentUser, fetchingNotices, notices, routerData, match, location, dispatch,menuList
    } = this.props;
    const layout = (
        <Layout>
          <GlobalHeaderForOwner
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            location={location}
            dispatch={dispatch}
            menuList={menuList}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item =>
                    (
                      <Route
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/user/login" />
                <Route render={NotFound} />
              </Switch>
            </div>
         
          </Content>
        </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  menuList:state.login.menuList,
}))(OwnerLayout);