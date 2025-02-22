import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {

  title: string;
  author: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})

export class BookserviceService {

  apiUrl = 'http://localhost:3000/books';


  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getNumberBooks(): Observable<any>{
    let url = "getnumber";
    return this.http.get(`${this.apiUrl}/${url}`);
  }

  createBook(book: Book): Observable<any> {
    return this.http.post(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<any> {
    console.log(book);
    console.log(book.title);
    return this.http.put(`${this.apiUrl}/${book.title}`, book);
  }

  deleteBook(Title: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${Title}`);
  }
}

