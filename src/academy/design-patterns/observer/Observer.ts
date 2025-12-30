export interface Observer {
  update(news: string): void;
}

export class NewsAgency {
  private observers: Observer[] = [];

  subscribe(o: Observer) {
    this.observers.push(o);
  }

  unsubscribe(o: Observer) {
    this.observers = this.observers.filter(obs => obs !== o);
  }

  notify(news: string) {
    this.observers.forEach(o => o.update(news));
  }
}

export class NewsChannel implements Observer {
  public latestNews = '';

  update(news: string): void {
    this.latestNews = news;
  }
}
