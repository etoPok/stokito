class Inventory {
  private _id: string;
  public name: string;
  public location: string;
  private _date: string;

  constructor(id: string, name: string, location: string, date: string) {
    this._id = id;
    this.name = name;
    this.location = location;
    this._date = date;
  }

  get createdAt(): string {
    return this._date;
  }

  get id(): string {
    return this._id;
  }

  setId(id: string): void {
    this._id = id;
  }
}

export default Inventory;
