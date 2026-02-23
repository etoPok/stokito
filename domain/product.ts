type ProductState =
  | 'registered'
  | 'in_stock'
  | 'for_sale'
  | 'discontinued'
  | 'not_registered';

export class Product {
  private _id: string;
  public name: string;
  public sku: string | null;
  private _salePrice: number;
  private _costPrice: number;
  public description: string;
  public isDiscontinued: boolean;
  public readonly state: ProductState;
  private _createdAt: string;

  constructor(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string,
    isDiscontinued: boolean,
    sku: string | null = null
  ) {
    this._id = id;
    this.name = name;
    this._salePrice = salePrice;
    this._costPrice = costPrice;
    this.sku = sku;
    this.description = description;
    this.state = 'not_registered';
    this.isDiscontinued = isDiscontinued;
    this._createdAt = new Date().toISOString();
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get id(): string {
    return this._id;
  }

  get salePrice(): number {
    return this._salePrice;
  }

  get costPrice(): number {
    return this._costPrice;
  }

  setId(id: string): void {
    this._id = id;
  }
}
