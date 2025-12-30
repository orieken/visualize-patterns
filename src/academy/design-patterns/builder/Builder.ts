export class Product {
  public parts: string[] = [];

  public listParts(): string {
    return `Product parts: ${this.parts.join(', ')}`;
  }
}

export interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}

export class ConcreteBuilder1 implements Builder {
  private product: Product;

  constructor() {
    this.product = new Product();
  }

  public reset(): void {
    this.product = new Product();
  }

  public producePartA(): void {
    this.product.parts.push('PartA1');
  }

  public producePartB(): void {
    this.product.parts.push('PartB1');
  }

  public producePartC(): void {
    this.product.parts.push('PartC1');
  }

  public getProduct(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}

export class Director {
  private builder: Builder;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  public buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }

  public buildFullFeaturedProduct(): void {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}
