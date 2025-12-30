export interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

export interface Aggregator<T> {
  createIterator(): Iterator<T>;
}

export class Book {
  constructor(public title: string) {}
}

export class BookShelf implements Aggregator<Book> {
  private books: Book[] = [];

  appendBook(book: Book) {
    this.books.push(book);
  }

  getLength() {
    return this.books.length;
  }

  getBookAt(index: number) {
    return this.books[index];
  }

  createIterator(): Iterator<Book> {
    return new BookShelfIterator(this);
  }
}

export class BookShelfIterator implements Iterator<Book> {
  private index = 0;

  constructor(private bookShelf: BookShelf) {}

  hasNext(): boolean {
    return this.index < this.bookShelf.getLength();
  }

  next(): Book {
    const book = this.bookShelf.getBookAt(this.index);
    this.index++;
    return book;
  }
}
