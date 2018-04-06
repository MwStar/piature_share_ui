import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';
import { addLocaleData, IntlProvider } from 'react-intl';
import { getRouterData } from './common/router';;
import { getPlainNode,getLanguage } from './utils/utils';
import trans_zh from './translations/zh_cn.json';
import trans_en from './translations/en_us.json';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import styles from './index.less';
//需要本地化的语言
addLocaleData([...en, ...zh]);
//获取本地语言


const  languageWithoutRegionCode =getLanguage();

const messages = languageWithoutRegionCode =='zh-cn'?trans_zh:trans_en;
const localeLanguage = languageWithoutRegionCode == "zh-cn"?zhCN:enUS;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});
function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const OwnerLayout = routerData['/owner'].component;
  return (
    <LocaleProvider locale={localeLanguage}>
    <IntlProvider locale={languageWithoutRegionCode} messages={messages}>
      <Router history={history}>
        <Switch>
          <Route path="/owner" render={props => <OwnerLayout {...props} />} />
          <Route path="/user" render={props => <UserLayout {...props} />} />
          <Route path="/" render={props => <BasicLayout {...props} />} />
        </Switch>
      </Router>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default RouterConfig;
