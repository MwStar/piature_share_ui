import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal , Form , Select , Row ,Col, Input ,Checkbox,message ,TreeSelect} from 'antd';
const forge = require('node-forge');
import styles from './index.less';

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

/*@connect(state => ({
  users: state.users,
}))*/

//首页--某一张图片的信息
class ViewPicture extends PureComponent {
  state = {
      
    };

  render() {
  	const { pictures: { modal } } = this.props;
    const { pictures ,picture ,dispatch} = this.props;

    return (
          <Modal
            visible={modal}
            maskClosable={false}
            width={800}
          >
            <Row>
            	<Col span={4}>
            		<a>
            			<i className="iconfont icon-add"></i>
            			<span>{picture.author}</span>
            		</a>
            	</Col>
            	<Col span={20}>
            		<div className={styles.right}>
			      		<div><Button>采集</Button></div>
            			<div><Button><Icon type="heart-o" /></Button></div>
            			<div><Button>下载</Button></div>
            		</div>
            	</Col>
            	<Col span={24}>
            		<div className={styles.picture}>
            			<img src={picture.path}/>
            		</div>
            	</Col>
            	<Col span={24}>
            		<div className={styles.info}>
            			<Button>分享</Button>
            			<Button>图片信息</Button>
            		</div>
            	</Col>
            </Row>
            <h3>推荐</h3>
            <Row>
            	
            </Row>

          </Modal>
    );
  }
};


export default connect(({pictures})=>({pictures}))(ViewPicture);
