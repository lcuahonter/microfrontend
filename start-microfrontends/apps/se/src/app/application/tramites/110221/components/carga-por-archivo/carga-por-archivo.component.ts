/**
 * @component
 * @name CargaPorArchivoComponent
 * @description
 * Componente standalone para la carga de archivos en el trámite 110204.
 * Permite seleccionar un archivo y mostrar una alerta cuando se selecciona correctamente.
 * 
 * @imports
 * - CommonModule
 * - ReactiveFormsModule
 * - SharedModule
 * - TituloComponent
 * 
 * @template ./carga-por-archivo.component.html
 * @style ./carga-por-archivo.component.css
 *
 * @property {boolean} mostrarAlerta Indica si la alerta debe mostrarse al usuario.
 *
 * @method cerrarModal
 * Cierra el modal de alerta estableciendo `mostrarAlerta` en `false`.
 *
 * @method onFileSelected
 * Maneja el evento de selección de archivo. Si se selecciona un archivo, muestra la alerta.
 * @param {Event} event Evento de selección de archivo.
 */
import { SharedModule, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


/**
 * Componente standalone para la carga de archivos en el trámite 110204.
 * Permite seleccionar un archivo y mostrar una alerta cuando se selecciona correctamente.
 *
 * @component
 * @example
 * <app-carga-por-archivo></app-carga-por-archivo>
 */
@Component({
  selector: 'app-carga-por-archivo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, TituloComponent],
  templateUrl: './carga-por-archivo.component.html',
  styleUrl: './carga-por-archivo.component.css',
})
export class CargaPorArchivoComponent {
  /**
   * Indica si la alerta debe mostrarse al usuario.
   */
  mostrarAlerta: boolean = false;

  /**
   * Cierra el modal de alerta estableciendo `mostrarAlerta` en `false`.
   */
  cerrarModal(): void {
    this.mostrarAlerta = false;
  }

  /**
   * Maneja el evento de selección de archivo. Si se selecciona un archivo, muestra la alerta.
   * @param event Evento de selección de archivo.
   */
  onFileSelected(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const FILE = INPUT.files && INPUT.files[0];
    if (FILE) {
      this.mostrarAlerta = true;
    }
  }
}
