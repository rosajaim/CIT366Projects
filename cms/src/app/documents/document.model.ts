export class Document {
  public Id: number;
  public name: string;
  public description: string;
  public Url: string;
  public children: string;

  constructor(Id: number, name: string, description: string, Url: string, children: string) {
    this.Id = Id;
    this.name = name;
    this.description = description;
    this.Url = Url;
    this.children = children;
  }
}
