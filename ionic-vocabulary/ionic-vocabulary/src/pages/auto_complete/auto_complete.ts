import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import { NavController, NavParams, ViewController, AlertController, PopoverController, ModalController, LoadingController, Events } from 'ionic-angular';
import { NewWordPage } from '../new_word/new_word';
import { PopoverMenuPage } from '../popover_menu/popover_menu';
import { FiltersPage } from '../filters/filters';
import { ShareP2PPage } from '../share_p2p/share_p2p';
import { NotificationSchedulesPage } from '../notification_schedules/notification_schedules';
import { WordViewPage } from '../word_view/word_view';
import { Utils } from '../../services/utils';
import * as Constants from '../../services/constants';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the auto_complete page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-auto_complete',
    templateUrl: 'auto_complete.html'
})
export class AutoCompletePage {

    txtNewWord: string = "";
    txtKey: string;
    title: string;
    currentWordList: Array<any> = [];
    currentFilteredWordList: Array<any> = [];
    filteredWordAuxList: Array<any> = [];
    type: string;
    filtersActived: boolean = false;
    filtersApplied: Array<string> = [];
    filtersLabel: Array<string> = [];
    newWordParent: any;

    constructor(
                public navCtrl: NavController, 
                public navParams: NavParams,
                public viewCtrl:ViewController,
                public utils:Utils,
                public alertCtrl:AlertController,
                public storage: Storage,
                public popoverCtrl:PopoverController,
                public modalCtrl:ModalController,
                public http:Http,
                public loadingCtrl:LoadingController,
                public events:Events) {

        this.currentWordList = this.navParams.get("currentWordList") || [];
        this.title = this.navParams.get("title") || "Your Words";
        this.type = this.navParams.get("type") || "words";
        this.newWordParent = this.navParams.get("newWordParent") || null;

        if (this.type == 'words') {
            this.getMyDictionary();
        }
    }

