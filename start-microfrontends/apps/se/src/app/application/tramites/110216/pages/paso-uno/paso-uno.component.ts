import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110216State, Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatarioComponent } from '../../components/destinatario/destinatario.component';
import { HistProductoresComponent } from '../../components/hist-productores/hist-productores.component';
import { Shared1102Service } from '../../../../shared/services/shared1102/shared1102.service';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';

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
  imports: [CommonModule, SolicitanteComponent, DatosCertificadoComponent, DestinatarioComponent, CertificadoOrigenComponent, HistProductoresComponent]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente `SolicitanteComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * de solicitante dentro de la plantilla.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Índice de la pestaña activa.
   * 
   * Esta propiedad indica cuál pestaña está activa actualmente.
   */
  indice: number = 1;

  /**
   * Estado actual del trámite.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite110216State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

    /** Indica si el formulario del componente DatosCertificadoComponent es válido. */
  private isDatosCertificadoComponentValid: boolean = false;

  /** Indica si el formulario del componente DestinatarioComponent es válido. */
  private isDestinarioComponentValid: boolean = false;

  /** Indica si el formulario del componente CertificadoOrigenComponent es válido. */
  private isCertificadoOrigenComponentValid: boolean = false;
  
  /** Referencia al componente 'DatosCertificadoComponent' en la plantilla.
   * Permite interactuar con sus métodos y propiedades.
   */
  @ViewChild('DatosCertificadoComponent', { static: false }) datosCertificadoComponent!: DatosCertificadoComponent;
  
  /** Referencia al componente 'DestinatarioComponent' en la plantilla.
   * Facilita el acceso a sus funcionalidades desde este componente.
   */
  @ViewChild('DestinatarioComponent', { static: false }) destinatarioComponent!: DestinatarioComponent;
  
  /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('CertificadoOrigenComponent', { static: false }) certificadoOrigenComponent!: CertificadoOrigenComponent;

  /**
   * Identificador del procedimiento o trámite actual.
   *
   * Esta propiedad almacena el ID del procedimiento que se está gestionando en el componente,
   * permitiendo realizar operaciones y consultas específicas para dicho trámite.
   */
  private idProcediemento: number = 110216;

  /**
   * Identificador de la solicitud actual.
   *
   * Esta propiedad almacena el ID de la solicitud que se está gestionando en el trámite,
   * permitiendo realizar consultas, actualizaciones y operaciones relacionadas con dicha solicitud.
   */
  private idSolicitud: number = 0;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false; 

  /**
   * Constructor del componente.
   * 
   * @param {Tramite110216Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110216Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    private store: Tramite110216Store,
    private tramiteQuery: Tramite110216Query,
    private consultaioQuery: ConsultaioQuery,
    private certificadosOrigenService: CertificadosOrigenService,
    private shared1102Service: Shared1102Service
  ) { }

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
  this.indice = this.tramiteState?.pestanaActiva || 1;
    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
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

    this.shared1102Service.setProcedimiento(this.idProcediemento);
  }

  /**
   * Método para seleccionar una pestaña específica.
   * 
   * Este método actualiza el índice de la pestaña activa y almacena el valor
   * en el store.
   * 
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;

  }
  /**
   * Obtiene los datos de consulta desde el servicio y actualiza el estado del store.
   * 
   * Este método realiza una solicitud al servicio `CertificadosOrigenService` para obtener
   * los datos de consulta relacionados con el trámite. Si la respuesta es exitosa, actualiza
   * múltiples propiedades en el store con los datos obtenidos.
   */
  public fetchGetDatosConsulta(): void {
    this.certificadosOrigenService
      .fetchMostrarApi(this.idProcediemento, this.idSolicitud) 
      .pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (respuesta) => {
        if (respuesta['codigo'] === "00") {
          this.esDatosRespuesta = true;
          const MAPPED_STATE = this.shared1102Service.mapToState(respuesta['datos'] as Record<string, unknown>);
          this.store.update(MAPPED_STATE);
        }
      }, error: () => {
          //
        }
      });
  }

  /**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean { 
    this.isCertificadoOrigenComponentValid = this.tramiteQuery.getValue().formValidity?.certificadoOrigen ?? false; 
    this.isDatosCertificadoComponentValid = this.tramiteQuery.getValue().formValidity?.datosCertificado ?? false;
    this.isDestinarioComponentValid = this.tramiteQuery.getValue().formValidity?.destinatario ?? false;

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