import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@ng-mf/data-access-user';
import { CANCELACION_PASOS } from '../../enum/cancelacion-servicios-extraordinarios.enum';
import { CancelarSolicitudComponent } from '../../components/cancelar-solicitud/cancelar-solicitud.component';
import { Modal } from 'bootstrap';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

/**
 * Componente para manejar la cancelación de servicios extraordinarios.
 * Controla la navegación entre pasos con validación de formularios y confirmación modal.
 */
@Component({
  selector: 'app-cancelacion-extraordinarios-page',
  templateUrl: './cancelacion-extraordinarios-page.component.html',
})
export class CancelacionExtraordinariosPageComponent {
  /**
   * Referencia al modal principal de confirmación de cancelación.
   * Se muestra cuando el formulario es válido y el usuario quiere proceder.
   */
  @ViewChild('modalConfirmarCancelarSolicitud', { static: false }) modalConfirmarCancelarSolicitud!: ElementRef;

  /**
   * Referencia al modal de advertencia para formularios inválidos.
   * Se muestra cuando faltan campos obligatorios por completar.
   */
  @ViewChild('modalConfirmar', { static: false }) modalConfirmar!: ElementRef;

  /**
   * Instancia de Bootstrap Modal para controlar la visualización.
   * Se utiliza para mostrar/ocultar los diferentes modales del componente.
   */
  modalInstance!: Modal;

  /**
   * Referencia al componente wizard para navegación entre pasos.
   * Controla los métodos siguiente() y atras() del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al primer paso del wizard para validación de formulario.
   * Se utiliza para verificar si el formulario está completo antes de continuar.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Lista de configuración de pasos del wizard de cancelación.
   * Define la estructura y contenido de cada paso del proceso.
   */
  pantallasPasos: ListaPasosWizard[] = CANCELACION_PASOS;

  /**
   * Índice del paso actual en el wizard.
   * Se actualiza conforme el usuario navega entre pasos.
   */
  indice: number = 1;

  /**
   * Configuración para el componente de navegación de pasos.
   * Incluye número de pasos, índice actual y textos de botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Guardar y firmar',
  };

  /**
   * Referencia al componente de cancelación de solicitud.
   * Se utiliza para acceder a los métodos y propiedades del componente hijo.
   */
  @ViewChild(CancelarSolicitudComponent)
  cancelarSolicitudComp!: CancelarSolicitudComponent;

  /**
   * Folio de la solicitud de cancelación.
   * Se utiliza para identificar de manera única la solicitud en el sistema.
   */
  public folio: string = '';

  /**
   * Almacena temporalmente la acción del usuario mientras se valida.
   * Se utiliza para ejecutar la navegación después de la confirmación modal.
   */
  valorIndicePendiente: AccionBoton | null = null;

  /**
   * Maneja las acciones de navegación con validación previa.
   * Valida el formulario y muestra el modal correspondiente según el resultado.
   */
  getValorIndice(e: AccionBoton): void { 
    this.valorIndicePendiente = e;
    if (this.pasoUnoComponent.isFormValid()) { 
      this.folio = this.pasoUnoComponent.getFolio();
      this.abrirModal();
    }
    else {  
      this.pasoUnoComponent.markFormAsTouched();
      if (this.modalConfirmar) {
        this.modalInstance = new Modal(this.modalConfirmar.nativeElement);
        this.modalInstance.show();
      }
    }
  }

  /**
   * Muestra el modal de confirmación principal.
   * Se ejecuta cuando el formulario es válido y el usuario quiere continuar.
   */
  abrirModal(): void {
    if (this.modalConfirmarCancelarSolicitud) {
      this.modalInstance = new Modal(this.modalConfirmarCancelarSolicitud.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
   * Ejecuta la navegación confirmada por el usuario.
   * Oculta el modal y navega al paso correspondiente en el wizard.
   */
  abrirModalSi(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    if (this.valorIndicePendiente && this.valorIndicePendiente.valor > 0 && this.valorIndicePendiente.valor < 3) {
      this.indice = this.valorIndicePendiente.valor;
      if (this.wizardComponent) {
        if (this.valorIndicePendiente.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }
  /**
   * Cierra el modal de advertencia.
   * Se ejecuta cuando el usuario confirma que desea continuar.
   */
  abrirModalAceptar(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}

