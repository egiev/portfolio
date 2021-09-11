import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  age: number = new Date().getFullYear() - 1993;
  years_of_working: number = new Date().getFullYear() - 2014;

  constructor() {}

  ngOnInit(): void {}

  onGoToSection(element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}
