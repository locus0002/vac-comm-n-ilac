import { Headers, RequestOptions } from '@angular/http';

export const CURRENT_HOST = 'http://192.168.1.76:8081/';
export const HEADERS_OPTIONS = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json;charset=utf-8' }) });
export const WORD_TYPE = { 'Verb': 'V', 'Adjective': 'A', 'Noun': 'N', 'Adverb':'B'};