import { combineLatest } from "rxjs";
import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Component, OnInit } from "@angular/core";
import { Contact } from "../contact.model";
import { ContactService } from "../contact.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  standalone: false,
  selector: "app-contact-edit",
  templateUrl: "./contact-edit.component.html",
  styleUrls: ["./contact-edit.component.css"],
})
export class ContactEditComponent implements OnInit {
  contact: Contact = null;
  contactGroup: Contact[] = [];
  originalContact: Contact;
  editMode: boolean = false;
  hasGroup: boolean = false;
  invalidGroupContact: boolean = false;
  id: string;

  private destroyRef = inject(DestroyRef);
  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    combineLatest([
      this.route.params,
      this.contactService.contactListChangedEvent,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params]) => {
        this.id = params["id"];

        if (!this.id) {
          this.editMode = false;
          return;
        }

        this.originalContact = this.contactService.getContact(this.id);
        if (this.originalContact === null) {
          return;
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        this.contactGroup = this.contact.group || [];
        if (this.hasGroup) {
          this.contactGroup = JSON.parse(JSON.stringify(this.contactGroup));
        }
      });
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newContact = new Contact(
      this.id,
      values.name,
      values.email,
      values.phone || "",
      values.imageUrl || "",
      this.contactGroup,
    );

    if (!form.valid) return;
    const request = this.editMode
      ? this.contactService.updateContact(this.originalContact, newContact)
      : this.contactService.addContact(newContact);
    request.subscribe({
      next: () => this.router.navigate(["/contacts"]),
      error: () => {},
    });
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (newContact.id === this.contact?.id) {
      return true;
    }

    for (let i = 0; i < this.contactGroup.length; i++) {
      if (newContact.id === this.contactGroup[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    let selectedContact: Contact = $event.dragData;
    this.invalidGroupContact = this.isInvalidContact(selectedContact);
    if (this.invalidGroupContact) {
      return;
    }
    this.contactGroup.push(selectedContact);
    this.invalidGroupContact = false;
  }

  onRemoveItem(idx: number) {
    if (idx < 0 || idx >= this.contactGroup.length) return;

    this.contactGroup.splice(idx, 1);
    this.invalidGroupContact = false;
  }
}
