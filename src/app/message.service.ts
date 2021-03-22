import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  //taulukko johon tulee viestejä siitä mitä sovelluksessa tapahtuu
  //eli tämä on lokikirja
  messages: string[] = [];

  //metodi jolla lisätään tietoa lokitaulukkoon
  add(message: string) {
    this.messages.push(message);
  }
  // putsaa lokin tyhjäksi
  clear() {
    this.messages = [];
  }
}
