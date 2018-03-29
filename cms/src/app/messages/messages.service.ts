import { EventEmitter, Injectable } from '@angular/core';
import { Message} from './message.model';
import { Http, Response } from '@angular/http';

@Injectable()
export class MessagesService {

  messageChangeEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: Http) {
    this.initMessages();
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    for(let message of this.messages) {
      if(message.id === id) {
        return message
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangeEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let message in this.messages) {
      let currentId = parseInt(this.messages[message].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;

  }

  initMessages() {
    this.http.get('https://jaimecms-f8238.firebaseio.com/messages.json')
      .map(
        (response: Response) => {
          const messages = response.json();
          return messages;
        }
      )
      .subscribe(
        (messagesReturned: Message[]) => {
          this.messages = messagesReturned;
          this.maxMessageId = this.getMaxId();
          const messagesListClone: Message[] = this.messages.slice();
          this.messageChangeEvent.next(messagesListClone);
        }
      );
  }

  storeMessages() {
    this.http.put('https://jaimecms-f8238.firebaseio.com/messages.json',
      JSON.stringify(this.messages),
      'Content-Type: application/jason',)
      .subscribe(
        () => {
          this.messageChangeEvent.next(this.messages.slice());
        }
      );
  }

}