    addWord() {
        this.navCtrl.push(NewWordPage);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    filterWords(showVerbs: boolean, showAdjectives: boolean, showNouns: boolean, showAdverbs: boolean, showPhrases: boolean) {

        let that = this;
        this.filtersApplied = [];

        if (showVerbs) { this.filtersApplied.push(Constants.WORD_TYPE.Verb); }
        if (showAdjectives) { this.filtersApplied.push(Constants.WORD_TYPE.Adjective); }
        if (showNouns) { this.filtersApplied.push(Constants.WORD_TYPE.Noun); }
        if (showAdverbs) { this.filtersApplied.push(Constants.WORD_TYPE.Adverb); }
        if (showPhrases) { this.filtersApplied.push(Constants.WORD_TYPE.Phrase); }

        if (!(this.filtersApplied.length == 5)) {

            this.filtersActived = true;
            this.setFiltersLabel();

            this.filteredWordAuxList = this.currentWordList.filter(
                function (wordElement) {

                    return wordElement.definitions.findIndex(
                        function (definitionElement) {
                            return that.filtersApplied.findIndex(
                                function (filterElement) {
                                    return filterElement == definitionElement.type;
                                }
                            ) > -1;
                        }
                    ) > -1;
                }
            );
            this.currentFilteredWordList = this.filteredWordAuxList;
        } else {
            this.filtersActived = false;
            this.filtersApplied = [];
            this.currentFilteredWordList = this.currentWordList;
            this.setFiltersLabel();
        }
    }

    getMyDictionary() {

        this.storage.get("MY_DICTIONARY")
            .then((MY_DICTIONARY) => {
                if (MY_DICTIONARY) {
                    if (MY_DICTIONARY.length > 0) {

                        this.currentFilteredWordList = [];
                        this.currentWordList = [];
                        this.currentFilteredWordList = this.currentWordList = MY_DICTIONARY;
                    }
                }
            })
            .catch((error) => {
                console.log("Error to get my dicctionary", error);
            });
    }

    getWord(myEvent) {

        if (this.filtersActived) {
            this.currentFilteredWordList = this.filteredWordAuxList;
        } else {
            this.currentFilteredWordList = this.currentWordList;
        }
        let val = myEvent.target.value;

        if (val) {
            if (val.trim()) {
                this.txtKey = '';
                val = this.utils.buildKey(val);
                if (this.filtersActived) {
                    //we only search in own FILTERED words
                    this.currentFilteredWordList = this.filteredWordAuxList.filter(function (item) {
                        return (item.key.indexOf(val) > -1);
                    });
                } else {
                    //we only search in own ALL words
                    this.currentFilteredWordList = this.currentWordList.filter(function (item) {
                        return (item.key.indexOf(val) > -1);
                    });
                }
            }
        }
    }

    getUnsynchronizeWords() {

        return this.currentWordList.filter(function (myWord) {
            return myWord.sent == false;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad auto_completePage');
    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter auto_completePage'); 
    }

    ionViewWillEnter() {

        console.log('type View: ' + this.type);
        if (this.type == 'words') {

            this.events.subscribe('word:created', (wordsParam) => {
                console.log('type View: ' + this.type);
                console.log('wordsParam',wordsParam);
                if (wordsParam) {

                    let that = this;
                    this.events.unsubscribe('word:created');
                    wordsParam.forEach(function (wordParam) {
                        let currentWordIndex = that.currentWordList.findIndex(function (myWordElemnt) {
                            return myWordElemnt.internalId == wordParam.internalId;
                        });
                        if (currentWordIndex == -1) { that.currentWordList.push(wordParam); }
                    });
                }
            });

            this.events.subscribe('word:deleted', (wordKey) => {
                console.log('Deleted index: ' + wordKey);
                if (wordKey) {

                    let wordIndex = this.currentWordList.findIndex(
                        function (wordElemnt) {
                            return wordElemnt.internalId == wordKey;
                        });
                    if (wordIndex > -1) { this.currentWordList.splice(wordIndex, 1); }
                    this.events.unsubscribe('word:deleted');
                }
            });

            this.events.subscribe('word:updated', (wordParam) => {
                if (wordParam) {

                    let wordIndex = this.currentWordList.findIndex(
                        function (wordElemnt) {
                            return wordElemnt.internalId == wordParam.internalId;
                        });
                    if (wordIndex > -1) { this.currentWordList[wordIndex] = wordParam };
                    this.events.unsubscribe('word:updated');
                }
            });
        }
    }

    newWord() {

        let valNewKey = this.utils.buildKey(this.txtNewWord);

        if (this.txtKey) {
            if (valNewKey == this.txtKey) {
                this.viewCtrl.dismiss({ isNewWord: false, key: this.txtKey });
            } else {
                this.viewCtrl.dismiss({ isNewWord: true, newWord: this.txtNewWord });
            }
        } else {
            let matches = this.currentFilteredWordList.filter(function (item) {
                return (item.key == valNewKey);
            });
            if (matches.length > 0) {
                this.viewCtrl.dismiss({ isNewWord: false, key: matches[0].key });
            } else {
                this.viewCtrl.dismiss({ isNewWord: true, newWord: this.txtNewWord });
            }
        }
    }

    notificationsConfiguration() {
        this.navCtrl.push(NotificationSchedulesPage);
    }

    setWord(currentWord) {

        if (this.type == 'new_word') {
            this.dismiss();
            this.newWordParent.showWord(currentWord);
        } else {
            console.log("View current word", currentWord);
            this.navCtrl.push(WordViewPage, { currentWord: currentWord });
        }
        
    }

    setFilters() {

        this.modalCtrl.create(
            FiltersPage,
            {
                typeView: 'words',
                parentPage: this,
                filtersApplied: this.filtersApplied
            }
        ).present();
    }

    setFiltersLabel() {
        this.filtersLabel = this.filtersApplied.map(function (myFilter) { return Constants.WORD_TYPE_TEXT[myFilter] });
    }

    shareYourWords() {
        this.modalCtrl.create(
            ShareP2PPage
        ).present();
    }

    showPopoverMenu(myEvent) {
        this.popoverCtrl.create(
            PopoverMenuPage,
            {
                typeView: 'words',
                parent: this
            }
        ).present(
            {
                ev: myEvent
            }
        );
    }

    synchronizeWords() {

        let loadBox = this.loadingCtrl.create({
                content:'Synchronizing your words...'
            }),
            bodyData = JSON.stringify( this.getUnsynchronizeWords());

        loadBox.present();

        this.http.post(
            Constants.CURRENT_HOST + 'synchronize',
            bodyData,
            Constants.HEADERS_OPTIONS
        )
            .timeout(10000, new Error('Time out execed, Please try later'))
            .subscribe(data => {

                loadBox.dismiss();
                let response = data.json();
                if (response.code == 200) {

                    this.currentWordList = response.data;
                    this.storage.set("MY_DICTIONARY", this.currentWordList);
                    this.alertCtrl.create({
                        title: 'Success',
                        message: 'Words synchronized.',
                        buttons: ["Ok"]
                    }).present();
                } else {

                    this.alertCtrl.create({
                        title: 'Error',
                        message: 'Error: ' + response.msg
                    }).present();
                }

            }, error => {

                loadBox.dismiss();
                console.log("SYNCHRONIZE_ERROR", error);

                this.alertCtrl.create(
                    {
                        title: 'Error',
                        message: 'Error: ' + error.message
                    }
                ).present();
            });
    }

}
