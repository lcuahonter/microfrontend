import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cargar-archivo-menus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cargar-archivo-menus.component.html'
})
export class CargarArchivoMenusComponent {
  @Input() titulo = 'Archivo: ';
  @Output() cancel = new EventEmitter<void>();

  selectedFile: File | null = null;

  /**
   * Maneja el evento de selección de archivo.
   */
  onFileSelected(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.selectedFile = INPUT.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Maneja el evento de cargar el archivo.
   */
  onCargar(): void {
    if (this.selectedFile) {
      console.warn('Archivo cargado:', this.selectedFile.name);
    } else {
      console.warn('No se cargó ningún archivo');
    }
  }

  /**
   * Maneja el evento de cancelar.
   */
  onCancelar(): void {
    this.cancel.emit();
  }
}
