import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Tramite6403State, Tramite6403Store} from '../../estados/tramite6403.store';
import { CommonModule } from '@angular/common';
import { RetornoDePartesService } from '../../services/retorno-de-partes.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite6403Query } from '../../estados/tramite6403.query';
/**
 * Componente para gestionar el paso uno del trámite 6403.
 * 
 * Este componente permite al usuario navegar entre las pestañas del trámite y gestionar
 * los datos del solicitante y del aviso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitudComponent, SolicitanteComponent]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
    * Indica si los datos de respuesta están disponibles.
    */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
    * Estado de la consulta, utilizado para manejar el estado de la aplicación.
    */
  public consultaState!: ConsultaioState;
  /**
   * Referencia al componente `SolicitanteComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del solicitante dentro de la plantilla.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  @ViewChild(SolicitudComponent) solicitudComponent!: SolicitudComponent;

  /**
   * Índice de la pestaña activa.
   * 
   * Esta propiedad indica la pestaña actual seleccionada en el componente.
   */
  indice: number = 1;

  /**
   * Estado actual del trámite 6403.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite6403State;

  /**
   * Indica si los datos de respuesta están disponibles.
   * 
   * Esta propiedad se utiliza para determinar si los datos de respuesta del trámite
   * están listos para ser mostrados en la interfaz de usuario.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * Constructor del componente.
   * 
   * @param {Tramite6403Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite6403Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite6403Store,
    public tramiteQuery: Tramite6403Query,
    public consultaQuery: ConsultaioQuery,
    public retornoDePartesService: RetornoDePartesService) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos. También inicializa el índice de la pestaña activa.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;

    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormularios();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Obtiene los datos de consulta del servicio y actualiza el store.
   */
  public guardarDatosFormularios(): void {
    this.retornoDePartesService
      .getRegistroTomaMuestrasMercanciasData().pipe(takeUntil(this.destroyed$)).subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          const FORM = respuesta?.datos?.solicitudFormulario;
          const MERCANCIA = respuesta?.datos?.mercanciaFormulario;
          this.store.setMercanciaFormulario(respuesta?.datos?.mercanciaFormulario);
          this.store.setCveAduana(FORM.cveAduana);
          this.store.setCveSeccionAduanal(FORM.cveSeccionAduanal);
          this.store.setCveRecintoFiscalizado(FORM.cveRecintoFiscalizado);
          this.store.setCveTipoDocumento(FORM.cveTipoDocumento);
          this.store.setEstadoTipoDocumento(FORM.estadoTipoDocumento);
          this.store.setAduana(FORM.aduana);
          this.store.setPatente(FORM.patente);
          this.store.setPedimento(FORM.pedimento);
          this.store.setFolioImportacionTemporal(FORM.folioImportacionTemporal);
          this.store.setFolioFormatoOficial(FORM.folioFormatoOficial);
          this.store.setCheckProrroga(FORM.checkProrroga);
          this.store.setFolioOficialProrroga(FORM.folioOficialProrroga);
          this.store.setFechaImportacionTemporal(FORM.fechaImportacionTemporal);
          this.store.setFechaVencimiento(FORM.fechaVencimiento);
          this.store.setDescMercancia(FORM.descMercancia);
          this.store.setMarca(FORM.marca);
          this.store.setModelo(FORM.modelo);
          this.store.setNumeroSerie(FORM.numeroSerie);
          this.store.setTipo(FORM.tipo);
          this.store.setCveMedioTrasporte(FORM.cveMedioTrasporte);
          this.store.setGuiaMaster(FORM.guiaMaster);
          this.store.setGuiaBl(FORM.guiaBl);
          this.store.setNumeroBl(FORM.numeroBl);
          this.store.setRfcEmpresaTransportista(FORM.rfcEmpresaTransportista);
          this.store.setEstadoMedioTransporte(FORM.estadoMedioTransporte);
          this.store.setCartaPorte(FORM.cartaPorte);
          this.store.setCvePaisProcedencia(FORM.cvePaisProcedencia);
          this.store.setGuiaHouse(FORM.guiaHouse);
          this.store.setNumeroBuque(FORM.numeroBuque);
          this.store.setNumeroEquipo(FORM.numeroEquipo);
          this.store.setFechaCartaPorte(FORM.fechaCartaPorte);
          this.store.setTipContenedor(FORM.tipContenedor);
          this.store.setTranporteMarca(FORM.tranporteMarca);
          this.store.setTranporteModelo(FORM.tranporteModelo);
          this.store.setTranportePlaca(FORM.tranportePlaca);
          this.store.setObservaciones(FORM.observaciones);
          this.store.setConDestino(FORM.conDestino);
          this.store.setCveTipoDestino(FORM.cveTipoDestino);
          this.store.setCveTipoDocumentoReemplazada(FORM.cveTipoDocumentoReemplazada);
          this.store.setNumeroActaDescruccion(FORM.numeroActaDescruccion);
          this.store.setCveAduanaDestino(FORM.cveAduanaDestino);
          this.store.setCvePatenteDestino(FORM.cvePatenteDestino);
          this.store.setCvePedimentoDestino(FORM.cvePedimentoDestino);
          this.store.setFolioVucemRetorno(FORM.folioVucemRetorno);
          this.store.setFolioFormatoOficialDestino(FORM.folioFormatoOficialDestino);
          this.store.setFechaDescruccionDestino(FORM.fechaDescruccionDestino);
          this.store.setEstadoTipoDocumentoDestino(FORM.estadoTipoDocumentoDestino);
          this.store.setAutoridadPresentoAvisoDestruccion(FORM.autoridadPresentoAvisoDestruccion);

          this.store.setModalDescMercancia(MERCANCIA.modalDescMercancia);
          this.store.setEspeMercancia(MERCANCIA.espeMercancia);
          this.store.setMarcaMercancia(MERCANCIA.marcaMercancia);
          this.store.setModeloMercancia(MERCANCIA.modeloMercancia);
          this.store.setNumSerieMercancia(MERCANCIA.numSerieMercancia);
          this.store.setNumParteMercancia(MERCANCIA.numParteMercancia);
          this.store.setTipoMercancia(MERCANCIA.tipoMercancia);
          this.store.setTablaPartesReemplazadasDatos(respuesta.datos.tablaPartesReemplazadasDatos || []);
        }
      });
  }
  
  /**
   * Cambia la pestaña activa.
   * 
   * Este método actualiza el índice de la pestaña activa y llama al método correspondiente
   * del store para actualizar el estado.
   * 
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor al `destroyed$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */

    /**
   * Método público para validar los formularios del paso uno.
   *
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */

  isFormValid(): boolean {
    const IS_SOLICITANTE_VALID = this.solicitudComponent.isFormValid();
    return IS_SOLICITANTE_VALID;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}