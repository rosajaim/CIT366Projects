import { Pipe, PipeTransform } from '@angular/core';
import { Contact} from './contact.model';

@Pipe({
  name: 'contactFilter'
})
export class ContactFilterPipe implements PipeTransform {

  transform(contacts: any, [term]: any): any {
    let filteredArray: Contact[] = [];

   filteredArray = contacts.filter(
     (contact: any) => contact.name.toLowerCase().includes(term.toLowerCase())
   );

    // for(let i = 0; i < contacts.length; i++) {
    //   let contact = contacts[i];
    //   if(contact.name.toLowerCase().includes(term)) {
    //     filteredArray.push(contact);
    //   }
    // }

    if (filteredArray.length < 1) {
      return contacts.slice();
    }
    return filteredArray;
  }

}
