import { AppModule } from "../../app.module";
import { TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { of, BehaviorSubject } from "rxjs";
import { ContactItemComponent } from "./contact-item.component";
import { ContactService } from "../contact.service";
import {
  DragContactDirective,
  DropContactDirective,
} from "../../Shared/contact-drag.directive";
describe("ContactItemComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: ContactService,
          useValue: {
            getContact: () => ({
              id: "1",
              name: "Alice",
              email: "alice@example.com",
              phone: "",
              imageUrl: "",
              group: [],
            }),
            deleteContact: () => of([]),
            addContact: () => of([]),
            updateContact: () => of([]),
            contactListChangedEvent: new BehaviorSubject([]),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "1" }),
            snapshot: { params: { id: "1" } },
          },
        },
      ],
    }).compileComponents();
  });
  it("renders its real template with required dependencies", () => {
    const fixture = TestBed.createComponent(ContactItemComponent);
    fixture.componentInstance.contact = {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      phone: "",
      imageUrl: "",
      group: [],
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim().length).toBeGreaterThan(0);
  });
});
