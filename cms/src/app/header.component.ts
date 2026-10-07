import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
@Component({
  standalone: false,
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
