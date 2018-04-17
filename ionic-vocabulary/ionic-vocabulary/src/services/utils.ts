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
}
