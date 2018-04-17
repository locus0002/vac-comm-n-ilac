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
import { AutoCompletePage } from '../pages/auto_complete/auto_complete';
import { Utils } from '../services/utils';
import { PopoverMenuPage } from '../pages/popover_menu/popover_menu';
import { FiltersPage } from '../pages/filters/filters';
import { ShareP2PPage } from '../pages/share_p2p/share_p2p';
import { WordViewPage } from '../pages/word_view/word_view';
import { NotificationSchedulesPage } from '../pages/notification_schedules/notification_schedules';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        NewWordPage,
        WordDefinitionPage,
        AutoCompletePage,
        PopoverMenuPage,
        FiltersPage,
        ShareP2PPage,
        NotificationSchedulesPage,
        WordViewPage
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
        WordDefinitionPage,
        AutoCompletePage,
        PopoverMenuPage,
        FiltersPage,
        ShareP2PPage,
        NotificationSchedulesPage,
        WordViewPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Push, Storage, Utils]
})
export class AppModule {}
