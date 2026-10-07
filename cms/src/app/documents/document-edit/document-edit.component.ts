import { combineLatest } from "rxjs";
import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Component, OnInit } from "@angular/core";
import { DocumentService } from "../document.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Document } from "../document.model";
import { NgForm } from "@angular/forms";

@Component({
  standalone: false,
  selector: "app-document-edit",
  templateUrl: "./document-edit.component.html",
  styleUrls: ["./document-edit.component.css"],
})
export class DocumentEditComponent implements OnInit {
  document: Document;
  originalDocument: Document;
  editMode: boolean = false;
  id: string = "";

  private destroyRef = inject(DestroyRef);
  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    combineLatest([
      this.route.params,
      this.documentService.documentListChangedEvent,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params]) => {
        this.id = params["id"];

        if (!this.id) {
          this.editMode = false;
          return;
        }

        this.originalDocument = this.documentService.getDocument(this.id);
        if (this.originalDocument === null) {
          return;
        }

        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      });
  }

  onSubmit(form: NgForm) {
    let values = form.value;
    let newDocument = new Document(
      "1",
      values.documentTitle,
      values.documentDescription || "",
      values.documentUrl,
    );

    if (!form.valid) return;
    const request = this.editMode
      ? this.documentService.updateDocument(this.originalDocument, newDocument)
      : this.documentService.addDocument(newDocument);
    request.subscribe({
      next: () => this.router.navigate(["/documents"]),
      error: () => {},
    });
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
