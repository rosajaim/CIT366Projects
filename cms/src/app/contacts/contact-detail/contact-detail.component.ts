import {Component, OnChanges, OnInit, Input} from '@angular/core';
import {Contact} from "../contact.model";
@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  @Input() contact: Contact;
  // export class ContactDetailComponent implements OnChanges {

  // @Input() contact: Contacts;
  // contactGroup[];
  constructor() {
  //  this.contact = new Contact(id: "", name:"", email:"", phone:"", imageUrl:"", group:[]);
  }

 // ngOnInit() {
 //   this.contactGroup = this.contact.group;
  //

}
