/* eslint-disable @nx/enforce-module-boundaries */
import {Component, OnDestroy,ViewChild, } from '@angular/core';
import { AVISO } from '@ng-mf/data-access-user';
import { AccionBoton } from 'libs/shared/data-access-user/src/core/models/301/servicios-pantallas.model';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

import { ERROR_MESSAGE_PAGO, ERROR_MESSAGE_REGISTRO } from '../../constantes/301.enum';
import { DatosComponent } from '../datos/datos.component';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';

import { Subject, takeUntil } from 'rxjs';

/**
 * Este componente se utiliza para mostrar los pasos del asistente - 220401
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'app-pantallas',
  standalone: false,
  templateUrl: './pantallas.component.html',
})
export class PantallasComponent implements OnDestroy {

   /**
   * Constantes importadas desde el archivo de enumeración para los mensajes de advertencia.
   *
   * @type {AVISO}
   * @memberof RegistroParaLaComponent
   */
  public ADVERTENCIA = AVISO;

  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente WizardComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente DatosComponent dentro de la plantilla.
   * Se obtiene mediante la variable de plantilla 'datos' para poder llamar a
   * sus métodos de validación (por ejemplo validarFormularios()) desde este componente.
   */
  @ViewChild('datos') datosComponent!: DatosComponent;


  /**
   * Esta variable se utiliza para almacenar los datos de los pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Indicador de error en el pago (controla la visualización en la UI) */
  pagoError: boolean = false;
  /** Indicador de error en el registro (controla la visualización en la UI) */
  registroError: boolean = false;
  /** Mensaje de error para pago (constante importada) */
  pagoErrorMessage: string = ERROR_MESSAGE_PAGO;
  /** Mensaje de error para registro (constante importada) */
  registroErrorMessage: string = ERROR_MESSAGE_REGISTRO;

  /**
   * Inyecta Tramite301Query y se suscribe a selectSolicitud$.
   * Actualiza los indicadores de error cuando cambia la solicitud.
   * La suscripción se completa cuando destroyNotifier$ emite (previene memory leaks).
   */
  constructor(private tramite301Query: Tramite301Query) {
    this.tramite301Query.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((solicitud) => {
      // Si existe una solicitud, actualizar los flags de error (fallback a false si son undefined)
      if (solicitud) {
        this.pagoError = solicitud.pagoError ?? false;
        this.registroError = solicitud.registroError ?? false;
      }
    });
  }

  /**
   * Actualiza el índice del paso en función de la acción recibida desde el botón.
   * - Si está en el paso 1, valida todos los formularios de ese paso antes de avanzar.
   * - Para otros pasos, simplemente mueve el wizard hacia adelante o hacia atrás.
   *
   * @param e Acción del botón con la propiedad `valor` (nuevo índice) y `accion` ('cont'|'atras')
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const ISVALID = this.validarTodosFormulariosPasoUno() ?? false;
      if (!ISVALID) {
        this.datosPasos.indice = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      } else {
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
        this.wizardComponent.siguiente();
      }
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

/**
 * validarTodosFormulariosPasoUno 
 * @returns boolean
 */
private validarTodosFormulariosPasoUno(): boolean {
  if (!this.datosComponent) {
    return false;
  }
  const ISFORM_VALID_TOUCHED = this.datosComponent.validarFormularios();
  if (!ISFORM_VALID_TOUCHED) {
    return false;
  }

  return true;
}

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Emite un valor en destroyNotifier$ para completar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

