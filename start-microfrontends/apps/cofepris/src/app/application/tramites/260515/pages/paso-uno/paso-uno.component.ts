import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AfterViewInit } from '@angular/core';
import { AvisocalidadStore } from '../../../../shared/estados/stores/aviso-calidad.store';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { GuardarAdapter_260515 } from '../../adapters/guardar-payload.adapter';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PagoDerechosComponent } from '../../components/pago-derechos/pago-derechos.component';
import { PagoDerechosStore } from '../../../../shared/estados/stores/pago-de-derechos.store';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';

/**
 * Componente que representa el primer paso del proceso de solicitud.
 * Contiene un componente de solicitante y permite la navegación entre tabs.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  @ViewChild(DatosSolicitudComponent) datosSolicitudRef!: DatosSolicitudComponent;
  @ViewChild(PagoDerechosComponent) pagoDeDerechosContenedoraRef!: PagoDerechosComponent;


  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Índice del tab seleccionado.
   */
  indice: number = 1;

  /**
   * Método para seleccionar un tab.
   * @param i Índice del tab.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de consulta que contiene la información del formulario y su estado.
   * Se obtiene a través de la consulta ConsultaioQuery.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente Datos260502Component.
   *
   * @param solicitud260502Service - Servicio para manejar la lógica de negocio relacionada con el trámite 260502.
   * @param consultaQuery - Consulta para obtener el estado actual del formulario y su configuración.
   */
  constructor(
    private datosDomicilioLegalService: DatosDomicilioLegalService,
    private pagoBancoService: PagoBancoService,
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
     private avisocalidadStore: AvisocalidadStore,
    private pagoDerechosStore: PagoDerechosStore,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore,
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta para obtener la información del formulario.
   * Si el estado indica que se está actualizando, se llama a `guardarDatosFormulario`.
   * De lo contrario, se establece `esDatosRespuesta` como verdadero.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState?.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio `getRegistroTomaMuestrasMercanciasData` para obtener los datos del formulario.
   * Si la respuesta es válida, se actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
     const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260515,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260515.patchresponseToStore(res.datos,this.avisocalidadStore,this.datosDomicilioLegalStore,this.pagoDerechosStore,);
      }
    });
    this.esDatosRespuesta=true;

    // También se puede llamar al servicio pagoBancoService si es necesario
    // this.pagoBancoService
    //   .getRegistroTomaMuestrasMercanciasData()
    //   .pipe(takeUntil(this.destroyNotifier$))
    //   .subscribe((resp) => {
    //     if (resp) {
    //       this.esDatosRespuesta = true;
    //       this.pagoBancoService.actualizarEstadoFormulario(resp);
    //     }
    //   });
  }
  validOnButtonClick():boolean{
    let isValid = true;
    if(!this.datosSolicitudRef?.validarClickDeBoton()){
          isValid = false;
        }
        if(!this.pagoDeDerechosContenedoraRef?.validarContenedor()){
          isValid = false;
        } 
        return isValid;
      }
  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
