export class SaleDatail {
  private _id: string;
  private _saleId: string;
  private _productId: string;
  private _productName: string;
  public price: number;
  public subtotal: number;
  public quantity: number;

  constructor(
    id: string,
    saleId: string,
    productId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number
  ) {
    this._id = id;
    this._saleId = saleId;
    this._productId = productId;
    this._productName = productName;
    this.price = price;
    this.subtotal = subtotal;
    this.quantity = quantity;
  }

  get id(): string {
    return this._id;
  }
  get saleId(): string {
    return this._saleId;
  }
  get productId(): string {
    return this._productId;
  }
  get productName(): string {
    return this._productName;
  }
}
