import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Utils } from '../../services/utils';

/*
  Generated class for the alarms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-alarms',
    templateUrl: 'alarms.html'
})
export class AlarmsPage {

    txtTime: string;
    alarmList: Array<{ label: string, value: string }>;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController,
                public utilsCtrl: Utils) {

        this.alarmList = this.navParams.get("alarmList") || [];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad alarmsPage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    setAlarm() {

        if (this.txtTime) {

            this.alarmList.push({ label: this.utilsCtrl.getHourLabel(this.txtTime), value: this.txtTime });
            this.dismiss();
        } else {

            this.alertCtrl.create({
                title: 'Validate',
                message: 'You need to set the time of the notification',
                buttons: ['Accept']
            }).present();
        }
    }

}
