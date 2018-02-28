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

 currentSender = 'Jaime';

  constructor(private messagesService: MessagesService) { }

  onSendMessage() {
    const subjectContent = this.subjectInputRef.nativeElement.value;
    const msgContent = this.msgTextRef.nativeElement.value;
    const newMessage = new Message("", subjectContent, msgContent, this.currentSender);
    this.addMessageEvent.emit(newMessage);

    this.messagesService.addMessage(newMessage);
    // this.addMessageEvent.emit(newMessage);

  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

  ngOnInit() {
  }

}
