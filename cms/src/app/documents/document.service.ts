import {EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs/subject';

@Injectable()
export class DocumentService {

  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId()
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if(document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {

    let maxId = 0;

   for(let document in this.documents) {
    let currentId = parseInt(this.documents[document].id);
     if(currentId > maxId){
       maxId = currentId;
     }
   }
   return maxId;
  }

  addDocument(newDocument: Document) {
    if(newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    const documentsListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);

  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(originalDocument === null || newDocument === null) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument)
    if(pos < 0 ) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone)

  }

  deleteDocument(document: Document) {
    if(document === null) {
      return
    }

    const pos = this.documents.indexOf(document)
    if( pos < 0 ) {
      return
    }

    this.documents.splice(pos, 1);
    const documentListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentListClone);
  }

}
