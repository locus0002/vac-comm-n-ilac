import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { CurrentChatPage } from '../pages/current_chat/current_chat';
import { ContactsPage } from '../pages/contacts/contacts';
import { ChatsPage } from '../pages/chats/chats';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage = HomePage;
  //rootPage = ContactsPage;
  //rootPage = ChatsPage;
  rootPage = CurrentChatPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
