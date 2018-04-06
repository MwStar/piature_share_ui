import React from 'react';
import * as d3 from "d3";
import {Divider,InputNumber,Button } from 'antd';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import * as d3Chart from "./layout/D3Chart";
const squareTarget = {
  // canDrop(props) {
  //   console.log("props:",props);
  //   //console.log("canMoveKnight(props.x, props.y):",canMoveKnight(props.x, props.y));
  //  // return canMoveKnight(props.x, props.y)
  //   return r
  // },

  drop(props,monitor) {
    const param = monitor.getItem();
   if(param.type==="mirco"){
      d3Chart.updateMirco(props,param);
   }else{
    d3Chart.updateRect(props,param);
   }
    
   }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
}
@DropTarget(ItemTypes.KNIGHT, squareTarget, collect)
class RectCompnent extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let text1="",text2="",text3="";
    if(this.props.text){
      text1 = this.props.text.substring(0,6);
      text2= this.props.text.substring(6,12);
      text3 = this.props.text.substring(12,this.props.text.length);
    }
    const textX = this.props.x +5;
    const textY = this.props.y +10;
    const {connectDropTarget} = this.props;
    const id = "d3-rect-"+this.props.x+"-"+this.props.y;
    return connectDropTarget(
      <g >
        {this.props.text?
          <g>
          <rect  width={this.props.width} height={this.props.height} style={{fill:'#f2f2f2',stroke:'rgba(0,0,0,0.4)'}}>
          </rect>
        
            <text fill="rgba(0,0,0,0.4)" x={textX} y={textY} style={{fontSize:12}} >
              <tspan x={textX} dy="1em" font-size="12px">{text1}</tspan>
              <tspan x={textX} dy="1em" font-size="12px">{text2}</tspan>
              <tspan x={textX} dy="1em" font-size="12px">{text3}</tspan>
            </text>
        
          </g>:
          <rect x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} style={{fill:'#f2f2f2',stroke:'rgba(0,0,0,0.4)',strokeDasharray:"5,5"}}></rect>
        }
      </g>
    )
  }
}
export default RectCompnent;
