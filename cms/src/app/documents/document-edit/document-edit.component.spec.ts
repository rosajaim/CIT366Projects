import { AppModule } from "../../app.module";
import { TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { of, BehaviorSubject } from "rxjs";
import { DocumentEditComponent } from "./document-edit.component";
import { DocumentService } from "../document.service";
describe("DocumentEditComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: DocumentService,
          useValue: {
            getDocument: () => ({
              id: "1",
              name: "Guide",
              description: "Reference",
              url: "https://example.com",
            }),
            addDocument: () => of([]),
            updateDocument: () => of([]),
            documentListChangedEvent: new BehaviorSubject([]),
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
    const fixture = TestBed.createComponent(DocumentEditComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim().length).toBeGreaterThan(0);
  });
});
