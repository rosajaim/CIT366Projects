import { Component, OnInit, Input } from "@angular/core";
import { Contact } from "../contact.model";

@Component({
  standalone: false,
  selector: "app-contact-item",
  templateUrl: "./contact-item.component.html",
  styleUrls: ["./contact-item.component.css"],
})
export class ContactItemComponent implements OnInit {
  @Input() contact: Contact;

  constructor() {}

  ngOnInit() {}
}
