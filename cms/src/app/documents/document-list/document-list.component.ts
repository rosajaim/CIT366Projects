import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Document } from '../document.model';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [
    new Document( 1,
      'CIT 360 - Object Oriented Software Development',
      'This course allows students to find, evaluate, and select solutions to problems that have many right solutions.',
      'https://byui.brightspace.com/d2l/le/content/374376/viewContent/5302876/View',
      ''),
    new Document( 2,
      'CIT 353 - Operating Systems II',
      'This is a senior-level operating system course designed to provide the skills and knowledge necessary to work in the ' +
      'systems administration field.',
      'https://onedrive.live.com/view.aspx?resid=97EBBAC951F8BD5!170063&ithint=file%2cdocx&app=Word&authkey=!AO4dx-auf8PYg88',
      ''),
    new Document( 3,
      'CIT 366 - Full Web Stack Develoment',
      'Learn how develop modern web applications using the MEAN stack',
      'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT%20366%20syllabus.pdft',
      ''),
    new Document( 4,
      'FEDREL 275 - Teachings of the Book of Mormon',
      'This course teaches the doctrines of the Book of Mormon',
      'https://byui.brightspace.com/d2l/le/content/371918/viewContent/5274910/View',
      ''),
    new Document( 5,
      'FDMAT 108 - Mathematical Tools for the Real World ',
      'This course introduces the Quantitative Reasoning Process. This process teaches you to use algebraic, computational, ' +
      'statistical, and graphical tools to make informed decisions',
      'https://byui.brightspace.com/d2l/le/content/377287/viewContent/5332703/View',
      '')
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>()

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

  constructor() { }

  ngOnInit() {
  }

}
