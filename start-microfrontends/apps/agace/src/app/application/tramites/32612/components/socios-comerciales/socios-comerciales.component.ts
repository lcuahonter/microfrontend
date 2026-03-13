import { CONFIGURACION, CONFIGURACION_REQUERIMIENTOS } from '../../constants/socios-comerciales.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SOCIOS_COMERCIALES } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para gestionar la sección de "Socios Comerciales" en la aplicación.
 * Maneja formularios dinámicos para criterios y requerimientos, e interactúa con los stores de estado de la aplicación.
 *
 * @notas
 * - Utiliza Akita para la gestión de estado.
 * - Integra componentes de formularios dinámicos.
 * - Se suscribe a cambios de estado y actualiza el estado local en consecuencia.
 *
 * @ejemplo
 * <app-socios-comerciales></app-socios-comerciales>
 */
@Component({
  selector: 'app-socios-comerciales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './socios-comerciales.component.html',
  styleUrl: './socios-comerciales.component.scss',
})
export class SociosComercialesComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente "Socios Comerciales".
   * Estos textos se utilizan para etiquetas de la interfaz, mensajes y otros contenidos
   * estáticos relacionados con los socios comerciales dentro de la aplicación.
   *
   * @see TEXTOS_ESTATICOS_SOCIOS_COMERCIALES para las definiciones de texto reales.
   */
  public textos = TEXTOS_ESTATICOS_SOCIOS_COMERCIALES;
  /**
   * Representa el grupo principal de formularios para el componente Socios Comerciales.
   * 
   * @notas
   * Este grupo de formularios contiene dos grupos de formularios anidados:
   * - `criteriosFormGroup`: Maneja los controles relacionados con los criterios.
   * - `requerimientosFormGroup`: Maneja los controles relacionados con los requerimientos.
   *
   * Ambos grupos anidados se inicializan vacíos y pueden ser poblados con controles según sea necesario.
   */
  public forma: FormGroup = new FormGroup({
    criteriosFormGroup: new FormGroup({}),
    requerimientosFormGroup: new FormGroup({}),
  });
  /**
   * Almacena el objeto de configuración para los criterios de socios comerciales.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION`, que contiene
   * los ajustes y parámetros necesarios para gestionar y mostrar los datos relacionados
   * con los socios comerciales dentro del componente.
   *
   * @see CONFIGURACION
   */
  public criteriosDatos = CONFIGURACION;
  /**
   * Almacena la configuración para los requerimientos de datos utilizados en el componente Socios Comerciales.
   * 
   * @notas
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_REQUERIMIENTOS`, que debe
   * contener la estructura y los detalles necesarios para gestionar los requerimientos de datos dentro del componente.
   * 
   * @see CONFIGURACION_REQUERIMIENTOS
   */
  public requerimientosDatos = CONFIGURACION_REQUERIMIENTOS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * 
   * @type {Solicitude32612State}
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Esto ayuda a prevenir fugas de memoria al cancelar la suscripción de los observables.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en componentes de Angular.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual de la consulta de socios comerciales.
   *
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa el SociosComercialesComponent con los stores y queries requeridos.
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` para actualizar la propiedad local `consultaState`
   * cada vez que el estado cambie, hasta que el componente sea destruido.
   *
   * @param tramite32612Store - Servicio store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Servicio query para acceder al estado del trámite 32612.
   * @param consultaQuery - Servicio query para acceder al estado de consultaio.
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
   * Obtiene el 'criteriosFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'criteriosFormGroup'.
   */
  get criteriosFormGroup(): FormGroup {
    return this.forma.get('criteriosFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'requerimientosFormGroup'
   * desde el formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * el grupo de controles de formulario relacionados con los "requerimientos" dentro del componente.
   *
   * @returns El `FormGroup` para 'requerimientosFormGroup'.
   */
  get requerimientosFormGroup(): FormGroup {
    return this.forma.get('requerimientosFormGroup') as FormGroup;
  }

  /**
   * Emite un cambio de valor para un campo específico actualizando el store con el nuevo valor.
   *
   * @param event - Un objeto que contiene el nombre del campo (`campo`) y su nuevo valor (`valor`).
   */
  public emitirCambioDeValor(event: {campo: string, valor: string}): void {
    this.tramite32612Store.setDynamicFieldValue(event.campo, event.valor);
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para limpiar las suscripciones
   * y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
