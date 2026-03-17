import { CONFIGURACION_ACTUALIZADA, CONFIGURACION_CONTROL, CONFIGURACION_GESTION } from '../../constants/gestion-aduanera.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_GESTION } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para la gestión de trámites aduaneros dentro de la aplicación.
 * 
 * Este componente maneja los formularios dinámicos y la gestión de estado para la sección de gestión aduanera,
 * incluyendo la configuración y los datos para los diferentes grupos de formularios (gestión, control, actualizada).
 * Se suscribe a los stores y queries relevantes para mantener su estado interno actualizado.
 */
@Component({
  selector: 'app-gestion-aduanera',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './gestion-aduanera.component.html',
  styleUrl: './gestion-aduanera.component.scss',
})
export class GestionAduaneraComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático utilizados en el componente de Gestión Aduanera.
   * Estos textos se importan desde la constante `TEXTOS_ESTATICOS_GESTION` y
   * están destinados a mostrarse dentro de la plantilla del componente.
   */
  public textos = TEXTOS_ESTATICOS_GESTION;
  /**
   * Grupo principal de formularios que contiene formularios anidados para la gestión de operaciones aduaneras.
   *
   */
  public forma: FormGroup = new FormGroup({
    gestionFormGroup: new FormGroup({}),
    controlFormGroup: new FormGroup({}),
    actualizadaFormGroup: new FormGroup({})
  });
  /**
   * Contiene los datos de configuración para el componente "Gestión Aduanera".
   */
  public gestionDatos = CONFIGURACION_GESTION;
  /**
   * Contiene el objeto de configuración para la sección de datos de control.
   */
  public controlDatos = CONFIGURACION_CONTROL;
  /**
   * Almacena el objeto de configuración para los datos actualizados, utilizando el valor de `CONFIGURACION_ACTUALIZADA`.
   * Esta propiedad se utiliza para gestionar y acceder a la configuración actualizada dentro del componente.
   */
  public actualizadaDatos = CONFIGURACION_ACTUALIZADA;
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * Esta propiedad contiene toda la información relevante sobre la solicitud,
   * incluyendo su estado, datos asociados y cualquier actualización realizada
   * durante el flujo de gestión aduanera.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Emite un valor void para señalar la finalización de los observables, ayudando a prevenir fugas de memoria.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en componentes de Angular.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual de la consulta de gestión aduanera.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * Crea una instancia de GestionAduaneraComponent.
   * 
   * @param tramite32612Store - Servicio para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Servicio de consulta para acceder al estado del trámite 32612.
   * @param consultaQuery - Servicio de consulta para acceder al estado de consultaio.
   * 
   * Se suscribe al observable del estado de consultaio y actualiza la propiedad local consultaState
   * hasta que destroyNotifier$ emite.
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
   * Obtiene el 'gestionFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'gestionFormGroup'.
   */
  get gestionFormGroup(): FormGroup {
    return this.forma.get('gestionFormGroup') as FormGroup;
  }

  /**
   * Obtiene el `controlFormGroup` como un `FormGroup` desde el formulario principal.
   * Este getter recupera el grupo de formulario anidado llamado 'controlFormGroup' del formulario principal `forma`.
   * 
   * @returns La instancia de `FormGroup` asociada a 'controlFormGroup'.
   */
  get controlFormGroup(): FormGroup {
    return this.forma.get('controlFormGroup') as FormGroup;
  }

  /**
   * Obtiene el `actualizadaFormGroup` como un `FormGroup` desde el grupo de formulario principal `forma`.
   * 
   * @returns El `actualizadaFormGroup` casteado como `FormGroup`.
   */
  get actualizadaFormGroup(): FormGroup {
    return this.forma.get('actualizadaFormGroup') as FormGroup;
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
