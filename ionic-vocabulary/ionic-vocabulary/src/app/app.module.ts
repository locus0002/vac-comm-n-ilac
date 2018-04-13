import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Push } from 'ionic-native';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewWordPage } from '../pages/new_word/new_word';
import { Storage } from '@ionic/storage';
import { WordDefinitionPage } from '../pages/word_definition/word_definition';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        NewWordPage,
        WordDefinitionPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        NewWordPage,
        WordDefinitionPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Push, Storage]
})
export class AppModule {}
