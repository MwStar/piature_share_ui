import React from 'react';
import * as d3 from "d3";
import RectComponent from "./RectCompnent";
import {Divider,InputNumber,Button } from 'antd';
import PropTypes from 'prop-types'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
const cfg = {
  paddingX: 15,
  paddingY: 15,
  rectWidth:50,
  rectHeight:70
}

const margin = {top: 15, right: 20, bottom: 15, left: 20};
@DragDropContext(HTML5Backend)
class NodeCompnent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      row:2,//行
      column:3//列
    }
  }
  componentDidMount() {
     // this.initCell();
  }
  initCell=()=>{
    d3.select(this.refs.svg).select("g").remove();
    var svg = this.refs.svg;

    var cfg = {
      paddingX: 15,
      paddingY: 15,
      rectWidth:50,
      rectHeight:70
    }

    var margin = {top: 15, right: 20, bottom: 15, left: 20};

    var width = (cfg.rectWidth + cfg.paddingX)* this.state.column ,
      height = (cfg.rectHeight + cfg.paddingY)*this.state.row;

    //d3.select(svg).remove();
    var svg = d3.select(svg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g").attr("class","constituen_c")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    for(var i =0;i < this.state.column;i++){
      var constituencies = svg.append("g").attr("class", "constituencies_"+i);
      for(var j =0;j < this.state.row;j++){
       // var constituencies = svg.append("g").attr("class", "constituencies").append("rect")
       // constituencies.append("rect").attr("class", "constituency")
        constituencies.append()
          // .attr("x", i*(cfg.rectWidth + cfg.paddingX))
          // .attr("y", j* (cfg.rectHeight + cfg.paddingY))
          // .attr("width", cfg.rectWidth)
          // .attr("height", cfg.rectHeight)
          // .attr("fill", '#f2f2f2')
          // .attr("stroke", 'rgba(0,0,0,0.4)')
          // .attr("stroke-dasharray","5,5")
      }
    }
  }
  onChangeRow = (value)=>{
    this.setState({row:value})
  }
  onChangeColumn = (value)=>{
    this.setState({column:value})
  }
  onOkCell =()=>{
    this.initCell();
  }
  addRow =()=>{
    let row = this.state.row +1;
    let column  = this.state.column;
    this.setState({row,row});
    var cfg = {
      gridLength: 5,
      gridHeight: 10,
      paddingX: 15,
      paddingY: 15,
      rectWidth:50,
      rectHeight:70
    }

    var margin = {top: 15, right: 20, bottom: 15, left: 20};

    var width = (cfg.rectWidth + cfg.paddingX)* this.state.column ,
      height = (cfg.rectHeight + cfg.paddingY)*row;

    d3.select(this.refs.svg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    for(var i =0;i<column;i++){
      d3.select(this.refs.svg).selectAll(".constituencies_"+i).append("rect").attr("class", "constituency")
        .attr("x", i*(cfg.rectWidth + cfg.paddingX))
        .attr("y", this.state.row* (cfg.rectHeight + cfg.paddingY))
        .attr("width", cfg.rectWidth)
        .attr("height", cfg.rectHeight)
        .attr("fill", '#f2f2f2')
        .attr("stroke", 'rgba(0,0,0,0.4)')
        .attr("stroke-dasharray","5,5")
    }
    }
  addColumn =()=>{
    let row = this.state.row ;
    let column  = this.state.column+1;
    this.setState({column,column});
    var cfg = {
      gridLength: 5,
      gridHeight: 10,
      paddingX: 15,
      paddingY: 15,
      rectWidth:50,
      rectHeight:70
    }

    var margin = {top: 15, right: 20, bottom: 15, left: 20};

    var width = (cfg.rectWidth + cfg.paddingX)* column ,
      height = (cfg.rectHeight + cfg.paddingY)*this.state.row;
    d3.select(this.refs.svg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    var constituencies =d3.select(this.refs.svg).select(".constituen_c").append("g").attr("class", "constituencies_"+this.state.column);

    for(var i =0;i<row;i++){
      constituencies.append("rect").attr("class", "constituency")
        .attr("x", this.state.column*(cfg.rectWidth + cfg.paddingX))
        .attr("y", i* (cfg.rectHeight + cfg.paddingY))
        .attr("width", cfg.rectWidth)
        .attr("height", cfg.rectHeight)
        .attr("fill", '#f2f2f2')
        .attr("stroke", 'rgba(0,0,0,0.4)')
        .attr("stroke-dasharray","5,5")
    }
  }
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
        var y =j* (cfg.rectHeight + cfg.paddingY)
        arr.push(<RectComponent width={cfg.rectWidth} height={cfg.rectHeight} x={x} y={y} />)
      }
    }
    return arr;

  }
  render(){
    // const { node, addRef, store } = this.props;
    // const { force } = store;
    return (
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
      <svg className="node" id="svg" ref="svg" style={{margin:'60px 20px 20px 20px'}}>
        <g>
            {this.setRects()}
        </g>
        {/*<g ref ="node">*/}
          {/*<rect width="60" height="70"*/}
                {/*style={{fill:'rgba(0,0,255,0.3)',strokeWidth:1,stroke:'rgba(0,0,0,0.3)'}}/>*/}
        {/*</g>*/}
      </svg>
      </div>
    );
  }


}
export default NodeCompnent;
