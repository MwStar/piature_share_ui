import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar, Input,Cascader } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FaAnchor from "react-icons/lib/fa/anchor";
import styles from './index.less';
import fetch from 'dva/fetch';
import _ from "lodash";
import { compose, withProps, withHandlers, withStateHandlers, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, } from 'react-google-maps';
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import {getLocalStorage} from "../../utils/utils";

const MapWithASearchBox = compose(
    withProps({
       googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEMTETU5hLZv8kp8vHwD7W3Y_S8Jhoe04&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{
            height: `100%`
        }} />,
        containerElement: <div style={{
            height: `400px`
        }} />,
        mapElement: <div style={{
            height: `100%`
        }} />,
    }),
    lifecycle({
        componentWillMount() {

            const refs = {}

            this.setState({
                bounds: null,
                center: {
                    lat: 41.9,
                    lng: -87.624
                },
                //markers: [],
               // places: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },

                onPlacesChanged: () => {

                    const places = refs.searchBox.getPlaces();
                    const bounds = new google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location)
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,

                    });

                },

            })
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    onClick={props.onMapClick}
    >

    <SearchBox
    ref={props.onSearchBoxMounted}
    bounds={props.bounds}
    controlPosition={google.maps.ControlPosition.TOP_LEFT}
    onPlacesChanged={props.onPlacesChanged}
    >
      <input
    type="text"
    placeholder="输入要查询的地址"

    style={{
        boxSizing: `border-box`,
        border: `1px solid transparent`,
        width: `240px`,
        height: `32px`,
        marginTop: `27px`,
        padding: `0 12px`,
        borderRadius: `3px`,
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
        fontSize: `14px`,
        outline: `none`,
        textOverflow: `ellipses`,
    }}
    />
    </SearchBox>
    {props.markers.map((marker, index) => <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>

);
// const ChinaMapSearch =({markers,places})=>{

//     let  geocoder = new google.maps.Geocoder();
//         map = new google.maps.Map(refs.map, {
//           center: {lat: -33.8688, lng: 151.2195},
//           zoom: 13,
//           mapTypeId: 'roadmap'
//         });

//      return(
//             <div>
//                 <input id="searchInput"   type="text" placeholder="Search Box" />
//                 <div ref="map" style={{width:'100%',height:'400'}}>2222</div>
//             </div>
//         )
// }
class ChinaMapSearch extends React.Component {
    constructor(props){
      super(props);
      this.state ={
        map:null,
        marker:null,
      }
    }

    componentDidMount(){
        let  geocoder = new google.maps.Geocoder();
        let chinaMap = new google.maps.Map(this.refs.ChinaMap, {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap',
          gestureHandling:'greedy'
        });
        this.setState({map:chinaMap});
         var auto = new AMap.Autocomplete({
         input: this.refs.searchInput
        });
        var self = this;
         AMap.event.addListener(auto, "select", function(e){
            self.codeAddress(e.poi.name,chinaMap);
        });
      chinaMap.addListener('click', function(e) {
        self.props.onMapClick(e);
        if(self.state.marker !=null){
            self.state.marker.setPosition(e.latLng);
        }else{
            var marker = new google.maps.Marker({
              map:self.state.map,
              position: e.latLng
          });
           self.setState({marker});
        }
      });
    }
    codeAddress=(address,map)=> {
        var self = this;
      new google.maps.Geocoder().geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);

        } else {
          console.warning("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    onChange=(value)=>{
      if(value.length > 0){
        const address = value.join("");
        this.codeAddress(address,this.state.map);
      }
    }
    render(){
      const options = [{value:"中国", label:"China",children:[
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [{
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [{
                value: 'xihu',
                label: 'West Lake',
              }],
            }],
          }, {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [{
              value: 'nanjing',
              label: 'Nanjing',
              children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              }],
            }],
          }
        ]}];
        const {addressArr} = this.props.places;
        return(
            <div>
              <div className={styles.address}>
                <Cascader options={options} defaultValue ={addressArr} changeOnSelect  onChange={this.onChange}  placeholder="Please select"  />
                <input id="searchInput" ref="searchInput" className={styles.controls} type="text" placeholder="Search Box" />
              </div>
                <div ref="ChinaMap" style={{width:'100%',height:'400px'}}>2222</div>
            </div>
        )
    }
}
class MapSearch extends React.Component {
    render(){
        const country = getLocalStorage("country");

        return(
        <div>
        {country =="中国"?<ChinaMapSearch markers={this.props.markers} places={this.props.places} onMapClick ={this.props.onMapClick}/>:
        <MapWithASearchBox markers={this.props.markers} places={this.props.places} onMapClick ={this.props.onMapClick}/>
    }

        </div>
        )
    }
}
export default MapSearch;
