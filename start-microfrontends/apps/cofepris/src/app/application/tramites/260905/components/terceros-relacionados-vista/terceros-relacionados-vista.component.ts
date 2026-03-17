import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ELEMENTOS_REQUERIDOS } from '../../constantes/enmienda-permiso-sanitario.enum';
import { TercerosRelacionadosModificacionComponent} from '../../../../shared/components/shared2609/terceros-relacionados-modificacion/terceros-relacionados.component';
import { Tramite260905Query } from '../../estados/tramite260905Query.query';
import { Tramite260905Store } from '../../estados/tramite260905Store.store';

/**
 * @component TercerosRelacionadosVistaComponent
 * @description Componente de solo lectura que muestra las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores).
 * Consume observables del store para renderizar los datos en la vista mediante el componente
 * `TercerosRelacionadosComponent`.
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosModificacionComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Tipo de trámite actual, recibido del padre.
   */
  @Input() tipoTramite: string = '';
  /**
/**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * Estados de habilitación de las tablas.
   */
  tablasDeshabilitadas: boolean = true;

  /**
   * Estado de los botones de acción (ejemplo: para prórroga)
   */
  botonDesactivarParaProrrogar: boolean = false;

  mostrarBotonesAccion: boolean = false;
  
  /**
   * @property {string[]} elementosRequeridos
   * @description
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
  public readonly elementosRequeridos = ['fabricante'];
     
  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * @description Almacena los datos de la tabla de fabricantes que se mostrarán en la vista.
   * Esta propiedad se actualiza automáticamente cuando el observable del store emite nuevos datos.
   * Se inicializa como un arreglo vacío y se llena mediante la suscripción al observable
   * `getFabricanteTablaDatos$` del servicio de consulta.
   * 
   * @public
   * @default []
   * @readonly Solo se modifica a través de observables del store
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * @description Contiene los datos de la tabla de destinatarios finales para mostrar en la interfaz.
   * Esta colección se mantiene sincronizada con el estado global del store a través de observables.
   * Los destinatarios finales representan las entidades que recibirán finalmente los productos
   * o servicios relacionados con el trámite.
   * 
   * @public
   * @default []
   * @readonly Solo se modifica a través de observables del store
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * @description Arreglo que contiene la información de los proveedores asociados al trámite.
   * Se sincroniza automáticamente con el estado del store mediante observables reactivos.
   * Los proveedores son las entidades que suministran productos o servicios para el trámite.
   * 
   * @public
   * @default []
   * @readonly Solo se modifica a través de observables del store
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * @property {Facturador[]} facturadorTablaDatos
   * @description Almacena los datos de los facturadores relacionados con el trámite.
   * Se actualiza reactivamente cuando hay cambios en el store correspondiente.
   * Los facturadores son las entidades responsables de emitir las facturas
   * relacionadas con el trámite.
   * 
   * @public
   * @default []
   * @readonly Solo se modifica a través de observables del store
   */
  facturadorTablaDatos: Facturador[] = [];

  /**
   * @property {Subject<void>} destroy$
   * @description Subject utilizado para gestionar la limpieza de suscripciones y prevenir
   * fugas de memoria cuando el componente se destruye. Se utiliza con el operador `takeUntil`
   * para cancelar automáticamente todas las suscripciones activas cuando el componente
   * se desmonta del DOM.
   * 
   * @private
   * @readonly
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * observable$.pipe(takeUntil(this.destroy$)).subscribe();
   * ```
   */
  private destroy$ = new Subject<void>();

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Bandera que indica si el componente está en modo de solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar y solo se muestran
   * para consulta. Esta propiedad se actualiza automáticamente basándose en el estado
   * de consulta obtenido del `ConsultaioQuery`.
   * 
   * @public
   * @default false
   * @since 1.0.0
   * 
   * @example
   * ```html
   * <input [readonly]="esFormularioSoloLectura" />
   * ```
   */
   esFormularioSoloLectura: boolean = false; 

