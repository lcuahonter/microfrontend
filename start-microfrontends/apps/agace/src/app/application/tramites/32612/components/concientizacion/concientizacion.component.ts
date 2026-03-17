import { CONFIGURACION_CAPACITACION, CONFIGURACION_CAPACITACIONDOS } from '../../constants/concientizacion.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_CONCIENTIZACION } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para manejar la sección de "Concientización" en la aplicación.
 * 
 * Este componente gestiona dos grupos de formularios dinámicos para "capacitacion" y "capacitacionDos",
 * se suscribe a los cambios de estado desde los servicios de store y query, y emite cambios de valor
 * para actualizar el store según corresponda.
 */
@Component({
  selector: 'app-concientizacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './concientizacion.component.html',
  styleUrl: './concientizacion.component.scss',
})
export class ConcientizacionComponent implements OnInit,OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente Concientizacion.
   * Estos textos se utilizan para mostrar contenido informativo o instructivo
   * dentro de la interfaz de usuario del componente.
   *
   * @see TEXTOS_ESTATICOS_CONCIENTIZACION para la definición de los textos estáticos.
   */
  public textos = TEXTOS_ESTATICOS_CONCIENTIZACION;
  /**
   * Grupo principal de formularios para el componente, que contiene dos grupos de formularios anidados:
   * - `capacitacionFormGroup`: Maneja los controles relacionados con la primera sección de capacitación.
   * - `capacitacionDosFormGroup`: Maneja los controles relacionados con la segunda sección de capacitación.
   *
   * Ambos grupos de formularios anidados se inicializan vacíos y pueden ser llenados con controles según sea necesario.
   */
  public forma: FormGroup = new FormGroup({
    capacitacionFormGroup: new FormGroup({}),
    capacitacionDosFormGroup: new FormGroup({})
  });

  /**
   * Subject utilizado para notificar y completar las suscripciones para una limpieza adecuada.
   * Emite un valor void cuando el componente se destruye para evitar fugas de memoria.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en flujos observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena los datos de configuración para la sección de "Capacitación".
   * Este objeto se inicializa con el valor de `CONFIGURACION_CAPACITACION`,
   * que contiene configuraciones y parámetros utilizados en la lógica del componente.
   *
   * @see CONFIGURACION_CAPACITACION para la estructura y detalles de la configuración.
   */
  public capacitacionDatos = CONFIGURACION_CAPACITACION;
  /**
   * Almacena la configuración para la segunda sección del módulo de capacitación.
   * 
   * @remarks
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_CAPACITACIONDOS`,
   * que contiene los datos y opciones necesarios para la sección correspondiente de capacitación.
   * 
   * @see CONFIGURACION_CAPACITACIONDOS
   */
  public capacitacionDatosDos = CONFIGURACION_CAPACITACIONDOS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * Esta propiedad contiene toda la información relevante sobre el estado,
   * progreso y datos asociados de la solicitud dentro del contexto del componente de concientización.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Almacena el estado actual del proceso de consulta.
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa el ConcientizacionComponent con los stores y queries requeridos.
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` para actualizar la propiedad local
   * `consultaState` cada vez que el estado cambie, hasta que el componente sea destruido.
   */
  constructor(
    private tramite32612Store: Tramite32612Store,
    private tramite32612Query: Tramite32612Query,
    private consultaQuery: ConsultaioQuery,
  ) {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
    })).subscribe();
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de un componente.
   * 
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query` y actualiza la propiedad local
   * `solicitudeState` cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente
   * cuando `destroyNotifier$` emite, evitando fugas de memoria.
   */
  ngOnInit(): void {
    this.tramite32612Query.selectSolicitude$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeState = seccionState;
        })
      ).subscribe();
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'capacitacionFormGroup'
   * del formulario principal (`forma`).
   */
  get capacitacionFormGroup(): FormGroup {
    return this.forma.get('capacitacionFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'capacitacionDosFormGroup'
   * del formulario principal (`forma`).
   *
   * @returns La instancia de FormGroup asociada a 'capacitacionDosFormGroup'.
   */
  get capacitacionDosFormGroup(): FormGroup {
    return this.forma.get('capacitacionDosFormGroup') as FormGroup;
  }

  /**
   * Emite un cambio de valor para un campo dinámico en el tramite32612Store.
   */
  public emitirCambioDeValor(event: {campo: string, valor: string}): void {
    this.tramite32612Store.setDynamicFieldValue(event.campo, event.valor);
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a los suscriptores
   * que deben limpiar recursos y cancelar la suscripción a los observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
