import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the notification_schedules page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-notification_schedules',
    templateUrl: 'notification_schedules.html'
})
export class NotificationSchedulesPage {

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController) { }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad notification_schedulesPage');
    }

}
