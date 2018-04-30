import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ViewController, PopoverController, AlertController, ModalController } from 'ionic-angular';
import { AlarmsPage } from '../alarms/alarms';
import { AutoCompletePage } from '../auto_complete/auto_complete';
import { PopoverMenuPage } from '../popover_menu/popover_menu';
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
    alarmList: Array<{label:string, value:string}> = [];
    wordList: Array<string> = [];

    constructor(
                public navCtrl: NavController, 
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public viewCtrl: ViewController,
                public popoverCtrl: PopoverController,
                public alertCtrl:AlertController,
                public modalCtrl:ModalController) {

        this.setDefaultTime();
    }

    deleteAlarm(alarmIndex: number) {

        this.alertCtrl.create({
            title: 'Delete Alarm',
            message: 'Are you sure that you would like to delete this alarm?',
            buttons: [
                {
                    text: 'Cancel',
                    role:'cancel'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.alarmList.splice(alarmIndex, 1);
                    }
                }
            ]
        }).present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad custom_reminderPage');
    }

    setAlarms() {
        this.modalCtrl.create(AlarmsPage, { alarmList: this.alarmList }).present();
    }

    setWords() {
        console.log("TODO set words");
    }

    setDefaultTime() {
        this.alarmList.push({ label: "10:30 AM", value: "10:00" });
        this.alarmList.push({ label: "02:30 PM", value: "14:30" });
        this.alarmList.push({ label: "06:30 AM", value: "18:30" });
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

    showPopMenu(index:number, type:string, myEvent:any) {

        this.popoverCtrl.create(
            PopoverMenuPage,
            {
                index: index,
                type: type,
                typeView: 'reminder',
                parent: this
            }
        ).present({ ev: myEvent });
    }

}
