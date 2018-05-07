import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { CustomReminderPage } from '../custom_reminder/custom_reminder';
//import { LocalNotifications } from 'ionic-native';

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

    notifyTime: any;
    notifications: any[] = [];
    days: any[];
    chosenHours: number;
    chosenMinutes: number;

    typeReminder: string = "";

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController,
                public modalCtrl: ModalController) { 

        this.testNofitication();
    }

    testNofitication() {

        let myNotTime = new Date();
        myNotTime.setMinutes(myNotTime.getMinutes() + 1);
        this.notifyTime = new Date();
        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
        /*LocalNotifications.schedule(
            {
                id: 1,
                title: 'Hey!',
                text: 'Colas',
                at: myNotTime
            }
        );*/
    }

    addCustomReminder() {
        this.modalCtrl.create(CustomReminderPage).present();
        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad notification_schedulesPage');
    }

    setReminder() {
        console.log("TODO set reminder");
    }

}
