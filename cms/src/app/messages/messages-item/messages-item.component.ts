import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../message.model";
import { ContactService } from "../../contacts/contact.service";
import { MessagesService } from "../messages.service";
@Component({
  standalone: false,
  selector: "app-messages-item",
  templateUrl: "./messages-item.component.html",
  styleUrls: ["./messages-item.component.css"],
})
export class MessagesItemComponent implements OnInit {
  @Input() message: Message;
  messageSender = "";
  editing = false;
  subject = "";
  body = "";
  constructor(
    private contacts: ContactService,
    private messages: MessagesService,
  ) {}
  ngOnInit() {
    this.messageSender =
      this.contacts.getContact(this.message.sender)?.name || "Administrator";
  }
  edit() {
    this.subject = this.message.subject;
    this.body = this.message.msgText;
    this.editing = true;
  }
  save() {
    this.messages
      .updateMessage(this.message, {
        ...this.message,
        subject: this.subject,
        msgText: this.body,
      })
      .subscribe({
        next: () => {
          this.editing = false;
        },
        error: () => {},
      });
  }
  remove() {
    this.messages.deleteMessage(this.message).subscribe({ error: () => {} });
  }
}
