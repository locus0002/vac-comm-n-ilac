import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the share_p2p page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-share_p2p',
    templateUrl: 'share_p2p.html'
})
export class ShareP2PPage {

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController) { }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad share_p2pPage');
    }

}
