import { BrowserModule } from '@angular/platform-browser'
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChatsPage } from '../pages/chats/chats';
import { ContactsPage } from '../pages/contacts/contacts';
import { CurrentChatPage } from '../pages/current_chat/current_chat';
import { SocketIoConfig, SocketIoModule } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://192.168.1.74:12345', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatsPage,
    ContactsPage,
    CurrentChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatsPage,
    ContactsPage,
    CurrentChatPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
