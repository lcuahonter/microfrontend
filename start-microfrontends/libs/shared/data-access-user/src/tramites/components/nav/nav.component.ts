import { Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'c-header-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnDestroy {

  dropdownOpen = false;
  private documentClickListener: (() => void) | null = null;

  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen) {
      this.documentClickListener = this.renderer.listen('document', 'click', (e: MouseEvent) => {
        const DROP_DOWN_ELEMENT = this.el.nativeElement.querySelector('.dropdown');
        if (DROP_DOWN_ELEMENT && !DROP_DOWN_ELEMENT.contains(e.target as Node)) {
          this.dropdownOpen = false;
          if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
          }
        }
      });
    } else {
      if (this.documentClickListener) {
        this.documentClickListener();
        this.documentClickListener = null;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }
}