import { CONFIGURACION_ADUANAL_CUENTA, CONFIGURACION_ANEXE_PROCEDIMIENTO, CONFIGURACION_CONSERVARSE, CONFIGURACION_PROCEDIMIENTO, CONFIGURACION_SELLOS } from '../../constants/vehiculos.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TEXTOS_ESTATICOS_VEHICULOS } from '../../constants/texto-estatico.enum';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para gestionar los formularios y el estado relacionado con vehículos en el trámite 32612.
 *
 * @remarks
 * Este componente es standalone e importa módulos comunes de Angular y un componente de formularios dinámicos.
 * Administra varios grupos de formularios para diferentes secciones, carga datos de configuración para cada sección,
 * y se suscribe a los cambios de estado desde los servicios de store y query de la aplicación.
 */
@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent implements OnInit, OnDestroy {

  /**
   * Contiene los recursos de texto estático para el componente Vehiculos.
   * 
   * Esta propiedad proporciona acceso al conjunto predefinido de textos estáticos
   * utilizados en todo el componente Vehiculos para su visualización y localización.
   *
   * @see TEXTOS_ESTATICOS_VEHICULOS
   */
  public textos = TEXTOS_ESTATICOS_VEHICULOS;
  /**
   * Grupo de formulario reactivo principal para el componente Vehiculos.
   * 
   * Este grupo de formulario contiene grupos de formularios anidados para gestionar diferentes secciones:
   * - `sellosFormGroup`: Maneja los controles de formulario relacionados con "sellos".
   * - `procedimientoFormGroup`: Maneja los controles de formulario relacionados con "procedimiento".
   * - `anexeElProcedimientoFormGroup`: Maneja los controles de formulario relacionados con "anexe el procedimiento".
   * - `aduanalCuentaFormGroup`: Maneja los controles de formulario relacionados con "aduanal cuenta".
   * - `conservarseFormGroup`: Maneja los controles de formulario relacionados con "conservarse".
   */
  public forma: FormGroup = new FormGroup({
    sellosFormGroup: new FormGroup({}),
    procedimientoFormGroup: new FormGroup({}),
    anexeElProcedimientoFormGroup: new FormGroup({}),
    aduanalCuentaFormGroup: new FormGroup({}),
    conservarseFormGroup: new FormGroup({})
  });

  /**
   * Almacena la configuración de "sellos" utilizada en el componente.
   * 
   * El valor se importa desde `CONFIGURACION_SELLOS`, que define la estructura y opciones
   * para mostrar o gestionar los datos relacionados con los sellos dentro del componente de vehículos.
   *
   * @see CONFIGURACION_SELLOS
   */
  public sellosDatos = CONFIGURACION_SELLOS;
  /**
   * Almacena la configuración de "procedimiento" utilizada en el componente.
   * 
   * El valor se importa desde `CONFIGURACION_PROCEDIMIENTO`, que define la estructura y opciones
   * para mostrar o gestionar los datos relacionados con el procedimiento dentro del componente de vehículos.
   *
   * @see CONFIGURACION_PROCEDIMIENTO
   */
  public procedimientoDatos = CONFIGURACION_PROCEDIMIENTO;
  /**
   * Almacena el objeto de configuración para la sección "Anexe Procedimiento".
   * Esta configuración se importa desde `CONFIGURACION_ANEXE_PROCEDIMIENTO` y
   * se utiliza para gestionar los ajustes y el comportamiento de los componentes de la interfaz relacionados.
   */
  public anexeProcedimientoDatos = CONFIGURACION_ANEXE_PROCEDIMIENTO;
  /**
   * Almacena la configuración para la sección "Aduanal Cuenta".
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_ADUANAL_CUENTA`,
   * que contiene los datos de configuración necesarios para gestionar la información
   * de la cuenta aduanal dentro del componente de vehículos.
   *
   * @see CONFIGURACION_ADUANAL_CUENTA
   */
  public aduanalCuentaDatos = CONFIGURACION_ADUANAL_CUENTA;
  /**
   * Almacena la configuración para la funcionalidad "conservarse".
   * 
   * @remarks
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_CONSERVARSE`.
   * Se utiliza para gestionar y acceder a la configuración relacionada con la preservación de datos dentro del componente.
   *
   * @see CONFIGURACION_CONSERVARSE
   */
  public conservarseDatos = CONFIGURACION_CONSERVARSE;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * 
   * Esta propiedad contiene todos los datos relevantes e información de estado de la solicitud,
   * permitiendo al componente gestionar y mostrar el progreso y los detalles de la solicitud.
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Subject utilizado para notificar y completar las suscripciones para una limpieza adecuada,
   * normalmente en el ciclo de vida ngOnDestroy para evitar fugas de memoria.
   * Emite un valor void cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Contiene el estado actual del proceso de consulta de vehículos.
   * 
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Inicializa el VehiculosComponent con los stores y queries requeridos.
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` para actualizar la propiedad local
   * `consultaState` cada vez que el estado cambie, hasta que el componente sea destruido.
   *
   * @param tramite32612Store - Servicio store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Servicio query para obtener datos relacionados con el trámite 32612.
   * @param consultaQuery - Servicio query para obtener y suscribirse al estado de consultaio.
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
   * Obtiene el 'sellosFormGroup' como un FormGroup desde el formulario principal.
   *
   * @returns La instancia de FormGroup asociada a 'sellosFormGroup'.
   */
  get sellosFormGroup(): FormGroup {
    return this.forma.get('sellosFormGroup') as FormGroup;
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'procedimientoFormGroup'
   * del formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * el grupo de formulario relacionado con el procedimiento dentro del componente.
   *
   * @returns El `FormGroup` para 'procedimientoFormGroup'.
   */
  get procedimientoFormGroup(): FormGroup {
    return this.forma.get('procedimientoFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'anexeElProcedimientoFormGroup'
   * del formulario principal (`forma`).
   *
   * @returns El `FormGroup` para 'anexeElProcedimientoFormGroup'.
   */
  get anexeElProcedimientoFormGroup(): FormGroup {
    return this.forma.get('anexeElProcedimientoFormGroup') as FormGroup;
  }
  /**
   * Obtiene la instancia de FormGroup asociada al control 'aduanalCuentaFormGroup' del formulario principal.
   *
   * @returns {FormGroup} El FormGroup para 'aduanalCuentaFormGroup'.
   */
  get aduanalCuentaFormGroup(): FormGroup {
    return this.forma.get('aduanalCuentaFormGroup') as FormGroup;
  }
  /**
   * Obtiene el 'conservarseFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'conservarseFormGroup'.
   */
  get conservarseFormGroup(): FormGroup {
    return this.forma.get('conservarseFormGroup') as FormGroup;
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
