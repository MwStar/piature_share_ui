import React, { Component } from 'react'
import {Icon} from 'antd';
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'
const mircoSource = {
	beginDrag(props) {
		return props
	},
}

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}
}

@DragSource(ItemTypes.KNIGHT, mircoSource, collect)
class Mirco extends Component{
	render(){
		const { connectDragSource, isDragging } = this.props
		return connectDragSource(
			<div
				style={{
					cursor: 'move',
					opacity: isDragging ? 0.5 : 1,
					fontSize:"16px",
					paddingTop:8,
				}}
			>
			{this.props.type ==="mirco"?<Icon type="appstore" style={{paddingRight:10,color:"#61b2fa"}} />:
			<Icon type="inbox" style={{paddingRight:10,color:"#61b2fa"}} />
		}
			
			{this.props.children}
			</div>
			)
	}

}
export default Mirco;