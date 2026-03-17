import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Expedicion120204State, Expedicion120204Store } from '../../estados/tramites/expedicion120204.store';
import { CapturarExpedicionCertificadosComponent } from '../../components/capturar-expedicion-certificados/capturar-expedicion-certificados.component';
import { ExpedicionCertificadoService } from '../../services/expedicion-certificado.service';
// Importación del componente Solicitante desde la librería compartida
/**
 * Componente DatosComponent.
 * 
 * Este componente se encarga de gestionar la lógica relacionada con los datos
 * en la página correspondiente. Incluye funcionalidades para interactuar con
 * componentes hijos y manejar la selección de pestañas.
 */
@Component({
  selector: 'app-datos', // Selector del componente
  templateUrl: './datos.component.html' // Ruta del archivo HTML asociado al componente
})
export class DatosComponent implements OnInit, OnDestroy{
  /**
   * Índice del subtítulo actual.
   * 
   * Esta variable se utiliza para almacenar el índice de la pestaña seleccionada.
   * Por defecto, se inicializa con el valor 1.
   */
  public indice: number = 1;
  
  /**
   * Estado actual de la consulta para el componente.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!:ConsultaioState;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * 
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones a observables y evitar fugas de memoria.
   * 
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente de capturar expedición de certificados.
   */
  @ViewChild('capturarExpedicionComponent') capturarExpedicionComponent!: CapturarExpedicionCertificadosComponent;

  
   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

/**
 * Constructor de la clase DatosComponent.
 * 
 * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
 * @param consultaStore Almacén para gestionar el estado de las consultas de trámite.
 * @param productoresService Servicio para la expansión y gestión de productores.
 * @param tramiteStore Almacén específico para el manejo del estado del trámite 120204.
 * 
 * Al inicializar el componente, se establece la consulta inicial en el store de consultas
 * con los parámetros correspondientes al trámite 120204.
 */
constructor(private consultaQuery: ConsultaioQuery,private expedicionService: ExpedicionCertificadoService, private tramite120204Store: Expedicion120204Store) {
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
   * - Dependiendo del valor de `consultaState.update`, decide si guardar los datos del formulario o mostrar los datos de respuesta.
   * 
   * @returns {void}
   */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;

      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormularios(this.consultaState.id_solicitud);
      this.tramite120204Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga y procesa los datos de una solicitud específica desde el servidor.
   * 
   * Este método obtiene la información de una solicitud mediante el servicio de expedición,
   * procesa los datos recibidos transformándolos al formato requerido por el store,
   * actualiza el estado del formulario con la información obtenida y marca que los
   * datos de respuesta están disponibles para su visualización.
   * 
   * @param id_solicitud - Identificador único de la solicitud cuyos datos se desean cargar.
   * @returns {void} No retorna ningún valor.
   */
  guardarDatosFormularios(id_solicitud: string): void {
    this.expedicionService.getMostrarSolicitud(id_solicitud)
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((resp) => {
              if (resp) {
                if (resp?.datos) {
                  const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
                  if (DATOS) {
                    const MAPPED_DATA = this.expedicionService.reverseBuildSolicitud110201(DATOS as Record<string, unknown>) as unknown as Expedicion120204State;
                    this.expedicionService.actualizarEstadoFormulario(MAPPED_DATA);
                  }
                this.esDatosRespuesta = true;
              }
            }
            });
  }

  /**
   * Método para seleccionar una pestaña específica.
   * 
   * Este método actualiza el índice de la pestaña seleccionada, permitiendo
   * cambiar entre diferentes vistas o secciones de la interfaz.
   * 
   * @param i - Índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene la referencia al componente de capturar expedición de certificados.
   * 
   * Este método proporciona acceso a la instancia del componente hijo que maneja
   * la captura y expedición de certificados, permitiendo interactuar con sus
   * métodos y propiedades desde el componente padre.
   * 
   * @returns {CapturarExpedicionCertificadosComponent | undefined} 
   *          La instancia del componente CapturarExpedicionCertificadosComponent 
   *          si está disponible, o undefined si no ha sido inicializado.
   */
  obtenerComponenteExpedicion(): CapturarExpedicionCertificadosComponent | undefined {
    return this.capturarExpedicionComponent;
  }

  /**
   * Valida todos los formularios presentes en el componente.
   * 
   * Este método ejecuta la validación de todos los formularios del componente,
   * específicamente verifica la validez del componente de captura de expedición
   * de certificados. Es utilizado antes de proceder con operaciones que requieren
   * datos válidos, como el guardado o envío de información.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos y el componente
   *                   está disponible, `false` si hay errores de validación o el
   *                   componente no está inicializado.
   */
  public validarFormularios(): boolean {
    let esValido = true;
    if(this.capturarExpedicionComponent){
      if(!this.capturarExpedicionComponent.validarFormulario()){
        esValido = false;
      }
    } else{
      esValido = false;
    }
    return esValido;

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
