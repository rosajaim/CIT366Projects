import { Component, Output, EventEmitter } from '@angular/core';
// import {Contact} from './contacts/contact.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string) {
    this.selectedFeatureEvent.emit(selectedEvent);
    console.log(selectedEvent);
  }

}
