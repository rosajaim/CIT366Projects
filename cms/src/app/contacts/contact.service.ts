import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable()
export class ContactService {

  contacts: Contact[] = [];

  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  maxContactId: number;

  constructor(private http: HttpClient) {
    this.initContacts();

  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  getMaxId(): number {

    let maxId = 0;

    for (let contact of this.contacts) {
      let currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    const strContact = JSON.stringify(newContact);

    this.http.post('http://localhost:3000/contacts', strContact, {headers: headers})
      .map(
        (response: any) => {
          return response.obj;
        })
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          const contactListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactListClone);
        });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const strContact = JSON.stringify(newContact);

    this.http.patch('http://localhost:3000/contacts/' + originalContact.id,
      strContact,
      {headers: headers})
      .map(
        (response: any) => {
          return response.obj;
        })
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          const contactListClone = this.contacts.slice()
          this.contactListChangedEvent.next(contactListClone);
        });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .map(
        (response: any) => {
          return response.obj;
        })
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          const contactListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactListClone);
        });

  }

  compareName(contactA: Contact, contactB: Contact) {
    const nameA = contactA.name.toUpperCase();
    const nameB = contactB.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  initContacts() {
    this.http.get('http://localhost:3000/contacts')
      .map((response: any) => {
          return response.obj;
        }
      )
      .subscribe(
        (contactsReturned: Contact[]) => {
          this.contacts = contactsReturned;
          this.contacts = this.contacts.sort(this.compareName);
          this.maxContactId = this.getMaxId();
          const contactsListClone: Contact[] = this.contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);
        }
      );
  }

  storeContacts() {
    JSON.stringify(this.contacts);
    this.http.put('https://jaredgarciacms.firebaseio.com/contacts.json',
      this.contacts)
      .subscribe(
        () => {
          const contactListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactListClone);
        }
      );
  }


}
