import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { NewSupermarketProductPage } from '../new_supermarket_product/new_supermarket_product';
import * as Constants from '../../services/constants';

/*
  Generated class for the supermarket_list page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-supermarket_list',
    templateUrl: 'supermarket_list.html'
})
export class SupermarketListPage {

    myProductHistorial: Array<any>;
    myProductList: Array<any> = [];
    myAddedProductList: Array<any> = [];

    constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public storage:Storage,
                public loadingCtrl: LoadingController,
                public alertCtrl:AlertController) { 

        this.getMyProducts();
    }

    addProduct() {
        this.modalCtrl.create(NewSupermarketProductPage, { myProductList: this.myProductList, myProductHistorial: this.myProductHistorial }).present();
    }

    editProductAdded() {

        this.alertCtrl.create(
            {
                title:'Man Wroking',
                subTitle: 'I am working in this function',
                buttons: ['Accept']
            }
        ).present();
        /*
         * TODO i need to able another functions when the product was added
         */
    }

    getMyProducts() {

        this.storage.get("PRODUCTS").then(
            (data) => {
                if (data) {

                    this.myProductHistorial = data || [];

                    this.myProductList = this.myProductHistorial.filter(
                        function (currentProductElmnt) {
                            return currentProductElmnt.status == Constants.PRODUCT_STATUS.READY;
                        });

                    this.myAddedProductList = this.myProductHistorial.filter(
                        function (currentProductElmnt) {
                            return currentProductElmnt.status == Constants.PRODUCT_STATUS.ADDED;
                        });
                } else {
                    this.myProductHistorial = [];
                    this.myProductList = [];
                    this.myAddedProductList = [];
                }
            }
        );
    }

    finalizePurchase() {

        let loadingBox = this.loadingCtrl.create(
                {
                    content:'Finishing...'
                }
            );

        loadingBox.present();

        this.storage.set("PRODUCTS", this.myProductHistorial.map(
            function (currentProductElmnt) {
                currentProductElmnt.status = Constants.PRODUCT_STATUS.BOUGHT;
                return currentProductElmnt;
            })).then(
            () => {
                this.myAddedProductList = [];
                this.myProductList = [];
                loadingBox.dismiss();
            }
            );

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad supermarket_listPage');
    }

    productAdded(productIndex: number) {
        
        this.myProductHistorial[this.myProductList[productIndex].index].status = Constants.PRODUCT_STATUS.ADDED;
        this.storage.set("PRODUCTS", this.myProductHistorial);
        this.myAddedProductList.push(this.myProductList[productIndex]);
        this.myProductList.splice(productIndex, 1);
    }

}
