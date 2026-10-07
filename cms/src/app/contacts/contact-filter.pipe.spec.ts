import { ContactFilterPipe } from "./contact-filter.pipe";
describe("ContactFilterPipe", () => {
  it("filters names case-insensitively and returns no results for an unmatched term", () => {
    const pipe = new ContactFilterPipe();
    const rows = [
      {
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        phone: "",
        imageUrl: "",
        group: [],
      },
    ];
    expect(pipe.transform(rows, ["AL"])).toEqual(rows);
    expect(pipe.transform(rows, ["missing"])).toEqual([]);
  });
});
