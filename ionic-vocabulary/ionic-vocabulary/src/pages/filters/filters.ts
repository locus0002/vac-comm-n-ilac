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
    filtersApplied: Array<string>;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl:ViewController) { 

        this.parentPage = this.navParams.get("parentPage");
        this.filtersApplied = this.navParams.get("filtersApplied") || [];
        this.setFilterValues();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad filtersPage');
    }

    setFilterValues() {

        let that = this;

        if (this.filtersApplied.length == 0 || this.filtersApplied.length == 5) {

            that.showVerbs = true;
            that.showAdjectives = true;
            that.showNouns = true;
            that.showAdverbs = true;
            that.showPhrases = true;
            return;
        }

        this.filtersApplied.forEach(
            function (filterElmt) {
                switch (filterElmt) {
                    case 'V':
                        that.showVerbs = true;
                        break;
                    case 'A':
                        that.showAdjectives = true;
                        break;
                    case 'N':
                        that.showNouns = true;
                        break;
                    case 'B':
                        that.showAdverbs = true;
                        break;
                    case 'P':
                        that.showPhrases = true;
                        break;
                }
            }
        );
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
