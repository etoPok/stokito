type ProductState =
  | "registered"
  | "in_stock"
  | "for_sale"
  | "discontinued"
  | "not_registered";

export class Product {
  private _id?: number;
  public name: string;
  public sku: string | null;
  public description: string;
  public isDiscontinued: boolean;
  public readonly state: ProductState;
  private _createdAt: string;

  constructor(
    name: string,
    description: string,
    isDiscontinued: boolean,
    sku: string | null = null,
  ) {
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.state = "not_registered";
    this.isDiscontinued = isDiscontinued;
    this._createdAt = new Date().toISOString();
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get id(): number | undefined {
    return this._id;
  }

  setId(id: number): void {
    this._id = id;
  }
}
