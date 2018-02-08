import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-messages-item',
  templateUrl: './messages-item.component.html',
  styleUrls: ['./messages-item.component.css']
})
export class MessagesItemComponent implements OnInit {
  @Input() message: Message;


  ngOnInit() {
  }
}
