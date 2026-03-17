import { CONFIGURACION, CONFIGURACION_ACCESOS, CONFIGURACION_ALUMBRADO, CONFIGURACION_DISPOSITIVOS, CONFIGURACION_ESTACIONAMIENTOS, CONFIGURACION_PERIMETRALES, CONFIGURACION_SISTEMAS } from '../../constants/seguridad-fisica.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SEGURIDAD } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente encargado de la gestión de la sección de Seguridad Física en el trámite 32612.
 * 
 * Este componente utiliza formularios reactivos para manejar los diferentes grupos de campos relacionados
 * con instalaciones, accesos, perímetros, estacionamientos, dispositivos, alumbrado y sistemas.
 * 
 * - Inicializa los datos de configuración y los estados requeridos para la sección.
 * - Se suscribe a los estados de consulta y solicitud mediante los stores y queries correspondientes.
 * - Expone getters para acceder fácilmente a los distintos grupos de formularios.
 * - Permite emitir cambios de valor de campos dinámicos a través del store.
 * - Gestiona la destrucción de las suscripciones al destruir el componente.
 */
@Component({
  selector: 'app-seguridad-fisica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './seguridad-fisica.component.html',
  styleUrl: './seguridad-fisica.component.scss',
})
export class SeguridadFisicaComponent implements OnInit,OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente de Seguridad Física.
   * Se obtiene del constante `TEXTOS_ESTATICOS_SEGURIDAD`.
   * Se utiliza para mostrar etiquetas, mensajes y otros elementos de texto en la interfaz relacionados con la seguridad física.
   */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD;
  /**
   * Grupo principal de formularios para el componente de Seguridad Física.
   * 
   * Este grupo de formularios contiene grupos anidados para gestionar el estado y la validación
   * de varias secciones relacionadas con la seguridad física, incluyendo:
   * - instalacionesFormGroup: Información sobre instalaciones.
   * - accesosFormGroup: Detalles sobre puntos de acceso.
   * - perimetralesFormGroup: Datos sobre seguridad perimetral.
   * - estacionamientosFormGroup: Detalles de seguridad en estacionamientos.
   * - dispositivosFormGroup: Información de dispositivos de seguridad.
   * - alumbradoFormGroup: Datos de sistemas de alumbrado.
   * - sistemasFormGroup: Otros sistemas de seguridad.
   */
  public forma: FormGroup = new FormGroup({
    instalacionesFormGroup: new FormGroup({}),
    accesosFormGroup: new FormGroup({}),
    perimetralesFormGroup: new FormGroup({}),
    estacionamientosFormGroup: new FormGroup({}),
    dispositivosFormGroup: new FormGroup({}),
    alumbradoFormGroup: new FormGroup({}),
    sistemasFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para las instalaciones de seguridad física.
   * 
   * @remarks
   * Esta propiedad se inicializa con el valor de `CONFIGURACION`, que debe contener
   * los ajustes o parámetros relevantes para la funcionalidad del componente.
   *
   * @see CONFIGURACION
   */
  public instalacionesDatos = CONFIGURACION;
  /**
   * Almacena los datos de configuración para los controles de acceso, según lo definido en `CONFIGURACION_ACCESOS`.
   * Esta propiedad proporciona acceso al conjunto de configuraciones relacionadas con accesos utilizadas dentro del componente.
   */
  public accesosDatos = CONFIGURACION_ACCESOS;
  /**
   * Almacena los datos de configuración para los ajustes perimetrales.
   * El valor se importa de `CONFIGURACION_PERIMETRALES`, que contiene
   * opciones o parámetros predefinidos utilizados en el componente de seguridad física
   * para gestionar la información de seguridad perimetral.
   */
  public perimetralesDatos = CONFIGURACION_PERIMETRALES;
  /**
   * Almacena los datos de configuración para los estacionamientos.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_ESTACIONAMIENTOS`,
   * que contiene los ajustes y detalles relacionados con las instalaciones de estacionamiento.
   * 
   * @see CONFIGURACION_ESTACIONAMIENTOS
   */
  public estacionamientosDatos = CONFIGURACION_ESTACIONAMIENTOS;
  /**
   * Almacena los datos de configuración para los dispositivos de seguridad física.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_DISPOSITIVOS`,
   * que contiene los ajustes y parámetros necesarios para gestionar y mostrar
   * la información de los dispositivos dentro del componente.
   *
   * @see CONFIGURACION_DISPOSITIVOS para la estructura y detalles de la configuración.
   */
  public dispositivosDatos = CONFIGURACION_DISPOSITIVOS;
  /**
   * Almacena la configuración para la sección de "Alumbrado".
   * 
   * El valor se asigna desde `CONFIGURACION_ALUMBRADO`, que contiene
   * los parámetros y opciones necesarios para gestionar los datos relacionados
   * con el alumbrado dentro del componente de Seguridad Física.
   *
   * @see CONFIGURACION_ALUMBRADO para la estructura y detalles de la configuración.
   */
  public alumbradoDatos = CONFIGURACION_ALUMBRADO;
  /**
   * Almacena los datos de configuración para los sistemas, inicializados desde `CONFIGURACION_SISTEMAS`.
   * Esta propiedad proporciona acceso a la configuración de sistemas utilizada dentro del componente de Seguridad Física.
   */
  public sistemasDatos = CONFIGURACION_SISTEMAS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * Se utiliza para gestionar y rastrear el progreso y los datos de la aplicación dentro del
   * componente de Seguridad Física.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Esto ayuda a prevenir fugas de memoria al cancelar la suscripción de los observables.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual de la consulta de seguridad física.
   * 
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa una instancia de SeguridadFisicaComponent.
   * 
   * @param tramite32612Store - Servicio para gestionar el estado del trámite 32612.
   * @param tramite32612Query - Servicio para consultar el estado del trámite 32612.
   * @param consultaQuery - Servicio para consultar el estado de Consultaio.
   *
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza
   * la propiedad local `consultaState` cada vez que el estado cambia. La suscripción se cancela
   * automáticamente cuando `destroyNotifier$` emite.
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
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de un componente.
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query` y actualiza la propiedad `solicitudeState`
   * cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente cuando
   * `destroyNotifier$` emite, evitando fugas de memoria.
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
   * Obtiene el 'instalacionesFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'instalacionesFormGroup'.
   */
  get instalacionesFormGroup(): FormGroup {
    return this.forma.get('instalacionesFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'accesosFormGroup' del formulario principal.
   *
   * @returns El `FormGroup` correspondiente a 'accesosFormGroup'.
   */
  get accesosFormGroup(): FormGroup {
    return this.forma.get('accesosFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'perimetralesFormGroup'
   * del formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * el grupo de formularios relacionado con los campos de seguridad perimetral dentro del componente.
   *
   * @returns El `FormGroup` correspondiente a 'perimetralesFormGroup'.
   */
  get perimetralesFormGroup(): FormGroup {
    return this.forma.get('perimetralesFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'estacionamientosFormGroup'
   * del formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * los controles de formulario relacionados con las áreas de estacionamiento dentro del componente.
   *
   * @returns El `FormGroup` correspondiente a 'estacionamientosFormGroup'.
   */
  get estacionamientosFormGroup(): FormGroup {
    return this.forma.get('estacionamientosFormGroup') as FormGroup;
  }
  /**
   * Obtiene el `dispositivosFormGroup` como un `FormGroup` desde el formulario principal.
   * Este método permite acceder al grupo de controles de formulario relacionados con los dispositivos dentro del formulario principal.
   * 
   * @returns La instancia de `FormGroup` para los controles de formulario de dispositivos.
   */
  get dispositivosFormGroup(): FormGroup {
    return this.forma.get('dispositivosFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'alumbradoFormGroup' del formulario principal.
   *
   * @returns {FormGroup} El grupo de formulario para la sección de alumbrado.
   */
  get alumbradoFormGroup(): FormGroup {
    return this.forma.get('alumbradoFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'sistemasFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'sistemasFormGroup'.
   */
  get sistemasFormGroup(): FormGroup {
    return this.forma.get('sistemasFormGroup') as FormGroup;
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
   * que deben limpiar recursos y cancelar la suscripción de los observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
