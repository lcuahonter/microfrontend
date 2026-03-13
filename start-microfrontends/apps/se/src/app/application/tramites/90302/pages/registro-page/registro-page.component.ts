/**
 * @fileoverview
 * El `RegistroPageComponent` es el componente principal para gestionar el formulario de registro de solicitud IMMEX modalidad ampliación 3R's.
 * Este componente utiliza un asistente (wizard) para controlar la navegación entre los pasos del formulario y gestionar la información mostrada.
 * 
 * @module RegistroPageComponent
 * @description
 * Este componente permite la navegación entre los pasos del formulario, muestra alertas según el estado del servicio y gestiona los datos
 * relacionados con el registro de la solicitud IMMEX.
 */

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, } from 'rxjs';

import { AVISO } from '@ng-mf/data-access-user';

import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '../../constantes/modificacion.constants';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz para manejar las acciones de los botones del asistente.
 * @interface AccionBoton
 */
interface AccionBoton {
  /**
   * Acción del botón (e.g., "cont" para continuar, "atras" para retroceder).
   * @property {string} accion
   */
  accion: string;

  /**
   * Valor asociado a la acción (índice del paso).
   * @property {number} valor
   */
  valor: number;
}

@Component({
  selector: 'app-registro-page',
  templateUrl: './registro-page.component.html',
})
export class RegistroPageComponent implements OnDestroy {
  /**
   * Array de pasos del asistente.
   * @property {ListaPasosWizard[]} pasos - Lista de los pasos del asistente, incluyendo título y componente asociado.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Notificador para gestionar la destrucción de observables.
   * @property {Subject<void>} destroyNotifier$
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje
   */
  tituloMensaje: string | null = "Registro de solicitud modificación programa PROSEC (Modificación Baja de domicilio de una planta, bodega o almacén) ";

  /**
   * Clase CSS para mensajes de alerta.
   * @property {string} dangerClass
   */
  dangerClass = 'alert-danger';

  /**
   * Referencia al componente Wizard para controlar la navegación.
   * @property {WizardComponent} wizardComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Índice actual del paso.
   * @property {number} indice
   */
  indice: number = 1;

  /**
   * Configuración para los botones del asistente.
   * @property {DatosPasos} datosPasos
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Textos constantes utilizados en el componente.
   * @property {any} TEXTOS
   */
  TEXTOS = AVISO;

  /**
   * Mensaje de éxito para el primer paso.
   * @property {string} mensajeDeTextoDeExito
   */
  mensajeDeTextoDeExito: string = "MENSAJE_DE_ÉXITO_ETAPA_UNO";


  /**
   * Maneja la acción del botón y navega entre los pasos.
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto con la acción (cont/atras) y el valor (índice) del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

 

  /**
   * Método que se ejecuta cuando se destruye el componente.
   * Limpia el notifier para evitar fugas de memoria.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}