import { ARANCELARIA_TABLA_ENCABEZADOS, PRODUCTO_OPCION_RADIO, SOLICITUD_OPCION_RADIO, SOLICITUD_TABLA_ENCABEZADOS } from '../../constants/modificacion-descripcion.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, InputRadioComponent, TablaDinamicaComponent, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosArancelaria, SolicitudTablaDatos } from '../../models/modificacion-descripcion.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, filter, first } from 'rxjs';
import { Tramite130401State, Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { CommonModule } from '@angular/common';
import { ModificacionDescripcionService } from '../../services/modificacion-descripcion.service';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para gestionar la solicitud del trámite 130401.
 * 
 * Este componente muestra los datos de la solicitud, las partidas y las fracciones arancelarias.
 * También permite inicializar el formulario de solicitud y cargar los datos desde el servicio.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
  standalone: true,
  imports: [CommonModule, TituloComponent, FormsModule, ReactiveFormsModule, InputRadioComponent, TablaDinamicaComponent],
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite130401State;

  /**
   * Formulario reactivo para capturar los datos de la solicitud.
   * 
   * Este formulario incluye campos como el número de folio, solicitud, régimen, entre otros.
   */
  solicitudFormulario!: FormGroup;

  /**
   * Variable para almacenar el valor de países.
   * 
   * Esta propiedad almacena el valor de países para mostrar en el template.
   */
  paises: string = '';

  /**
   * Opciones de radio para el tipo de solicitud.
   * 
   * Estas opciones se muestran en el formulario para seleccionar el tipo de solicitud.
   */
  solicitudOpcionRadio = SOLICITUD_OPCION_RADIO;

  /**
   * Opciones de radio para el tipo de producto.
   * 
   * Estas opciones se muestran en el formulario para seleccionar el tipo de producto.
   */
  productoOpcionRadio = PRODUCTO_OPCION_RADIO;

  /**
   * Configuración de las columnas de la tabla de partidas.
   * 
   * Define los encabezados y claves para mostrar los datos de las partidas.
   */
  public solicitudTablaEncabezados: ConfiguracionColumna<SolicitudTablaDatos>[] = SOLICITUD_TABLA_ENCABEZADOS;

  /**
   * Datos de la tabla de partidas.
   * 
   * Contiene las partidas obtenidas desde el servicio.
   */
  solicitudTablaDatos: SolicitudTablaDatos[] = [];

  /**
   * Configuración de las columnas de la tabla de fracciones arancelarias.
   * 
   * Define los encabezados y claves para mostrar los datos de las fracciones arancelarias.
   */
  public arancelariaTablaEncabezados: ConfiguracionColumna<DatosArancelaria>[] = ARANCELARIA_TABLA_ENCABEZADOS;

  /**
   * Datos de la tabla de fracciones arancelarias.
   * 
   * Contiene las fracciones arancelarias obtenidas desde el servicio.
   */
  arancelariaTablaDatos: DatosArancelaria[] = [];
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param {Tramite130401Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite130401Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   * @param {ModificacionDescripcionService} modificacionDescripcionService - Servicio para obtener datos relacionados con la solicitud.
   */
  constructor(
    public store: Tramite130401Store,
    public tramiteQuery: Tramite130401Query,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private modificacionDescripcionService: ModificacionDescripcionService,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Constructor del componente
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite, inicializa el formulario y
   * carga los datos de partidas, fracciones arancelarias y solicitud.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter(datos => Boolean(datos)),
        first(),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.actualizarFormularioConDatos();
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

  }

  /**
   * Inicializa el formulario reactivo para capturar los datos de la solicitud.
   */
  inicializarFormulario(): void {
    this.solicitudFormulario = this.fb.group({
      numeroFolioTramiteOriginal: [{ value: this.tramiteState?.datosSolicitud?.numeroFolioResolucion || '', disabled: true }, []],
      solicitud: [{ value: this.tramiteState?.datosSolicitud?.tramite?.solicitud || '', disabled: true }, []],
      regimen: [{ value: this.tramiteState?.datosSolicitud?.mercanciaResponseDto?.regimen || '', disabled: true }, []],
      clasificacionRegimen: [{ value: this.tramiteState?.datosSolicitud?.clasificacionRegimen || '', disabled: true }, []],
      tipoSolicitudPexim: [{ value: this.tramiteState?.datosSolicitud?.tipoSolicitudPexim, disabled: true }, []],
      condicionMercancia: [{ value: this.tramiteState?.datosSolicitud?.condicionMercancia, disabled: true }, []],
      mercanciaDescripcion: [{ value: this.tramiteState?.datosSolicitud?.mercanciaDescripcion, disabled: true }, []],
      fraccionArancelaria: [{ value: this.tramiteState?.datosSolicitud?.fraccionArancelaria, disabled: true }, []],
      unidadMedidaTarifaria: [{ value: this.tramiteState?.datosSolicitud?.unidadMedidaTarifaria, disabled: true }, []],
      unidadesAutorizadas: [{ value: this.tramiteState?.datosSolicitud?.unidadesAutorizadas, disabled: true }, []],
      importeFacturaAutorizadoUSD: [{ value: this.tramiteState?.datosSolicitud?.importeFacturaAutorizadoUSD, disabled: true }, []],
      usoEspecifico: [{ value: this.tramiteState?.datosSolicitud?.usoEspecifico, disabled: true }, []],
      justificacionImportacionExportacion: [{ value: this.tramiteState?.datosSolicitud?.justificacionImportacionExportacion, disabled: true }, []],
      observaciones: [{ value: this.tramiteState?.datosSolicitud?.observaciones, disabled: true }, []],
      representacionFederal: [{ value: this.tramiteState?.datosSolicitud?.representacionFederal, disabled: true }, []],
      paises: [{ value: this.tramiteState?.datosSolicitud?.paises, disabled: true }, []],
    });
    this.inicializarEstadoFormulario();
  }
  
  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * Este método deshabilita el formulario `solicitudFormulario` si la propiedad `soloLectura` es `true`.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.solicitudFormulario?.disable();
    }
  }

  /**
   * Actualiza el formulario con los datos del trámite.
   * 
   * Este método maneja la actualización de valores en controles deshabilitados.
   */
  actualizarFormularioConDatos(): void {
    if (this.solicitudFormulario && this.tramiteState?.datosSolicitud) {
      const DATOS = this.tramiteState.datosSolicitud;

      this.habilitarControlesFormulario();
      this.actualizarValoresFormulario(DATOS);
      this.establecerVariablesComponente(DATOS);
      this.deshabilitarControlesFormulario();
    }
  }

  /**
   * Habilita temporalmente los controles del formulario para actualización.
   */
  private habilitarControlesFormulario(): void {
    const CONTROLES = [
      'numeroFolioTramiteOriginal', 'solicitud', 'clasificacionRegimen', 'regimen',
      'condicionMercancia', 'mercanciaDescripcion', 'fraccionArancelaria',
      'unidadMedidaTarifaria', 'unidadesAutorizadas', 'importeFacturaAutorizadoUSD',
      'usoEspecifico', 'justificacionImportacionExportacion', 'observaciones',
      'representacionFederal', 'paises'
    ];

    CONTROLES.forEach(control => {
      this.solicitudFormulario.get(control)?.enable();
    });
  }

  /**
   * Actualiza los valores del formulario con los datos recibidos.
   */
  private actualizarValoresFormulario(DATOS: Tramite130401State['datosSolicitud']): void {
    this.solicitudFormulario.patchValue({
      numeroFolioTramiteOriginal: DATOS.numeroFolioResolucion || '',
      solicitud: DATOS.tramite?.solicitud || '',
      clasificacionRegimen: DATOS.mercanciaResponseDto?.clasificacionRegimen || '',
      regimen: DATOS.mercanciaResponseDto?.regimen || '',
      tipoSolicitudPexim: DATOS.mercanciaResponseDto?.tipoSolicitudPexim || '',
      condicionMercancia: DATOS.mercanciaResponseDto?.condicionMercancia || DATOS.mercancia || '',
      mercanciaDescripcion: DATOS.mercanciaResponseDto?.descripcion || '',
      fraccionArancelaria: DATOS.mercanciaResponseDto?.fraccionArancelaria || '',
      unidadMedidaTarifaria: DATOS.mercanciaResponseDto?.unidadMedidaTarifaria || '',
      unidadesAutorizadas: DATOS.mercanciaResponseDto?.unidadesAutorizadas || '',
      importeFacturaAutorizadoUSD: DATOS.mercanciaResponseDto?.importeFacturaAutorizadoUSD || '',
      usoEspecifico: DATOS.usoEspecifico || '',
      justificacionImportacionExportacion: DATOS.justificacionImportacionExportacion || '',
      observaciones: DATOS.observaciones || '',
      representacionFederal: DATOS.representacionFederal || '',
      paises: DATOS.paises || ''
    });
  }

  /**
   * Establece las variables del componente basadas en los datos.
   */
  private establecerVariablesComponente(DATOS: Tramite130401State['datosSolicitud']): void {
    this.paises = DATOS.paises || '';
    if (DATOS?.partidasMercancia && Array.isArray(DATOS.partidasMercancia)) {
      this.solicitudTablaDatos = DATOS.partidasMercancia;
    }
  }

  /**
   * Deshabilita todos los controles del formulario después de la actualización.
   */
  private deshabilitarControlesFormulario(): void {
    const CONTROLS = [
      'numeroFolioTramiteOriginal', 'solicitud', 'clasificacionRegimen', 'regimen',
      'condicionMercancia', 'mercanciaDescripcion', 'fraccionArancelaria',
      'unidadMedidaTarifaria', 'unidadesAutorizadas', 'importeFacturaAutorizadoUSD',
      'usoEspecifico', 'justificacionImportacionExportacion', 'observaciones',
      'representacionFederal', 'paises'
    ];

    CONTROLS.forEach(control => {
      this.solicitudFormulario.get(control)?.disable();
    });
  }
 
  /**
   * Verifica si un campo del formulario es válido.
   * 
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}