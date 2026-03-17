/**
 * Componente contenedor encargado de gestionar y mostrar la información relacionada
 * con terceros relacionados en el trámite, incluyendo destinatarios finales y proveedores.
 * 
 * @component
 * 
 * @remarks
 * Este componente utiliza servicios de estado para obtener datos en tiempo real y controla
 * la apertura de modales para agregar nuevos destinatarios finales o proveedores.
 * 
 * @example
 * ```html
 * <app-terceros-relacionados-contenedora
 *   [formularioDeshabilitado]="false"
 * ></app-terceros-relacionados-contenedora>
 * ```
 */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { map, Subject, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src/core/queries/consulta.query';
import { ID_PROCEDIMIENTO } from '../../constants/agregar-destinatario.enum';

@Component({
  /**
   * Selector que identifica el componente para su uso en plantillas.
   * 
   * @example
   * <app-terceros-relacionados-contenedora></app-terceros-relacionados-contenedora>
   */
  selector: 'app-terceros-relacionados-contenedora',

  /**
   * Archivo HTML que define la estructura visual del componente.
   */
  templateUrl: './terceros-relacionados-contenedora.component.html',

  /**
   * Archivo SCSS que contiene los estilos del componente.
   */
  styleUrl: './terceros-relacionados-contenedora.component.scss',

  /**
   * Componentes independientes importados para uso en la plantilla.
   */
  standalone: true,
  imports: [TercerosRelacionadosComponent, ModalComponent],
})
export class TercerosRelacionadosContenedoraComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente ModalComponent dentro de la plantilla.
   * Permite controlar la apertura y cierre del modal dinámico.
   * 
   * @example
   * this.modalComponent.abrir(...);
   * this.modalComponent.cerrar();
   * 
   * @see ModalComponent
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Indica si el formulario debe estar deshabilitado (modo solo lectura).
   * Cuando es `true`, los controles no podrán ser editados.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Subject para controlar la limpieza de suscripciones al destruir el componente.
   */
  private destroy$ = new Subject<void>();

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
  * Indica si el formulario debe mostrarse en modo solo lectura.
  *
  * @type {boolean}
  * @memberof TercerosRelacionadosContenedoraComponent
  * @default false
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Datos de la tabla que contienen los destinatarios finales.
   */
  destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
   * Datos de la tabla que contienen los proveedores.
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
  * Modifica los datos del proveedor en el store.
  * 
  * Llama al método `actualizarDatosProveedor` del store con el objeto recibido.
  *
  * @param {Proveedor} datos - Objeto que contiene los datos actualizados del proveedor.
  * @returns {void}
  */
  modificarProveedorDatos(datos: Proveedor): void {
    this.tramiteStore.actualizarDatosProveedor(datos);
    this.openModal('agregar-proveedor');
  }

  /**
* @method eliminarDestinatarioFinal
* @description Elimina el primer DestinoFinal final de la tabla de datos.
* Si no hay DestinoFinal finales seleccionados, no realiza ninguna acción.
*/
  eliminarDestinatarioFinal(datos: DestinoFinal): void {
    if (datos) {
      this.tramiteStore.eliminarDestinatarioFinal(datos);

    }
  }

  /**
  * @method eliminarProveedor
  * @description Elimina el primer Proveedor final de la tabla de datos.
  * Si no hay Proveedor finales seleccionados, no realiza ninguna acción.
  */
  eliminarProveedor(datos: Proveedor): void {
    if (datos) {
      this.tramiteStore.eliminareliminarProveedorFinal(datos);
    }
  }

  /**
   * Constructor que inyecta el servicio para consultar el estado del trámite.
   * 
   * @param tramiteQuery - Query para obtener datos relacionados con terceros.
   */

  /**
 * Modifica los datos del destinatario en el store y navega a la sección de acciones.
 * 
 * Llama al método `actualizarDatosDestinatario` del store con el objeto recibido,
 * y luego ejecuta la función `irAAcciones()` para continuar con el flujo.
 *
 * @param {DestinoFinal} datos - Objeto que contiene los datos actualizados del destinatario.
 * @returns {void}
 */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramiteStore.actualizarDatosDestinatario(datos);
    this.openModal('agregar-destino-final');
  }

  /**
 * Constructor del componente.
 * Inyecta los servicios necesarios para consultar
 * y actualizar el estado del trámite, así como para
 * realizar consultas adicionales.
 */
  constructor(
    private tramiteQuery: Tramite240112Query, private tramiteStore: Tramite240112Store, private consultaQuery: ConsultaioQuery,
  ) { }

  /**
   * Hook de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los observables para obtener datos de destinatarios finales y proveedores.
   */
  ngOnInit(): void {
    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Hook que se ejecuta al destruir el componente.
   * Realiza la limpieza de suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Abre el modal correspondiente según el evento recibido.
   * 
   * - Si el evento es `'agregar-destino-final'`, abre el modal con el componente
   *   `AgregarDestinatarioFinalContenedoraComponent`.
   * - Si el evento es `'agregar-proveedor'`, abre el modal con el componente
   *   `AgregarProveedorContenedoraComponent`.
   * 
   * @param event - Nombre del evento que indica qué modal abrir.
   */
  openModal(event: string): void {
    if (event === 'agregar-destino-final') {
      this.modalComponent.abrir(AgregarDestinatarioFinalContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    } else if (event === 'agregar-proveedor') {
      this.modalComponent.abrir(AgregarProveedorContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
   * Cierra el modal dinámico que esté abierto en el momento.
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }
}
