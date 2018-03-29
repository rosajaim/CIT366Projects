import { Injectable, EventEmitter } from '@angular/core';
import { Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs/Subject';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class ContactService {

  contacts: Contact[] = [];

  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();

  maxContactId: number;

  constructor(private http: Http) {
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
    this.storeContacts()


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
    this.storeContacts()
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
    this.storeContacts()


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
    this.http.get('https://jaimecms-f8238.firebaseio.com/contacts.json')
      .map((response: Response) => {
        const contacts: Contact[] = response.json();
        return contacts;
      })
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.contacts = this.contacts.sort(this.compareName)
          this.maxContactId = this.getMaxId();
          this.contactListChangedEvent.next(this.contacts.slice())
        }
      )
  }

  storeContacts() {
    const contactString = JSON.stringify(this.contacts.slice())
    let headers = new Headers({'Content-type':'application/json'});
    this.http.put('https://jaimecms-f8238.firebaseio.com/contacts.json', contactString, {headers: headers})
      .subscribe(
        () => {
          this.contactListChangedEvent.next(this.contacts.slice())
        })
  }


}
