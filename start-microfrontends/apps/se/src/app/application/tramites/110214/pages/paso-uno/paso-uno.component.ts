import { Component, Input, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatarioComponent } from '../../components/destinatario/destinatario.component';
import { HistProductoresComponent } from '../../components/hist-productores/hist-productores.component';
import { Shared1102Service } from '../../../../shared/services/shared1102/shared1102.service';
import { Subject } from 'rxjs';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { Tramite110214State } from '../../../../estados/tramites/tramite110214.store';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent,
    DatosCertificadoComponent, HistProductoresComponent,
    DestinatarioComponent, CertificadoOrigenComponent
  ]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  
/**
 * Referencia al componente 'Solicitante' en la plantilla.
 * Permite acceder a sus propiedades y métodos desde el componente padre.
 */
@ViewChild('Solicitante', { static: false }) solicitante!: SolicitanteComponent;

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

/** Índice que representa la pestaña activa en el componente. */
indice: number = 1;

/** Estado del trámite actual, utilizado para almacenar y gestionar datos relacionados con el trámite. */
public tramiteState!: Tramite110214State;

/** Notificador para destruir observables y evitar fugas de memoria. */
destroyNotifier$: Subject<void> = new Subject();

/** Estado de la consulta, utilizado para almacenar los datos obtenidos de la consulta. */
consultaDatos!: ConsultaioState;

/** Bandera que indica si los datos de la consulta ya están disponibles. */
public esDatosRespuesta: boolean = false;

/** Indica si el formulario del componente DatosCertificadoComponent es válido. */
private isDatosCertificadoComponentValid: boolean = false;

/** Indica si el formulario del componente DestinatarioComponent es válido. */
private isDestinarioComponentValid: boolean = false;

/** Indica si el formulario del componente HistProductoresComponent es válido. */
private isHistProductoresComponentValid: boolean = false;

/** Indica si el formulario del componente CertificadoOrigenComponent es válido. */
private isCertificadoOrigenComponentValid: boolean = false;

/**
 * Identificador del procedimiento o trámite actual.
 *
 * Esta propiedad almacena el ID del procedimiento que se está gestionando en el componente,
 * permitiendo realizar operaciones y consultas específicas para dicho trámite.
 */
private idProcediemento: number = 110214;

/** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
@Input() isContinuarTriggered: boolean = false; 

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
 * @param store 
 * @param tramiteQuery 
 * @param consultaioQuery 
 * @param validarInicialmenteCertificadoService 
 */
 
  constructor(
    public store: Tramite110214Store,
    public tramiteQuery: Tramite110214Query,
    private consultaioQuery: ConsultaioQuery,
    private validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService,
    private shared1102Service: Shared1102Service
  ) { }

  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;
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
    this.shared1102Service.setProcedimiento(this.idProcediemento);
  }

  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
  }

  /**
   * Obtiene los datos de consulta desde el servicio y actualiza el estado del store.
   * 
   * Este método realiza una solicitud al servicio `CertificadosOrigenService` para obtener
   * los datos de consulta relacionados con el trámite. Si la respuesta es exitosa, actualiza
   * múltiples propiedades en el store con los datos obtenidos.
   */
  public fetchGetDatosConsulta(): void {
    this.validarInicialmenteCertificadoService
      .fetchMostrarApi(this.idProcediemento, this.idSolicitud) 
      .pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (respuesta) => {
        if (respuesta['codigo'] === "00") {
          this.esDatosRespuesta = true;
          const MAPPED_STATE = this.shared1102Service.mapToState(respuesta['datos'] as Record<string, unknown>);
          this.store.update(MAPPED_STATE);
        }
      }, error: () => {
          // En caso de error, se intenta obtener los datos de consulta nuevamente
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
   * Maneja el clic en el botón de continuar.
   * Valida los formularios y muestra un mensaje de error si hay campos faltantes.
   */
  public continuar(): void {
    if (this.validarFormularios()) {
      // Lógica para continuar al siguiente paso
    } 
  }

  /**
   * Muestra una notificación de error.
   * 
   * @param {string} titulo - Título de la notificación.
   * @param {string} mensaje - Mensaje de la notificación.
   */
  

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}