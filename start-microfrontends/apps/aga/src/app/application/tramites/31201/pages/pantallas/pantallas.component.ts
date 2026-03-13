import { Component, ViewChild } from '@angular/core';

import { 
  CategoriaMensaje,
  DatosPasos, 
  ListaPasosWizard, 
  Notificacion,
  TipoNotificacionEnum,
  WizardComponent
} from '@libs/shared/data-access-user/src';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/enums/31201/aviso-unico.enum';

import { AccionBoton } from '../../models/aviso.model';
import { DatosComponent } from '../datos/datos.component';

/**
 * @component
 * @name PantallasComponent
 * @description
 * Componente que gestiona las pantallas del flujo del trámite.
 * Controla los pasos del wizard y la navegación entre ellos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrl: './pantallas.component.scss'
})
export class PantallasComponent {
  /**
   * @property {ListaPasosWizard[]} pantallasPasos
   * @description
   * Lista de pasos del wizard que se muestran en el flujo del trámite.
   */
  pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
   * @property {number} indice
   * @description
   * Índice actual del paso en el wizard. Inicialmente se establece en 1.
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * @description
   * Referencia al componente del wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {DatosComponent} datosComponent
   * @description
   * Referencia al componente de datos (Paso 1) para acceso a validaciones.
   */
  @ViewChild('datosRef') datosComponent!: DatosComponent;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Configuración de notificación para mostrar alertas al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {boolean} btnContinuar
   * @description
   * Estado del botón continuar para mostrar/ocultar popup de validación.
   */
  public btnContinuar: boolean = false;

  /**
   * @property {DatosPasos} datosPasos
   * @description
   * Datos relacionados con los pasos del wizard, como el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar'
  };

  /**
   * @method
   * @name getValorIndice
   * @description
   * Actualiza el índice del paso actual y controla la navegación en el wizard.
   * Incluye validación de formularios y muestra popup de error si la validación falla.
   * @param {AccionBoton} e Objeto que contiene el valor del índice y la acción a realizar (continuar o retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let esValido = true;
      if (this.indice === 1) {
          esValido = this.validarPasoUno();
      }
      // El paso 2 (documentos) no requiere una validación de formulario estricta
      if (!esValido) {
        this.mostrarPopupValidacion();
        return;
      }
    }
    if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.indice = e.valor;
      this.actualizarDatosPasos();
      
      if (e.accion === 'cont') {
        this.wizardComponent?.siguiente();
      } else {
        this.wizardComponent?.atras();
      }
    }
  }

  /**
   * @method
   * @name validarPasoUno
   * @description
   * Valida los formularios del paso uno (datos básicos).
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  private validarPasoUno(): boolean {
    if (this.datosComponent) {
      return this.datosComponent.validarFormularios();
    }
    return true;
  }

  /**
   * @method
   * @name mostrarPopupValidacion
   * @description
   * Muestra un popup modal con mensaje de error de validación.
   */
  private mostrarPopupValidacion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal-md',
      titulo: '',
      mensaje: "Existen requisitos obligatorios en blanco o con errores.",
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.btnContinuar = true;
    this.actualizarDatosPasos();
  }



  /**
   * @method
   * @name actualizarDatosPasos
   * @description
   * Actualiza los datos de los pasos del wizard con el índice actual.
   */
  private actualizarDatosPasos(): void {
    this.datosPasos = {
      ...this.datosPasos,
      indice: this.indice
    };
  }
}
