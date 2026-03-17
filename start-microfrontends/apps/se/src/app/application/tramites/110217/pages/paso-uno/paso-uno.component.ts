import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110217State, Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CertificadosOrigenService } from '../../services/certificado-origen.service.ts';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatariosComponent } from '../../components/destinatarios/destinatario.component';
import { HistProductoresComponent } from '../../components/hist-productores/hist-productores.component';
import { Shared1102Service } from '../../../../shared/services/shared1102/shared1102.service';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';

/**
 * Componente para gestionar el paso uno del trámite.
 *
 * Este componente permite al usuario navegar entre diferentes pestañas y gestionar
 * las secciones relacionadas con el trámite, como solicitante, destinatario, histórico
 * de productores y datos del certificado.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosCertificadoComponent,
    DestinatariosComponent,
    CertificadoOrigenComponent,
    HistProductoresComponent
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false; 

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente `SolicitanteComponent`.
   *
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * de solicitante dentro de la plantilla.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente `CertificadoOrigenComponent`.
   */
  @ViewChild('certificadoOrigenRef') certificadoOrigenComp!: CertificadoOrigenComponent;

  /**
   * Referencia al componente `DestinatariosComponent`.
   */
  @ViewChild('destinatarioRef') destinatarioComp!: DestinatariosComponent;

  /**
   * Referencia al componente `DatosCertificadoComponent`.
   */
  @ViewChild('datosCertificadoRef') datosCertificadoComp!: DatosCertificadoComponent;

  /**
   * Evento que se emite cuando cambia de tab.
   */
  @Output() cambioDePestana = new EventEmitter<void>();

  /**
   * Índice de la pestaña activa.
   *
   * Esta propiedad indica cuál pestaña está activa actualmente.
   */
  indice: number = 1;

  /**
   * Tracking de tabs completadas
   * Almacena qué tabs han sido visitadas y completadas por el usuario
   */
  tabsCompletadas: Set<number> = new Set();

  /**
   * Estado actual del trámite.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite110217State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

   /** Indica si el formulario del componente DatosCertificadoComponent es válido. */
  private isDatosCertificadoComponentValid: boolean = false;

  /** Indica si el formulario del componente DestinatarioComponent es válido. */
  private isDestinarioComponentValid: boolean = false;

  /** Indica si el formulario del componente CertificadoOrigenComponent es válido. */
  private isCertificadoOrigenComponentValid: boolean = false;

  /**
   * Identificador del procedimiento o trámite actual.
   *
   * Esta propiedad almacena el ID del procedimiento que se está gestionando en el componente,
   * permitiendo realizar operaciones y consultas específicas para dicho trámite.
   */
  private idProcediemento: number = 110217;

  /**
   * Identificador de la solicitud actual.
   *
   * Esta propiedad almacena el ID de la solicitud que se está gestionando en el trámite,
   * permitiendo realizar consultas, actualizaciones y operaciones relacionadas con dicha solicitud.
   */
  private idSolicitud: number = 0;

  /**
   * Constructor del componente.
   *
   * @param {Tramite110217Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110217Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite110217Store,
    public tramiteQuery: Tramite110217Query,
    private certificadosOrigenService: CertificadosOrigenService,
    private consultaioQuery: ConsultaioQuery,
    private shared1102Service: Shared1102Service
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite y establece la pestaña activa
   * según el estado almacenado.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    // this.indice = this.tramiteState.pestanaActiva;

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.idSolicitud = Number(seccionState.id_solicitud);
        })
      )
      .subscribe();
   
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    } else {
      this.esDatosRespuesta = true;
    }
    // this.indice = this.tramiteState.pestanaActiva;
    this.shared1102Service.setProcedimiento(this.idProcediemento);
  }

  /**
   * Método para obtener los datos de consulta del servicio.
   *  Este método realiza una llamada al servicio `CertificadosOrigenService`
   *  para obtener los datos necesarios para la consulta del certificado de origen.
   *  @returns {void}
   *  @memberof PasoUnoComponent
   * */
   public fetchGetDatosConsulta(): void {
    this.certificadosOrigenService
      .fetchMostrarApi(this.idProcediemento, this.idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (respuesta) => {
          this.esDatosRespuesta = true;
        if (respuesta['codigo'] === "00") {
          const MAPPED_STATE = this.shared1102Service.mapToState(respuesta['datos'] as Record<string, unknown>);
          this.store.update(MAPPED_STATE);
        }
      }, error: () => {
         //
        }
      });
  }
  /**
   * Método para seleccionar una pestaña específica.
   *
   * Este método actualiza el índice de la pestaña activa y almacena el valor
   * en el store. También marca la tab anterior como completada si tenía form válido.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    // Marcar la tab actual como completada si tiene form válido
    // this.marcarTabComoCompletada(this.indice);
    
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
    this.cambioDePestana.emit(); // Emite evento cuando cambia de tab
  }

  /**
   * Marca una tab como completada si su formulario es válido
   * @param tabIndex - Índice de la tab a verificar
   */
  // private marcarTabComoCompletada(tabIndex: number): void {
  //   let isValid = false;
    
  //   // Tab 2: Certificado de origen
  //   if (tabIndex === 2 && this.certificadoOrigenComp?.formCertificado) {
  //     isValid = this.certificadoOrigenComp.formCertificado.valid;
  //   }
    
  //   // Tab 4: Destinatario  
  //   if (tabIndex === 4 && this.destinatarioComp?.validateAllForms) {
  //     isValid = this.destinatarioComp.validateAllForms();
  //   }
    
  //   // Tab 5: Datos certificado
  //   if (tabIndex === 5 && this.datosCertificadoComp?.formDatosCertificado) {
  //     isValid = this.datosCertificadoComp.formDatosCertificado.valid;
  //   }
    
  //   // Si es válida, marcarla como completada
  //   if (isValid) {
  //     this.tabsCompletadas.add(tabIndex);
  //   } else if ([2, 4, 5].includes(tabIndex)) {
  //     // Si es una tab requerida pero inválida, removerla de completadas
  //     this.tabsCompletadas.delete(tabIndex);
  //   }
  // }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * Requiere que TODAS las tabs necesarias estén completadas:
   * - Tab 2: Certificado de origen
   * - Tab 4: Destinatario  
   * - Tab 5: Datos certificado
   * 
   * @returns {boolean} `true` si TODAS las tabs requeridas están completadas
   */
  public validarTodosLosFormularios(): boolean {
    this.isCertificadoOrigenComponentValid = this.tramiteQuery.getValue().formValidity?.certificadoOrigen ?? false; 
    this.isDatosCertificadoComponentValid = this.tramiteQuery.getValue().formValidity?.datosCertificado ?? false;
    this.isDestinarioComponentValid = (this.tramiteQuery.getValue().formValidity?.domicilioDestinatario && this.tramiteQuery.getValue().formValidity?.datosRepresentante) ?? false; 

    return this.isDatosCertificadoComponentValid && this.isDestinarioComponentValid &&
      this.isCertificadoOrigenComponentValid;
    }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.shared1102Service.resetProcedimiento();
  }
}
