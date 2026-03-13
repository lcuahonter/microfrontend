import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
})
export class Tooltip implements AfterViewInit {
  @Input() text = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initTooltip();
  }

  private initTooltip(): void {
    if (typeof $ === 'undefined' || typeof $.fn.tooltip !== 'function') {
      console.warn('⚠️ Tooltip plugin not found. Make sure gobmx.js is loaded.');
      return;
    }

    const $el = $(this.el.nativeElement).find('[data-toggle="tooltip"]');

    $el.tooltip({ container: 'body' });
  }
}
