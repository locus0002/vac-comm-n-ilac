import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController, ViewController } from 'ionic-angular';

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
    definitionList: Array<{ type: string, definition: string }>;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public alertCtrl: AlertController,
                public viewCtrl: ViewController) { 

        this.definitionList = this.navParams.get("definitionList") || [];
    }

    addDefinition() {

        if (this.txtDefinition && this.txtNewWordType) {

            this.definitionList.push({
                definition: this.txtDefinition,
                type: this.txtNewWordType
            });

            this.dismiss();

        } else {

            this.alertCtrl.create({
                title: 'Validate',
                subTitle: 'You need to fill all fields',
                buttons: ["Aceptar"]
            }).present();
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
                }
            ]
        });

        typeWordActionSheet.present();
    }
}
