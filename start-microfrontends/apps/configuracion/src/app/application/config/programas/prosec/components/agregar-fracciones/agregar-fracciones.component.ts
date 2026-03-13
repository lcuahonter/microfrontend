import { Component, EventEmitter, Output } from '@angular/core';
import { TreeDataSelectComponent } from '../tree-data-select/tree-data-select.component';

@Component({
  selector: 'app-agregar-fracciones',
  standalone: true,
  templateUrl: './agregar-fracciones.component.html',
  imports: [TreeDataSelectComponent]
})
export class AgregarFraccionesComponent {
  @Output() cancelEmitter = new EventEmitter<void>();

  onCancelAction(): void {
    this.cancelEmitter.emit();
  }
}
