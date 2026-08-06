import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Sidenav } from './sidenav/sidenav';
import { SidenavToggle } from './shared/interfaces/sidenav-toggle';
import { Body } from "./body/body";
@Component({
  selector: 'app-root',
  imports: [CommonModule, Sidenav, Body],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Impact Football Club');

  protected readonly isSideNavCollapsed = signal<boolean>(false);
  protected readonly screenWidth = signal<number>(0);

  onToggleSideNav(data: SidenavToggle): void {
    this.screenWidth.set(data.screenWidth);
    this.isSideNavCollapsed.set(data.collapsed);
  }
}
