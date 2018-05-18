import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import { Modal , Form , Select , Row ,Col, Input ,message ,Button , Icon , Avatar} from 'antd';
const forge = require('node-forge');
import styles from './index.less';
import {config} from '../../utils/config';
import { download } from '../../services/download.js';
import Info from './Info';
import avatarDefault from '../../assets/avatarDefault.png';
import {setLocalStorage, getLocalStorage } from '../../utils/utils';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12}
  }
};

@connect(state => ({
  pictures: state.pictures,
  user: state.user,
  focususer: state.focususer,
  collectuser: state.collectuser,
}))

//某一张图片的信息
class ViewPicture extends PureComponent {
  state = {
      reply:false,//回复
      reply_id:'',//被回复者id
    };

    onCancel = () => {
      const { dispatch } = this.props;
      dispatch({type:'pictures/modalStatus',modal:false});
    }
    //评论//回复
    comment = (id) => {
      const token = getLocalStorage('Token');
      const { picture ,dispatch } = this.props;
      const imgAuthor_id = picture.img.author._id;
      const content = document.getElementById("comment").value;
      if(token){
        let value = {
          imgId:picture.img._id,//图片id
          id:id,//被评论的用户id
          level:1,//评论1，回复2
          content:content,
        }
      dispatch({type:'pictures/comment',payload:value});
      }
      else{
        message.info('请先登录！');
      }
    }

    ///回复
    commentReplay = (id) => {
      const token = getLocalStorage('Token');
      const { picture ,dispatch } = this.props;
      const imgAuthor_id = picture.img.author._id;
      //const content = this.refs.reply.value;
      const content = document.getElementById("reply").value;
      console.log("content---",content);
      if(token){
        let value = {
          imgId:picture.img._id,//图片id
          id:id,//被回复的用户id
          level:2,//评论1，回复2
          content:content,
        }
      dispatch({type:'pictures/comment',payload:value});
      this.setState({reply:false});
      }
      else{
        message.info('请先登录！');
      }
    }
     //回复
    reply = (id) => {
      const token = getLocalStorage('Token');
      if(token){
        this.setState({reply:true,reply_id:id});
      }
      else{
        message.info('请先登录！');
      }
    }

    //删除评论/回复
    de_reply = (id) => {
      const token = getLocalStorage('Token');
      const { picture ,dispatch } = this.props;
      
      if(token){
        dispatch({type:'pictures/de_comment',payload:{id:id}});
      }
      else{
        message.info('请先登录！');
      }
    }

