import * as formData from '@libs/shared/theme/assets/json/140105/datos-del-formulario.json';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Cancelacion } from '../../models/cancelacion-de-solicitus.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { DetalleDelBuscarResponse } from '../../../../shared/models/detalleDelPermiso.model';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';

/**
 * @component BusquedaFolioComponent
 * @description
 * Componente encargado de gestionar la búsqueda de trámites por folio y la visualización
 * del detalle del permiso correspondiente.
 *
 * Utiliza formularios reactivos para realizar validaciones, presentar datos y manejar el estado del formulario.
 * Además, se comunica con servicios para el control de mensajes y sincronización del estado de la aplicación.
 *
 * Este componente permite:
 * - Buscar un trámite mediante su número de folio.
 * - Visualizar los datos del permiso en modo solo lectura.
 * - Agregar o cancelar acciones relacionadas al permiso consultado.
 *
 * @example
 * ```html
 * <app-busqueda-folio></app-busqueda-folio>
 * ```
 */
@Component({
  selector: 'app-busqueda-folio',
  templateUrl: './busqueda-folio.component.html',
  styleUrl: './busqueda-folio.component.scss',
})
export class BusquedaFolioComponent implements OnDestroy, OnChanges{
  /**
   * Formulario utilizado para capturar el número de folio del trámite.
   * Este formulario incluye validaciones requeridas y de patrón numérico.
   */
  public busquedaForm!: FormGroup;

  /**
   * Formulario que contiene los datos del detalle del permiso consultado.
   * Todos los campos están deshabilitados porque se presentan en modo solo lectura.
   */
  public detalleDelPermisoForm!: FormGroup;

  /**
   * Bandera que indica si se debe mostrar el formulario con el detalle del permiso.
   */
  public detalleDelPermiso: boolean = false;

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Este estado se obtiene desde el estado global de la aplicación.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @descripcion
   * Evento que se emite al cerrar el modal.
   */
  @Output() cerrarClicado = new EventEmitter();

