import {Component, OnInit, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import {Message} from '../message.model';
import {Contact} from '../../contacts/contact.model';
import {MessagesService} from '../messages.service';

@Component({
  selector: 'app-messages-edit',
  templateUrl: './messages-edit.component.html',
  styleUrls: ['./messages-edit.component.css']
})
export class MessagesEditComponent implements OnInit {

  @ViewChild('subjectRef') subjectInputRef: ElementRef;
  @ViewChild('msgTextRef') msgTextRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messagesService: MessagesService) { }

  onSendMessage() {
    const subjectContent = this.subjectInputRef.nativeElement.value;
    const msgContent = this.msgTextRef.nativeElement.value;
    const currentSender = "3";
    const newMessage = new Message("", subjectContent, msgContent, currentSender);
    this.addMessageEvent.emit(newMessage);

    this.messagesService.addMessage(newMessage);

  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

  ngOnInit() {
  }

}
