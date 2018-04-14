import { EventEmitter, Injectable } from '@angular/core';
import { Message} from './message.model';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MessagesService {

  messageChangeEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: Http) {
    this.initMessages();
  }

  getMessages(): Message[] {
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
    if(!message) {
      return;
    }

    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    message.id = '';
    const strMessage = JSON.stringify(message);

    this.http.post('http://localhost:3000/messages', strMessage, {headers: headers})
      .map(
        (response: Response) => {
          return response.json().obj;
        })
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.messageChangeEvent.next(this.messages.slice());
        }
      )
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
    this.http.get('http://localhost:3000/messages')
      .map(
        (response: Response) => {
          return response.json().obj;
        }
      )
      .subscribe(
        (messagesReturned: Message[]) => {
          this.messages = messagesReturned;
          this.maxMessageId = this.getMaxId();
          this.messageChangeEvent.next(this.messages.slice());
        }
      );
  }

  storeMessages() {
    this.http.put('http://localhost:3000/messages',
      JSON.stringify(this.messages),
      'Content-Type: application/jason',)
      .subscribe(
        () => {
          this.messageChangeEvent.next(this.messages.slice());
        }
      );
  }

}