  /**
   * Sujeto utilizado para cancelar suscripciones activas al momento de destruir el componente.
   * Esto evita fugas de memoria en la aplicación.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  @Input() detalleDelPermisoDatos: DetalleDelBuscarResponse[] | null = null;

  /**
   * Constructor del componente.
   * Inicializa los formularios y suscriptores que observan cambios en el estado global.
   *
   * @param servicioDeMensajesService Servicio que maneja el envío de mensajes entre componentes.
   * @param fb Instancia de FormBuilder para construir formularios reactivos.
   * @param consultaQuery Query de estado para obtener información de readonly u otros flags globales.
   * @param desistimientoStore Store para manejar el estado de cancelación de permisos.
   */
  constructor(
    private servicioDeMensajesService: ServicioDeMensajesService,
    private fb: FormBuilder,
    private consultaQuery: ConsultaioQuery,
    private desistimientoStore: DesistimientoStore
  ) {
    this.estableDetalleDelPermisoForm();
    this.buscar();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario de detalle del permiso si aún no ha sido creado.
   */
  inicializarEstadoFormulario(): void {
    if (!this.detalleDelPermisoForm) {
      this.estableDetalleDelPermisoForm();
    }
  }

  /**
   * Ejecuta la lógica para buscar un trámite por folio.
   * Si el formulario es inválido, se marcan todos los campos como tocados para mostrar errores.
   * Si es válido, se muestra el detalle del permiso y se cargan los datos correspondientes.
   *
   * @param _event Evento de tipo `Event` (no utilizado directamente).
   */
  public buscar(): void {
    this.detalleDelPermiso = true;
    this.establecerFormularioDeDetallesDe();
  }

  /**
   * Envía una señal de que se han agregado los datos del permiso consultado.
   * Crea el payload de cancelación a partir de los datos del formulario y lo almacena en el store.
   *
   * @param _event Evento de tipo `Event` (no utilizado directamente).
   */
  public agregar(_event: Event): void {
    const PAYLOAD = this.crearPayloadCancelacion();
    this.desistimientoStore.actualizarDatosForma([PAYLOAD]);
    this.servicioDeMensajesService.enviarMensaje(false);
    this.servicioDeMensajesService.establecerDatosDePermiso(true);
    this.cerrarClicado.emit();
  }

  /**
   * Crea el payload de cancelación a partir de los datos del formulario de detalle del permiso.
   *
   * @returns Objeto de tipo Cancelacion con los datos mapeados desde el formulario.
   */
  private crearPayloadCancelacion(): Cancelacion {
    const FORM_VALUES = this.detalleDelPermisoForm.value;

    return {
      idResolucion: '',
      numeroResolucion: '',
      regimen: FORM_VALUES.regimen || '',
      clasificacionRegimen: '',
      condicionMercancia: FORM_VALUES.condicionDeLaMercancia || '',
      fraccionArancelaria: FORM_VALUES.fraccionArancelaria || '',
      unidadMedida: FORM_VALUES.umt || '',
      cantidadImportarExportar: FORM_VALUES.cantidad || '',
      vigenciaResolucion: this.obtenerFechaVigencia(),
      valorAutorizado: FORM_VALUES.usd || '',
      inicioResolucion: this.obtenerFechaActual(),
      numFolioTramite: FORM_VALUES.folioTramite || '',
      valorSolicitado: '',
      cantidadImportarExportarSolicitada: '',
      general: '',
    };
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD.
   *
   * @returns Fecha actual como string.
   */
  private obtenerFechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Obtiene la fecha de vigencia (un año desde la fecha actual) en formato YYYY-MM-DD.
   *
   * @returns Fecha de vigencia como string.
   */
  private obtenerFechaVigencia(): string {
    const FECHA_VIGENCIA = new Date();
    FECHA_VIGENCIA.setFullYear(FECHA_VIGENCIA.getFullYear() + 1);
    return FECHA_VIGENCIA.toISOString().split('T')[0];
  }

  /**
   * Cancela la visualización del detalle del permiso y oculta el formulario.
   *
   * @param _event Evento de tipo `Event` (no utilizado directamente).
   */
  public detalleCancelar(): void {
    this.cerrarClicado.emit();
  }

  /**
   * Cancela la búsqueda actual y notifica a través del servicio de mensajes.
   *
   * @param _event Evento de tipo `Event` (no utilizado directamente).
   */
  public cancelar(_event: Event): void {
    this.servicioDeMensajesService.enviarMensaje(false);
  }

  /**
   * Inicializa el formulario del detalle del permiso con campos deshabilitados.
   * Este formulario solo sirve para visualizar los datos y no permite edición.
   */
  public estableDetalleDelPermisoForm(): void {
    this.detalleDelPermisoForm = this.fb.group({
      numFolioTramite: [{ value: '', disabled: true }],
      tipoSolicitud: [{ value: '', disabled: true }],
      regimen: [{ value: '', disabled: true }],
      condicionMercancia: [{ value: '', disabled: true }],
      unidadMedidaUMT: [{ value: '', disabled: true }],
      cantidadAutorizada: [{ value: '', disabled: true }],
      clasificacionRegimen: [{ value: '', disabled: true }],
      usoEspecifico: [{ value: '', disabled: true }],
      valorSolicitado: [{ value: '', disabled: true }],
      fraccion: [{ value: '', disabled: true }],
      descripcionMercancia: [{ value: '', disabled: true }],
      esquemaReglaOctava: [{ value: '', disabled: true }],
      paises: [{ value: '', disabled: true }],
    });
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['detalleDelPermisoDatos'] && this.detalleDelPermisoDatos) {
      this.detalleDelPermisoForm.patchValue(this.detalleDelPermisoDatos);
    }
  }

  /**
   * Establece los valores del formulario de detalles a partir del JSON importado.
   * Esta información simula una respuesta cargada para propósitos de presentación.
   */
  public establecerFormularioDeDetallesDe(): void {
    this.detalleDelPermisoForm.patchValue(formData);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
