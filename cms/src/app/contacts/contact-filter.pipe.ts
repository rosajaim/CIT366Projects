import { Pipe, PipeTransform } from "@angular/core";
import { Contact } from "./contact.model";
@Pipe({ standalone: false, name: "contactFilter" })
export class ContactFilterPipe implements PipeTransform {
  transform(contacts: Contact[], [term]: [string]): Contact[] {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes((term || "").toLowerCase()),
    );
  }
}
