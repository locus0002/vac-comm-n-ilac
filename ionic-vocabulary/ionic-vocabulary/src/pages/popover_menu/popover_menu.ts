import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the popover_menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-popover_menu',
    templateUrl: 'popover_menu.html'
})
export class PopoverMenuPage {

    type: string;
    typeView: string;
    parentPage: any;
    indexElement: number;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController) { 

        this.type = this.navParams.get("type");
        this.typeView = this.navParams.get("typeView");
        this.parentPage = this.navParams.get("parent");
        this.indexElement = this.navParams.get("index");
    }

    editElement() {
        this.viewCtrl.dismiss();
        this.parentPage.editElement(this.indexElement, this.type);
    }

    deleteElement() {

        switch (this.type) {
            case 'definition':
                this.viewCtrl.dismiss();
                this.parentPage.deleteDefinition(this.indexElement);
                break;
            case 'example':
                this.viewCtrl.dismiss();
                this.parentPage.deleteExample(this.indexElement);
                break;
            case 'alarm':
                this.viewCtrl.dismiss();
                this.parentPage.deleteAlarm(this.indexElement);
                break;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad popover_menuPage');
    }

    notifications() {
        this.viewCtrl.dismiss();
        this.parentPage.notificationsConfiguration();
    }

    setFilters() {
        this.viewCtrl.dismiss();
        this.parentPage.setFilters();
    }

    sharePtwoP() {
        this.viewCtrl.dismiss();
        this.parentPage.shareYourWords();
    }

    synchronize() {
        this.viewCtrl.dismiss();
        this.parentPage.synchronizeWords();
    }
}
