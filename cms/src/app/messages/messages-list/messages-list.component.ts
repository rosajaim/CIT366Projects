import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Message} from '../message.model';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  @Input() message: Message;

  messages: Message[] = [
    new Message (1, 'This is test', 'It works!', 'Bro. Jackson'),
    new Message (2, 'Hello World', 'Hello world!', 'Bro. Barzee'),
    new Message (3, 'I like tacos', 'I want tacos', 'Bro. Morrin'),
    new Message (4, 'I am tired', 'Go to sleep', 'Bro. Allred'),
  ];

  constructor() { }

  // @Output() messageAdded = new EventEmitter<Message>();


   onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnInit() {
  }

}
