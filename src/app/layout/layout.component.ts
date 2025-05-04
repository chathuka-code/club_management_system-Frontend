import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../components/header/header.component";
import { NavBarComponent } from "../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="main-container">
      <app-nav-bar></app-nav-bar>
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
  imports: [HeaderComponent, NavBarComponent, RouterOutlet]
})
export class LayoutComponent {}