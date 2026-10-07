import { AppModule } from "../../app.module";
import { TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { of, BehaviorSubject } from "rxjs";
import { DocumentViewComponent } from "./document-view.component";
describe("DocumentViewComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
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
    const fixture = TestBed.createComponent(DocumentViewComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim().length).toBeGreaterThan(0);
  });
});
