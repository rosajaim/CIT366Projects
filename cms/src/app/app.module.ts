import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent} from './app.component';
import { HeaderComponent } from "./header.component";
import { ContactsComponent } from './contacts/contacts.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactDetailComponent } from "./contacts/contact-detail/contact-detail.component";
import { ContactItemComponent } from './contacts/contact-item/contact-item.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentItemComponent } from './documents/document-item/document-item.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesItemComponent } from './messages/messages-item/messages-item.component';
import { MessagesEditComponent } from './messages/messages-edit/messages-edit.component';
import { MessagesListComponent } from './messages/messages-list/messages-list.component';
import {DropdownDirective} from './Shared/dropdown.directive';
import {ContactService} from './contacts/contact.service';
import {MessagesService} from './messages/messages.service';
import {DocumentService} from './documents/document.service';
import { AppRoutingComponent } from './app-routing/app-routing.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContactsComponent,
    ContactListComponent,
    ContactDetailComponent,
    ContactItemComponent,
    DocumentsComponent,
    DocumentListComponent,
    DocumentDetailComponent,
    DocumentItemComponent,
    MessagesComponent,
    MessagesItemComponent,
    MessagesEditComponent,
    MessagesListComponent,
    DropdownDirective,
    AppRoutingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [ContactService, MessagesService, DocumentService],
  bootstrap: [AppComponent]

})
export class AppModule { }
