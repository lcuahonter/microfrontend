import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente que permite expandir y colapsar una tabla o cualquier otro elemento.
 */
@Component({
  selector: 'app-expandir-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expandir-tabla.component.html',
  styleUrls: ['./expandir-tabla.component.scss']
})
export class ExpandirTablaComponent {
  @Input() title: string = '';
  @Input() isExpanded: boolean = true;

  /**
   * Maneja el evento de expandir/collapse.
   */
  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }
}
