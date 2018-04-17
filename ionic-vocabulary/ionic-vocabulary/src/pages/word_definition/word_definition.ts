import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController, ViewController } from 'ionic-angular';
import * as Constants from '../../services/constants';

/*
  Generated class for the word_definition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-word_definition',
    templateUrl: 'word_definition.html'
})
export class WordDefinitionPage {

    txtNewWordType: string;
    txtDefinition: string;
    definitionList: Array<any>;
    type: string;
    title: string;
    placeHolder: string;
    currentIndex: number;
    currentObject: any;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public alertCtrl: AlertController,
                public viewCtrl: ViewController) { 

        this.definitionList = this.navParams.get("definitionList") || [];
        this.type = this.navParams.get("type") || "";
        this.title = this.navParams.get("title") || "";
        this.placeHolder = this.navParams.get("placeholder") || "";
        this.currentIndex = this.navParams.get("currentIndex");

        if (this.currentIndex > -1) {

            this.currentObject = this.definitionList[this.currentIndex];

            switch (this.type) {

                case Constants.VIEW_TYPE.EXAMPLE:
                    this.txtDefinition = this.currentObject;
                    break;

                case Constants.VIEW_TYPE.DEFINITION:
                    this.txtDefinition = this.currentObject.definition;
                    this.txtNewWordType = this.currentObject.type;
                    break;
            }
        }
    }

    addDefinition() {

        switch (this.type) {
            case Constants.VIEW_TYPE.DEFINITION:

                if (this.txtDefinition && this.txtNewWordType) {

                    if (this.currentIndex > -1) {

                        this.currentObject.definition = this.txtDefinition;
                        this.currentObject.type = this.txtNewWordType;
                        this.definitionList[this.currentIndex] = this.currentObject;
                    } else {

                        this.definitionList.push({
                            definition: this.txtDefinition,
                            type: this.txtNewWordType
                        });
                    }

                    this.dismiss();

                } else {

                    this.alertCtrl.create({
                        title: 'Validate',
                        subTitle: 'You need to fill all fields',
                        buttons: ["Aceptar"]
                    }).present();
                }

                break;
            case Constants.VIEW_TYPE.EXAMPLE:
                if (this.txtDefinition) {

                    if (this.currentIndex > -1) {
                        this.definitionList[this.currentIndex] = this.txtDefinition;
                    } else {
                        this.definitionList.push(this.txtDefinition);
                    }
                    this.dismiss();

                } else {

                    this.alertCtrl.create({
                        title: 'Validate',
                        subTitle: 'You need to fill all fields',
                        buttons: ["Aceptar"]
                    }).present();
                }
                break;
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad word_definitionPage');
    }

    showTypeWordMenu() {
        let typeWordActionSheet = this.actionSheetCtrl.create({
            title: 'Type of new word',
            buttons: [
                {
                    text: 'Verb',
                    icon: !this.platform.is('ios') ? 'grid' : null,
                    handler: () => {
                        this.txtNewWordType = 'Verb';

                    }
                },
                {
                    text: 'Adjective',
                    icon: !this.platform.is('ios') ? 'grid' : null,
                    handler: () => {
                        this.txtNewWordType = 'Adjective';
                    }
                },
                {
                    text: 'Noun',
                    icon: !this.platform.is('ios') ? 'grid' : null,
                    handler: () => {
                        this.txtNewWordType = 'Noun';
                    }
                },
                {
                    text: 'Adverb',
                    icon: !this.platform.is('ios') ? 'grid' : null,
                    handler: () => {
                        this.txtNewWordType = 'Adverb';
                    }
                },
                {
                    text: 'Phrase/Phrasal Verb',
                    icon: !this.platform.is('ios') ? 'grid' : null,
                    handler: () => {
                        this.txtNewWordType = 'Phrase';
                    }
                }
            ]
        });

        typeWordActionSheet.present();
    }
}
