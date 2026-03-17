import { CONFIGURACION_TECNOLOGIA, CONFIGURACION_TECNOLOGIA_DOS } from '../../constants/seguridad-de-la.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SEGURIDAD_DE_LA } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente responsable de manejar la sección "Seguridad De La" en la aplicación.
 * 
 * Este componente gestiona dos grupos de formularios dinámicos (`tecnologiaFormGroup` y `tecnologiaDosFormGroup`)
 * e interactúa con los stores y queries de estado de la aplicación para sincronizar los datos del formulario y el estado.
 * 
 * @remarks
 * - Utiliza la arquitectura de componentes independientes de Angular.
 * - Se suscribe a los cambios de estado de `Tramite32612Query` y `ConsultaioQuery`.
 * - Emite cambios en los campos dinámicos a través de `tramite32612Store`.
 * - Limpia las suscripciones al destruir el componente.
 */
@Component({
  selector: 'app-seguridad-de-la',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './seguridad-de-la.component.html',
  styleUrl: './seguridad-de-la.component.scss',
})
export class SeguridadDeLaComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente "Seguridad de la".
   * Se llena desde `TEXTOS_ESTATICOS_SEGURIDAD_DE_LA`, que proporciona
   * cadenas localizadas o predefinidas utilizadas en la interfaz de usuario del componente.
   */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_DE_LA;
  /**
   * Representa el grupo de formulario principal para el componente, que contiene dos grupos de formularios anidados:
   * - `tecnologiaFormGroup`: Un grupo de formulario vacío destinado a controles relacionados con tecnología.
   * - `tecnologiaDosFormGroup`: Un grupo de formulario vacío destinado a controles adicionales relacionados con tecnología.
   *
   * Esta estructura permite organizar y validar los controles del formulario relacionados con diferentes secciones de tecnología dentro del componente.
   */
  public forma: FormGroup = new FormGroup({
    tecnologiaFormGroup: new FormGroup({}),
    tecnologiaDosFormGroup: new FormGroup({}),
  });

  /**
   * Contiene los datos de configuración relacionados con tecnología.
   * Inicializado con el valor de `CONFIGURACION_TECNOLOGIA`.
   */
  public tecnologiaDatos = CONFIGURACION_TECNOLOGIA;
  /**
   * Contiene los datos de configuración para la segunda sección de tecnología.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_TECNOLOGIA_DOS`,
   * que contiene la configuración y opciones relevantes para la tecnología.
   */
  public tecnologiaDosDatos = CONFIGURACION_TECNOLOGIA_DOS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * Esta propiedad contiene toda la información relevante de datos y estado para la solicitud.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Ayuda a prevenir fugas de memoria al emitir un valor y completar todos los observables que están suscritos a este notificador.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en componentes de Angular.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Contiene el estado actual del proceso de consulta.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa el componente SeguridadDeLaComponent con los stores y queries requeridos.
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` para actualizar la propiedad local `consultaState`
   * cada vez que el estado cambie, hasta que el componente sea destruido.
   *
   * @param tramite32612Store - Servicio store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Servicio query para obtener datos relacionados con el trámite 32612.
   * @param consultaQuery - Servicio query para obtener y observar el estado de Consultaio.
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
   * 
   * Se suscribe al observable `selectSolicitude$` de `tramite32612Query`, actualizando la propiedad `solicitudeState`
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
   * Obtiene la instancia de `FormGroup` asociada al control 'tecnologiaFormGroup' del formulario principal.
   *
   * @returns {FormGroup} El `FormGroup` correspondiente a 'tecnologiaFormGroup'.
   */
  get tecnologiaFormGroup(): FormGroup {
    return this.forma.get('tecnologiaFormGroup') as FormGroup;
  }

  /**
   * Obtiene el `tecnologiaDosFormGroup` como un `FormGroup` desde el formulario principal.
   * 
   * @returns La instancia de `FormGroup` asociada al control 'tecnologiaDosFormGroup'.
   */
  get tecnologiaDosFormGroup(): FormGroup {
    return this.forma.get('tecnologiaDosFormGroup') as FormGroup;
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
