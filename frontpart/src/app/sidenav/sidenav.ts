import { CommonModule } from '@angular/common';
import { Component, output, signal, OnInit, HostListener, inject } from '@angular/core';
import { navbarData } from './nav-data';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SidenavToggle } from '../shared/interfaces/sidenav-toggle';
import { Auth } from '../features/auth/data/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav implements OnInit {

  public onToggleSidenav = output<SidenavToggle>();
  public screenWidth = signal<number>(0);
  // Desktop
  public collapsed = signal<boolean>(false);

  // Mobile
  public mobileMenuOpen = signal<boolean>(false);
  public navData = signal(navbarData);

  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth.set(window.innerWidth);

    if (this.screenWidth() >= 768) {
      this.mobileMenuOpen.set(false);
    }

    this.onToggleSidenav.emit({
      screenWidth: this.screenWidth(),
      collapsed: this.collapsed()
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  ngOnInit(): void {
    this.screenWidth.set(window.innerWidth);

    this.onToggleSidenav.emit({
      screenWidth: this.screenWidth(),
      collapsed: this.collapsed()
    });
  }


  toggleCollapse(): void {

    if (this.isMobile()) {
      this.toggleMobileMenu();
      return;
    }

    this.collapsed.update(value => !value);

    this.onToggleSidenav.emit({
      screenWidth: this.screenWidth(),
      collapsed: this.collapsed()
    });
  }

  closeSidenav(): void {
    if (this.isMobile()) {
      this.mobileMenuOpen.set(false);
      return;
    }

    this.collapsed.set(false);

    this.onToggleSidenav.emit({
      screenWidth: this.screenWidth(),
      collapsed: this.collapsed()
    });
  }


  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // private methods
  private isMobile(): boolean {
    return this.screenWidth() < 768;
  }


}
