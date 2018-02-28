import {Component, Input, OnInit} from '@angular/core';
import {Contact} from '../contact.model';
import {ContactService} from '../contact.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit{
  @Input() contact: Contact;
  id: string;

  constructor(private contactService: ContactService) {
  }

  ngOnInit(){
   this.contactService.contactSelectedEvent.subscribe()
  }

}
