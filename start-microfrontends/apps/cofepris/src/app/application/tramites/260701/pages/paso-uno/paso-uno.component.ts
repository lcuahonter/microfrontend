import { Subject,map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Component,Input, OnInit, ViewChild } from '@angular/core';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { DatosdelasolicitudComponent } from '../../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
/**
 * Componente PasoUnoComponent.
 *
 * Este componente representa el primer paso de un trámite en la aplicación.
 * Contiene lógica para manejar la selección de subtítulos y mostrar la sección
 * correspondiente de datos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit {
/**
 * Holds the current radio value for tipoTramite, used for child component binding.
 */
  public tipoTramite: string = '';
    /**
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
    indice: number = 1;
    /**
     * Subject utilizado para notificar y completar las suscripciones para su limpieza, típicamente en el ciclo de vida ngOnDestroy.
     * Emite un valor void para señalar a los observadores que deben desuscribirse y prevenir fugas de memoria.
     * 
     * @private
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
     * Mantiene el estado actual del proceso Consultaio para este componente.
     * 
     * @remarks
     * Esta propiedad se utiliza para gestionar y rastrear el estado del flujo de trabajo de Consultaio
     * dentro del PasoUnoComponent. Se espera que sea inicializada en otra parte del componente.
     * 
     * @type {ConsultaioState}
     */
    public consultaState!:ConsultaioState;
/**
 * Identificador del procedimiento asociado a este componente.
 */
    public idProcedimiento: number = 260701;
    /**
     * Inicializa una nueva instancia de la clase PasoUnoComponent.
     * 
     * @param certificadosLicenciasSvc Servicio para manejar operaciones relacionadas con certificados y licencias.
     * @param consultaQuery Servicio de consulta para recuperar datos de consulta.
     */
    constructor(
       private certificadosLicenciasSvc: CertificadosLicenciasService,
       private consultaQuery: ConsultaioQuery,
       private solicitud260703Query: Solicitud260702Query,
         private solicitud260703Store:Solicitud260702Store,
    ) {

    }


    /**
     * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
     * 
     * - Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza la propiedad local `consultaState` con el valor emitido.
     * - Si la bandera `consultaState.update` es verdadera, se dispara el método `guardarDatosFormulario()` para guardar los datos del formulario.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite, previniendo fugas de memoria.
     */
    ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
      if(this.consultaState.update) {
        this.guardarDatosFormulario();
      }
    }
 
    /**
     * Método para cambiar el índice del subtítulo seleccionado.
     *
     * @param i - Índice del nuevo subtítulo seleccionado.
     */
    seleccionaTab(i: number): void {
      this.indice = i;
    }
    /**
 * Referencia al componente hijo "DatosdelasolicitudComponent" para acceder a sus métodos y propiedades.
 */
 @ViewChild(DatosdelasolicitudComponent)datosdelasolicitudComponent!: DatosdelasolicitudComponent;

    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
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
     * Guarda los datos del formulario obteniendo los datos actuales del servicio y actualizando el estado del formulario.
     *
     * Este método se suscribe al observable `getConsultaDatos` de `certificadosLicenciasSvc`,
     * y al recibir una respuesta, actualiza el estado del formulario usando `actualizarEstadoFormulario`.
     * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite.
     */
    public guardarDatosFormulario(): void {
      this.certificadosLicenciasSvc.getConsultaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (response) => {
          if (response) {
            this.certificadosLicenciasSvc.actualizarEstadoFormulario(response);
          }
        }
      });
      this.certificadosLicenciasSvc.getRepresentLegalaConsulta().pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (response) => {
          if (response) {
            this.certificadosLicenciasSvc.actualizarRepresentLegala(response);
          }
        }
      });
    }

}
