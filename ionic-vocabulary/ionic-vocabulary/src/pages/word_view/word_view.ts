import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewWordPage } from '../new_word/new_word';

/*
  Generated class for the word_view page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-word_view',
    templateUrl: 'word_view.html'
})
export class WordViewPage {

    currentWord: any;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams) { 

        this.currentWord = this.navParams.get("currentWord");
    }

    editWord() {
        this.navCtrl.push(NewWordPage, { currentWord: this.currentWord });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad word_viewPage');
    }

}
