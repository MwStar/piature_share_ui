import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal , Form , Select , Row ,Col, Input ,Checkbox,message ,TreeSelect} from 'antd';
const forge = require('node-forge');
import {setLocalStorage, getLocalStorage } from '../../utils/utils';
import EditPainging from '../EditPainting/index';
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

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
  paintingsuser: state.paintingsuser,
}))
@Form.create()

//采集图片

 export default class ChoosePaintings extends PureComponent {
  state = {
      
    };


    componentDidMount() {
      const {dispatch} = this.props;
      const token = getLocalStorage("Token");
       if(token){
          dispatch({type:"paintingsuser/getAllPaintings"});
       }
  }
//采集确定事件
  handleOk = () => {
    const { _id } = this.props.pictures;
    const { pictures: { modal } } = this.props;
    const { dispatch } = this.props;    
    //获取form值  
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
        dispatch({type:"pictures/gatherPicture",payload:fieldsValue});

    });
  };

  //取消事件
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({type:'pictures/changeChoose',modal:false});
  }


  //创建画集
  create = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'paintingsuser/modalStatus', modal: true });
  }

    //搜索画集
  filterOption = (inputValue, option) => {
    if(option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0){
      return true;
    }
    else{
      return false;
    }
  }

   

  render() {
  	const { pictures: { choosePaintings , id} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { paintingsuser:{ painting , paintingsList}} = this.props;
    let info = '';
    /*if(paintingsList.length>0){
      for (let i = 0; i <=paintingsList.length; i++) {
        console.log("2222",paintingsList[i]);
        for(let j=0; j <= paintingsList[i].picture.length; j++){
          if(paintingsList[i].picture[j] === id){
            info = paintingsList[i].title;
          }
        }
      }
    }*/
    return (
          <Modal
            title="采集"
            visible={choosePaintings}
            width={600}
            onOk={this.handleOk}
            maskClosable={true}
            onCancel={this.handleCancel}
            width={700}
          >
            <Form onSubmit={(e)=>{e.stopPropagation();this.handleOk();}}>
              <Row>
                {info?
                  <Col span={24}>
                    <span>`该图片已采集到${info}画集`</span>
                  </Col>:''}
                <Col span={24}>
                  <FormItem
                    {...formItemLayout}
                    label="所属画集" 
                    >
                    {
                      getFieldDecorator('paintings_id')(
                        <Select 
                          showSearch
                          filterOption={this.filterOption}
                          placeholder="请选择或创建画集"
                          >
                              {paintingsList.map((item) => {
                                return (
                                  <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                )
                              })}
                        </Select>
                        )
                    }
                    <span><i className="iconfont icon-add_paintings"></i><a onClick={this.create}>创建画集</a></span>
                  </FormItem>
                </Col>

              </Row>
            </Form>

            <EditPainging painting={painting}></EditPainging>

          </Modal>
    );
  }
};

