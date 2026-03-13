import { Component, OnInit, ViewChild } from '@angular/core';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';

import { PASOS, SECCIONES_TRAMITE_220702 } from '../../constantes/acuicola.enum';
import { SeccionState, SeccionStore } from '../../../../estados/seccion.store';
import { map, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PiePaginaInformacionComponent } from '@libs/shared/data-access-user/src';
import { SeccionQuery } from '../../../../estados/queries/seccion.query';
import { Subject } from 'rxjs';
import { WizardComponent } from '@libs/shared/data-access-user/src';


/**
 * Interfaz que representa la acción de un botón.
 * @export
 * @interface AccionBoton
 */
interface AccionBoton {
  /**
   * Acción asociada al botón.
   * @property {string} accion
   */
  accion: string;

  /**
   * Valor asociado a la acción del botón.
   * @property {number} valor
   */
  valor: number;
}

@Component({
  selector: 'app-fitosanitario-page',
  standalone: true,
  imports: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    WizardComponent,
    PiePaginaInformacionComponent
  ],
  templateUrl: './fitosanitario-page.component.html',
  
})
export class FitosanitarioPageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
 * Estado de la sección actual.
 */
  public seccion!: SeccionState;

  /**
 * Sujeto para manejar la destrucción de suscripciones.
 */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Referencia al componente del asistente.
  */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
 * Datos de los pasos del asistente.
 */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param seccionStore Almacén de secciones.
   * @param seccionQuery Consulta de secciones.
   */
  constructor(
    private seccionQuery: SeccionQuery,
    private seccionStore: SeccionStore,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$.pipe(
      takeUntil(this.destroyNotifier$),
      map(seccionState => {
        this.seccion = seccionState;
      })
    ).subscribe();

    this.asignarSecciones();
  }

  /**
 * Método para seleccionar una pestaña.
 * @param i Índice de la pestaña a seleccionar.
 */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
 * Método para obtener el valor del índice y navegar en el asistente.
 * @param e Acción del botón que contiene el valor del índice.
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
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMAVALIDA: boolean[] = [];
    
    for (const LLAVESECCION of Object.keys(SECCIONES_TRAMITE_220702.PASO_1) as Array<keyof typeof SECCIONES_TRAMITE_220702.PASO_1>) {

      SECCIONES.push(SECCIONES_TRAMITE_220702.PASO_1[LLAVESECCION]);
      FORMAVALIDA.push(false);
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMAVALIDA);
  }
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

   
}
