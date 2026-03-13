import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, RegistroSolicitudService, SolicitanteComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { ConsultaService } from '../../service/consulta.service';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { DatosdelasolicitudComponent } from '../../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { GuardarAdapter_260704 } from '../../adapters/guardar-payload.adapter';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { TercerosRelacionadosTwoComponent } from '../../../../shared/components/shared2607/terceros relacionados two/terceros-relacionados-two.component';
import { TercerosrelacionadosComponent } from '../../../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component'; 
import { Tramite260704Query } from '../../estados copy/queries/tramite260704Query.query';
import { Tramite260704Store } from '../../estados copy/stores/tramite260704Store.store';
import { DestinatarioModel, FacricanteModel } from '../../../../shared/models/terceros-fabricante-relocionados.model';
/**
 * Componente que representa el primer paso del trámite.
 *
 * Este componente agrupa los subcomponentes de solicitante, datos de la solicitud,
 * pago de derechos, terceros relacionados y trámites asociados, y administra la
 * navegación entre las pestañas del asistente.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo que contiene los campos del primer paso del trámite.
   */
  pasoUnoForm: FormGroup;
 

 @Input() confirmarSinPagoDeDerechos: number = 0;
 
   @ViewChild(SolicitanteComponent) solicitanteComponent!: SolicitanteComponent;
   
   @ViewChild(ContenedorDeDatosSolicitudComponent) contenedorDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;
 
 /**
  * Referencia al componente hijo "TercerosrelacionadosComponent" para acceder a sus métodos y propiedades.
  */
   @ViewChild(TercerosRelacionadosTwoComponent)tercerosrelacionadosComponent!: TercerosRelacionadosTwoComponent;
 
   @ViewChild(PagoDeDerechosContenedoraComponent) pagoDerechosComponent!: PagoDeDerechosContenedoraComponent;
 
 

  /**
  * Notificador utilizado para cancelar suscripciones al destruir el componente.
  * Ayuda a prevenir fugas de memoria en flujos observables.
  */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
   /**
     * Estado de la consulta, utilizado para manejar el estado de la aplicación.
     */
  public consultaState!: ConsultaioState;
  /**
   * Indica si los datos de respuesta están disponibles.
   * Se utiliza para determinar si se deben mostrar los datos del formulario o no.
   */
  public esDatosRespuesta: boolean = false;
  
  /**
   * Tipo de persona seleccionada.
   *
   * Representa el tipo de persona (por ejemplo, física o moral) que se selecciona.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona. */
  persona: FormularioDinamico[] = [];

  /*** Configuración del formulario dinámico para el domicilio fiscal.*/
  domicilioFiscal: FormularioDinamico[] = [];

    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Índice de la pestaña actual del asistente.
   */
  indice: number = 1;
/**
 * Indica si el formulario es de solo lectura.
 */
  public idProcedimiento: number = 260704;
  

  /**
     * Constructor del componente.
     *
     * Se utiliza para la inyección de dependencias.
     */
  constructor(
    private fb: FormBuilder,
    private consultaQuery: ConsultaioQuery,
    private consulta: ConsultaService,
    private tramite260704Store: Tramite260704Store,
    private tramite260704Query: Tramite260704Query,
    public registroSolicitudService: RegistroSolicitudService,
    
  ) {
    this.pasoUnoForm = this.fb.group({
      folioDeDesistimiento: [''],
      folioOriginal: ['']
    });
  }
 /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se pueden realizar tareas de configuración inicial, pero en este caso lanza un error indicando que no está implementado.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();
    if (this.consultaState.update) {
          this.guardarDatosFormulario(this.consultaState.id_solicitud,this.consultaState.procedureId);
    } else {
      this.esDatosRespuesta = true;
      this.guardarDatosFormulario("203065267", "260104");

    }
  // this.tramite260704Store.setContinuarTriggered(false);
  }

  
  /**
     * Método para guardar los datos del formulario.
     * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
     * y actualiza el estado del formulario según la respuesta.
     */
     guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
        this.registroSolicitudService.parcheOpcionesPrellenadas(
          Number(PROCEDURE_ID),
          Number(ID_SOLICITUD)
        ).subscribe((res: any) => {
          if (res && res.datos) {
            
            GuardarAdapter_260704.patchToStore(res.datos, this.tramite260704Store);
            // GuardarAdapter_260704.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
            // GuardarAdapter_260704.patchToStoreManifestos(res.datos, this.manifestoStore);
            // GuardarAdapter_260704.patchToStoreDomicilio(res.datos, this.domicilioStore);
          }
        });
  
      }

  // guardarDatosFormularios(): void {
  //   this.consulta
  //     .getRegistroTomaMuestrasMercanciasData().pipe(
  //       takeUntil(this.destroyed$)
  //     )
  //     .subscribe((resp) => {
  //       if (resp) {
  //         this.esDatosRespuesta = true;
  //         this.consulta.actualizarEstadoFormulario(resp);
  //       }
  //     });
  // }
  
  /**
   * Selecciona una pestaña del asistente.
   *
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

   validarPasoUno(): boolean {
    const ES_TAB_VALIDO = this.contenedorDatosSolicitudComponent?.validarContenedor() ?? false;
    const ES_TERCEROS_VALIDO = this.tercerosrelacionadosComponent.validarContenedor() ?? false;
    // const ES_PAGO_VALIDO = this.pagoDerechosComponent.validarContenedor() ?? false;
    return (
      (ES_TAB_VALIDO && ES_TERCEROS_VALIDO) ? true : false

    );
  }

   /**
   * Maneja el cambio de validez del formulario.
   * 
   * @param event - Valor booleano que indica si el formulario es válido o no.
   * Establece el estado de validez del formulario 'datosDelSolicitude' en el store de solicitud260703.
   */
  onFormValidityChange(event:boolean):void {
  //  this.tramite260704Store.setFormValidity('datosDelSolicitude', event);
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
  // const VALIDITY = this.tramite260704Query.getValue().formValidity;
  // const DATOS_VALID = VALIDITY?.datosDelSolicitud ?? false;
  // const TERCEROS_VALID = VALIDITY?.tercerosRelacionados ?? false;

  // return DATOS_VALID && TERCEROS_VALID;
  return false;
  }

  /**
   * Maneja los datos seleccionados de fabricantes desde el componente hijo.
   * @param fabricanteData - Arreglo de objetos FacricanteModel seleccionados.
   */
  public fabricanteTabla(fabricanteData: FacricanteModel[]): void {
    this.tramite260704Store.setFacricanteModel(fabricanteData);
  }

  public destinatarioTabla(destinatarioData: DestinatarioModel[]): void {
    this.tramite260704Store.setDestinatarioModel(destinatarioData);
  }
/**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Aquí se pueden realizar tareas de limpieza, pero en este caso lanza un error indicando que no está implementado.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
