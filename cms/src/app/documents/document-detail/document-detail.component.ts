import { combineLatest } from "rxjs";
import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Component, OnInit } from "@angular/core";
import { Document } from "../document.model";
import { DocumentService } from "../document.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WindRefService } from "../../wind-ref.service";

@Component({
  standalone: false,
  selector: "app-document-detail",
  templateUrl: "./document-detail.component.html",
  styleUrls: ["./document-detail.component.css"],
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;

  private destroyRef = inject(DestroyRef);
  constructor(
    private documentService: DocumentService,
    private windRefService: WindRefService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.nativeWindow = windRefService.getNativeWindow();
  }

  ngOnInit() {
    combineLatest([
      this.route.params,
      this.documentService.documentListChangedEvent,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params]) => {
        this.id = params["id"];
        this.document = this.documentService.getDocument(this.id);
      });
  }

  onView() {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url, "_blank", "noopener,noreferrer");
    }
  }

  onDelete() {
    this.documentService
      .deleteDocument(this.document)
      .subscribe({
        next: () => this.router.navigate(["/documents"]),
        error: () => {},
      });
  }
}
