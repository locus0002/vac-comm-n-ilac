import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the current_chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-current_chat',
    templateUrl: 'current_chat.html'
})
export class CurrentChatPage {

    historical: Array<Object>;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

      this.getHistorical();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad current_chatPage');
    }

    getHistorical() {

      console.log("TODO Design how can i save the messages");
    }

}
