import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, tap } from "rxjs";
import { Contact } from "./contact.model";
@Injectable()
export class ContactService {
  contacts: Contact[] = [];
  contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
  contactSelectedEvent = new EventEmitter<Contact>();
  constructor(private http: HttpClient) {
    this.initContacts();
  }
  getContacts() {
    return this.contacts.slice();
  }
  getContact(id: string) {
    return this.contacts.find((row) => row.id === id) || null;
  }
  private update(rows: Contact[]) {
    this.contacts = rows;
    this.contactListChangedEvent.next(rows.slice());
  }
  initContacts() {
    this.http
      .get<any>("/api/contacts")
      .subscribe({ next: (r) => this.update(r.obj), error: () => {} });
  }
  addContact(row: Contact) {
    return this.http.post<any>("/api/contacts", row).pipe(
      map((r) => r.obj as Contact[]),
      tap((rows) => this.update(rows)),
    );
  }
  updateContact(original: Contact, row: Contact) {
    return this.http
      .patch<any>("/api/contacts/" + encodeURIComponent(original.id), row)
      .pipe(
        map((r) => r.obj as Contact[]),
        tap((rows) => this.update(rows)),
      );
  }
  deleteContact(row: Contact) {
    return this.http
      .delete<any>("/api/contacts/" + encodeURIComponent(row.id))
      .pipe(
        map((r) => r.obj as Contact[]),
        tap((rows) => this.update(rows)),
      );
  }
}
