import { Component,OnInit } from '@angular/core';
import { BookserviceService,Book } from '../bookservice.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  books: Book[] = [];
  newBook: Book = {
    title: '',
    author: '',
    price: 0,
  };

  isEditing = false;

  number = 0;

  constructor(private bookService: BookserviceService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        console.log(this.books);
      },
      error: (err) => {
        this.showErrorAlert('Failed to load books', err);
      }
    });
    this.bookService.getNumberBooks().subscribe({
      next: (number) => {
        this.number = number.key;
        console.log(number)
      }
    })
  }

  saveBook() {
    if (!this.newBook.title || !this.newBook.author || this.newBook.price <= 0) {
      this.showErrorAlert('Invalid Input', 'Please fill all fields correctly');
      return;
  }

  if (this.isEditing) {
    // Update existing book
    this.bookService.updateBook(this.newBook).subscribe({
      next: () => {
        this.loadBooks();
        this.resetForm();
      },
      error: (err) => this.showErrorAlert('Update Failed', err)
    });
  }

  else {
    // Create new book
    const bookToCreate = { ...this.newBook };

    this.bookService.createBook(bookToCreate).subscribe({
      next: () => {
        this.loadBooks();
        this.resetForm();
      },
      error: (err) => this.showErrorAlert('Create Failed', err)
    });
  }
}
  editBook(book: Book) {
    this.newBook = { ...book };
    this.isEditing = true;
  }

  deleteBook(title: string) {
    this.bookService.deleteBook(title).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (err) => this.showErrorAlert('Delete Failed', err)
    });
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      price: 0,
    };
    this.isEditing = false;
  }

  async showErrorAlert(header: string, error: any) {
    const alert = await this.alertController.create({
      header: header,
      message: error.message || 'An error occurred',
      buttons: ['Ok :(']
    });

    await alert.present();
  }
}