import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
@Component({
  standalone: false,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "WeLearn CMS";
  username = "";
  password = "";
  constructor(public auth: AuthService) {}
  login() {
    this.auth.login(this.username, this.password);
    this.password = "";
  }
}
