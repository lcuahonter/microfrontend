import { CONFIGURACION_COMMUNICACION, CONFIGURACION_PROCESOS } from '../../constants/seguridad-de-procesos.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SEGURIDAD_DE_PROCESOS } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para gestionar la sección de seguridad de procesos en la aplicación.
 * 
 * Maneja formularios dinámicos para procesamiento y comunicación, se suscribe a cambios de estado,
 * y emite cambios de valor al store. Limpia las suscripciones al destruirse.
 *
 * @component
 * @example
 * <app-seguridad-de-procesos></app-seguridad-de-procesos>
 */
@Component({
  selector: 'app-seguridad-de-procesos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './seguridad-de-procesos.component.html',
  styleUrl: './seguridad-de-procesos.component.scss',
})
export class SeguridadDeProcesosComponent implements OnInit,OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente Seguridad de Procesos.
   * Se obtiene del constante `TEXTOS_ESTATICOS_SEGURIDAD_DE_PROCESOS`.
   */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_DE_PROCESOS;
  /**
   * Grupo principal de formulario que contiene subgrupos para la seguridad de procesos.
   *
   * @property procesamientoFormGroup - Grupo de controles relacionados con el procesamiento.
   * @property comunicacionFormGroup - Grupo de controles relacionados con la comunicación.
   */
  public forma: FormGroup = new FormGroup({
    procesamientoFormGroup: new FormGroup({}),
    comunicacionFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para la seguridad de procesos, según lo definido en `CONFIGURACION_PROCESOS`.
   * Esta propiedad se utiliza para gestionar y acceder a la configuración relacionada con el manejo de procesos dentro del componente.
   *
   * @see CONFIGURACION_PROCESOS
   */
  public procesamientoDatos = CONFIGURACION_PROCESOS;
  /**
   * Almacena los datos de configuración para los procesos de comunicación.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_COMMUNICACION`,
   * que contiene la configuración necesaria para gestionar las operaciones
   * relacionadas con la comunicación dentro del componente.
   */
  public comunicacionDatos = CONFIGURACION_COMMUNICACION;
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * 
   * @type {Solicitude32612State}
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Emite un valor void para señalar la finalización de los observables, ayudando a prevenir fugas de memoria.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en componentes de Angular.
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
   * Inicializa el componente SeguridadDeProcesosComponent con los servicios requeridos y configura una suscripción
   * al observable de estado de consultaQuery. La suscripción actualiza la propiedad local consultaState
   * cada vez que cambia el estado de consultaQuery, y se cancela automáticamente cuando el componente se destruye.
   *
   * @param tramite32612Query - Servicio para consultar datos del trámite 32612.
   * @param tramite32612Store - Store para gestionar el estado del trámite 32612.
   * @param consultaQuery - Servicio para consultar el estado de Consultaio.
   */
  constructor(
    private tramite32612Query: Tramite32612Query,
    private tramite32612Store: Tramite32612Store,
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
   * Obtiene la instancia de `FormGroup` asociada al control 'procesamientoFormGroup'
   * del formulario principal (`forma`).
   *
   * @returns El `FormGroup` correspondiente a 'procesamientoFormGroup'.
   */
  get procesamientoFormGroup(): FormGroup {
    return this.forma.get('procesamientoFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'comunicacionFormGroup'
   * del formulario principal (`forma`).
   *
   * @returns El `FormGroup` correspondiente a 'comunicacionFormGroup'.
   */
  get comunicacionFormGroup(): FormGroup {
    return this.forma.get('comunicacionFormGroup') as FormGroup;
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
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a las suscripciones y limpiar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
