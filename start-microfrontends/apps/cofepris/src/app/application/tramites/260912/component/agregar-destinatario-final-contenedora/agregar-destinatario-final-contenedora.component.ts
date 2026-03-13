import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tramite260912Store, Tramites260912State } from '../../estados/tramite-260912.store';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';

import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';





/**
 * @component AgregarDestinatarioFinalContenedoraComponent
 * @description Componente que actúa como contenedor para gestionar la funcionalidad de agregar destinatarios finales 
 * en el trámite 260203. Este componente utiliza el store `Tramite260203Store` para administrar el estado del trámite 
 * y delega la lógica de actualización de datos a través de métodos específicos.
 * 
 * @selector app-agregar-destinatario-final-contenedora
 * @standalone true
 * @imports 
 * - CommonModule: Módulo común de Angular que proporciona directivas y servicios básicos.
 * - AgregarDestinatarioFinalComponent: Componente hijo que contiene la lógica específica para agregar destinatarios finales.
 * 
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  @Input() idProcedimiento: number = ID_PROCEDIMIENTO;
  @Input() tramiteState!: Tramites260912State;
  @Input() datoSeleccionado!: Destinatario[];
  @Input() destinatarioFinalTablaDatos!: Destinatario[];

  @Output() updateDestinatarioFinalTablaDatos = new EventEmitter<Destinatario[]>();
  @Output() cancelarDestinario = new EventEmitter<void>();
  @Output() guardarYSalir = new EventEmitter<void>();

  constructor(public tramiteStore: Tramite260912Store) {}

  updateDestinatarioFinalTablaDatosHandler(event: Destinatario[]): void {
    this.updateDestinatarioFinalTablaDatos.emit(event);
  }

  cerrarModalAgregarDestinatarioFinal(): void {
    this.cancelarDestinario.emit();
  }

  cerrarModalGuardarYSalir(): void {
    this.guardarYSalir.emit();
  }

  static openModalAgregarDestinatarioFinal(): void {
    const MODAL_ELEMENT = document.getElementById('modalAgregarDestinatarioFinal');
    interface BootstrapWindow extends Window {
      bootstrap?: {
        Modal: new (element: HTMLElement) => { show: () => void };
      };
    }
    const WIN = window as BootstrapWindow;
    if (MODAL_ELEMENT && WIN.bootstrap) {
      const MODAL = new WIN.bootstrap.Modal(MODAL_ELEMENT);
      MODAL.show();
    }
  }
}
