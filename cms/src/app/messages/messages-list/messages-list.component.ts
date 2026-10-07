import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Component, OnInit } from "@angular/core";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";

@Component({
  standalone: false,
  selector: "app-messages-list",
  templateUrl: "./messages-list.component.html",
  styleUrls: ["./messages-list.component.css"],
})
export class MessagesListComponent implements OnInit {
  messages: Message[] = [];

  private destroyRef = inject(DestroyRef);
  constructor(private messagesService: MessagesService) {
    this.messages = this.messagesService.getMessages();
  }

  ngOnInit() {
    this.messagesService.messageChangeEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      });
  }
}
