import { Injectable } from "@angular/core";
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
@Injectable({ providedIn: "root" })
export class AuthService {
  authenticated = new BehaviorSubject<boolean>(false);
  ready = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<string>("");
  csrfToken = "";
  private http: HttpClient;
  constructor(backend: HttpBackend) {
    this.http = new HttpClient(backend);
    this.refresh();
  }
  refresh() {
    this.http.get<any>("/api/auth/session").subscribe({
      next: (data) => {
        this.csrfToken = data.csrfToken;
        this.authenticated.next(data.authenticated);
        this.ready.next(true);
      },
      error: () => {
        this.error.next("Unable to connect. Please reload the page.");
        this.ready.next(true);
      },
    });
  }
  login(username: string, password: string) {
    this.error.next("");
    this.http
      .post<any>(
        "/api/auth/login",
        { username, password },
        { headers: this.headers() },
      )
      .subscribe({
        next: (data) => {
          this.csrfToken = data.csrfToken;
          this.authenticated.next(true);
        },
        error: (e) =>
          this.error.next(
            e.status === 429
              ? "Too many attempts. Try again later."
              : "Sign-in failed. Check your username and password.",
          ),
      });
  }
  logout() {
    this.http
      .post("/api/auth/logout", {}, { headers: this.headers() })
      .subscribe({
        next: () => {
          this.authenticated.next(false);
          this.refresh();
        },
        error: () => this.error.next("Unable to sign out. Please retry."),
      });
  }
  headers() {
    return new HttpHeaders({ "X-CSRF-Token": this.csrfToken });
  }
}
