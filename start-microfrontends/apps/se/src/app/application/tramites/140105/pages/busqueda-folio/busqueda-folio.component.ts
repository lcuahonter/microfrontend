import { Component, OnDestroy } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
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
export class BusquedaFolioComponent implements OnDestroy {

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

  /**
   * Constructor del componente.
   * Inicializa los formularios y suscriptores que observan cambios en el estado global.
   *
   * @param servicioDeMensajesService Servicio que maneja el envío de mensajes entre componentes.
   * @param fb Instancia de FormBuilder para construir formularios reactivos.
   * @param consultaQuery Query de estado para obtener información de readonly u otros flags globales.
   */
  constructor(
    private servicioDeMensajesService: ServicioDeMensajesService,
    private fb: FormBuilder,
    private consultaQuery: ConsultaioQuery,
  ) {
    // Initialize busquedaForm
    this.busquedaForm = this.fb.group({
      tramite: ['']
    });
   
    this.estableDetalleDelPermisoForm();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.servicioDeMensajesService.obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        if (data?.datos && Array.isArray(data.datos) && data.datos.length > 0) {
          this.detalleDelPermiso = true;
          this.detalleDelPermisoForm.patchValue(data.datos[0]);
        }
      });
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
   * Ahora utiliza los datos del store en lugar de datos hardcodeados.
   */
  public buscar(): void {
    this.detalleDelPermiso = true;
  }

  /**
   * Envía una señal de que se han agregado los datos del permiso consultado.
   *
   * @param _event Evento de tipo `Event` (no utilizado directamente).
   */
  public agregar(_event: Event): void {
    this.servicioDeMensajesService.enviarMensaje(false);
    this.servicioDeMensajesService.establecerDatosDePermiso(true);
    this.cerrarClicado.emit();
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
      folioTramite: [{ value: '', disabled: true }],
      tipoDeSolicitud: [{ value: '', disabled: true }],
      regimen: [{ value: '', disabled: true }],
      condicionDeLaMercancia: [{ value: '', disabled: true }],
      umt: [{ value: '', disabled: true }],
      cantidad: [{ value: '', disabled: true }],
      cdr: [{ value: '', disabled: true }],
      usd: [{ value: '', disabled: true }],
      fraccionArancelaria: [{ value: '', disabled: true }],
      descripcionDeLaMercancia: [{ value: '', disabled: true }],
      procedencia: [{ value: '', disabled: true }],
      mercancia: [{ value: '', disabled: true }],
      beneficioQueSeObtiene: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
    });
  }

  /**
   * Establece el formulario de detalles con datos del API en lugar de datos hardcodeados.
   * Esta información viene de la respuesta del API de búsqueda.
   */
  public establecerFormularioDeDetallesDe(data?: Record<string, unknown>): void {
    if (data) {
      this.detalleDelPermisoForm.patchValue(data);
    }
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
