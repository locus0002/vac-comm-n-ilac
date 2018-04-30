import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the utils provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utils {

    constructor(public http: Http) {
        console.log('Hello utils Provider');
    }

    buildKey(word:string) {

        if (word) {

            let key = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            key = key.replace(/[^A-Z0-9]/ig, "");
            key = key.toLowerCase();

            return key;
        }
        return '';
    }

    getHourLabel(data: string) {

        if (data) {

            let timeData = data.split(":"),
                hours = parseInt(timeData[0]),
                minutes = timeData[1],
                stringTime = "";

            if (hours < 12) {
                //AM
                let hourString = hours.toString();
                stringTime = (hourString.length == 1 ? '0' + hourString : hourString) + ':' + (minutes.length == 1 ? '0' + minutes : minutes) + ' AM';

            } else {
                //PM
                hours -= 12;
                if (hours == 0) { hours = 12; }
                let hourString = hours.toString();
                stringTime = (hourString.length == 1 ? '0' + hourString : hourString) + ':' + (minutes.length == 1 ? '0' + minutes : minutes) + ' PM';
            }

            return stringTime;
        }
        return "";
    }
}
