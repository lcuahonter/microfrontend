import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosdelasolicitudComponent } from '../../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { Service260702Service } from '../../../../shared/services/shared2607/service260702.service';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { TercerosrelacionadosComponent } from '../../../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component';
/**
 * Componente que representa el paso uno del trámite.
 * Gestiona la selección de pestañas en el proceso.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente hijo "DatosdelasolicitudComponent" para acceder a sus métodos y propiedades.
   */
   @ViewChild(DatosdelasolicitudComponent)datosdelasolicitudComponent!: DatosdelasolicitudComponent;
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
  /** Índice de la pestaña seleccionada. */
  indice: number = 1;
  
 /**
  * Referencia al componente hijo "TercerosrelacionadosComponent" para acceder a sus métodos y propiedades.
  */
 @ViewChild(TercerosrelacionadosComponent)tercerosrelacionadosComponent!: TercerosrelacionadosComponent;

  /** Estado actual de la consulta obtenido desde el store. */
  public consultaState!: ConsultaioState;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
   * ID del procedimiento asociado al trámite.
   * Este campo almacena el identificador único del procedimiento.
   */
  public idProcedimiento: number = 260702;
  /**
  * Constructor del componente DatosComponent.
  * Inyecta los servicios necesarios para la gestión de pantallas, obtención y actualización de datos,
  * así como la consulta del estado desde el store.
  *
  * @param {service260702Service} Service260702Service - Servicio para obtener y actualizar los datos del formulario del trámite 260702.
  * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado actual desde el store.
  */
  constructor(
    private service260702Service: Service260702Service,
    private consultaQuery: ConsultaioQuery,
     private solicitud260702Store:Solicitud260702Store,
    private solicitud260702Query:Solicitud260702Query
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
  /**
     * Método del ciclo de vida `ngOnInit`.
     * Inicializa el componente y sus dependencias.
     * Suscribe al observable del estado de consulta para obtener el estado actual desde el store.
     * Si el estado indica que hay una actualización pendiente (`update`), llama al método para guardar los datos del formulario.
     * En caso contrario, activa la bandera para mostrar los datos de respuesta.
     */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
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
  const VALIDITY = this.solicitud260702Query.getValue().formValidity;
  const DATOS_VALID = VALIDITY?.datosDelSolicitud ?? false;
  const TERCEROS_VALID = VALIDITY?.tercerosRelacionados ?? false;

  return DATOS_VALID && TERCEROS_VALID;
  }

    /**
   * Maneja el cambio de validez del formulario.
   * 
   * @param event - Valor booleano que indica si el formulario es válido o no.
   * Establece el estado de validez del formulario 'datosDelSolicitude' en el store de solicitud260703.
   */
  onFormValidityChange(event:boolean):void {
   this.solicitud260702Store.setFormValidity('datosDelSolicitude', event);
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.service260702Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.service260702Service.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Método para seleccionar una pestaña específica.
   * Actualiza el índice de la pestaña seleccionada.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  
  /**
  * Método del ciclo de vida `ngOnDestroy`.
  * Se ejecuta cuando el componente es destruido.
  * Notifica a los observables suscritos que deben finalizar y libera los recursos asociados.
  *
  * @example
  * // Angular llama automáticamente a este método al destruir el componente.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
