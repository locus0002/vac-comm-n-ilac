import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Utils } from '../../services/utils';
import * as Constants from '../../services/constants';

/*
  Generated class for the new_supermarket_product page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-new_supermarket_product',
    templateUrl: 'new_supermarket_product.html'
})
export class NewSupermarketProductPage {

    myProductHistorial: Array<any>;
    myProductList: Array<any>;
    txtDescription: string;
    txtUnit: string;
    txtQuantity: number;

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl:AlertController,
                public storage:Storage,
                public utilsCtrl:Utils) {

        this.myProductList = this.navParams.get("myProductList") || [];
        this.myProductHistorial = this.navParams.get("myProductHistorial") || [];
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad new_supermarket_productPage');
    }

    saveProduct() {

        if (this.txtUnit && this.txtDescription && this.txtQuantity) {

            let currentProductKey = this.utilsCtrl.buildKey(this.txtDescription);

            if (this.validateProduct(currentProductKey)) {

                this.alertCtrl.create({
                    title: 'Product existing',
                    subTitle: 'This product already was added',
                    buttons:['Accept']
                }).present();
                return;
            }

            let existingIndex = this.myProductHistorial.findIndex(function (currentElemntProduct) { return currentElemntProduct.key == currentProductKey; }),
                productObj: any = {};

            if (existingIndex > -1) {

                productObj = this.myProductHistorial[existingIndex];

                productObj.status = Constants.PRODUCT_STATUS.READY;
                productObj.unit = this.txtUnit;
                productObj.unitKey = Constants.UNIT_MEASUREMENT_GROCERY[this.txtUnit];
                productObj.quantity = this.txtQuantity;

                this.myProductHistorial[existingIndex] = productObj;

            } else {

                productObj = {
                    key: currentProductKey,
                    description: this.txtDescription,
                    quantity: this.txtQuantity,
                    unit: this.txtUnit,
                    unitKey: Constants.UNIT_MEASUREMENT_GROCERY[this.txtUnit],
                    status: Constants.PRODUCT_STATUS.READY,
                    index: this.myProductHistorial.length
                };
                this.myProductHistorial.push(productObj);
            }

            this.myProductList.push(productObj);
            this.storage.set("PRODUCTS", this.myProductHistorial);

            this.dismiss();
            this.alertCtrl.create({
                title: 'Success',
                message: 'Your product was added successfully',
                buttons: ['Accept']
            }).present();
            return;
        }
        this.alertCtrl.create({
            title: 'Validate',
            message: 'You need to fill all fields',
            buttons: ['Accept']
        }).present();
    }

    setUnit(unitDescription: string) {

        if (unitDescription) {
            this.txtUnit = unitDescription;
            return;
        }

        this.alertCtrl.create({
            title: 'Validate',
            message: 'You need to select a unit of measurement',
            buttons:['Accept']
        }).present();
    }

    showUnits() {
        let myUnitSelect = this.alertCtrl.create(
            {
                title: 'Unit',
                subTitle:'Select your unit of measurement',
                buttons: [
                    {
                        text: 'Cancel',
                        role:'cancel'
                    },
                    {
                        text: 'Accept',
                        handler: (data) => { this.setUnit(data); }
                    }
                ]
            }
        );

        for (let currentUnitText in Constants.UNIT_MEASUREMENT_GROCERY) {
            myUnitSelect.addInput(
                {
                    type: 'radio',
                    label: currentUnitText,
                    value: currentUnitText
                }
            );
        }

        myUnitSelect.present();
    }

    validateProduct(productKey: string) {

        let existingIndex = this.myProductList.findIndex(
            function (currentElemntProduct) {
                return currentElemntProduct.key == productKey;
            });

        if (existingIndex > -1) { return true; }
        return false;
    }

}
