import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, PushOptions, PushNotification } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { NewWordPage } from '../pages/new_word/new_word';
import { AutoCompletePage } from '../pages/auto_complete/auto_complete';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    //rootPage = TabsPage;
    //rootPage = NewWordPage;
    rootPage = AutoCompletePage;

    constructor(
                platform: Platform,
                public alertCtrl:AlertController) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
            console.log("Before...");
            this.initPushNotification();
            console.log("After...");
        });
    }

    initPushNotification() {
        Push.hasPermission()
            .then((data) => {

                if (data.isEnabled) {
                    console.log("We have permission to send push notifications ");
                } else {
                    console.log("We DON'T have permission to send push notifications ");
                }

            }, (errorP) => {
                console.log("Error");
                console.log(errorP);
            });

        const options: PushOptions = {
            android: {
                senderID: "728267144284"
            },
            ios: {
                alert: "true",
                badge: false,
                sound:"true"
            },
            windows: {}
        };

        let pushObj: PushNotification = Push.init(options);

        pushObj.on("registration", (registration) => {
            console.log("Device registered", registration.registrationId);
        });

        pushObj.on("notification", (notification) => {
            console.log("Notification: ", notification.message);
            this.alertCtrl.create({
                title: 'Notification',
                subTitle: notification.message,
                buttons: [
                    {
                        text: 'Ignore',
                        role: 'cancel'
                    },
                    {
                        text: 'View',
                        handler: () => {
                            //TODO
                            console.log("Ver notification");
                        }
                    }
                ]
            }).present();
        });
        

        pushObj.on("error", (errorPO) => {
            console.log("Error: " + errorPO.message);
        });
    }

}
