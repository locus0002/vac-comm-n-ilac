import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ActionSheetController, Platform, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { WordDefinitionPage } from '../word_definition/word_definition';
import * as Constanst from '../../services/constants';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the new_word page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-new_word',
    templateUrl: 'new_word.html'
})
export class NewWordPage {

    exampleList: Array<string> = [];
    definitionList: Array<{ type: string, definition: string }> = [];
    txtNewWord: string;
    txtBaseForm: string;
    txtPreterite: string;
    txtPastParticiple: string;
    myDicctionary: Object;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController,
                public http:Http,
                public storage:Storage,
                public modalCtrl:ModalController) { 

        this.getMyDictionary();
    }

    addDefinition() {
        this.modalCtrl.create(WordDefinitionPage, { definitionList: this.definitionList }).present();
    }

    addExample() {

        this.alertCtrl.create({
            title: 'New Example',
            subTitle: 'Add examples as much as you can',
            inputs: [
                {
                    name: 'txtNewExample',
                    placeholder:'Type your example'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { console.log("Operation canceled");  }
                },
                {
                    text: 'Add',
                    handler: (data) => {
                        if (data.txtNewExample) {
                            this.exampleList.push(data.txtNewExample);
                        }
                    }
                }
            ]
        }).present();
    }

    buildWordJSON() {
        if (this.definitionList.length > 0
            && this.txtNewWord) {

            let key = this.txtNewWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            key = key.replace(/[^A-Z0-9]/ig, "");
            key = key.toLowerCase();

            let newWordData = {
                    definitions: this.definitionList.map(function (currentDef) { return { type: Constanst.WORD_TYPE[currentDef.type], definition: currentDef.definition } }),
                    word: this.txtNewWord,
                    key: key,
                    sent:false
                };

            let hasVerb = this.definitionList.findIndex(function (currentDef) { return currentDef.type == 'Verb' });
            if (hasVerb > -1) {
                if (this.txtBaseForm
                    && this.txtPreterite
                    && this.txtPastParticiple) {

                    newWordData['conjugation'] = {
                        'base': this.txtBaseForm,
                        'past': this.txtPreterite,
                        'pp': this.txtPastParticiple
                    };
                } else {

                    this.alertCtrl.create({
                        title: 'Validate',
                        subTitle: 'Your word is a verb, you need to fill these fields [Base form, Definition & Word]',
                        buttons: ["Aceptar"]
                    }).present();
                }
            } else {
                newWordData['conjugation'] = null;
            }

            return newWordData;

        } else {

            this.alertCtrl.create({
                title: 'Validate',
                subTitle: 'At least you need to fill the fields [Word, Definition & Word type]',
                buttons:["Aceptar"]
            }).present();
        }
        return null;
    }

    deleteDefinition(currentIndex: number) {

        this.alertCtrl.create({
            title: 'Delete Definition',
            subTitle: 'Are you sure that you wish to delete this definition?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    handler: () => { this.definitionList.splice(currentIndex, 1); }
                }
            ]
        }).present();
    }

    deleteExample(currentIndex: number) {

        this.alertCtrl.create({
            title: 'Delete Example',
            subTitle: 'Are you sure that you wish to delete this example?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    handler: () => { this.exampleList.splice(currentIndex, 1); }
                }
            ]
        }).present();
    }

    getMyDictionary() {

        this.myDicctionary = {};

        this.storage.get("MY_DICTIONARY")
            .then((MY_DICTIONARY) => {
                if (MY_DICTIONARY) {
                    if (Object.keys(MY_DICTIONARY).length > 0) {
                        this.myDicctionary = MY_DICTIONARY;
                    }
                }
            })
            .catch((error) => {
                console.log("Error to get my dicctionary", error);
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad new_wordPage');
    }

    saveWord(newWordJSON: any) {
        this.storage
    }

    sendWord() {

        let loadBox = this.loadingCtrl.create({
                content:'Saving...'
            }),
            newWordJSON = this.buildWordJSON();

        console.log("Data JSON", newWordJSON);
        if (newWordJSON != null) {

            /*if (this.myDicctionary.hasOwnProperty(newWordJSON.key)) {
                
            }*/

            /*
             * TODO i need to validate if the word that we are saving already exist and wether user wants to overwrite
             */

            this.alertCtrl.create({
                title: 'Share',
                subTitle: 'Do you want to share your word?',
                message: 'Your word will need an approbation',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    },
                    {
                        text: 'Share',
                        handler: () => {
                            loadBox.present();
                            this.http.post(
                                Constanst.CURRENT_HOST + 'new_word',
                                newWordJSON,
                                Constanst.HEADERS_OPTIONS
                            )
                                .timeout(10000, new Error('Time out execed, Please try later'))
                                .subscribe(data => {
                                    let response = data.json();
                                    if (response.code == 200) {

                                        this.alertCtrl.create({
                                            title: 'Success',
                                            subTitle: 'Your word was received successful',
                                            buttons: ["Ok"]
                                        }).present();

                                    } else {

                                        this.alertCtrl.create({
                                            title: 'Error',
                                            subTitle: response.msg,
                                            buttons: ["Ok"]
                                        }).present();
                                    }
                                }, error => {

                                    console.log("Error when i sent the word", error);

                                    this.alertCtrl.create({
                                        title: 'Error',
                                        subTitle: error,
                                        buttons: ["Ok"]
                                    }).present();
                                });
                        }
                    }
                ]
            }).present();
        }
    }

}
