
import {EventEmitter} from 'events';
import * as d3 from 'd3';
import './D3Chart.less';
import {getLocalStorage,setAgencySelectTree,getOwnerByAgencyId,setDeviceTree,alertMessage} from '../../../utils/utils';

var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;

var ns = {};
//删除拖动后的数据
ns.removeTree=function(list,sn,dispatch){
  if(list && list.length > 0){
    var arr =[];
      list.map((item)=>{

        if(item.name != sn){
          if(item.children && item.children.length > 0){
            var children = [];
            item.children.map((child)=>{
              if(child.name !=sn){
                  children.push(child);
              }
            })
            if(children.length >0){
              arr.push({id:item.id,name:item.name,children:children});
            }
          }
        }
      })
      dispatch({type:'quicksite/saveLayout',payload:{treeDeviceList:arr}}) 
  }
 

}
ns.drawRect = function(props,param){
 const sn = param.sn;
    const id = "#d3-rect-"+props.x+"-"+props.y;
    const className = "#d3-rect-"+props.x+"-"+props.y+"-active";

     d3.select(id).select("g").remove();
    var g = d3.select(id).append("g").attr("class","active");
    const textX = props.x +5;
    const textY = props.y +10;
     let text1="",text2="",text3="";
    if(sn){
      text1 = sn.substring(0,6);
      text2=sn.substring(6,12);
      text3 = sn.substring(12,sn.length);
    }
    g.append("rect").attr("class","active-rect")
    .attr("x",props.x)
    .attr("y",props.y)
    .attr("width",props.width)
    .attr("height",props.height)
    .attr("fill", '#3091F2')
    .attr("stroke-width", '3')
    .attr("stroke", '#000');
      g.append("rect").attr("x",props.x)
    .attr("y",textY+props.height-25)
    .attr("width",props.width)
    .attr("height","15")
    .attr("fill","#000");
    g.append("text")
    .attr("font-size","12px")
    .attr("fill","#fff")
    .attr("font-weight","bold")
    .attr("x",textX)
    .attr("y",textY+props.height-13).text(sn)
    for(var i =0; i < 5;i++){
      for(var j = 0 ;j < 3;j++){
        g.append("rect").attr("width","20px").attr("height","15px")
        .attr("x",props.x +i*20)
        .attr("y",props.y+j*15)
        .attr("fill","#3091F2")
        .attr("stroke-width", '2')
        .attr("stroke","rgba(0,0,0,0.2)");
      }
    }
}
//拖动后更新组件
ns.updateRect = function(props,param,sn){
  ns.drawRect(props,param);
  if(sn){
  
    ns.removeTree(param.treeDeviceList,sn,param.dispatch);
  }else{
    ns.removeTree(param.treeDeviceList,param.sn,param.dispatch);
  }
  
}

//拖动微逆，获取微逆的所有组件，按照顺序依次排列
ns.updateMirco=function(props,param){
    const sn = param.children; //获取当前拖动微逆的序列号
    const treeData = param.treeDeviceList;//获取当前微逆树列表
    const dispatch = param.dispatch;//获取dispatch 对象
    const x = props.x;//拖动节点放置rect的x值
    const y = props.y;//拖动节点放置rect的y值
    const cfg = param.cfg;//rect 基本属性
    const row = param.row;//行数
    const column = param.column;//列数
   
    if(treeData){
      //获取当前微逆下的所有组件
      const componets = treeData.find((item)=>{return (item.name===sn)}).children;
      const comLength = componets.length ;//微逆组件个数
      const flag = ns.validate(x,y,cfg,row,column,comLength);
      if(!flag){
        alertMessage("不能放置","warning");
        return false;
      }
      //获取下x,y的索引
      const indexX = (x)/(cfg.rectWidth+cfg.paddingX);
      const indexY = (y)/(cfg.rectHeight+cfg.paddingY);
      const MaxX = (cfg.rectWidth)*(column-1)+(cfg.paddingX*(column-1));
      const MaxY = (cfg.rectHeight)*(row-1)+(cfg.paddingY*(row-1));
      const deviceLen = (column-indexX) < comLength ? (column-indexX):comLength; 
      // console.log("deviceLen:",deviceLen);
      // console.log("index:",indexX)
      // console.log("indexY:",indexY);
       var j =0;
       for(var i =indexX;i <= deviceLen;i++){
          
          const nextX = i*(cfg.rectWidth +cfg.paddingX);
          const nextY= y;
        
          ns.updateRect({x:nextX,y:nextY,height:cfg.rectHeight,width:cfg.rectWidth},{sn:componets[j].name,treeDeviceList:treeData,dispatch:dispatch},param.sn);
          j++;
  }

     
    }

}
//验证拖动微逆是否能在当前rect 中放 return： true 可以放置  false: 不可以放
ns.validate=function(x,y,cfg,row,column,len){
  const MaxX = (cfg.rectWidth)*(column-1)+(cfg.paddingX*(column-1));
  const MaxY = (cfg.rectHeight)*(row-1)+(cfg.paddingY*(row-1));
  //获取下x,y的索引
  const indexX = (x)/(cfg.rectWidth+cfg.paddingX);
  const indexY = (y)/(cfg.rectHeight+cfg.paddingY);
  const deviceLen = (column-indexX) < len ? (column-indexX):len; 
  var flag = true;
  for(var i =indexX;i < deviceLen;i++){
    const nextX = i*(cfg.rectWidth +cfg.paddingX);
    const nextY= y;
    const id = "#d3-rect-"+nextX+"-"+nextY;
    const className = d3.select(id).select("g").attr("class");

    if(className==="active"){
      flag = false;
      break;
    }
  }
  return flag;
}

ns.destroy = function(el) {

};

module.exports = ns;
