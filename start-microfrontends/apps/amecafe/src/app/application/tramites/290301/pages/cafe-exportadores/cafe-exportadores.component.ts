import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, PASOS, SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz que representa una acción de botón en el wizard.
 */
interface AccionBoton {
  /** Acción a realizar (e.g., 'cont' para continuar, 'atras' para retroceder). */
  accion: string;

  /** Valor asociado al índice del paso. */
  valor: number;
}

/**
 * Componente que representa la página de registro del trámite.
 * Gestiona la navegación entre los pasos del wizard y el estado de la sección.
 */
@Component({
  selector: 'app-cafe-exportadores',
  templateUrl: './cafe-exportadores.component.html',
  styleUrl: './cafe-exportadores.component.scss',
 
})
export class CafeExportadoresComponent implements OnDestroy, OnInit {
  /** Lista de pasos del wizard. */
  pasos: Array<ListaPasosWizard> = PASOS;

  /** Índice del paso actual en el wizard. */
  indice: number = 1;

  /** Sujeto para manejar la destrucción de observables. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Estado actual de la sección. */
  public seccion!: SeccionLibState;

  /** Referencia al componente del wizard. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Datos de configuración para los pasos del wizard. */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param seccionQuery Servicio para consultar el estado de la sección.
   * @param seccionStore Servicio para gestionar el estado de la sección.
   */
  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore
  ) {}

  /**
   * Método para seleccionar un paso específico en el wizard.
   * Actualiza el índice del paso seleccionado.
   * @param i Índice del paso a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la sección y actualiza la propiedad `seccion`.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState: SeccionLibState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método para manejar el cambio de paso en el wizard.
   * Actualiza el índice del paso y navega al siguiente o anterior paso según la acción.
   * @param e Objeto que contiene la acción y el valor del paso.
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
   * Método que se ejecuta al destruir el componente.
   * Completa el sujeto `destroyed$` para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
