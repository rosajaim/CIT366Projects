import { Injectable, EventEmitter } from '@angular/core';
import { Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ContactService {

  contacts: Contact[] = [];

  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId()

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

    for(let contact in this.contacts) {
      let currentId = parseInt(this.contacts[contact].id);
      if(currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if(newContact === null) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);

  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if(originalContact === null || newContact === null) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact)
    if(pos < 0 ) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone)

  }

  deleteContact(contact: Contact) {
    if(contact === null) {
      return
    }

    const pos = this.contacts.indexOf(contact)
    if(pos < 0 ) {
      return
    }

    this.contacts.splice(pos, 1);
    let contactListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);

  }

}
