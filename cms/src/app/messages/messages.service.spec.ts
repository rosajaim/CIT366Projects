import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  provideHttpClientTesting,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MessagesService } from "./messages.service";
describe("MessagesService", () => {
  let service: MessagesService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessagesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MessagesService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne("/api/messages").flush({ obj: [] });
  });
  afterEach(() => http.verify());
  it("loads and stores message text through the same-origin API", () => {
    const message = { id: "1", subject: "Hello", msgText: "Body", sender: "" };
    service
      .addMessage(message)
      .subscribe((rows) => expect(rows[0].msgText).toBe("Body"));
    const request = http.expectOne("/api/messages");
    expect(request.request.method).toBe("POST");
    expect(request.request.body.msgText).toBe("Body");
    request.flush({ obj: [message] });
    expect(service.getMessages()).toEqual([message]);
  });
  it("keeps existing state when saving fails", () => {
    service
      .addMessage({ id: "", subject: "Hello", msgText: "Body", sender: "" })
      .subscribe({ error: () => {} });
    http
      .expectOne("/api/messages")
      .flush(
        { error: "Invalid request" },
        { status: 400, statusText: "Bad Request" },
      );
    expect(service.getMessages()).toEqual([]);
  });
});
