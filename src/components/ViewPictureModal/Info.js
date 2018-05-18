import React, { PureComponent } from 'react';
import { Modal , Form , Select , Row ,Col, Input ,message ,Button , Icon} from 'antd';
import styles from './Info.less';


//图片信息---一些相机参数
class Info extends PureComponent {
  state = {
      
    };


  render() {
    const { key , value } = this.props;
    return (
          <div>
            <p className={styles.key}>{key}</p>
            <p className={styles.value}>{value}</p>
          </div>
    );
  }
};


export default Info;
