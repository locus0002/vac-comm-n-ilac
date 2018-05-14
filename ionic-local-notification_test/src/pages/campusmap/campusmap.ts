import { Component } from '@angular/core';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the CampusmapPage page
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-campusmap',
  templateUrl: 'campusmap.html',
})
export class CampusMapPage {

  myMap: GoogleMap;

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera:{
        target:{
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.myMap = GoogleMaps.create('campusmaps_canvas', mapOptions);
    this.myMap.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready');
        this.myMap.addMarker({
          title:'Ass',
          icon:'blue',
          animation:'DROP',
          position:{
            lat: 43.0741904,
            lng: -89.3809802
          }
        })
          .then((marker) => {
            marker.showInfoWindow();
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                this.alertCtrl.create({
                  title:'Marker Ionic',
                  message:'You have clicked in this marker',
                  buttons:['Accept']
                }).present();
              });
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CampusmapPage');
    this.ionViewDidLoad();
  }

}
