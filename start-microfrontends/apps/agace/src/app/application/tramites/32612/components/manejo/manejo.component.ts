import { CONFIGURACION_INVESTIGACION, CONFIGURACION_REPORTE_ANOMALIAS } from '../../constants/manejo.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_MANEJO } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * ManejoComponent es un componente independiente de Angular responsable de manejar
 * la sección "manejo" de la aplicación. Administra formularios dinámicos para reportes
 * de anomalías e investigaciones, e interactúa con el estado de la aplicación mediante stores y queries.
 *
 * @comentarios
 * - Utiliza formularios reactivos para la entrada dinámica de datos.
 * - Se suscribe a cambios de estado desde los stores Tramite32612 y Consultaio.
 * - Emite cambios en campos dinámicos a través del store.
 *
 */
@Component({
  selector: 'app-manejo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './manejo.component.html',
  styleUrl: './manejo.component.scss',
})
export class ManejoComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente Manejo.
   * Se llena desde `TEXTOS_ESTATICOS_MANEJO`, que proporciona
   * cadenas localizadas o predefinidas utilizadas en la interfaz de usuario.
   */
  public textos = TEXTOS_ESTATICOS_MANEJO;
  /**
   * Representa el grupo de formulario principal para el componente, que contiene dos grupos de formularios anidados:
   * - `reporteDeAnomaliasFormGroup`: Maneja los controles de formulario relacionados con los reportes de anomalías.
   * - `investigacionFormGroup`: Maneja los controles de formulario relacionados con las investigaciones.
   *
   * Esta estructura permite una gestión y validación organizada de los datos del formulario
   * dentro del componente.
   */
  public forma = new FormGroup({
    reporteDeAnomaliasFormGroup: new FormGroup({}),
    investigacionFormGroup: new FormGroup({})
  });
  /**
   * Contiene los datos de configuración para la funcionalidad de "Reporte de Anomalías".
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_REPORTE_ANOMALIAS`,
   * que define la configuración y estructura para el reporte de anomalías dentro de la aplicación.
   */
  public reporteDeAnomaliasDatos = CONFIGURACION_REPORTE_ANOMALIAS;
  /**
   * Almacena la configuración para la sección de "Investigación".
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_INVESTIGACION`,
   * que contiene los parámetros y opciones necesarios para gestionar los datos relacionados
   * con la investigación dentro del componente.
   *
   * @see CONFIGURACION_INVESTIGACION
   */
  public investigacionDatos = CONFIGURACION_INVESTIGACION;
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * Esta propiedad contiene toda la información relevante sobre el estado de la solicitud,
   * incluyendo su progreso, validación y cualquier metadato asociado.
   *
   * @type {Solicitude32612State}
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones, asegurando una limpieza adecuada cuando el componente se destruye.
   * Emite un valor void para indicar a los observadores que deben cancelar la suscripción, ayudando a prevenir fugas de memoria.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en flujos observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual del proceso de consulta.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;


  /**
   * Inicializa el ManejoComponent con los stores y queries requeridos.
   * 
   * @param tramite32612Store - Store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Query para acceder al estado del trámite 32612.
   * @param consultaQuery - Query para acceder al estado de consultaio.
   * 
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza
   * la propiedad local `consultaState` cada vez que el estado cambia, hasta que el componente se destruye.
   */
  constructor(
      private tramite32612Store: Tramite32612Store,
      private tramite32612Query: Tramite32612Query,
      private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos del componente.
   * 
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query`, actualizando la propiedad local
   * `solicitudeState` cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente
   * cuando `destroyNotifier$` emite, evitando fugas de memoria.
   */
  ngOnInit() {
    this.tramite32612Query.selectSolicitude$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeState = seccionState;
        })
      ).subscribe();
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'reporteDeAnomaliasFormGroup'
   * desde el grupo de formulario principal (`forma`).
   *
   * @returns El `FormGroup` para 'reporteDeAnomaliasFormGroup'.
   */
  get reporteDeAnomaliasFormGroup(): FormGroup {
    return this.forma.get('reporteDeAnomaliasFormGroup') as FormGroup;
  }
  /**
   * Obtiene el `investigacionFormGroup` como un `FormGroup` desde el formulario principal.
   * 
   * @returns La instancia de `FormGroup` asociada al control 'investigacionFormGroup'.
   */
  get investigacionFormGroup(): FormGroup {
    return this.forma.get('investigacionFormGroup') as FormGroup;
  }

  /**
   * Emite un cambio de valor para un campo dinámico en el tramite32612Store.
   *
   * @param event - Un objeto que contiene el nombre del campo (`campo`) y su nuevo valor (`valor`).
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
