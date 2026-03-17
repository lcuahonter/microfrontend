import { CONFIGURACION, CONFIGURACION_AUDITORIAS, CONFIGURACION_CONTINGENCIA, CONFIGURACION_POLITICAS } from '../../constants/analisis-riesgo-forma.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CONFIGURACION_REVISIONES } from '../../constants/socios-comerciales.enum';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_PLANEACION } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * @componente PlaneacionComponent
 * 
 * Componente Angular independiente para gestionar la sección de "Planeación" de la aplicación.
 * Maneja formularios dinámicos y la gestión de estado para varias subsecciones como análisis de riesgo,
 * políticas, auditorías, contingencia y revisiones.
 */
@Component({
  selector: 'app-planeacion',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent,
    ReactiveFormsModule
  ],
  templateUrl: './planeacion.component.html',
  styleUrl: './planeacion.component.scss',
})
export class PlaneacionComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente de planeación.
   * Se llena a partir de la constante `TEXTOS_ESTATICOS_PLANEACION`.
   * Utilice esta propiedad para acceder a cadenas de la interfaz de usuario localizadas o predefinidas.
   */
  public textos = TEXTOS_ESTATICOS_PLANEACION;
  /**
   * Grupo principal de formularios para el componente Planeacion, que contiene grupos de formularios anidados para
   * diferentes secciones del proceso de planeación:
   * - `analisisDeRiesgoFormGroup`: Maneja los datos de análisis de riesgo.
   * - `politicasFormGroup`: Administra las entradas relacionadas con políticas.
   * - `auditoriasFormGroup`: Contiene los controles relacionados con auditorías.
   * - `contingenciaFormGroup`: Administra los campos de planeación de contingencia.
   * - `revisionesFormGroup`: Maneja los datos relacionados con revisiones.
   */
  public forma: FormGroup = new FormGroup({
    analisisDeRiesgoFormGroup: new FormGroup({}),
    politicasFormGroup: new FormGroup({}),
    auditoriasFormGroup: new FormGroup({}),
    contingenciaFormGroup: new FormGroup({}),
    revisionesFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para la sección de análisis de riesgo.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION`, que contiene
   * los ajustes y parámetros necesarios para el proceso de análisis de riesgo dentro
   * del componente de planeación.
   *
   * @see CONFIGURACION
   */
  public analisisDeRiesgoDatos = CONFIGURACION;
  /**
   * Almacena los datos de configuración para políticas, inicializados desde `CONFIGURACION_POLITICAS`.
   * Esta propiedad se utiliza para gestionar y mostrar la información relacionada con políticas dentro del componente.
   */
  public politicasDatos = CONFIGURACION_POLITICAS;
  /**
   * Almacena los datos de configuración para auditorías, definidos en `CONFIGURACION_AUDITORIAS`.
   * Esta propiedad se utiliza para gestionar y mostrar la información relacionada con auditorías dentro del componente de planeación.
   */
  public auditoriasDatos = CONFIGURACION_AUDITORIAS;
  /**
   * Almacena los datos de configuración para operaciones de contingencia.
   *
   */
  public contingenciaDatos = CONFIGURACION_CONTINGENCIA;
  /**
   * Almacena el objeto de configuración para los datos de revisiones, según lo definido en `CONFIGURACION_REVISIONES`.
   * Esta propiedad se utiliza para gestionar y mostrar la información relacionada con revisiones dentro del componente Planeacion.
   */
  public revisionesDatos = CONFIGURACION_REVISIONES;
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * Se utiliza para gestionar y rastrear los datos y el flujo de trabajo de la solicitud dentro del componente de planeación.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones para una limpieza adecuada,
   * normalmente en el ciclo de vida ngOnDestroy para prevenir fugas de memoria.
   * Emite un valor void cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Mantiene el estado actual del proceso de consulta.
   * 
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;


  /**
   * Inicializa el PlaneacionComponent con los servicios requeridos y configura una suscripción
   * al observable de estado de consultaQuery. La suscripción actualiza la propiedad local consultaState
   * cada vez que el estado cambia, y se cancela automáticamente cuando el componente es destruido.
   *
   * @param consultaQuery - Servicio para consultar el estado de consultaio.
   * @param tramite32612Store - Store para gestionar el estado de Tramite 32612.
   * @param tramite32612Query - Servicio de consulta para el estado de Tramite 32612.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite32612Store: Tramite32612Store,
    private tramite32612Query: Tramite32612Query
  ) {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
    })).subscribe();
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos del componente.
   * 
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query` y actualiza la propiedad `solicitudeState`
   * cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente cuando
   * `destroyNotifier$` emite, evitando fugas de memoria.
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
   * Obtiene la instancia de `FormGroup` asociada al control 'analisisDeRiesgoFormGroup'
   * del formulario principal (`forma`).
   *
   * @returns El `FormGroup` correspondiente a 'analisisDeRiesgoFormGroup'.
   */
  get analisisDeRiesgoFormGroup(): FormGroup {
    return this.forma.get('analisisDeRiesgoFormGroup') as FormGroup;
  }
  /**
   * Obtiene el `politicasFormGroup` como un `FormGroup` desde el formulario principal.
   * 
   * @returns La instancia de `FormGroup` asociada al control 'politicasFormGroup'.
   */
  get politicasFormGroup(): FormGroup {
    return this.forma.get('politicasFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'auditoriasFormGroup' del formulario principal.
   *
   * @returns El `FormGroup` correspondiente a 'auditoriasFormGroup'.
   */
  get auditoriasFormGroup(): FormGroup {
    return this.forma.get('auditoriasFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'contingenciaFormGroup' como un FormGroup desde el formulario principal.
   *
   * @returns La instancia de FormGroup asociada al control 'contingenciaFormGroup'.
   */
  get contingenciaFormGroup(): FormGroup {
    return this.forma.get('contingenciaFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'revisionesFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada al control 'revisionesFormGroup'.
   */
  get revisionesFormGroup(): FormGroup {
    return this.forma.get('revisionesFormGroup') as FormGroup;
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
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a los suscriptores y limpiar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
