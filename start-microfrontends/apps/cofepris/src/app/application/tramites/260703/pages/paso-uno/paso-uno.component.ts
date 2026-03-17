import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosdelasolicitudComponent } from '../../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { Service260702Service } from '../../../../shared/services/shared2607/service260702.service';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { TercerosrelacionadosComponent } from '../../../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component'; 


/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 * Este componente se encarga de gestionar la información del pago de derechos
 * y de mostrar los trámites asociados a la solicitud de permiso.
 * 
 * @example
 * ```html
 * <app-paso-uno></app-paso-uno>
 * ```
 * 
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * Referencia al componente hijo "DatosdelasolicitudComponent" para acceder a sus métodos y propiedades.
   */
   @ViewChild(DatosdelasolicitudComponent)datosdelasolicitudComponent!: DatosdelasolicitudComponent;

  /**
   * El índice de la pestaña actualmente seleccionada.
   * Por defecto es 1 que representa la primera pestaña.
   * 
   * @type {number}
   * @default 1
   * @example
   * ```typescript
   * this.indice = 3; // Selecciona la tercera pestaña
   * ```
   */
  indice: number = 1;

 /**
  * Referencia al componente hijo "TercerosrelacionadosComponent" para acceder a sus métodos y propiedades.
  */
 @ViewChild(TercerosrelacionadosComponent)tercerosrelacionadosComponent!: TercerosrelacionadosComponent;

  /**
   * Formulario reactivo para capturar los datos del pago de derechos.
   * Se inicializa dinámicamente con los valores del estado de la solicitud.
   * 
   * @type {FormGroup}
   * @see {@link crearformularioPagoDerechos}
   * @example
   * ```typescript
   * this.formularioPagoDerechos.get('claveDeReferencia')?.value;
   * ```
   */
  formularioPagoDerechos!: FormGroup;

  /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   * Esto ayuda a evitar fugas de memoria mediante el patrón takeUntil.
   * 
   * @private
   * @type {Subject<void>}
   * @see {@link ngOnDestroy}
   * @example
   * ```typescript
   * someObservable.pipe(takeUntil(this.notificadorDestruccion$))
   * ```
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   * Indica si los datos han sido cargados desde el servidor correctamente.
   * 
   * @type {boolean}
   * @default false
   * @example
   * ```typescript
   * if (this.esDatosRespuesta) {
   *   // Procesar datos del servidor
   * }
   * ```
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la consulta, que contiene información sobre el estado actual del formulario.
   * Incluye información sobre el modo de visualización y permisos del usuario.
   * 
   * @type {ConsultaioState}
   * @see {@link ConsultaioState}
   */
  public consultaState!: ConsultaioState;
/**
 * Indica si el formulario está en modo de solo lectura.
 */
  esFormularioSoloLectura: boolean = false;

  /**
   * Identificador del procedimiento asociado a este componente.
   */
  public idProcedimiento: number = 260703;
  
/**
 * Evento que emite el estado de validez del formulario de domicilio.
 * 
 * @event
 * @type {boolean}
 * @description Emite `true` si el formulario de domicilio es válido, `false` en caso contrario.
 */
@Output() domicilioFormValidity = new EventEmitter<boolean>();


   /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
@Input() isContinuarTriggered: boolean = false;
  



 /**
  * Constructor del componente PasoUnoComponent.
  * Inyecta los servicios necesarios para la gestión del formulario, estado y consultas.
  */
  constructor(
    private formBuilder: FormBuilder,
    private service260702Service: Service260702Service,
    private consultaQuery: ConsultaioQuery,
    public solicitud260703Store:Solicitud260702Store,
    private solicitud260703Query:Solicitud260702Query
  ) {
     this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.notificadorDestruccion$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
       
      })
    )
    .subscribe()
  }

 /**
  * Método del ciclo de vida `ngOnInit`.
  * Inicializa el componente y sus dependencias.
  * Suscribe al observable del estado de consulta para obtener el estado actual desde el store.
  * Si el estado indica que hay una actualización pendiente (`update`), llama al método para guardar los datos del formulario.
  * En caso contrario, activa la bandera para mostrar los datos de respuesta.
  */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
   
  }

   /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.service260702Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.notificadorDestruccion$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.service260702Service.actualizarEstadoFormulario(resp);
        }
      });
  }


 /**
  * Método para seleccionar una pestaña específica.
  * @param i Índice de la pestaña a seleccionar.
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


  /**
   * Maneja el cambio de validez del formulario.
   * 
   * @param event - Valor booleano que indica si el formulario es válido o no.
   * Establece el estado de validez del formulario 'datosDelSolicitude' en el store de solicitud260703.
   */
  onFormValidityChange(event:boolean):void {
   this.solicitud260703Store.setFormValidity('datosDelSolicitude', event);
  }

  /**
   * Valida los formularios relacionados con la solicitud actual.
   * 
   * Esta función verifica la validez del componente de datos de la solicitud
   * accediendo al estado actual de `solicitud260703Query` y consultando la propiedad
   * `formValidity.datosDelSolicitude`. Si la propiedad no está definida, retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario de datos de la solicitud es válido, `false` en caso contrario.
   */
  public validarFormularios(): boolean { 
  const VALIDITY = this.solicitud260703Query.getValue().formValidity;
  const DATOS_VALID = VALIDITY?.datosDelSolicitud ?? false;
  const TERCEROS_VALID = VALIDITY?.tercerosRelacionados ?? false;

  return DATOS_VALID && TERCEROS_VALID;

  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria utilizando el patrón takeUntil.
   * 
   * Realiza las siguientes operaciones de limpieza:
   * - Emite una señal de destrucción a todas las suscripciones activas
   * - Completa el subject notificadorDestruccion$
   * - Libera los recursos utilizados por las suscripciones
   * 
   * @returns {void}
   * @see {@link notificadorDestruccion$}
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente al destruir el componente
   * component.ngOnDestroy();
   * ```
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}