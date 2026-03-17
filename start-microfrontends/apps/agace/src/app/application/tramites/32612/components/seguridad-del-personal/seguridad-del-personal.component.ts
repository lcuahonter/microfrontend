import { CONFIGURACION_ADMINISTRACION, CONFIGURACION_PROCEDIMIENTO, CONFIGURACION_VERIFICACION } from '../../constants/seguridad-del-personal.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_SEGURIDAD_DEL_PERSONAL } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente encargado de la gestión de la sección "Seguridad del Personal" en el trámite 32612.
 * 
 * Este componente utiliza formularios reactivos para manejar los datos de antecedentes laborales,
 * procedimientos y administración relacionados con la seguridad del personal. Integra configuraciones
 * dinámicas y estáticas para la visualización y edición de los datos, y se conecta con los stores
 * y queries para la gestión del estado global de la aplicación.
 * 
 * - `textos`: Contiene los textos estáticos para la sección.
 * - `forma`: Formulario principal que agrupa los subformularios de antecedentes laborales, procedimiento y administración.
 * - `antecedentesLaboralesDatos`, `procedimientoDatos`, `administracionDatos`: Configuraciones para los formularios dinámicos.
 * - `solicitudeState`: Estado actual de la solicitud del trámite.
 * - `consultaState`: Estado actual de la consulta.
 * 
 * El componente implementa la suscripción y limpieza de observables para evitar fugas de memoria.
 * 
 * @example
 * <app-seguridad-del-personal></app-seguridad-del-personal>
 */
@Component({
  selector: 'app-seguridad-del-personal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './seguridad-del-personal.component.html',
  styleUrl: './seguridad-del-personal.component.scss',
})
export class SeguridadDelPersonalComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático relacionados con el componente "Seguridad del Personal".
   * Estos textos se utilizan para mostrar etiquetas, mensajes y otros elementos de la interfaz de usuario
   * dentro del componente, asegurando consistencia y localización.
   */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_DEL_PERSONAL;
  /**
   * Grupo de formulario principal que contiene subgrupos para diferentes secciones del proceso de seguridad del personal.
   *
   * @property antecedentesLaboralesFormGroup - Grupo de formulario para gestionar la información de antecedentes laborales.
   * @property procedimientoFormGroup - Grupo de formulario para manejar los detalles de procedimientos.
   * @property administracionFormGroup - Grupo de formulario para datos relacionados con la administración.
   */
  public forma: FormGroup = new FormGroup({
    antecedentesLaboralesFormGroup: new FormGroup({}),
    procedimientoFormGroup: new FormGroup({}),
    administracionFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para la sección "Verificación de antecedentes laborales".
   * Este objeto se inicializa con el valor de `CONFIGURACION_VERIFICACION`, que contiene
   * los ajustes y parámetros necesarios para mostrar y gestionar la verificación de antecedentes laborales.
   */
  public antecedentesLaboralesDatos = CONFIGURACION_VERIFICACION;
  /**
   * Almacena el objeto de configuración para el procedimiento, utilizando la constante
   * predefinida `CONFIGURACION_PROCEDIMIENTO`. Este objeto contiene todos los ajustes
   * y parámetros necesarios para el funcionamiento del procedimiento dentro del componente.
   */
  public procedimientoDatos = CONFIGURACION_PROCEDIMIENTO;
  /**
   * Almacena la configuración para la sección de administración.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_ADMINISTRACION`,
   * que contiene los parámetros y opciones necesarios para gestionar los datos administrativos.
   */
  public administracionDatos = CONFIGURACION_ADMINISTRACION;
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * Se utiliza para gestionar y rastrear el estado y los datos relacionados con la solicitud dentro del componente.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones de observables cuando el componente se destruye.
   * Ayuda a prevenir fugas de memoria al emitir un valor y completar todas las suscripciones vinculadas a este notifier.
   * Normalmente se utiliza con el operador `takeUntil` de RxJS en componentes de Angular.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual de la consulta de seguridad del personal.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;


  /**
   * Inicializa el componente SeguridadDelPersonalComponent.
   * 
   * @param tramite32612Store - Servicio para gestionar el estado del trámite 32612.
   * @param tramite32612Query - Servicio de consulta para obtener el estado del trámite 32612.
   * @param consultaQuery - Servicio de consulta para obtener el estado de consultaio.
   * 
   * Se suscribe al observable selectConsultaioState$ de consultaQuery,
   * actualizando la propiedad local consultaState cada vez que el estado cambia.
   * La suscripción se cancela automáticamente cuando destroyNotifier$ emite.
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
   * Obtiene la instancia de `FormGroup` asociada al control 'antecedentesLaboralesFormGroup'
   * del formulario principal (`forma`). Este grupo de formulario contiene los controles y la lógica
   * de validación para la sección "Antecedentes Laborales" del formulario.
   *
   * @returns El `FormGroup` correspondiente a 'antecedentesLaboralesFormGroup'.
   */
  get antecedentesLaboralesFormGroup(): FormGroup {
    return this.forma.get('antecedentesLaboralesFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'procedimientoFormGroup'
   * del formulario principal (`forma`). Este grupo de formulario contiene los controles y la lógica
   * de validación para la sección "Procedimiento" del formulario.
   *
   * @returns El `FormGroup` correspondiente a 'procedimientoFormGroup'.
   */
  get procedimientoFormGroup(): FormGroup {
    return this.forma.get('procedimientoFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'administracionFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'administracionFormGroup'.
   */
  get administracionFormGroup(): FormGroup {
    return this.forma.get('administracionFormGroup') as FormGroup;
  }

  /**
   * Emite un cambio de valor para un campo dinámico en el store de tramite32612.
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
