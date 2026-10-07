import { combineLatest } from "rxjs";
import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Component, OnInit } from "@angular/core";
import { Contact } from "../contact.model";
import { ContactService } from "../contact.service";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  standalone: false,
  selector: "app-contact-detail",
  templateUrl: "./contact-detail.component.html",
  styleUrls: ["./contact-detail.component.css"],
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;
  id: string;

  private destroyRef = inject(DestroyRef);
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    combineLatest([
      this.route.params,
      this.contactService.contactListChangedEvent,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params]) => {
        this.id = params["id"];
        this.contact = this.contactService.getContact(this.id);
      });
  }

  onDelete() {
    this.contactService
      .deleteContact(this.contact)
      .subscribe({
        next: () => this.router.navigate(["/contacts"]),
        error: () => {},
      });
  }
}
