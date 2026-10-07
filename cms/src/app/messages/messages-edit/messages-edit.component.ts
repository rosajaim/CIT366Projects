import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Message } from "../message.model";
import { Contact } from "../../contacts/contact.model";
import { MessagesService } from "../messages.service";

@Component({
  standalone: false,
  selector: "app-messages-edit",
  templateUrl: "./messages-edit.component.html",
  styleUrls: ["./messages-edit.component.css"],
})
export class MessagesEditComponent implements OnInit {
  @ViewChild("subjectRef") subjectInputRef: ElementRef;
  @ViewChild("msgTextRef") msgTextRef: ElementRef;

  constructor(private messagesService: MessagesService) {}

  onSendMessage() {
    const subjectContent = this.subjectInputRef.nativeElement.value;
    const msgContent = this.msgTextRef.nativeElement.value;
    const currentSender = "";
    const newMessage = new Message(
      "",
      subjectContent,
      msgContent,
      currentSender,
    );

    this.messagesService
      .addMessage(newMessage)
      .subscribe({ next: () => this.onClear(), error: () => {} });
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }

  ngOnInit() {}
}
