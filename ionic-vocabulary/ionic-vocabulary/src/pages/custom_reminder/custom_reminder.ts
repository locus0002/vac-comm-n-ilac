import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';
import { AlarmsPage } from '../alarms/alarms';
import { AutoCompletePage } from '../auto_complete/auto_complete';

/*
  Generated class for the custom_reminder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-custom_reminder',
    templateUrl: 'custom_reminder.html'
})
export class CustomReminderPage {

    txtReminderName: string;
    txtNumberWords: number = 3;
    alarmList: Array<string> = [];
    wordList: Array<string> = [];

    constructor(
                public navCtrl: NavController, 
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public viewCtrl: ViewController) {

        this.setDefaultTime();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad custom_reminderPage');
    }

    setAlarms() {
        console.log("TODO set alarms");
    }

    setWords() {
        console.log("TODO set words");
    }

    setDefaultTime() {
        this.alarmList.push("10:30 AM");
        this.alarmList.push("02:30 PM");
        this.alarmList.push("06:30 AM");
    }

    setNumberWords() {
        this.actionSheetCtrl.create({
            title: 'Number of Words',
            subTitle: 'How many words Do you wish to remember daily?',
            buttons: [
                {
                    text: 'Two words',
                    handler: () => { this.txtNumberWords = 2; }
                },
                {
                    text: 'Three words',
                    handler: () => { this.txtNumberWords = 3; }
                },
                {
                    text: 'Four words',
                    handler: () => { this.txtNumberWords = 4; }
                },
                {
                    text: 'Five words',
                    handler: () => { this.txtNumberWords = 5; }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).present();
    }

}
