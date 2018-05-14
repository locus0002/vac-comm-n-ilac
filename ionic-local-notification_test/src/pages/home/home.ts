import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { QRScanner } from '@ionic-native/qr-scanner';
import { UtilsProvider } from '../../providers/utils/utils';
import { CampusMapPage } from '../campusmap/campusmap';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  createdCode:string = "ID-IONIC";
  currentTeams: Array<{
    id: string,
    teamName: string,
    teamKey: string,
    imageURL: string,
    imageFileName: string,
    points: string,
    difference: string,
    imagePath: string
  }> = [];

  constructor(
              public navCtrl: NavController,
              public localNotCtrl: LocalNotifications,
              public alertCtrl: AlertController,
              public platform: Platform,
              public storage: NativeStorage,
              public facebook: Facebook,
              public qrCtrl: QRScanner,
              public utilsCtrl: UtilsProvider,
              public http:HttpClient
            ) {
      
      this.platform.ready().then(() => {
        this.testNotification();
        this.testStorage();
      });

  }

  testNotification(){
    
    let todayTime = new Date();
    todayTime.setMinutes(todayTime.getMinutes() + 1);

    this.localNotCtrl.schedule({
      id:1,
      title:'Ass',
      text:'Your big ass',
      trigger: { at: todayTime }
    });
  }

  testStorage(){

    console.log("Enter");

    this.storage.setItem("TEST_DATA", {message:'information saved'})
      .then(
        () => {console.log("data saved")},
        (error) => { console.log("Error", JSON.stringify(error)); }
      );

    console.log("Data saved");

    this.storage.getItem("TEST_DATA").then(
      (data) => {
        console.log("Enter promise");
        if(data){
          console.log("data: " + data.message);
        }else{
          console.log("No data");
        }
      }
    );
  }

  testFacebook(){

    let permission = new Array<string>();

    permission = ["public_profile"];
    this.facebook.login(permission)
      .then((responseFB) => {

        let userId = responseFB.authResponse.userID,
            params = new Array<string>();

        this.facebook.api("/me?fields=gender,email,first_name,last_name,age_range,birthday,currency,hometown,link,location", params)
          .then((userFB) => {
            userFB.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";

            let bodyDatta = 'name=' + userFB.first_name + '&mail=' + userFB.email + '&last_name=' + userFB.last_name + '&id=' + userFB.id + '&gender=' + userFB.gender;
            console.log("Facebook data: " + bodyDatta);
            
          });
      }, (error) => {
        console.log("Error in login permission: " + error);
      });
  }

  testQRScanner(){

    //i need to remember that i add a new variable in variables.scss file
    
    this.qrCtrl.prepare()
      .then(
        (status) => {
          if(status.authorized){

            let scanSub = this.qrCtrl.scan().subscribe(
              (text:string) => {
                console.log("Scanned something: " + text);

                this.qrCtrl.hide();
                scanSub.unsubscribe();
              }
            );

            this.qrCtrl.resumePreview();
            this.qrCtrl.show()
              .then(
                (data) => {
                  console.log("Data showing: " + data.showing);
                },
                (error) => {
                  console.log("Error: " + JSON.stringify(error));
                }
              );

          }else if(status.denied) {

            console.log("qrScanner is denied");
            this.alertCtrl.create({
              title: 'Permisson Denied',
              message:'It does not permission to use the camera.',
              buttons:["Accept"]
            }).present();

          }else {

            console.log("qrScanner is unknown");
            this.alertCtrl.create({
              title: 'Permisson unknown',
              message:'It does not permission to use the camera.',
              buttons:["Accept"]
            }).present();
          }
        }
      )
    .catch(
      (errorScan) => {
        console.log("QR Error: " + JSON.stringify(errorScan));
      }
    );
  }

  testDownloadImages(championshipId:number) {

    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IkFjYSIsInBlcm1pc3Npb25zIjoidmVyX2dydXBvcyx2ZXJfZ3J1cG9zX3ByaXZhZG9zLHZlcl9ncnVwb3NfcHVibGljb3MsY3JlYXJfZ3J1cG8sbW9kaWZpY2FyX2dydXBvLGJvcnJhcl9ncnVwbyx2ZXJfcHVudHVhY2lvbixvYnRlbmVyX2RpbmVybyxoYWNlcl9xdWluZWxhLHZlcl9tZW51X3BhcnRpY2lwYW50ZSx2ZXJfbWVudV9ncnVwb3NfcGFydGljaXBhbnRlLHZlcl9tZW51X2pvcm5hZGFfcGFydGljaXBhbnRlLGNhcmdhcl9ncnVwbyxpbnZpdGFyX3BhcnRpY2lwYW50ZSx1bmlyc2VfZ3J1cG8sY2FtYmlhcl9jb250cmFzZcOxYSxhZ3JlZ2FyX2NhbXBlb25hdG9fZ3J1cG8sY2FyZ2FyX3B1bnR1YWNpb25fY2FtcGVvbmF0byx2ZXJfY2FtcGVvbmF0b3MsZWxpbWluYXJfY2FtcGVvbmF0b19ncnVwbyx2ZXJfbWVudV9jcmVkaXRvcyxjYXJnYXJfYmFsYW5jZV9jdWVudGEsY2FyZ2FyX21vdmltaWVudG9zIiwicHJvZmlsZSI6MiwiaXNzIjoianF1aW5lbGEiLCJuYW1lIjoiVmxhZGltaXIiLCJpZCI6MjMsImV4cCI6MTUyNjEwOTk2Mn0.RTkPJxmm6udB_m56_C2XdiIFEJyo0Mi0OOT6xFcFwPw",
        headers = { headers: new HttpHeaders(
          { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json, text/plain'
          }
        )};
    
    let bodyDatta = 'token=' + token + '&championship=' + championshipId;

    this.http.get<any>(
      'https://www.juegaquinielas.com/standing-scores/championship?' + bodyDatta,
      headers
    )
      .subscribe(dataResponse => {

        let auxTeams = this.utilsCtrl.parserPositionTableData(dataResponse);
        this.utilsCtrl.synchronizeImages(auxTeams).then((dataImages) => {
          auxTeams = auxTeams.map(function (currentElemnt) {
            currentElemnt.imagePath = dataImages[currentElemnt.teamKey] || '';
            return currentElemnt;
          });
          
          this.currentTeams = auxTeams;
        })
        .catch((errorSyn) => {
          this.alertCtrl.create(
            {
              title: 'Error',
              message: JSON.stringify(errorSyn),
              buttons: ['Aceptar']
            }
          ).present();
        });

      }, error => {

        this.alertCtrl.create(
          {
            title: 'Error',
            message: JSON.stringify(error),
            buttons: ['Aceptar']
          }
        ).present();
      });
  }

  tesOpenMaps(){
    this.navCtrl.push(CampusMapPage);
  }
}
