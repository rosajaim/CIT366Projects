import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs/subject';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class DocumentService {

  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  maxDocumentId: number;

  constructor(private http: Http) {
    this.initDocuments();
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (let document in this.documents) {
      let currentId = parseInt(this.documents[document].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();

  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === null || newDocument === null) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document === null) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  initDocuments() {
    this.http.get('https://jaimecms-f8238.firebaseio.com/documents.json')
      .map(
        (response: Response) => {
          const documents: Document[] = response.json();
          return documents;
        }
      )
      .subscribe(
        (documentsReturned: Document[]) => {
          this.documents = documentsReturned;
          this.maxDocumentId = this.getMaxId();
          const documentsListClone: Document[] = this.documents.slice();
          this.documentListChangedEvent.next(documentsListClone);
        }
      );
  }

  storeDocuments() {
    this.http.put('https://jaimecms-f8238.firebaseio.com/documents.json',
      JSON.stringify(this.documents),
      'Content-Type: application/json',)
      .subscribe(
        () => {
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
  }

}
