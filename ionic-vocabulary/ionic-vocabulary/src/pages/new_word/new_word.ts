import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ActionSheetController, Platform, AlertController, LoadingController, ModalController, PopoverController, Events } from 'ionic-angular';
import { WordDefinitionPage } from '../word_definition/word_definition';
import { AutoCompletePage } from '../auto_complete/auto_complete';
import { PopoverMenuPage } from '../popover_menu/popover_menu';
import { WordViewPage } from '../word_view/word_view';
import { Utils } from '../../services/utils';
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
    newWordList: Array<any> = [];
    txtNewWord: string = "";
    txtBaseForm: string;
    txtPreterite: string;
    txtPastParticiple: string;
    myDicctionary: Array<any>;
    currentWord: any;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController,
                public http:Http,
                public storage:Storage,
                public modalCtrl:ModalController,
                public utils:Utils,
                public popoverCtrl:PopoverController,
                public events:Events) { 

        this.getMyDictionary();
        this.currentWord = this.navParams.get("currentWord") || null;

        if (this.currentWord != null) {

            this.exampleList = this.currentWord.examples;
            this.definitionList = this.currentWord.definitions.map(function (definitionElmt) { return { type: Constanst.WORD_TYPE_TEXT[definitionElmt.type], definition: definitionElmt.definition } });
            this.txtNewWord = this.currentWord.word;
            if (this.currentWord.conjugation != null) {
                this.txtBaseForm = this.currentWord.conjugation.base;
                this.txtPreterite = this.currentWord.conjugation.past;
                this.txtPastParticiple = this.currentWord.conjugation.pp;
            }
            
        }
    }

    addDefinition() {
        if (this.validateNewWord()) {

            this.modalCtrl.create(WordDefinitionPage, { definitionList: this.definitionList, type: Constanst.VIEW_TYPE.DEFINITION, title: 'Definition: ' + (this.txtNewWord || ''), placeholder: 'Your definition' }).present();
        } else {

            this.alertCtrl.create({
                title: 'Existing word!',
                subTitle: 'Would you like to review this word?',
                buttons: [
                    {
                        text: 'Cancel',
                        rol:'cancel'
                    },
                    {
                        text: 'Review',
                        handler: () => {
                            console.log('TODO review existing word');
                            //TODO review existing word
                        }
                    }
                ]
            }).present();
        }
    }

    addExample() {

        this.modalCtrl.create(WordDefinitionPage, { definitionList: this.exampleList, type: Constanst.VIEW_TYPE.EXAMPLE, title: 'Example', placeholder: 'Your example' }).present();
    }

    addWord() {
        
        let newWordModal = this.modalCtrl.create(AutoCompletePage, { currentWordList: this.myDicctionary, title: 'New Word', type:'new_word', newWordParent:this });

        newWordModal.onDidDismiss(
            data => {
                if (data) {
                    if (data.isNewWord) {
                        this.txtNewWord = data.newWord;
                    } else {
                        //TODO show the word in view mode
                        console.log('TODO review existing word');
                    }
                }
            }
        );

        newWordModal.present();
    }

    buildWordJSON() {
        if (this.definitionList.length > 0
            && this.txtNewWord) {

            let newWordData = {
                    definitions: this.definitionList.map(function (currentDef) { return { type: Constanst.WORD_TYPE[currentDef.type], definition: currentDef.definition } }),
                    examples: this.exampleList,
                    word: this.txtNewWord,
                    key: this.utils.buildKey(this.txtNewWord),
                    sent:false,
                    validated:false
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

                    return null;
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
                    handler: () => {
                        this.definitionList.splice(currentIndex, 1);
                        let hasVerb = this.definitionList.findIndex(function (currentDef) { return currentDef.type == 'Verb' });
                        if (hasVerb == -1) {
                            this.txtBaseForm = '';
                            this.txtPastParticiple = '';
                            this.txtPreterite = '';
                        }
                    }
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

    editElement(index: number, type: string) {

        switch (Constanst.VIEW_TYPE_LOW[type]) {

            case Constanst.VIEW_TYPE.EXAMPLE:

                this.modalCtrl.create(
                    WordDefinitionPage,
                    {
                        definitionList: this.exampleList,
                        type: Constanst.VIEW_TYPE.EXAMPLE,
                        title: 'Example',
                        placeholder: 'Your example',
                        currentIndex: index
                    }).present();

                break;
            case Constanst.VIEW_TYPE.DEFINITION:

                this.modalCtrl.create(
                    WordDefinitionPage,
                    {
                        definitionList: this.definitionList,
                        type: Constanst.VIEW_TYPE.DEFINITION,
                        title: 'Definition',
                        placeholder: 'Your definition',
                        currentIndex: index
                    }).present();
                break;
        }
    }

    getMyDictionary() {

        this.myDicctionary = [];
        this.storage.get("MY_DICTIONARY")
            .then((MY_DICTIONARY) => {
                if (MY_DICTIONARY) {
                    if (MY_DICTIONARY.length > 0) {
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

    ionViewDidLeave() {
        console.log('ionViewDidLeave new_wordPage');
        if (this.newWordList.length > 0) { this.events.publish('word:created', this.newWordList); }
    }

    saveWord(newWordJSON: any) {
        
        if (this.currentWord != null) {

            let that = this,
                wordIndex = this.myDicctionary.findIndex(
                    function (wordElemnt) {
                        return wordElemnt.internalId == that.currentWord.internalId;
                    });

            newWordJSON['internalId'] = this.currentWord.internalId;
            this.myDicctionary[wordIndex] = newWordJSON;
            this.storage.set("MY_DICTIONARY", this.myDicctionary);
            this.alertCtrl.create({
                title: 'Success',
                message: 'Word updated successfully.',
                buttons: ["Ok"]
            }).present();
            this.events.publish('word:updated', newWordJSON);
            this.navCtrl.pop();
        } else {

            newWordJSON['internalId'] = this.myDicctionary.length == 0 ? 1 : (this.myDicctionary.length + 1);
            this.myDicctionary.push(newWordJSON);
            this.newWordList.push(newWordJSON);
            /*this.newWordList[0] = newWordJSON;
            this.events.publish('word:created', this.newWordList);*/
            this.storage.set("MY_DICTIONARY", this.myDicctionary).then(() => {

                this.alertCtrl.create({
                    title: 'Success',
                    message: 'Word saved successfully.',
                    buttons: ["Ok"]
                }).present();
                this.exampleList = [];
                this.definitionList = [];
                this.txtNewWord = "";
                this.txtBaseForm = "";
                this.txtPastParticiple = "";
                this.txtPreterite = "";
            });
        }
        
    }

    sendWord() {

        let loadBox = this.loadingCtrl.create({
                content:'Saving...'
            }),
            newWordJSON = this.buildWordJSON();

        if (newWordJSON != null) {

            this.alertCtrl.create({
                title: 'Share',
                subTitle: 'Do you want to share your word?',
                message: 'Your word will need an approbation',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            this.saveWord(newWordJSON);
                        }
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
                                        newWordJSON.sent = true;
                                        this.saveWord(newWordJSON);
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

    showPopMenu(myEvent: any, index: number, type: string) {
        
        this.popoverCtrl.create(
            PopoverMenuPage,
            {
                index: index,
                type: type,
                typeView: 'autocomplete',
                parent: this
            }
        ).present({ ev: myEvent });
    }

    showWord(wordSelected: any) {

        this.navCtrl.pop();
        this.navCtrl.push(WordViewPage, { currentWord: wordSelected });
    }

    validateNewWord() {

        if (this.currentWord == null) {
            let key = this.utils.buildKey(this.txtNewWord);
            if (key) {
                let index = this.myDicctionary.findIndex(function (element) {
                    return key == element.key;
                });
                if (index > -1) {
                    return false;
                }
            }
        }
        return true;
    }

}
