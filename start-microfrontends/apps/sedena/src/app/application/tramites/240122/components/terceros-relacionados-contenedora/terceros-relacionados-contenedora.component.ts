import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240122Query } from '../../estados/tramite240122Query.query';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

/**
 * @component
 * @name TercerosRelacionadosContenedoraComponent
 * @description
 * Componente contenedor para gestionar los datos de terceros relacionados en el trámite 240122.
 * Este componente utiliza el patrón de diseño de Akita para manejar el estado y las consultas
 * relacionadas con los datos de destinatarios finales y proveedores.
 * 
 * @selector app-terceros-relacionados-contenedora
 * @standalone true
 * @imports [CommonModule, TercerosRelacionadosComponent]
 * @templateUrl ./terceros-relacionados-contenedora.component.html
 * @styleUrl ./terceros-relacionados-contenedora.component.scss
 * 
 * @implements OnInit, OnDestroy
 */
@Component({
  selector: 'app-terceros-relacionados-contenedora',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent, ModalComponent],
  templateUrl: './terceros-relacionados-contenedora.component.html',
  styleUrl: './terceros-relacionados-contenedora.component.scss',
})
export class TercerosRelacionadosContenedoraComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
* @description Referencia al componente ModalComponent dentro de la plantilla.
* Utiliza el decorador ViewChild para acceder a la instancia del modal y manipularlo desde el código TypeScript.
* @example
* // Para abrir el modal:
* this.modalComponent.open();
* 
* @see ModalComponent
* 
* @es
* Referencia al componente modal para mostrar u ocultar diálogos modales en la interfaz de usuario.
*/
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;
  /**
   * Identificador del procedimiento asignado al trámite específico.
   * 
   * @property {NUMERO_TRAMITE} idProcedimiento - Representa el identificador único del trámite.
   * @value TRAMITE_240122 - Código correspondiente al trámite específico.
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240122;

  /**
   * Observable para limpiar las suscripciones activas al destruir el componente.
   * 
   * @property {Subject<void>} destroy$
   */
  private destroy$ = new Subject<void>();

  /**
   * Datos de la tabla de destinatarios finales.
   * 
   * @property {DestinoFinal[]} destinatarioFinalTablaDatos
   */
  destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
   * Datos de la tabla de proveedores.
   * 
   * @property {Proveedor[]} proveedorTablaDatos
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * Indica si se deben prellenar los datos del proveedor automáticamente.
   * 
   * @property {boolean} prefillProveedorData
   * @default true
   */
  prefillProveedorData: boolean = true;

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * 
   * @remarks
   * Cuando esta propiedad es `true`, los campos del formulario no serán editables.
   * 
   * @defaultValue false
   * 
   * @es
   * Indica si el formulario está en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240122Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240122Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @param {Router} router - Servicio de Angular Router para la navegación.
   * @param {ActivatedRoute} activatedRoute - Ruta activa para obtener información del contexto actual.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240122Query,
    private tramiteStore: Tramite240122Store,
    private readonly consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables de destinatarios y proveedores para mostrarlos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
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
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * Suscribe al observable `selectConsultaioState$` para escuchar cambios en el estado de la sección y actualizar
   * la propiedad `esFormularioSoloLectura` según el valor de `readonly` en el estado.
   * 
   * La suscripción se mantiene activa hasta que se emite un valor en `destroy$`, lo que previene fugas de memoria.
   * 
   * @see https://angular.io/api/core/AfterViewInit
   */
  ngAfterViewInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

  }

  /**
   * Modifica los datos del destinatario final en el store.
   * 
   * @method modificarDestinarioDatos
   * @param {DestinoFinal} datos - Datos del destinatario final a modificar.
   * @returns {void}
   */
  modificarDestinarioDatos(datos: DestinoFinal): void {
      this.modalComponent.abrir(AgregarDestinatarioFinalContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    this.tramiteStore.actualizarDatosDestinatario(datos);
  }

  /**
   * Modifica los datos del proveedor en el store.
   * 
   * @method modificarProveedorDatos
   * @param {Proveedor} datos - Datos del proveedor a modificar.
   * @returns {void}
   */
  modificarProveedorDatos(datos: Proveedor): void {
       this.modalComponent.abrir(AgregarProveedorContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    this.tramiteStore.actualizarDatosProveedor(datos);
  }

  /**
   * Hook que se ejecuta al destruir el componente.
   * Envía un valor al Subject `destroy$` y lo completa para liberar suscripciones.
   * 
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
      * Abre el modal correspondiente según el nombre del evento recibido.
      *
      * Si el evento es `'Datosmercancia'`, se carga el componente `DatosMercanciaContenedoraComponent`
      * dentro del modal y se le pasa una función de cierre como input.
      *
      * @method openModal
      * @param {string} event - Nombre del evento que indica qué componente se debe mostrar en el modal.
      * @returns {void}
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
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
     this.tramiteStore.actualizarDatosDestinatario({} as DestinoFinal);
    this.modalComponent.cerrar();
     
  }

  eliminarDestinatarioFinal(datos: DestinoFinal): void {
    this.destinatarioFinalTablaDatos = this.destinatarioFinalTablaDatos.filter(d => d.id !== datos.id);
    this.tramiteStore.updateDestinatarioFinalTablaDatos(this.destinatarioFinalTablaDatos);
  }
   eliminarProveedorContenedoraFinal(datos: Proveedor): void {
    this.proveedorTablaDatos = this.proveedorTablaDatos.filter(d => d.id !== datos.id);
    this.tramiteStore.updateProveedorTablaDatos(this.proveedorTablaDatos);
  }
}
