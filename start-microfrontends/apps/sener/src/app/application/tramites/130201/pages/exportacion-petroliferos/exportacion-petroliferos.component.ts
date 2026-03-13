import { CategoriaMensaje,DatosPasos, ListaPasosWizard, Notificacion, TipoNotificacionEnum, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { PASOS_EXPORTACION } from '../../constants/exportacion-minerales-de-hierro-pasos.enum';

/**
 * @description Componente que gestiona el flujo de un wizard para el proceso de exportación de minerales de hierro.
 * Este componente implementa un sistema de pasos secuenciales que el usuario debe completar para realizar
 * una solicitud de exportación de minerales de hierro.
 * 
 * @usageNotes
 * Para utilizar este componente:
 * ```html
 * <app-exportacion-minerales-de-hierro></app-exportacion-minerales-de-hierro>
 * ```
 * 
 * El componente depende de:
 * - WizardComponent: Para la navegación entre pasos
 * - DatosPasos: Para la configuración de la información de los pasos
 * - ListaPasosWizard: Para la estructura de los pasos
 * - AccionBoton: Para determinar la acción a realizar según el botón presionado
 * - PASOS_EXPORTACION: Constante que define los pasos específicos para exportación de minerales de hierro
 */
@Component({
  selector: 'app-exportacion-petroliferos',
  templateUrl: './exportacion-petroliferos.component.html',
})
export class ExportacionPetroliferosComponent {
  /**
   * @description Lista de pasos que conforman el wizard de exportación de minerales de hierro.
   * Se obtiene desde la constante PASOS_EXPORTACION.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * @description Índice que indica el paso actual del wizard.
   * Por defecto comienza en el paso 1.
   */
  indice: number = 1;

  /**
   * @description Índice de la pestaña actualmente activa.
   * Por defecto comienza en la pestaña 1.
   */
  tabIndex: number = 1;

  /**
   * @description Referencia al componente WizardComponent utilizado para la navegación entre pasos.
   * Permite acceder a métodos como siguiente() y atras().
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @description Objeto que contiene la configuración de los pasos del wizard.
   * - nroPasos: Número total de pasos
   * - indice: Paso actual 
   * - txtBtnAnt: Texto del botón para retroceder
   * - txtBtnSig: Texto del botón para avanzar
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @description Maneja el evento de cambio de índice cuando se presionan los botones de navegación.
   * Actualiza el índice actual y navega al paso correspondiente según la acción recibida.
   * 
   * @param e - Objeto AccionBoton que contiene la información sobre la acción del botón:
   *   - valor: Nuevo índice al que se debe navegar
   *   - accion: Tipo de acción ('cont' para continuar, cualquier otro valor para retroceder)
   * 
   * @remarks
   * Solo procesa valores entre 1 y 3 (inclusive) para evitar navegación fuera de los límites permitidos.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 4) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
  /**
   * @description
   * Configuración de la notificación de privacidad que se muestra como un banner informativo.
   * Esta notificación contiene información sobre el aviso de privacidad y no permite ser cerrada.
   *
   * @property {TipoNotificacionEnum} tipoNotificacion - Tipo de notificación, en este caso un banner.
   * @property {CategoriaMensaje} categoria - Categoría de la notificación, en este caso informativa.
   * @property {string} modo - Modo de la notificación (vacío en este caso).
   * @property {string} titulo - Título de la notificación (vacío en este caso).
   * @property {string} mensaje - Mensaje de la notificación, que contiene el aviso de privacidad.
   * @property {boolean} cerrar - Indica si la notificación puede ser cerrada (falso en este caso).
   * @property {string} txtBtnAceptar - Texto del botón de aceptar (vacío en este caso).
   * @property {string} txtBtnCancelar - Texto del botón de cancelar (vacío en este caso).
   */
    public notificacionPrivacidad: Notificacion = {
      tipoNotificacion: TipoNotificacionEnum.BANNER, 
      categoria: CategoriaMensaje.INFORMACION, 
      modo: '', 
      titulo: '',
      mensaje: AVISO.Aviso,
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: ''
    };
}