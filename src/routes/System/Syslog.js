import React from 'react';
import {connect} from 'dva';
import {Breadcrumb,Table,Popconfirm,Modal,Button} from 'antd';
import styles from './Syslog.less';


function Syslog({ dispatch,systemlog}) {

	const {dirMap,dirList,previewFile,isShow,title,startNum,endNum,over}=systemlog;


 	const columns = [
 	{
    title: '日志文件',
    dataIndex: 'name',
    key: 'name',
    width:450,
    render:(text,record)=>{
    	if(!record.file){
	        return(
	          <span className={styles.diritem} onClick={(e)=>{e.stopPropagation();onNextDir(record)}}>
	            <i className="iconfont icon-d02d"></i>
	            <span>{text}</span>
	          </span>
	        )
       	}
        else{
        	return(
        		<span className={styles.txtitem}>
        			<i className="iconfont icon-d02d"></i>
	            	<span>{text}</span>
	            </span>
        		)
            }
    }
  	},{
  	title: '最近更新时间',
  	dataIndex: 'lastUpdateTime',
    key: 'lastUpdateTime',
	},{
    title: '大小',
    dataIndex: 'length',
    key: 'length',
    render:(text,record)=>{
      if(record.file){
        return (
          <span>{text}</span>
          )
      }
      else{
        return(<span>--</span>)
      }
    }
  },{
	title: '操作',
    dataIndex: 'action',
    key: 'action',
    render:(text, record) =>{
    	if(record.file){
    		return (
    			<div>
            <a href="javascript:void(0)" onClick={() => previewLog(record)}>预览</a>
            <span className="ant-divider"></span>
    				<a href="javascript:void(0)" onClick={()=>downloadFile(record)}>下载</a>
    			
    			</div>
    			)
    	}
      else{
        return(<span>--</span>)
      }
    }
    },
  ];

  //下载文件
  const downloadFile = (record)=>{
    let filename=record.name;
    dispatch({type:'systemlog/getDownloadFile',param:{path:record.path},fileName:filename});
  };

  /*面包屑跳转*/
  const onBreadcrumb = (record,idx)=>{
    if(idx==0){
      dispatch({type:'systemlog/getDirList',param:{path:'/'}});
    }
    else{
    dispatch({type:'systemlog/getDirList',param: {path:record.path}});
   }
    dispatch({type:'systemlog/pullBreadcrumb',idx});
  }; 


  /*进入子目录*/
  const onNextDir = (record)=>{
    dispatch({type:'systemlog/getDirList',param: {path:record.path}});
    dispatch({type:'systemlog/pushBreadcrumb',record});
  };

    const randomNum=()=>{
      let num='';
      for(var i=o;i<10;i++){
      num+=Math.floor(Math.random());
      }
      return num;
    }
  /*预览文件*/
  const previewLog = (record)=>{
      dispatch({type:'systemlog/setStart'});
      dispatch({type:'systemlog/setEnd'});
      dispatch({type:'systemlog/setPreviewFile'});
      dispatch({type:'systemlog/overState',over:false}); 
      dispatch({type:'systemlog/modalIsshow',isShow:true});
      dispatch({type:'systemlog/titleShow',title:record.name});
      dispatch({type:'systemlog/getPreviewFile',param:{path:record.path}});

      //监听滚动事件
      let timer1=window.setTimeout(function(){
           let conS=document.getElementById('content_scroll');
           let innerT=document.getElementById('inner_content');
           window.clearTimeout(timer1);
           let number=innerT.scrollHeight;
            while(number<440){             
              dispatch({type:'systemlog/startState'});
              dispatch({type:'systemlog/endState'}); 
              dispatch({type:'systemlog/getPreviewFile',param:{path:record.path}});
              number+=innerT.scrollHeight;
           }
        conS.onscroll = function() {
            let scTop=conS.scrollTop;
            let clHeight=conS.clientHeight;
            let scHeight=conS.scrollHeight;
            if(scTop+clHeight==scHeight){
              dispatch({type:'systemlog/startState'});
              dispatch({type:'systemlog/endState'}); 
              dispatch({type:'systemlog/getPreviewFile',param:{path:record.path}});
              console.log("页面获得的end"+over);
            } 
          }
      },500);
    }

     

    

  /**
   * 关闭预览文件Modal
   */
  const closePreviewModal = ()=>{
    dispatch({type:'systemlog/modalIsshow',isShow:false});
    dispatch({type:'systemlog/setPreviewFile'});

  };

  return(
    <div>
    	<div className={`navigation`}>日志管理>系统日志</div>
    	<div className={styles.content}>
        <div className={`flex-box `}>
          <span className={`flex-col`}>
    	   		<Breadcrumb className={styles.bread}>
    	            {
    	              dirMap.map((item,idx)=>{
    	                if(idx === dirMap.length-1){
    	                  return(<Breadcrumb.Item key={idx}>{item.name}</Breadcrumb.Item>)
    	                }
    	                return(<Breadcrumb.Item key={idx}><a href="javascript:void(0)" onClick={(e)=>{onBreadcrumb(item,idx)}}>{item.name}</a></Breadcrumb.Item>)
    	              })
    	            }
    	   		</Breadcrumb>
            <span className={styles.total}>已全部加载，共{dirList.length}个文件(夹)</span>
          </span>
        </div>
	   		<Table columns={columns} dataSource={dirList} pagination={false}/> 
   		</div>
       <Modal
        title={title}
        visible={isShow}
        key={randomNum}
        onCancel={closePreviewModal}
        className={styles.modaltxt}
        footer={[<Button onClick={closePreviewModal} key='footer'>关闭</Button>]}
        >
        <pre id="content_scroll">
          <div id='inner_content' className={styles.inner_content}>
          {
            previewFile
          }
        </div>
        </pre>
      </Modal>
    </div>
  )
}

export default connect(({systemlog})=>({systemlog}))(Syslog);