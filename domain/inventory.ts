class Inventory {
  private _id?: number;
  public name: string;
  public location: string;
  private _createdAt: string;

  constructor(name: string, location: string) {
    this.name = name;
    this.location = location;
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

export default Inventory;
