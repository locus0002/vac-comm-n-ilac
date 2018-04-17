import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the filters page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-filters',
    templateUrl: 'filters.html'
})
export class FiltersPage {

    showVerbs: boolean;
    showAdjectives: boolean;
    showNouns: boolean;
    showAdverbs: boolean;
    showPhrases: boolean;
    parentPage: any;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController) { 

        this.parentPage = this.navParams.get("parentPage");
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad filtersPage');
    }

    setFilters() {

        this.dismiss();
        this.parentPage.filterWords(
            this.showVerbs,
            this.showAdjectives,
            this.showNouns,
            this.showAdverbs,
            this.showPhrases
        );
    }
}
