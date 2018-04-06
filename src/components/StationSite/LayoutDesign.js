import React from 'react';
import { Form,Tabs, Input, Button,InputNumber, Alert, Divider,Tree, Table,Upload, Icon,Modal ,message,Popconfirm,Row,Col} from 'antd';
import { routerRedux } from 'dva/router';
import * as d3Chart from "./layout/D3Chart";
import * as d3 from "d3";
import Node from './Node';
import RectComponent from "./RectCompnent";
import { connect } from 'dva';
import styles from './style.less';
import Mirco from './Mirco';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
const TabPane = Tabs.TabPane;
const Search = Input.Search;

const cfg = {
  paddingX: 5,
  paddingY: 5,
  rectWidth:100,
  rectHeight:60
}

const margin = {top: 15, right: 20, bottom: 15, left: 20};
@DragDropContext(HTML5Backend)
class LayoutDesign extends React.Component{
  constructor(props){
    super(props);
    this.state={
       row:10,//行
      column:10//列
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type:"quicksite/getDevceList"});
    // var el = this.refs.svg;
    // var dispatcher = d3Chart.create(el, {
    //   width: 800,
    //   height: 900
    // },  {
    //   data: [[10,30],[20,59]],
    //   domain: {x: [0,30], y: [0, 100]},
    //   tooltip: null,
    //   prevDomain: null,
    //   showingAllTooltips: false
    // });
   // dispatcher.on('point:mouseover', this.showTooltip);
  //  dispatcher.on('point:mouseout', this.hideTooltip);
   // this.dispatcher = dispatcher;
  }
  /**搜索微逆*/
  onChangeMirco=(value)=>{
    let arr =[];
    mircoListD.map((item)=>{
      if(item.name.indexOf(value)!=-1){
        arr.push(item);
      }
    })
    if(value ==""){
      arr = mircoListD;
    }
    this.setState({deviceList:arr});
  }
  /**搜索组件*/
  onChangeComponet=(value)=>{
    let arr =[];
    mircoListD.map((item)=>{
      if(item.children){
        var children =[];
        item.children.map((child)=>{
          if(child.name.indexOf(value)!=-1){
            children.push(child);
          }
        })
        if(children.length > 0){
          arr.push({id:item.id,name:item.name,children:children})
        }
      }
    })
    if(value ==""){
      arr = mircoListD;
    }
    this.setState({deviceList:arr});
  }
  //设置虚线框
   setRects =()=>{
    var svg = this.refs.svg;
    var width = (cfg.rectWidth + cfg.paddingX)* this.state.column ,
      height = (cfg.rectHeight + cfg.paddingY)*this.state.row;

    //d3.select(svg).remove();
   var svg = d3.select(svg)
       .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    //   .append("g").attr("class","d3-rects");
    var arr=[];
    for(var i =0;i < this.state.column;i++) {
      for (var j = 0; j < this.state.row; j++) {
        var x =  i*(cfg.rectWidth + cfg.paddingX);
        var y =j* (cfg.rectHeight + cfg.paddingY);
        const id = "d3-rect-"+x+"-"+y;
        arr.push(<g id={id}><RectComponent width={cfg.rectWidth} height={cfg.rectHeight} x={x} y={y} /></g>)
      }
    }
    return arr;

  }
  render(){
    const {treeDeviceList} = this.props.quicksite.layout;
    return(
      <div style={{marginTop: '30px'}}>
        <Row >
          <Col span={6}>
            <div className={styles.equickBox}>
              <Tabs defaultActiveKey="1" >
                <TabPane tab="微逆模式" key="1"  >
                  <Search
                    placeholder=""
                    onSearch={this.onChangeMirco}
                    style={{ width: "100%" }}
                  />
                  
                  {treeDeviceList.map((item)=>{
                    return <Mirco key={item.id} cfg ={cfg} row={this.state.row} column={this.state.column} treeDeviceList={treeDeviceList} type="mirco" sn={item.name} dispatch={this.props.dispatch} type="mirco">{item.name}</Mirco>
                  })}
                  
                </TabPane>
                <TabPane tab="组件模式" key="2" className={styles.mircoList}>
                  <Search
                    placeholder=""
                    onSearch={this.onChangeComponet}
                    style={{ width: "100%" }}
                  />
                
                  {treeDeviceList.map((item)=>{
                    var arr =[];
                    if(item.children){
                      item.children.map((child)=>{
                        arr.push(<Mirco key={child.id} treeDeviceList={treeDeviceList} sn={child.name} dispatch={this.props.dispatch}>{child.name}</Mirco>);
                      })
                    }
                    return arr;
                  })}
               
                </TabPane>
              </Tabs>
            </div>
          </Col>
          <Col span={1}/>
          <Col span={17}>
            <div className={styles.layoutWrap} style={{background:'#ffffff'}}>
              <div >

                 <div>
                  <div className="layout-btn">
                    <a onClick={this.addRow}>添加一行</a>
                    <Divider type="vertical" />
                    <a onClick={this.addColumn}>添加一列</a>
                    <Divider type="vertical" />
                    <a>删除组件</a>
                    <Divider type="vertical" />
                    行数:<InputNumber value={this.state.row} onChange={this.onChangeRow}/>
                    列数:<InputNumber value={this.state.column} onChange={this.onChangeColumn}/>
                    &nbsp;&nbsp;
                    <Button type="primary" onClick={this.onOkCell}>确定</Button>
                  </div>
                  <svg className="node" id="svg" ref="svg" style={{margin:'65px 20px 20px 20px',padding:"10px"}}>
                    <g>
                        {this.setRects()}
                    </g>
             
                  </svg>
                  </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export default LayoutDesign;
