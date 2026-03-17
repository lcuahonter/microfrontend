import { Component, Input, OnDestroy } from '@angular/core';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosComponent } from '../../../../shared/components/complimentos/complimentos.component';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosComplimentos } from '../../../../shared/models/complimentos.model';
import { SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';

/**
 * Componente Angular para agregar cumplimientos en el trámite 80101.
 * Este componente permite gestionar los cumplimientos y accionistas asociados
 * a un trámite específico, proporcionando funcionalidades para agregar, eliminar
 * y modificar datos relacionados con los cumplimientos.
 *
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `ComplimentosComponent`.
 */
@Component({
  selector: 'app-aggregar-complimentos',
  standalone: true,
  imports: [CommonModule, ComplimentosComponent, NotificacionesComponent],
  templateUrl: './aggregar-complimentos.component.html',
  styleUrl: './aggregar-complimentos.component.scss',
})
export class AggregarComplimentosComponent implements OnDestroy{

  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  @Input() consultaState!: ConsultaioState;

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Propiedad que almacena los datos relacionados con los cumplimientos.
   *
   * @type {DatosComplimentos}
   * @remarks
   * Esta propiedad se utiliza para gestionar y manipular la información
   * asociada a los cumplimientos dentro del componente.
   */
  datosComplimentos!: DatosComplimentos;
  /**
   * Sujeto utilizado como notificador para la destrucción de observables.
   * Este Subject emite un valor cuando el componente se destruye, permitiendo
   * cancelar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Observable que representa los datos de la tabla de complementos.
   *
   * @type {Observable<SociaoAccionistas[]>}
   * @description Este observable contiene una lista de objetos de tipo `SociaoAccionistas`,
   * que se utiliza para mostrar y gestionar los datos relacionados con los complementos
   * en la interfaz de usuario.
   */
  tablaDatosComplimentos$: Observable<SociaoAccionistas[]>;
  /**
   * Observable que representa los datos de la tabla de complementos extranjeros.
   *
   * @type {Observable<SociaoAccionistas[]>}
   * @description Este observable emite una lista de objetos de tipo `SociaoAccionistas`,
   * que contienen información relacionada con los complementos extranjeros.
   * Es utilizado para mostrar y gestionar los datos en la tabla correspondiente
   * dentro del componente.
   */
  tablaDatosComplimentosExtranjera$: Observable<SociaoAccionistas[]>;

    /**
  * @description
  * Objeto que representa una nueva notificación.
  * Se utiliza para mostrar mensajes de alerta o información al usuario.
  */
    public plantasNotificacion!: Notificacion;

  /**
   * Arreglo que almacena los datos de los accionistas nacionales.
   * @type {SociaoAccionistas[]}
   * @description Este arreglo se utiliza para almacenar los datos de los accionistas
   * nacionales que se agregan a la tabla de cumplimentos.
   * @remarks
   * Los datos de los accionistas se gestionan a través del estado del store `Tramite80101Store`. 
   * */
    public sociaoAccionistas: SociaoAccionistas[] = [];

  /**
   * Arreglo que almacena los datos de los accionistas extranjeros.
   *  * @type {SociaoAccionistas[]}
   * @description Este arreglo se utiliza para almacenar los datos de los accionistas
   * extranjeros que se agregan a la tabla de cumplimentos extranjeros.
   * @remarks
   **/
    public sociaoAccionistasExtranjera: SociaoAccionistas[] = [];

  /**
   * Constructor de la clase `AggregarComplimentosComponent`.
   *
   * @param store - Instancia del estado `Tramite80101Store` utilizada para gestionar el estado de la aplicación.
   * @param tramiteQuery - Instancia de `Tramite80101Query` utilizada para realizar consultas relacionadas con los datos del trámite.
   *
   * Este constructor inicializa las propiedades observables `tablaDatosComplimentos$` y `tablaDatosComplimentosExtranjera$`
   * con los valores seleccionados desde `tramiteQuery`. Además, suscribe al observable `selectDatosComplimento$` para
   * actualizar la propiedad `datosComplimentos` con los datos emitidos, hasta que se complete el ciclo de vida del componente.
   */
  constructor(
    private store: Tramite80101Store,
    private tramiteQuery: Tramite80101Query
  ) {
    this.tablaDatosComplimentos$ =
      this.tramiteQuery.selectTablaDatosComplimentos$;
    this.tablaDatosComplimentosExtranjera$ =
      this.tramiteQuery.selectTablaDatosComplimentosExtranjera$;
    this.tramiteQuery.selectDatosComplimento$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.datosComplimentos = datos;
      });
    this.tablaDatosComplimentos$.pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (datosTabla) => {
        this.sociaoAccionistas = datosTabla;
      }
    );
    this.tablaDatosComplimentosExtranjera$.pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (datosTablaExtranjera) => {
        this.sociaoAccionistasExtranjera = datosTablaExtranjera;
      }
    );
  }

  /**
   * Modifica los datos de los cumplimientos y los almacena en el estado.
   *
   * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
   * @returns void
   */
  modifierComplimentos(complimentos: DatosComplimentos): void {
    this.store.setDatosComplimentos(complimentos);
  }

  /**
   * Agrega datos de accionistas a la tabla correspondiente según el tipo de RFC.
   *
   * @param datos - Objeto de tipo `SociaoAccionistas` que contiene la información del accionista.
   *                Si el objeto incluye un RFC válido, se agrega a la tabla de datos nacionales.
   *                De lo contrario, se agrega a la tabla de datos extranjeros.
   */
  accionistasAgregados(datos: SociaoAccionistas): void {
    const SOCIAO_ACCIONISTAS = this.sociaoAccionistas.findIndex(
      (accionista) => accionista.rfc === datos.rfc
    )
    const SOCIAO_ACCIONISTAS_EXTRANJERA = this.sociaoAccionistasExtranjera.findIndex(
      (accionista) => accionista.taxId === datos.taxId
    );
    if (datos.rfc && SOCIAO_ACCIONISTAS === -1) {
      // Si el RFC es válido y no existe en la tabla, se agrega a la tabla de datos nacionales
      this.store.aggregarTablaDatosComplimentos(datos);
    } else if (SOCIAO_ACCIONISTAS_EXTRANJERA === -1) {
      // Si el RFC no es válido y no existe en la tabla de extranjeros, se agrega a la tabla de datos extranjeros
      this.store.aggregarTablaDatosComplimentosExtranjera(datos);
    } else {
      this.abrirPlantasModal();
    }
  }

  /**
   * Elimina los datos de los accionistas proporcionados de la tabla de complementos.
   *
   * @param datos - Una lista de objetos de tipo `SociaoAccionistas` que representan los accionistas a eliminar.
   *
   * Este método utiliza el servicio `store` para realizar la eliminación de los datos
   * correspondientes en la tabla de complementos.
   */
  accionistasEliminados(datos: SociaoAccionistas[]): void {
    this.sociaoAccionistas = this.sociaoAccionistas.filter(
      (accionista) => !datos.some((dato) => dato.rfc === accionista.rfc)
    );
    this.store.eliminarTablaDatosComplimentos(this.sociaoAccionistas);
  }

  /**
   * Elimina los datos de los accionistas extranjeros de la tabla de complementos.
   *
   * @param datos - Una lista de objetos de tipo `SociaoAccionistas` que representan
   * los accionistas extranjeros a eliminar.
   */
  accionistasExtranjerosEliminado(datos: SociaoAccionistas[]): void {
    this.sociaoAccionistasExtranjera = this.sociaoAccionistasExtranjera.filter(
      (accionista) => !datos.some((dato) => dato.taxId === accionista.taxId)
    );
    this.store.eliminarTablaDatosComplimentosExtranjera(this.sociaoAccionistasExtranjera);
  }

      /**
   * Método para manejar la selección de plantas IMMEX.
   * 
   * Este método recibe un evento de tipo `PlantasImmex` y lo agrega al arreglo
   * `plantasImmexSeleccionadoDatos`, asegurando que no se dupliquen entradas.
   * 
   * @param {PlantasImmex} event - Objeto de tipo `PlantasImmex` que representa la planta seleccionada.
   */
  closePlantasModal(): void {
    this.plantasNotificacion.cerrar = false;
  }

    /**
   * Abre un modal relacionado con las plantas Immex y configura una notificación
   * para alertar al usuario en caso de que no se hayan seleccionado datos de las plantas.
   *
   * La notificación configurada tiene las siguientes características:
   * - Tipo de notificación: 'alert'
   * - Categoría: 'danger'
   * - Modo: 'action'
   * - Título: vacío
   * - Mensaje: 'No se seleccionaron datos de las plantas Immex.'
   * - Cierre automático: habilitado
   * - Tiempo de espera: 2000 milisegundos
   * - Texto del botón Aceptar: 'Aceptar'
   * - Texto del botón Cancelar: vacío
   *
   * @returns {void} No retorna ningún valor.
   */
  abrirPlantasModal(): void {
    this.plantasNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El RFC que intenta agregar se encuentra previamente registrado.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   *
   * @returns void
   */
  ngOnDestroy(): void {
    // Emitir un valor para notificar que el componente se está destruyendo
    this.destroyNotifier$.next();
    // Completar el Subject para liberar recursos
    this.destroyNotifier$.complete();
  }
}
