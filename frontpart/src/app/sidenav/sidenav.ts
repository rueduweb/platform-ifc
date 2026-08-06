import { CommonModule } from '@angular/common';
import { Component, output, signal, OnInit, HostListener } from '@angular/core';
import { navbarData } from './nav-data';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SidenavToggle } from '../shared/interfaces/sidenav-toggle';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav implements OnInit {

  public onToggleSidenav = output<SidenavToggle>();
  public screenWidth = signal<number>(0);
  public collapsed = signal<boolean>(false);
  public navData = signal(navbarData);

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth.set(window.innerWidth);
    if(this.screenWidth() <= 768) {
      this.collapsed.set(false);
      this.onToggleSidenav.emit({screenWidth: this.screenWidth(), collapsed: this.collapsed()});
    }
  }

  ngOnInit(): void {
    this.screenWidth.set(window.innerWidth);
  }

  toggleCollapse(): void {
    this.collapsed.set(!this.collapsed());
    this.onToggleSidenav.emit({screenWidth: this.screenWidth(), collapsed: this.collapsed()});
  }

  closeSidenav(): void {
    this.collapsed.set(false);
    this.onToggleSidenav.emit({screenWidth: this.screenWidth(), collapsed: this.collapsed()});
  }
}