    //喜欢
  collect = () => {
    const token = getLocalStorage('Token');
    if(token){
      const { picture ,dispatch } = this.props;
      const id = picture.img._id;
      dispatch({type:'pictures/saveId',id:id});
      dispatch({type:"pictures/collect"});
    }
    else{
      message.info('请先登录！');
    }
  }
  //取消喜欢
  de_collect = () => {
    const token = getLocalStorage('Token');
    if(token){
      const { picture ,dispatch } = this.props;
      const id = picture.img._id;
      dispatch({type:'pictures/saveId',id:id});
      dispatch({type:"pictures/de_collect"});
      }
    else{
      message.info('请先登录！');
    }
  }
    //采集
  gather = () => {
    const token = getLocalStorage('Token');
    if(token){
      const { picture ,dispatch } = this.props;
      const id = picture.img._id;
      dispatch({type:'pictures/saveId',id:id});
      dispatch({type:'pictures/changeChoose',choosePaintings:true});
    }
    else{
      message.info('请先登录！');
    }
  }
  //用户
    user = (id) => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/owner/user/'+id));
    }

    //下载
  downloadPicture = (id,url,name) => {
    download(id,url,name);
  }

   //关注
  focus = () => {
    const { dispatch } = this.props;
    const { picture } = this.props;
    const id = picture.img.author._id;
    dispatch({type:'pictures/focus',payload:{id:id}});
  }
  //取消关注
  de_focus = () => {
    const { dispatch } = this.props;
    const { picture } = this.props;
    const id = picture.img.author._id;
    dispatch({type:'pictures/de_focus',payload:{id:id}});
  }

  render() {
  	const { modal } = this.props.pictures;
    const { picture ,dispatch } = this.props;
    const { currentUser } = this.props.user;
    const { list } = this.props.focususer;
    const { list:collectList } = this.props.collectuser;
    const avatar = picture.img?picture.img.author.avatar:'';
    const user_id = picture.img?picture.img.author._id:'';
    const img_id = picture.img?picture.img._id:'';
    const name = picture.img?picture.img.author.name:'';
    const path = picture.img?picture.img.path:'';
    const reply = picture.reply?picture.reply:'';
    const focus = findIndex(list,{"_id":user_id});
    const collect = findIndex(collectList,{"_id":img_id});
    console.log("focus----",focus);
    console.log("collect----",collect);
    return (
          <Modal
            visible={modal}
            maskClosable={false}
            width={1000}
            onCancel={this.onCancel}
            footer={null}
          >
            <Row style={{marginBottom:'14px',marginTop:'10px'}}>
            	<Col span={6}>
            		<a>
                  <Avatar style={{marginRight:'5px'}} size="default" className={styles.avatar} src={avatar?(config.CHRCK_FILE+avatar):avatarDefault} onClick={()=>{this.user(picture.img.author._id)}}/>
                  <span>{name}</span>
            			{focus === -1?<Button onClick={this.focus} title="关注" style={{marginLeft:"10px"}}><Icon type="check" />关注</Button>
                  :
                  <Button onClick={this.de_focus} title="取消关注" style={{marginLeft:"10px"}}><Icon type="close" />取消关注</Button>
                  }
            		</a>
            	</Col>
            	<Col span={18}>
            		<div className={styles.right}>
			      		  <Button style={{marginRight:'10px'}} onClick={this.gather}>采集</Button>
                  {collect === -1?<span style={{marginRight:'10px'}} onClick={this.collect}><Icon type="heart-o" className={styles.collect}/></span>
                  :<span style={{marginRight:'10px'}} onClick={this.de_collect}><Icon type="heart" style={{"color":"#EE4D59","fontSize":"22px"}} className={styles.collect}/></span>}
            			<Button onClick={(e)=>{this.downloadPicture(picture.img._id,picture.img.path,picture.img.title)}}>下载</Button>
            		</div>
            	</Col>
            </Row>
            <Row style={{marginBottom:'14px'}}>
            	<Col span={24}>
            		<div className={styles.picture}>
            			<img src={config.CHRCK_FILE+path}/>
            		</div>
            	</Col>
            </Row>
            <Row style={{marginBottom:'14px'}}>
              <Col span={24}>
                <div className={styles.info}>
                  <Button style={{marginRight:'10px'}}>分享</Button>
                  <Button>图片信息</Button>
                </div>
              </Col>
            </Row>
            <Row style={{marginBottom:'14px'}}>
            	<Col span={24}>
            		<div className={styles.infoDetails}>
            			{picture.img?
                    picture.img.params.map((item)=>{
                      return(
                          <Info key={item.key} value={item.value}></Info>
                          )
                        }):<span>暂无图片信息</span>
                  }
            		</div>
            	</Col>
            </Row>
            <h4>评论<span>共{reply.length}条</span></h4>
            <Row gutter={16} className={styles.replyCol}>
              {reply.length>0?<div>{reply.map((item)=>{
                return(
                 <Col span={24} className={styles.border}>
                  <Avatar size="default" className={styles.avatar} src={item.author_id.avatar?(config.CHRCK_FILE+item.author_id.avatar):avatarDefault} onClick={()=>{this.user(item.author_id._id)}}/>
                  <span className={styles.name}>{item.author_id.name}</span>
                  {item.author_id._id === picture.img.author._id?<span style={{color:"#808080"}}>(图片摄影师)</span>:''}
                  <span className={styles.time}>{moment(item.create_at).fromNow()}</span>
                  {item.level === '2'?<span><Icon type="caret-right" />{item.beReviewed_id.name}</span>:''}
                  <div className={styles.content}>{item.content}</div>
                  <div className={styles.operator}>
                    <a onClick={()=>this.reply(item.author_id._id)}>回复</a>
                    {item.author_id._id === currentUser._id?
                      <a onClick={()=>this.de_reply(item._id)}>删除</a>
                      :''}

                  </div>
                  {this.state.reply && this.state.reply_id === item.author_id._id?
                    <div className={styles.writereply}>
                          <Input id="reply" placeholder={`回复${item.author_id.name}`} onPressEnter={()=>this.commentReplay(item.author_id._id)}/>
                          <Button onClick={()=>this.commentReplay(item.author_id._id)}>添加回复</Button>
                    </div>:''
                  }
                </Col>) 
              })
              }</div>:''}
              <Col span={24}>
                <Avatar size="default" className={styles.avatar} src={config.CHRCK_FILE+currentUser.avatar} />
                <TextArea id="comment" placeholder="请输入评论" rows={4}
                className={styles.input_co} onPressEnter={()=>this.comment(picture.img.author._id)}/>
                <div><Button onClick={()=>this.comment(picture.img.author._id)} className={styles.add}>添加评论</Button></div>
              </Col>
            </Row>
            <h3>推荐</h3>
            <Row>
            	
            </Row>


          </Modal>
    );
  }
};


export default ViewPicture;
//export default connect(({ pictures }) => ({ pictures }))(ViewPicture);
