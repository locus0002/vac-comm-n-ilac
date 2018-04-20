import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'
import { NavController, NavParams, Events, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { NewWordPage } from '../new_word/new_word';
import * as Constants from '../../services/constants';

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
    definitionList: Array<any>;
    hasVerbDefinition: boolean = false;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public events:Events,
                public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public storage:Storage,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {

        this.currentWord = this.navParams.get("currentWord");
        
        events.subscribe('word:updated', (wordParam) => {
            if (wordParam) {
                this.currentWord = wordParam;
            }
        });

        this.getDefinitions();
        this.validateVerbDefinition();
    }

    deleteWord(wordKey: number) {

        let loadBox = this.loadingCtrl.create({
                content:'Deleting word...'
            });

        loadBox.present();
        this.storage.get("MY_DICTIONARY")
            .then((MY_DICTIONARY) => {
                if (MY_DICTIONARY) {
                    let deleteIndex = MY_DICTIONARY.findIndex(
                        function (wordElemnt) {
                            return wordElemnt.internalId == wordKey;
                        }
                    );
                    if (deleteIndex > -1) {

                        MY_DICTIONARY.splice(deleteIndex, 1);
                        this.storage.set("MY_DICTIONARY", MY_DICTIONARY)
                            .then(() => {
                                loadBox.dismiss();
                                this.events.publish('word:deleted', wordKey);
                                this.navCtrl.pop();
                            })
                            .catch((error => {

                                loadBox.dismiss();
                                this.alertCtrl.create({
                                    title: 'Error',
                                    message: 'The dictionary could not be saved',
                                    buttons: ["Accept"]
                                }).present();
                            }));
                    } else {

                        loadBox.dismiss();
                        this.alertCtrl.create({
                            title: 'Error',
                            message: 'The word was not found',
                            buttons: ["Accept"]
                        }).present();
                    }
                } else { loadBox.dismiss(); }
            })
            .catch((error) => {
                loadBox.dismiss();
                this.alertCtrl.create({
                    title: 'Error',
                    message: 'Error getting the dictionary: ' + error.message,
                    buttons:["Accept"]
                }).present();
            });
    }

    editWord() {
        this.navCtrl.push(NewWordPage, { currentWord: this.currentWord });
    }

    getDefinitions() {
        this.definitionList = this.currentWord.definitions.map(function (definitionElemnt) { return { type: Constants.WORD_TYPE_TEXT[definitionElemnt.type], definition: definitionElemnt.definition } });
    }

    ionViewDidEnter() {
        this.events.subscribe('word:updated', (wordParam) => {
            if (wordParam) {
                this.currentWord = wordParam;
                this.getDefinitions();
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad word_viewPage');
    }

    showDeleteConfirmation(wordKey: number) {
        this.actionSheetCtrl.create({
            title: 'Delete Word',
            subTitle: 'Are you sure that you wish to delete this word?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null
                },
                {
                    text: 'Delete',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => { this.deleteWord(wordKey); }
                }
            ]
        }).present();
    }

    validateVerbDefinition() {
        this.hasVerbDefinition = (this.currentWord.definitions.findIndex(function (myDefinition) { return myDefinition.type == 'V' }) > -1);
    }

}
