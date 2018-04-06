import React, { Component } from 'react';
import { connect } from 'dva';
// import * as d3 from 'd3';
import d3 from 'd3';
import styles from './d3Demo.less';
import { Slider, Icon, Button, Form, Input, Select, Dropdown, Card, DatePicker, Row, Col  } from 'antd';
import { ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart } from '../../../components/Charts';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

@connect(state => ({
  stationReplay: state.stationReplay,
}))
@Form.create()

export default class d3Demo extends Component {
  state={
    sliderValue: 0,
    sliderMax: 3,
    replay: null,
    dataSetList: [],
    svgDom: null,
    svgLegend: null,
    stationId: 55,
    timeType: 'HH:MM',
    granularity: 'minute',
    exhibitionIndex: 0,
    playSpeed: 1000,
  }

  componentDidMount() {
     // 设置渲染的数组
     const dataSetListOne = [{ xAxsis: '1', yAxsis: '1', value: '10' }, { xAxsis: '2', yAxsis: '1', value: '10' }, { xAxsis: '5', yAxsis: '1', value: '6' }, { xAxsis: '3', yAxsis: '1', value: '6' }, { xAxsis: '2', yAxsis: '2', value: '0.5' }, { xAxsis: '1', yAxsis: '2', value: '20' }, { xAxsis: '1', yAxsis: '3', value: '30' }, { xAxsis: '1', yAxsis: '4', value: '40' }];
     const dataSetListTwo = [{ xAxsis: '1', yAxsis: '1', value: '10' }, { xAxsis: '5', yAxsis: '1', value: '6' }, { xAxsis: '3', yAxsis: '1', value: '46' }, { xAxsis: '2', yAxsis: '2', value: '41' }, { xAxsis: '1', yAxsis: '2', value: '50' }, { xAxsis: '1', yAxsis: '3', value: '23' }, { xAxsis: '1', yAxsis: '4', value: '12' }];
     const dataSetListThree = [{ xAxsis: '1', yAxsis: '1', value: '20' }, { xAxsis: '5', yAxsis: '1', value: '32' }, { xAxsis: '3', yAxsis: '1', value: '32' }, { xAxsis: '2', yAxsis: '2', value: '12' }, { xAxsis: '1', yAxsis: '2', value: '30' }, { xAxsis: '1', yAxsis: '3', value: '31' }, { xAxsis: '1', yAxsis: '4', value: '42' }];
     const dataSetListFour = [{ xAxsis: '1', yAxsis: '1', value: '20' }, { xAxsis: '5', yAxsis: '1', value: '32' }, { xAxsis: '3', yAxsis: '1', value: '32' }, { xAxsis: '2', yAxsis: '2', value: '12' }, { xAxsis: '1', yAxsis: '2', value: '30' }, { xAxsis: '1', yAxsis: '3', value: '31' }, { xAxsis: '1', yAxsis: '4', value: '42' }];
     let dataSetList= [dataSetListOne, dataSetListTwo, dataSetListThree, dataSetListFour];
     const self = this;
    this.setState({
      dataSetList,
    },()=>{
      this.initialSvgChart(); // 初始化svg图
      this.drawThumb();
    })
    
    this.getLineData(); // 获取折线图数据
    // 初始化高度
    this.initialHeight();
    window.addEventListener('resize', this.reasize);
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.reasize);
  }

  /*------------------------ 初始化刚发 ----------------------------------*/ 
  initialSvgChart = () => { // 初始化chart图
    const { dataSetList, sliderValue } = this.state;
    const screenWidth = document.body.clientWidth - 400;
    let margin = { top: 0, right: 10, bottom: 0, left: 10 },
      width = screenWidth - margin.left - margin.right,
      gridSize = Math.floor(width / 25),
      height = gridSize * 9,
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'], // alternatively colorbrewer.YlGnBu[9]
      yAxsis = ['1', '2', '3', '4', '5', '6', '7'],
      xAxsis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];


      const zoom = d3.behavior.zoom() // 缩放
      .scaleExtent([0.5, 10])
      .on('zoom', zoomed);

    // const svgLegendContainer = d3.select('#chart').append('svg') // 创建svg图
    //   .attr('width', '600px')
    //   .attr('height', '100px')
    //   .attr('transform', `translate(${margin.left},${margin.top})`);

    const svgContainer = d3.select('#chart').append('svg') // 创建svg图
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(zoom);

      
    

    const svg = svgContainer.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
   
    // const dayLabels = svg.selectAll('.dayLabel') // y轴坐标系
    //   .data(yAxsis)
    //   .enter().append('text')
    //   .text((d) => { return d; })
    //   .attr('x', 0)
    //   .attr('y', (d, i) => { return i * gridSize * 2.5; })
    //   .style('text-anchor', 'end')
    //   .attr('transform', `translate(-6,${gridSize / 1.5})`)
    //   .attr('class', (d, i) => { return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis'); });

    // const timeLabels = svg.selectAll('.timeLabel') // x轴坐标系
    //   .data(xAxsis)
    //   .enter().append('text')
    //   .text((d) => { return d; })
    //   .attr('x', (d, i) => { return i * gridSize * 1.5; })
    //   .attr('y', 0)
    //   .style('text-anchor', 'middle')
    //   .attr('transform', `translate(${gridSize / 2}, -6)`)
    //   .attr('class', (d, i) => { return ((i >= 7 && i <= 16) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis'); });

    this.setState({ // 保存svg为全局变量
      svgDom: svg,
    },()=>{
      dataSetList[0].forEach((item)=>{
        this.initialHeatMap(svg, item,dataSetList[0])
      })
    })

    function zoomed() { // 缩放
      console.log(d3.event);
			  svg.attr('transform', `translate(${d3.event.translate})scale(${d3.event.scale})`);
    }
  }

  initialHeatMap = (svg, data, dataList) =>{
    const svgChildNodes = svg[0][0].childNodes; // 清除已渲染的svg图
    if (svgChildNodes.length >0 ){
      svgChildNodes.forEach((item) =>{
        item.remove();
      })
    }
    const screenWidth = document.body.clientWidth - 400;
    let margin = { top: 0, right: 10, bottom: 0, left: 10 },
      width = screenWidth - margin.left - margin.right,
      gridSize = Math.floor(width / 25),
      height = gridSize * 9,
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'], // alternatively colorbrewer.YlGnBu[9]
      yAxsis = ['1', '2', '3', '4', '5', '6', '7'],
      xAxsis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
      const colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(dataList, (d) => { return d.value; })])
        .range(colors);


      const cards = svg.selectAll('.xAxsis')
        .data(dataList, (d) => { return `${d.yAxsis}:${d.xAxsis}`; });
      // cards.append('title');

      const g = cards.enter().append('g') // 将显示文字和矩形框都append入g中
        .style('fill', colors[0])
        .data(dataList, (d) => { return `${d.yAxsis}:${d.xAxsis}`; });


      g.append('rect') // 每一个组件
        .attr('x', (d) => { return (d.xAxsis - 1) * gridSize * 1.5; })
        .attr('y', (d) => { return (d.yAxsis - 1) * gridSize * 2; })
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'hour bordered')
        .attr('width', gridSize)
        .attr('height', gridSize * 1.8)
        .style('margin-bottom', '20')
        .attr('stroke', '#E6E6E6')
        .attr('stroke-width', '2px')
        .on('click', (d) => { // 鼠标点击事件
          console.log(d);
        });

      const text = g.append('text').text((d) => { return d.value + 'KWH'; }).attr('fill', 'salmon') // 添加值描述文字
        .attr('x', (d) => { return (gridSize / 2 + (d.xAxsis - 1) * gridSize)*1.5 + 4; })
        .attr('y', (d) => { return (gridSize / 2 + (d.yAxsis - 1) * gridSize) * 2 - 20; })
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('dy', 8);

        const textPosition = g.append('text').text((d) => { return d.xAxsis+ '-' + d.yAxsis; }).attr('fill', 'salmon') // 添加位置描述文字
        .attr('x', (d) => { return (gridSize / 2 + (d.xAxsis - 1) * gridSize) * 1.5 - 5; })
        .attr('y', (d) => { return (gridSize / 2 + (d.yAxsis - 1) * gridSize) * 2 + 30; })
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('color', '#fff')
        .attr('dy', 8);


      g.transition().duration(0) // 回放时填充颜色
        .style('fill', (d) => { return colorScale(d.value); });

      g.select('title').text((d) => { return d.value; });

      g.exit().remove();

      const legend = svg.selectAll('.legend')
        .data([0].concat(colorScale.quantiles()), (d) => { return d; });

      legend.enter().append('g')
        .attr('class', 'legend');

      legend.append('rect')
        .attr('x', (d, i) => { return legendElementWidth * i; })
        .attr('y', height)
        .attr('width', legendElementWidth)
        .attr('height', gridSize / 2)
        .style('fill', (d, i) => { return colors[i]; });

      legend.append('text')
        .attr('class', 'mono')
        .text((d) => { return `≥ ${Math.round(d)}`; })
        .attr('x', (d, i) => { return legendElementWidth * i; })
        .attr('y', height + gridSize);

      legend.exit().remove();
  }


  drawThumb=()=>{ // 渲染缩略图
    const { dataSetList, sliderValue } = this.state;
    const screenWidth = document.body.clientWidth - 400;
    let margin = { top: 0, right: 10, bottom: 0, left: 10 },
      width = screenWidth - margin.left - margin.right,
      gridSize = Math.floor(width / 25),
      height = gridSize * 9,
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'], // alternatively colorbrewer.YlGnBu[9]
      yAxsis = ['1', '2', '3', '4', '5', '6', '7'],
      xAxsis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];

      const drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        //.inertia(true)
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

      const svgContainer = d3.select('#thumbMap').append('svg') // 创建svg图
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const svg = svgContainer.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      dataSetList[0].forEach((item)=>{
        this.initialThumbMap(svg, item,dataSetList[0])
      }) 
      
      // 拖动
      // function dragstarted(d) {
      //   d3.event.sourceEvent.stopPropagation();
      //   d3.select(this).classed("dragging", true);
      // }
  
      // function dragged(d) {
      //   console.log(d);
      //   //console.log(this);
      //   // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      // }
  
      // function dragended(d) {
      //   d3.select(this).classed("dragging", false);
      // }
    }

    initialThumbMap = (svg, data, dataList) =>{ // 初始化缩略图
      const svgChildNodes = svg[0][0].childNodes; // 清除已渲染的svg图
      if (svgChildNodes.length >0 ){
        svgChildNodes.forEach((item) =>{
          item.remove();
        })
      }
      const screenWidth = 200;
      let margin = { top: 0, right: 10, bottom: 0, left: 10 },
        width = screenWidth - margin.left - margin.right,
        gridSize = Math.floor(width / 10),
        height = gridSize * 9,
        legendElementWidth = gridSize * 2,
        buckets = 9,
        colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'], // alternatively colorbrewer.YlGnBu[9]
        yAxsis = ['1', '2', '3', '4', '5', '6', '7'],
        xAxsis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
        const colorScale = d3.scale.quantile()
          .domain([0, buckets - 1, d3.max(dataList, (d) => { return d.value; })])
          .range(colors);
  
  
        const cards = svg.selectAll('.xAxsis')
          .data(dataList, (d) => { return `${d.yAxsis}:${d.xAxsis}`; });
        // cards.append('title');
  
        const g = cards.enter().append('g') // 将显示文字和矩形框都append入g中
          .style('fill', colors[5])
          .data(dataList, (d) => { return `${d.yAxsis}:${d.xAxsis}`; });
  
  
        g.append('rect') // 每一个组件
          .attr('x', (d) => { return (d.xAxsis - 1) * gridSize * 1.5; })
          .attr('y', (d) => { return (d.yAxsis - 1) * gridSize * 2; })
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('class', 'hour bordered')
          .attr('width', gridSize)
          .attr('height', gridSize * 1.8)
          .style('margin-bottom', '20')
          .attr('stroke', '#E6E6E6')
          .attr('stroke-width', '2px');
    }
  

  initialHeight = () => { // 初始化chart宽高
    // 定义chart高度
    const screenY = document.documentElement.clientHeight; // 浏览器高度
    const autoTable = document.querySelector('#chartContainer');
    const arrayContainer = document.querySelector('#arrayContainer');
    const screenTop = autoTable.offsetTop; // 距离顶端高度
    const autoHeight = `${screenY - screenTop - 500}px`;
    autoTable.style.height = autoHeight;
    arrayContainer.style.height = autoHeight;
    // 定义chart宽度
    // const screenWidth = document.body.clientWidth;
    // autoTable.style.width = screenWidth - 400 + 'px';
  }

  reasize = () => { // resize时宽高
    // 定义chart高度
    const screenY = document.documentElement.clientHeight; // 浏览器高度
    const autoTable = document.querySelector('#chartContainer');
    const arrayContainer = document.querySelector('#arrayContainer');
    const screenTop = autoTable.offsetTop; // 距离顶端高度
    const autoHeight = `${screenY - screenTop - 500}px`;
    autoTable.style.height = autoHeight;
    arrayContainer.style.height = autoHeight;
     // 定义chart宽度
    // const screenWidth = document.body.clientWidth;
    // autoTable.style.width = screenWidth - 400 + 'px';
  }

  /* ----------------------- 页面操作 ----------------------------------- */

  handleReplay = () => { // 设置定时器
    const { sliderValue, sliderMax, replay, svgDom, dataSetList, playSpeed } = this.state;
    const self = this;
    let i = sliderValue+1;
    clearInterval(replay);
    const replayTimeInterval = setInterval(() => {
      if (i > sliderMax) {
        clearInterval(replay);
      }else{
        self.setState({
          replay: replayTimeInterval,
          sliderValue: i,
          dataSetList: dataSetList,
        },()=>{
          dataSetList[i].forEach((item) => { // 渲染数据
            this.initialHeatMap(svgDom, item, dataSetList[i]);
          });
        });
        i++;
      }
    }, playSpeed);
  }

  onChange = (value) => { // 滑动条值改变时清理定时器。设置value值
    const { replay, dataSetList, svgDom } = this.state;
    clearInterval(replay);
    this.setState({ sliderValue: value },()=>{
      dataSetList[value].forEach((item) => { // 渲染数据
        this.initialHeatMap(svgDom, item, dataSetList[value]);
      });
    });
  }

  tipFormatter = (value) => { // 滑动条显示提示
    console.log(value)
    if(value==60){
      return 1111
    } else {
      return 'wwwww'
    }
  }
  /* --------------------- 页面请求 ------------------------- */

  getLineData = () => {
    const { dispatch } = this.props;
    const { stationId, granularity } = this.state;
    const payload = {
      dayTime: '2018-02-01 00:00:00',
      stationId,
      granularity: granularity,
      type: 2,
    };
    dispatch({
      type: 'stationReplay/getAllLineData',
      payload,
    });
  }

  handleSearch = (e) => { // 查询
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
    });
  }

  /* -------------------- 数据处理 -------------------------- */
  setLineData = (val) =>{
    const { stationId, exhibitionIndex } = this.state;
    const lineDataList = val;
    const resetLineData = [];
    console.log(val)
    if(lineDataList[stationId]){
      if(exhibitionIndex == '0'){
        lineDataList[stationId].forEach((item)=>{
          resetLineData.push({
            x: this.parseLineTime(item.create_at),
            y: item.mi_pn_hz,
            type: item.station_id.toString(),
          });
        })
      }else{
        lineDataList[stationId].forEach((item)=>{
          resetLineData.push({
            x: this.parseLineTime(item.create_at),
            y: item.mi_td_total,
            type: item.station_id.toString(),
          });
        })
      }
      
      return resetLineData;
    }
  }

  // 将时间转换为时间戳
  parseLineTime = (val) => {
    const date = new Date(val);
    const parseTime = Date.parse(date);
    return parseTime;
  }


  /*---------------表单操作---------------------*/ 
  handleExhibitionChange = (val) => {
    console.log(val)
  }
  handleLayoutChange = (val) => {
    console.log(val)
    let exhibitionIndex = 0;
    if(val == '0'){
      exhibitionIndex=0;
    }else{
      exhibitionIndex=1;
    }
    this.setState({
      exhibitionIndex,
    })
  }
  handleTimeTypeChange = (val) =>{
    if(val == '0'){
      this.setState({
        timeType: 'HH:MM',
        granularity: 'minute'
      }, ()=>{
        this.getLineData();
      })
    }else{
      this.setState({
        timeType: '20yy-mm-dd HH:MM',
        granularity: 'day' // 暂时没有周选择
      }, ()=>{
        this.getLineData();
      })
    }
  }
  handleplaySpeedChange = (val) => {
    let speed = 1000;
    if(val == 0){
      speed = 500;
    } else if(val == '1'){
      speed = 1000;
    }else{
      speed = 1500;
    }
    this.setState({
      playSpeed: speed,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { stationReplay: { lineData } } = this.props;
    const { timeType } = this.state;
    console.log(lineData)
    return (
      <div className={styles.stationReplayContainer}>
      <Card bordered={false}>
        <div className={styles.formContainer}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <FormItem label="布局展示:">
            {getFieldDecorator('layoutDisplay')(
              <Select placeholder="请选择" onChange={this.handleLayoutChange} style={{ width: '100px' }}>
                <Option value="0">物理图</Option>
                <Option value="1">通讯图</Option>
                <Option value="2">安装地图</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="展示指标:">
            {getFieldDecorator('exhibition')(
              <Select placeholder="请选择" onChange={this.handleExhibitionChange} style={{ width: '100px' }}>
                <Option value="0">功率</Option>
                <Option value="1">发电量</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="回放周期:">
            {getFieldDecorator('replayCyc')(
              <Select placeholder="请选择" onChange={this.handleTimeTypeChange} style={{ width: '80px' }}>
                <Option value="0">日</Option>
                <Option value="1">周</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
          {getFieldDecorator('datePick')(
               <DatePicker format={dateFormat} placeholder="请选择"/>
            )}
          </FormItem>
          <Button type="primary" onClick={this.handleReplay}>回放</Button>
          <FormItem label="播放速度:">
          {getFieldDecorator('playSpeed')(
               <Select placeholder="请选择" onChange={this.handleplaySpeedChange} style={{ width: '80px' }}>
               <Option value="0">快速</Option>
               <Option value="1">正常</Option>
               <Option value="2">慢速</Option>
             </Select>
            )}
          </FormItem>
          <Button type="primary" onClick={this.handleReplay}>保存图片</Button>
          <Button type="primary" onClick={this.handleReplay}>导出通讯关系</Button>
        </Form>
        </div>
        <Row gutter={16}>
          <Col span={4}>
          <div id="arrayContainer" className={styles.arrayContainer}></div>
          </Col>
          <Col span={20} >
            <div id="chartContainer" className={styles.chartContainer}>
              <div id="chart" className={styles.chart} />
              <div id='thumbMapContainer' className={styles.thumbMapContainer}>
                <div id="thumbMap" className={styles.chart} />
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.lineChartsContainer} >
          <div className={styles.lineCharts}>
            {/* sideTitle={sideTitle} timeType={timeType} */}
            <MiniArea height={200} title=" " sideTitle=' ' data={this.setLineData(lineData)} timeType={timeType}/>   
          </div>
          <Slider className={styles.lineChartsController} value={this.state.sliderValue} max={this.state.sliderMax} onChange={this.onChange} tipFormatter={this.tipFormatter} style={{ width: '92%', height: '50px' }} />
        </div>
        </Card>
      </div>
    );
  }
}
