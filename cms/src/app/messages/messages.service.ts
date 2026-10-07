import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, tap } from "rxjs";
import { Message } from "./message.model";
@Injectable()
export class MessagesService {
  messages: Message[] = [];
  messageChangeEvent = new BehaviorSubject<Message[]>([]);
  messageSelectedEvent = new EventEmitter<Message>();
  constructor(private http: HttpClient) {
    this.initMessages();
  }
  getMessages() {
    return this.messages.slice();
  }
  getMessage(id: string) {
    return this.messages.find((row) => row.id === id) || null;
  }
  private update(rows: Message[]) {
    this.messages = rows;
    this.messageChangeEvent.next(rows.slice());
  }
  initMessages() {
    this.http
      .get<any>("/api/messages")
      .subscribe({ next: (r) => this.update(r.obj), error: () => {} });
  }
  addMessage(row: Message) {
    return this.http.post<any>("/api/messages", row).pipe(
      map((r) => r.obj as Message[]),
      tap((rows) => this.update(rows)),
    );
  }
  updateMessage(original: Message, row: Message) {
    return this.http
      .patch<any>("/api/messages/" + encodeURIComponent(original.id), row)
      .pipe(
        map((r) => r.obj as Message[]),
        tap((rows) => this.update(rows)),
      );
  }
  deleteMessage(row: Message) {
    return this.http
      .delete<any>("/api/messages/" + encodeURIComponent(row.id))
      .pipe(
        map((r) => r.obj as Message[]),
        tap((rows) => this.update(rows)),
      );
  }
}
