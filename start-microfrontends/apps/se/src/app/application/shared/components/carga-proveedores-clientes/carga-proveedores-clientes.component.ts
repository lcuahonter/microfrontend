import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { TABLA_DATOS, TEXTOS } from '../../constantes/carga-proveedores-clientes.enum';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-carga-proveedores-clientes',
  standalone: true,
  imports: [CommonModule, TituloComponent],
  templateUrl: './carga-proveedores-clientes.component.html',
  styleUrl: './carga-proveedores-clientes.component.scss'
})
export class CargaProveedoresClientesComponent {
  /** Contiene los textos y mensajes utilizados en el componente para mostrar información y ayudas al usuario. */
  public TEXTOS = TEXTOS;

  /** Arreglo que contiene la información de las columnas y su posición para mostrar en la tabla de ejemplo de carga por archivo. */
  public tablaDatos: { posicion: number, dato: string }[] = TABLA_DATOS;

  /** Almacena el nombre del archivo seleccionado por el usuario para la carga por archivo. */
  public filaSeleccionadaNombre: string | null = null;
  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

   /**
   * Constructor de la clase CargaPorArchivoComponent.
   * @param {Router} router - Servicio de Angular para la navegación.
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular para obtener información sobre la ruta actual.
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  /**
   * Navega a la ruta de acciones
   */
  cambioPathe(): void {
    this.router.navigate(['../action'], {
      relativeTo: this.activatedRoute,
    });
  }

    /**
   * Cierra el popup de carga por archivo.
   * 
   * Emite el evento `cerrarPopup` para notificar al componente padre que
   * se debe cerrar el popup correspondiente.
   */
  cerrarCargaProveedoresClientes(): void {
    this.cerrarPopup.emit();
  }

  /**
   * Maneja el evento de selección de archivo y asigna el nombre del archivo seleccionado a la variable correspondiente.
   * @param event - Evento de cambio del input de archivo.
   */
  onFilaSeleccionada(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.filaSeleccionadaNombre = INPUT.files[0].name;
    }
  }

  /**
   * Devuelve el nombre del archivo seleccionado o el texto por defecto si no hay archivo seleccionado.
   * @returns {string} Nombre del archivo o texto por defecto.
   */
  get fila(): string {
    return this.filaSeleccionadaNombre ? this.filaSeleccionadaNombre : this.TEXTOS.CARGA_DE_ARCHIVO_DE_TEXTO;
  }
}
