export class Sale {
  private _id: string;
  private _date: string;
  public total: number;

  constructor(id: string, date: string, total: number) {
    this._id = id;
    this._date = date;
    this.total = total;
  }

  get id(): string {
    return this._id;
  }

  get date(): string {
    return this._date;
  }

  public setId(id: string): void {
    this._id = id;
  }
}
