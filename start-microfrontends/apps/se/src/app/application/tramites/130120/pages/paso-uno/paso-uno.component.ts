import { Component, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from "@ng-mf/data-access-user";
import { of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosExportadorComponent } from "../../components/datos-exportador/datos-exportador.component";
import { DatosMercanciaComponent } from "../../components/datos-mercancia/datos-mercancia.component";
import { DatosProductorComponent } from "../../components/datos-productor/datos-productor.component";
import { DetalleEvaluaconSolicitudService } from "../../services/detalleEvaluaconSolicitud.service";
import { DocumentoExportacionComponent } from "../../components/documento-exportacion/documento-exportacion.component";
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PermisoImportacionService } from "../../services/permiso-importacion.service";
import { RepresentacionFederalComponent } from "../../components/representacion-federal/representacion-federal.component";
import { Subject } from 'rxjs';
import { TramiteRealizerComponent } from "../../components/tramite_realizer/tramite_realizer.component";
import { takeUntil } from 'rxjs';

/**
 * Componente para el paso uno del trámite 130120.
 * Se encarga de inicializar el estado, gestionar la suscripción a los datos de consulta
 * y cargar los datos del formulario si es necesario.
 *
 * @export
 * @class PasoUnoComponent
 * @implements {OnDestroy}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [CommonModule, SolicitanteComponent, TramiteRealizerComponent, DatosMercanciaComponent, DocumentoExportacionComponent, DatosProductorComponent, DatosExportadorComponent, RepresentacionFederalComponent],
  standalone: true,
})
export class PasoUnoComponent implements OnDestroy, OnInit {

  /**
   * Estado de la consulta obtenido desde el store.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  @ViewChild(TramiteRealizerComponent) tramiteRealizer!: TramiteRealizerComponent;
  @ViewChild(DatosMercanciaComponent) datosMercancia!: DatosMercanciaComponent;
  @ViewChild(DocumentoExportacionComponent) documentoExportacion!: DocumentoExportacionComponent;
  @ViewChild(DatosProductorComponent) datosProductor!: DatosProductorComponent;
  @ViewChild(DatosExportadorComponent) datosExportador!: DatosExportadorComponent;
  @ViewChild(RepresentacionFederalComponent) representacionFederal!: RepresentacionFederalComponent;

  /**
   * Indica si los datos de respuesta del servidor están disponibles para actualizar el formulario.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Notificador observable que permite cancelar las suscripciones activas cuando se destruye el componente.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Número de folio del trámite.
   */
  numeroFolio: string = '';

  /**
   * Flag para controlar si ya se ejecutó el servicio de detalle.
   */
  private yaEjecutoServicio: boolean = false;

  /**
   * Constructor del componente.
   * Suscribe al estado de consulta y actualiza la propiedad consultaState.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param permisoImportacionService Servicio para operaciones de permiso de importación.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private permisoImportacionService: PermisoImportacionService,
    private servicioDetalle: DetalleEvaluaconSolicitudService
  ) {

  }

  /**
   * Ciclo de vida de Angular: se ejecuta al inicializar el componente.
   * Si hay datos para actualizar, llama a guardarDatosFormulario; si no, activa el modo de respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      switchMap((seccionState) => {
        this.consultaState = seccionState;
        this.numeroFolio = this.consultaState.folioTramite;
        
        // Solo ejecutar el servicio si es necesario y no se ha ejecutado antes
        if (this.consultaState.update && !this.yaEjecutoServicio && this.numeroFolio) {
          this.yaEjecutoServicio = true;
          return this.servicioDetalle.getDetalleEvaluacionSolicitud(this.numeroFolio);
        }
        
        if (!this.consultaState.update && !this.esDatosRespuesta) {
          this.esDatosRespuesta = true;
        }
        return of(null);
      })
    ).subscribe((resp) => {
      if (resp && resp.datos) {
        this.esDatosRespuesta = true;
        this.permisoImportacionService.actualizarEstadoFormulario(resp.datos);
      }
    });
  }

  /**
   * Cambia la pestaña seleccionada.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  validarFormulario(): boolean {
    const VALID_TRAMITE = this.tramiteRealizer?.validarFormulario() ?? false;
    const VALID_MERCANCIA = this.datosMercancia?.validarFormulario() ?? false;
    const VALID_EXPORTA = this.documentoExportacion?.validarFormulario() ?? false;
    const VALID_PRODUCTOR = this.datosProductor?.validarFormulario() ?? false;
    const VALID_EXPORTADOR = this.datosExportador?.validarFormulario() ?? false;
    const VALID_FEDERAL = this.representacionFederal?.validarFormulario() ?? false;
    return (
      VALID_TRAMITE &&
      VALID_MERCANCIA &&
      VALID_EXPORTA &&
      VALID_PRODUCTOR &&
      VALID_EXPORTADOR &&
      VALID_FEDERAL
    );
  }

  /**
   * Ciclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}