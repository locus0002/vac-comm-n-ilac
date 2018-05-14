import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public pushCtrl: Push,
              public alertCtrl:AlertController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
      this.testPushNotification();
      this.rootPage = HomePage;
    });
  }

  testPushNotification(){
    
    let push = this.pushCtrl.init({
      android:{
        senderID:"728267144284"
      },
      ios:{
        alert:"true",
        badge:false,
        sound:"true"
      },
      windows:{}
    });

    push.on("notification").subscribe((data) =>{
      console.log("data.message", JSON.stringify(data));

      if(data.additionalData.foreground){
        this.alertCtrl.create({
          title:'Notification Ass(Push)',
          message:'Good good',
          buttons:[
            {
              text:'Ignore',
              role:'cancel'
            },
            {
              text:'View',
              handler:(data)=>{ console.log("VIEW.data", JSON.stringify(data)); }
            },
          ]
        }).present();
      }else{
        console.log("I donnu");
      }
    });

    push.on("error").subscribe((error) => { console.log("Notification ERROR", JSON.stringify(error)); });
  }
}

