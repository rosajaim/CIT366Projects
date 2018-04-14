import {Component, OnInit} from '@angular/core';
import {Message} from '../message.model';
import {MessagesService} from '../messages.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {

  messages: Message[] = [];

  constructor(private messagesService: MessagesService) {
    this.messages = this.messagesService.getMessages();

  }

  ngOnInit() {

    this.messagesService.messageChangeEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      });
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
