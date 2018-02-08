export class Message {
  public Id: number;
  public subject: string;
  public msgText: string;
  public sender: string;

  constructor(Id: number, subject: string, msgText: string, sender: string) {
    this.Id = Id;
    this.subject = subject;
    this.msgText = msgText;
    this.sender = sender;
  }
}
