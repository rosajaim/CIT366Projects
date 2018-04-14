import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs/subject';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable()
export class DocumentService {

  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
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

    for (let document of this.documents) {
      let currentId = parseInt(document.id,10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const strDocument = JSON.stringify(newDocument);

    this.http.post('http://localhost:3000/documents', strDocument, {headers: headers})
      .map(
        (response: any) => {
          return response.obj;
        })
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          const documentListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentListClone);
        });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument|| !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const strDocument = JSON.stringify(newDocument);

    this.http.patch('http://localhost:3000/documents/' + originalDocument.id
                    , strDocument
                    , {headers: headers})
      .map(
        (response: any) => {
          return response.obj;
        })
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          const documentListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentListClone);
        });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

   this.http.delete('http://localhost:3000/documents/' + document.id)
     .map(
       (response: any) => {
         return response.obj;
       })
     .subscribe(
       (documents: Document[]) => {
         this.documents = documents;
         const documentListClone = this.documents.slice();
         this.documentListChangedEvent.next(documentListClone);
       });
  }

  initDocuments() {
    this.http.get('http://localhost:3000/documents')
      .map(
        (response: any) => {
          return response.obj;
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
    JSON.stringify(this.documents);
    this.http.put('https://jaimecms-f8238.firebaseio.com/documents.json',
      this.documents)
      .subscribe(
        () => {
          const documentListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentListClone);
        }
      );
  }

}
