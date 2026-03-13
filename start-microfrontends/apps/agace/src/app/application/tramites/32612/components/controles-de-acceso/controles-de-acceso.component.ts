import { CONFIGURACION, CONFIGURACION_ENTREGAS, CONFIGURACION_IDENTIFICACION } from '../../constants/controles-de-acceso.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SEGURIDAD_INFORMACION } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para gestionar los controles de acceso dentro de la aplicación.
 * Maneja formularios dinámicos para datos personales, identificación y entregas.
 * Se suscribe a cambios de estado desde los stores y queries, y emite cambios de valor.
 *
 * @remarks
 * - Utiliza arquitectura de componente standalone de Angular.
 * - Se integra con la gestión de estado de Tramite32612 y Consultaio.
 * - Limpia las suscripciones al destruir el componente.
 */
@Component({
  selector: 'app-controles-de-acceso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './controles-de-acceso.component.html',
  styleUrl: './controles-de-acceso.component.scss',
})
export class ControlesDeAccesoComponent implements OnInit,OnDestroy {

/**
 * Contiene recursos de texto estático relacionados con la seguridad de la información.
 * Estos textos se utilizan en todo el componente para mostrar información relacionada con la seguridad.
 */
 public textos = TEXTOS_ESTATICOS_SEGURIDAD_INFORMACION;
  /**
   * Grupo principal de formularios que contiene grupos anidados para información personal,
   * identificación y entregas. Se utiliza para gestionar y validar los controles
   * del componente "Controles de Acceso".
   */
  public forma: FormGroup = new FormGroup({
    personalFormGroup: new FormGroup({}),
    identificacionFormGroup: new FormGroup({}),
    entregasFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para los controles de información personal.
   * 
   */
  public personalDatos = CONFIGURACION;
  /**
   * Almacena el objeto de configuración para los controles de datos de identificación.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_IDENTIFICACION`,
   * que contiene la configuración y los parámetros necesarios para gestionar los datos
   * de identificación dentro del componente de controles de acceso.
   */
  public identificacionDatos = CONFIGURACION_IDENTIFICACION;
  /**
   * Almacena la configuración para las entregas, según lo definido en `CONFIGURACION_ENTREGAS`.
   * Este objeto se utiliza para gestionar y mostrar los datos relacionados con las entregas dentro del componente.
   */
  public entregasDatos = CONFIGURACION_ENTREGAS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * Se espera que esta propiedad sea asignada con una instancia de {@link Solicitude32612State},
   * la cual contiene toda la información relevante sobre el progreso y estado de la solicitud.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y activar la finalización de las suscripciones,
   * normalmente en el ciclo de vida ngOnDestroy para prevenir fugas de memoria.
   * Emite un valor void para señalar la destrucción.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual del proceso de consulta.
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa el componente ControlesDeAccesoComponent con los stores y queries requeridos.
   * 
   * Se suscribe al observable selectConsultaioState$ de consultaQuery y actualiza
   * la propiedad local consultaState cada vez que el estado cambia. La suscripción
   * se elimina automáticamente cuando destroyNotifier$ emite un valor.
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
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos del componente.
   * 
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query`, actualizando la propiedad local
   * `solicitudeState` cada vez que el observable emite un nuevo valor. La suscripción se elimina automáticamente
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
   * Obtiene la instancia de `FormGroup` asociada al control 'personalFormGroup' del formulario principal.
   */
  get personalFormGroup(): FormGroup {
    return this.forma.get('personalFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'identificacionFormGroup' como un FormGroup desde el formulario principal.
   * 
   */
  get identificacionFormGroup(): FormGroup {
    return this.forma.get('identificacionFormGroup') as FormGroup;
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'entregasFormGroup' del formulario principal.
   *
   * @returns {FormGroup} El `FormGroup` correspondiente a 'entregasFormGroup'.
   */
  get entregasFormGroup(): FormGroup {
    return this.forma.get('entregasFormGroup') as FormGroup;
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
