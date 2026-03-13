import { AcusesResolucionesTabsComponent, AcusesYResolucionesDocumentosComponent, AcusesYResolucionesFolioDelTramiteDetallesComponent, BotonAccion, DocumentoInterfaz, LoginQuery, SolicitudesSubsecuentesService } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, map, takeUntil } from "rxjs";
import { AccuseComponentes } from "@libs/shared/data-access-user/src/core/models/lista-trimites.model";
import { CommonModule } from "@angular/common";
import { ConsultaioStore } from '@ng-mf/data-access-user';
import { LISTA_TRIMITES } from "../../shared/constantes/lista-trimites.enums";

@Component({
  selector: 'ng-mf-acuses-y-resoluciones-folio-del-tramite-detalles-contenedor',
  standalone: true,
  imports: [CommonModule,
    AcusesYResolucionesFolioDelTramiteDetallesComponent, AcusesYResolucionesDocumentosComponent, AcusesResolucionesTabsComponent],
  templateUrl:
    './acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component.html',
  styleUrl:
    './acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component.scss',
})
export class AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent
  implements OnInit, OnDestroy {
    /** Subject utilizado para liberar recursos y desuscribirse. */
  private unsubscribe$ = new Subject<void>();
  /**Valor del RFC del usuario */
  private rfcValor : string = '';
  /**id de la solicitud actual */
  public idSolicitud: string = '';
  /**url para el boton de regreso */
  public procedureRegresorUrl: string = '/subsecuentes';
  /**datos del formulario obtenidos del servicio */
  public datosDeFormulario = {};
  /**numero de tramite actual */
  public tramite: number = 0
  /**folio del tramite actual */
  public folioTramite: string = ''
  /**Array de la lista de botones de accion obtenidos del servicio */
  public botonesDeAccion: Array<BotonAccion> = [];
  /**inidica si el tramite es comun para renderizar las tabs o los acuses */
  public esTramiteComun: boolean = false;
  /** lista de tramites dispoibles*/
  public listaTramites: AccuseComponentes[] = LISTA_TRIMITES;
  /**
  * Datos que se muestran en la tabla de acuse.
  */
  datosAcuse: DocumentoInterfaz[] = [];
  /**datos que se muestran en la tabla resoluciones */
  datosResoluciones: DocumentoInterfaz[] = []
  /**
   * 
   * @param solicitudesSubsecuentesService servicio para hacer la cosulta de datos a la api
   * @param consultaioStore store del contexto actual
   * @param loginQuery contexto de autenticacion
   */
  constructor(
    private solicitudesSubsecuentesService: SolicitudesSubsecuentesService,
    private consultaioStore: ConsultaioStore,
    public loginQuery: LoginQuery
  ) { }

  ngOnInit(): void {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((state) => {
          this.rfcValor = state.rfc
        })
      )
      .subscribe();
    this.idSolicitud = localStorage.getItem('id_solicitud') || ''
    localStorage.removeItem('id_solicitud')
    localStorage.removeItem('tramite')
    this.obtenerDetallesDeLaSolicitud();
  }

  /** Llama al servicio para obtener los botones */
  private obtenerDetallesDeLaSolicitud(): void {
    this.solicitudesSubsecuentesService.getDetalleDeSolicitud(this.idSolicitud, this.rfcValor, 'PersonaMoral')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.botonesDeAccion =
          res.datos.botones as Array<BotonAccion>;
        this.tramite = res.datos.id_tipo_tramite
        this.folioTramite = res.datos.num_folio_tramite
        this.datosDeFormulario = {
          folio: res.datos.num_folio_tramite,
          dependencia: "Administracion General de Aduanas",
          fechaInicial: res.datos.fecha_inicio_tramite,
          unidadAdministrativaORepresentacionFederal: res.datos.unidad_administrativa,
          tipoDeSolicitud: res.datos.tipo_solicitud,
          estatusDeLaSolicitud: res.datos.estado_solicitud,
          diasHabilesTranscurridos: res.datos.dias_habiles_transcurridos
        }
        this.esTramiteComun = res.datos.es_tramite_comun
        this.datosAcuse = res.datos.documentos.acuses ?? []
        this.datosResoluciones = res.datos.documentos.documentos_oficiales ?? []
        this.consultaioStore.establecerConsultaio(
          String(res.datos.id_tipo_tramite),
          "subsecuentes",
          res.datos.acronimo,
          res.datos.num_folio_tramite,
          String(res.datos.id_tipo_tramite),
          "",
          true,
          false,
          true,
          "",
          "",
          this.idSolicitud
        );

      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}