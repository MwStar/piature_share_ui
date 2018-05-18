import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Input } from 'antd'
 
import styles from './InputArray.less';
 
 class InputArray extends PureComponent {
     constructor(props) {
         super(props)
     }
 
     handleChange = index => {
         const { value, onChange } = this.props
         const newValue = [...value]
 
         newValue[index] = target.value
 
         onChange(newValue)
     }
 
 
     render() {
         const { value, ...others } = this.props
 
 
         return (
             <div className="input-array-component">
                 {value.map((v, i) => {
                     return (
                         <div key={i}>
                             <Input
                                 {...others}
                                 value={v}
                                 data-index={i}
                                 onChange={() => this.handleChange(i)}
                             />
                         </div>
                     );
                 })}
             </div>
         );
     }
 }
 
 InputArray.defaultProps = {
     value: []
 }
 
 export default InputArray