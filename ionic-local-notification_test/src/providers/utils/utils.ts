import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, normalizeURL } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  imagesPath: any;
  storageDirectory: string;

  constructor(
      public http: HttpClient,
      public platform:Platform,
      public fileTransferCtrl:FileTransfer,
      public storage: NativeStorage,
      public fileCtrl: File) {

      console.log('Hello UtilsProvider Provider');
      if(this.platform.is('ios')){
        this.storageDirectory = this.fileCtrl.documentsDirectory;
      }else{
        console.log("File: " + this.fileCtrl.dataDirectory);
        this.storageDirectory = this.fileCtrl.dataDirectory;
      }
  }

  donwloadImage(teamsNotFound: Array<any>): Promise<any> {
    
    if (teamsNotFound.length > 0) {

      const fileTrans: FileTransferObject = this.fileTransferCtrl.create();
      let that = this;

      let promisesList = teamsNotFound.map(function (currentElemnt) {
        return fileTrans.download(
          currentElemnt.imageURL,
          that.storageDirectory + currentElemnt.imageFileName)
          .then((entryIMG) => {

            that.imagesPath[currentElemnt.teamKey] = normalizeURL(that.storageDirectory + currentElemnt.imageFileName);
            //in --consolelogs the image doesn't show
          });
      });

      return Promise.all(promisesList).then(() => {
        this.storage.setItem("IMAGES_PATH", this.imagesPath); 
        console.log("Finished");
        return this.imagesPath;
      });
    }else{
      console.log("Finished");
      return this.imagesPath;
    }
  }

  synchronizeImages(teamData: Array<any>): Promise<any> {
    
    let that = this;
    return this.storage.getItem("IMAGES_PATH")
      .then((data) => {

        if (Object.keys(data).length > 0) {
          this.imagesPath = data;
        } else {
          this.imagesPath = {};
        }
        let teamsNotFound = this.prepareData(teamData, that);
        
        console.log("Go! " + teamsNotFound.length);
        return that.donwloadImage(teamsNotFound);
      })
      .catch((errorSyn) => {

        console.log("errorSynchronize: " + JSON.stringify(errorSyn));
        this.imagesPath = {};
        let teamsNotFound = this.prepareData(teamData, that);
        
        console.log("Go! " + teamsNotFound.length);
        return that.donwloadImage(teamsNotFound);
      });
  }

  prepareData(teamData: Array<any>, that:any){

    let teamsNotFound = [];

    if (teamData.length > 0) {
      console.log("Go!");
      if (teamData[0].hasOwnProperty('teamKeyA')) {
        teamData.forEach(function (currentElemnt) {

          if (!that.imagesPath.hasOwnProperty(currentElemnt.teamKeyA)) {
            if (teamsNotFound.findIndex(function (auxElemnt) { return auxElemnt.teamKey == currentElemnt.teamKeyA }) == -1) {
              teamsNotFound.push({
                imageURL: currentElemnt.imageURL_A,
                imageFileName: currentElemnt.imageFileName_A,
                teamKey: currentElemnt.teamKeyA
              });
            }
          }

          if (!that.imagesPath.hasOwnProperty(currentElemnt.teamKeyB)) {
            if (teamsNotFound.findIndex(function (auxElemnt) { return auxElemnt.teamKey == currentElemnt.teamKeyB }) == -1) {
              teamsNotFound.push({
                imageURL: currentElemnt.imageURL_B,
                imageFileName: currentElemnt.imageFileName_B,
                teamKey: currentElemnt.teamKeyB
              });
            }
          }
        });
      } else {
        teamsNotFound = teamData.filter(
          function (currentElemnt) {
            return !that.imagesPath.hasOwnProperty(currentElemnt.teamKey);
          }
        );
      }
    }
    return teamsNotFound;
  }

  ////////I NEED TO DELETE THIS
  parserPositionTableData(dataPositionsTable:Array<Array<string>>) {
    
    let that = this,
        imageDataURL = [];

    if (dataPositionsTable.length > 0) {
      return dataPositionsTable.map(function (currentPosition) {
        imageDataURL = currentPosition[1].split('/');
        return {
          id: currentPosition[0],
          teamName: currentPosition[2],
          teamKey: that.buildKey(currentPosition[2]),
          points: currentPosition[3],
          difference: currentPosition[4],
          //imageURL: Constants.END_POINT_SANDBOX + currentPosition[1].substring(1),
          imageURL: "https://www.juegaquinielas.com/" + currentPosition[1].substring(1),
          imageFileName: imageDataURL[3],
          imagePath: ''
        }
      });
    }
    return [];
  }

  ////////////I NEED TO DELETE THIS
  buildKey(word: string) {
    
    if (word) {

      let key = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      key = key.replace(/[^A-Z0-9]/ig, "");
      key = key.toLowerCase();

      return key;
    }
    return '';
  }
}
