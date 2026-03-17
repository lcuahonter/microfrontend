/**
 * @fileoverview Componente PermisoDeHidrocarburos.
 * 
 * Este componente se encarga de gestionar el proceso de solicitud de permisos de hidrocarburos
 * utilizando un asistente de pasos (WizardComponent). Permite navegar entre los distintos pasos del proceso,
 * actualizando el índice actual del paso y mostrando los textos adecuados en los botones de navegación.
 *
 * @example
 * <app-permiso-de-hidrocarburos></app-permiso-de-hidrocarburos>
 */

import { CategoriaMensaje, DatosPasos, ListaPasosWizard, Notificacion, TipoNotificacionEnum, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';

import { PASOS_EXPORTACION } from '../../constants/permiso-de-hidrocarburos.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

@Component({
  selector: 'app-permiso-de-hidrocarburos',
  templateUrl: './permiso-de-hidrocarburos.component.html',
})
export class PermisoDeHidrocarburosComponent {
  
  /**
   * Lista de pasos a solicitar para el proceso de exportación.
   * Se inicializa con el valor de PASOS_EXPORTACION.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
  MENSAJE_DE_ERROR: string ='<div>Faltan campos por capturar.</div>';

  /**
    * @property {string} infoAlert
    * Clase CSS usada para mostrar alertas informativas.
    */
  public infoAlert = 'alert-danger text-center';



  /**
   * Índice de la pestaña actual.
   */
  tabIndex: number = 1;

   /**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
  esFormaValido: boolean = false;

  /**
   * Instancia del componente WizardComponent.
   * Se utiliza para gestionar la navegación entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
 

  /**
   * Objeto que contiene la configuración y datos de los pasos del asistente.
   *
   * @property {number} nroPasos - Número total de pasos, derivado de la longitud de 'pasosSolicitar'.
   * @property {number} indice - Paso actual en el asistente.
   * @property {string} txtBtnAnt - Texto para el botón de acción "Anterior".
   * @property {string} txtBtnSig - Texto para el botón de acción "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el índice del paso actual basado en la acción del botón recibido.
   *
   * Si el valor recibido en el objeto 'e' se encuentra entre 1 y 3 (exclusivos 0 y 4) se actualiza el índice.
   * Además, según la acción indicada ('cont' para continuar o cualquier otra para retroceder), se invoca
   * el método correspondiente del WizardComponent para navegar al siguiente o anterior paso.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   */
  getValorIndice(e: AccionBoton): void {
    /*
    if (e.valor > 0 && e.valor < 4) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }*/
      if (e.accion === 'cont') {
        let isValid = true;
  
          if (this.indice === 1 && this.pasoUnoComponent) {
          isValid = this.pasoUnoComponent.validarPasoUno();
        }
        if (!isValid) {
          this.esFormaValido = true;
          this.datosPasos.indice = this.indice;
          return;
        }
  
        this.esFormaValido = false;
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
  
        this.wizardComponent.siguiente();
        return;
      }
  
        this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
  
  
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
