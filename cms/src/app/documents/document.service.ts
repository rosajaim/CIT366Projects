import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, tap } from "rxjs";
import { Document } from "./document.model";
@Injectable()
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documentSelectedEvent = new EventEmitter<Document>();
  constructor(private http: HttpClient) {
    this.initDocuments();
  }
  getDocuments() {
    return this.documents.slice();
  }
  getDocument(id: string) {
    return this.documents.find((row) => row.id === id) || null;
  }
  private update(rows: Document[]) {
    this.documents = rows;
    this.documentListChangedEvent.next(rows.slice());
  }
  initDocuments() {
    this.http
      .get<any>("/api/documents")
      .subscribe({ next: (r) => this.update(r.obj), error: () => {} });
  }
  addDocument(row: Document) {
    return this.http.post<any>("/api/documents", row).pipe(
      map((r) => r.obj as Document[]),
      tap((rows) => this.update(rows)),
    );
  }
  updateDocument(original: Document, row: Document) {
    return this.http
      .patch<any>("/api/documents/" + encodeURIComponent(original.id), row)
      .pipe(
        map((r) => r.obj as Document[]),
        tap((rows) => this.update(rows)),
      );
  }
  deleteDocument(row: Document) {
    return this.http
      .delete<any>("/api/documents/" + encodeURIComponent(row.id))
      .pipe(
        map((r) => r.obj as Document[]),
        tap((rows) => this.update(rows)),
      );
  }
}
