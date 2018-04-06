import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FaAnchor from "react-icons/lib/fa/anchor";

import styles from './index.less';
import fetch from 'dva/fetch';
import { compose, withProps, withHandlers,withStateHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
}  from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
const MapWithAMarkerClusterer = compose(
  withProps({
    //googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEMTETU5hLZv8kp8vHwD7W3Y_S8Jhoe04&v=3.exp&libraries=geometry,drawing,places",
    googleMapURL:"http://maps.google.cn/maps/api/js?v=3.20&region=cn&language=zh-CN&key=AIzaSyBzE9xAESye6Kde-3hT-6B90nfwUkcS8Yw&sensor=false&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(()=>({
     isOpen: false
  }),{
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
      onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  // withStateHandlers(() => ({
  //   isVisible: false
  // }), {
  //   onVisible: ({ isVisible }) => () =>{
  //       console.log("isVisible:",isVisible);
  //     console.log("marker:",marker);
  //     return ({

  //     isVisible: !isVisible,
  //   //  position:position,
  //   })

  //   }
  // }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
  >
  {console.log(props)}


    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          onClick={props.onToggleOpen}
          key={marker.photo_id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        >
        {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
        <FaAnchor />
      </InfoWindow>}
      </Marker>
      ))}
    </MarkerClusterer>
  </GoogleMap>
)

export default class MapCluster extends React.PureComponent {
  constructor(props){
    super(props);
  }
  componentWillMount() {
    this.setState({ markers: [] })
  }

  componentDidMount() {
    const url = [
      // Length issue
      `https://gist.githubusercontent.com`,
      `/farrrr/dfda7dd7fccfec5474d3`,
      `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
    ].join("")

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({ markers: data.photos });
      });
  }

  render() {
    return (

        <MapWithAMarkerClusterer markers={this.props.data} />

    )
  }
}
