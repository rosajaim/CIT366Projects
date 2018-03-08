import { Injectable, EventEmitter } from '@angular/core';
import { Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable()
export class ContactService {

  contacts: Contact[] = [];

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  deleteContact(contact: Contact) {
   if (contact === null) {
     return;
   }

   const pos = this.contacts.indexOf(contact);
   if (pos < 0) {
     return;
   }

   this.contacts.splice(pos, 1);
   this.contactChangedEvent.emit(this.contacts.slice());
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

}