/**
   * @property {TercerosRelacionadosComponent} TercerosRelacionadosComponent
   * @description Referencia al componente hijo `TercerosRelacionadosComponent`
   * que se utiliza para mostrar las tablas de terceros relacionados.
   */
  @ViewChild('TercerosRelacionadosComponent')
  TercerosRelacionadosComponent!: TercerosRelacionadosModificacionComponent;
     


     /**
   * @property {boolean} estaOculto
   * @description
   * Variable booleana que controla si el componente debe estar oculto o no.
   */
  estaOculto: boolean = true;
    /**
     * @property {string} idProcedimiento
     * @description Identificador del procedimiento, utilizado para la gestión del trámite.
     */
     public readonly idProcedimiento = 260905;
  
  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias
   * para el funcionamiento del componente. Inyecta los servicios requeridos para
   * consultar y actualizar el estado del trámite, así como para obtener el estado
   * de solo lectura del formulario.
   * 
   * Durante la construcción, se establece una suscripción al estado de consulta
   * para determinar si el formulario debe estar en modo de solo lectura.
   * 
   * @param {Tramite260905Store} tramiteStore - Store que gestiona el estado global
   * de los datos del trámite 260214. Proporciona métodos para actualizar las tablas
   * de fabricantes, destinatarios, proveedores y facturadores.
   * 
   * @param {Tramite260905Query} tramiteQuery - Servicio de consulta que expone
   * observables para leer los datos del store de manera reactiva. Permite suscribirse
   * a cambios en las tablas de terceros relacionados.
   * 
   * @param {ConsultaioQuery} consultaQuery - Servicio de consulta que proporciona
   * información sobre el estado de la consulta, incluyendo si el formulario debe
   * estar en modo de solo lectura.
   * 
   */
  constructor(
    private tramiteStore: Tramite260905Store,
    private tramiteQuery: Tramite260905Query, 
    private consultaQuery: ConsultaioQuery
  ) {
    // Suscripción para actualizar el estado de solo lectura del formulario
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroy$))
        .subscribe((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.estaOculto = false;
    if ((this.tipoTramite === '1' || this.tipoTramite === '2')) {
      this.tablasDeshabilitadas = false;
      this.botonDesactivarParaProrrogar = true;
      this.mostrarBotonesAccion = true;
    } else {
      this.tablasDeshabilitadas = true;
      this.botonDesactivarParaProrrogar = false;
      this.mostrarBotonesAccion = false;
    }
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta una vez después
   * de que Angular haya inicializado todas las propiedades vinculadas a datos del componente.
   * 
   */
  ngOnInit(): void {
    // Suscripción a los datos de fabricantes
    this.tramiteQuery.getFabricanteTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.fabricanteTablaDatos = data;
      });

    // Suscripción a los datos de destinatarios finales
    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    // Suscripción a los datos de proveedores
    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });

    // Suscripción a los datos de facturadores
    this.tramiteQuery.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.facturadorTablaDatos = data;
      });
  }

  /**
   * @method addFabricantes
   * @description Método público que permite agregar nuevos fabricantes a la tabla
   * de datos del trámite. Actúa como una interfaz para actualizar el estado global
   * del store con nuevos registros de fabricantes.
   * 
   * Este método delega la actualización al store correspondiente, el cual se encarga
   * de notificar a todos los componentes suscritos sobre los cambios realizados.
   * Los fabricantes son entidades que producen o manufacturan los productos
   * relacionados con el trámite.
   * 
   * @public
   * @param {Fabricante[]} newFabricantes - Arreglo de objetos tipo `Fabricante`
   * que contienen la información de los nuevos fabricantes a agregar. Cada objeto
   * debe cumplir con la estructura definida en el modelo `Fabricante`.
   * 
   * @returns {void} Este método no retorna ningún valor.
   * 
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * @method addDestinatarios
   * @description Método público que facilita la adición de nuevos destinatarios finales
   * a la tabla de datos correspondiente. Utiliza el store para actualizar el estado
   * global y mantener la consistencia de datos en toda la aplicación.
   * 
   * Los destinatarios finales representan las entidades que recibirán finalmente
   * los productos o servicios objeto del trámite. Este método garantiza que los
   * nuevos destinatarios se integren correctamente al flujo de datos reactivo.
   * 
   * @public
   * @param {Destinatario[]} newDestinatarios - Colección de objetos tipo `Destinatario`
   * que contienen la información detallada de los nuevos destinatarios finales.
   * Cada objeto debe adherirse a la estructura del modelo `Destinatario`.
   * 
   * @returns {void} No produce ningún valor de retorno.
   * 
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * @method addProveedores
   * @description Método público responsable de incorporar nuevos proveedores
   * a la tabla de datos del trámite. Coordina la actualización del estado
   * a través del store para asegurar la propagación correcta de los cambios
   * a todos los componentes interesados.
   * 
   * Los proveedores son entidades comerciales que suministran productos,
   * materias primas o servicios necesarios para el cumplimiento del trámite.
   * La información de estos proveedores es crucial para el seguimiento
   * y la trazabilidad del proceso.
   * 
   * @public
   * @param {Proveedor[]} newProveedores - Array de objetos tipo `Proveedor`
   * que encapsulan los datos de los nuevos proveedores a registrar. Cada
   * elemento debe cumplir con la especificación del modelo `Proveedor`.
   * 
   * @returns {void} Este método no genera ningún valor de retorno.
   * 
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }


  /**
   * @method addFacturadores
   * @description Método público que permite incorporar nuevos facturadores
   * al conjunto de datos del trámite. Gestiona la actualización del estado
   * global mediante el store, asegurando que todos los componentes suscritos
   * reciban las notificaciones correspondientes sobre los cambios.
   * 
   * Los facturadores son entidades autorizadas para emitir comprobantes
   * fiscales relacionados con las transacciones del trámite. Su registro
   * es fundamental para el cumplimiento de las obligaciones fiscales
   * y la documentación adecuada del proceso.
   * 
   * @public
   * @param {Facturador[]} newFacturadores - Conjunto de objetos tipo `Facturador`
   * que contienen la información completa de los nuevos facturadores a registrar.
   * Cada objeto debe seguir la estructura definida en el modelo `Facturador`.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }
  
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
    /**
   * @description
   * Método que se encarga de validar el formulario contenido en
   * el componente `TercerosRelacionadosComponent`.
   *
   * Utiliza el método `formularioSolicitudValidacion()` del componente hijo
   * para comprobar si el formulario es válido.
   * En caso de que el hijo no esté inicializado o devuelva `null/undefined`,
   * se retorna `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el formulario es válido.
   * - `false`: si el formulario no es válido o el componente hijo aún no está disponible.
   */
  validarContenedor(): boolean {
    return (
      this.TercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
}
