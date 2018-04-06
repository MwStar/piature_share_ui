
//import { warningList} from '../services/warning';
import {message} from 'antd';
import {config} from '../utils/config'
export default {
  namespace: 'view',

  state: {
    info: {},//电站信息
    alarm:{},//告警信息
    install:{},//安装商信息
    currInfo:{},//统计信息
    rate:[],//分钟功率趋势图数据
    power:[],//发电量统计图
    list:[],//告警具体表格信息
    weather:[],//天气信息
    pagination: {pageNum: 0, total: 0, pageSize: config.PAGE_SIZE},
    loading: false,
  },

  effects: {
    

  },

  reducers: {
    

  },
};
