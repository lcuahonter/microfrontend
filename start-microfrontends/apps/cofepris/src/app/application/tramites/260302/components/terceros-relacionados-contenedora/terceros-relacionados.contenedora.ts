import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren, OnChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  AlertComponent,
  ConfiguracionColumna,
  Fabricante,
  LASTABLA,
  Notificacion, 
  NotificacionesComponent,
  Otros260303,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';

import { FABRICANTE_TABLA, OTROS_TABLA } from '../../../constantes/shared2603/certificados-licencias-permisos.enum';
import { CertificadosLicenciasPermisosService } from '../../../services/shared2603/certificados-licencias-permisos.service';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FabricanteModalComponent } from '../fabricante-modal/fabricante-modal.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ID_PROCEDIMIENTO, PERMISO_DEFINITIVO_TITULO, SECCION_PERMISOS } from '../../../constantes/shared2603/medicos-sin-registrar.enum';
import { Tramite2603Query } from '../../../estados/queries/2603/tramite2603.query';
import { Tramite2603Store } from '../../../estados/stores/2603/tramite2603.store';
/**
 * Tipo permitido para los valores en las tablas dinámicas de terceros relacionados.
 * @typedef {string | number | boolean | undefined} AllowedValue
 */
type AllowedValue = string | number | boolean | undefined;

/**
 * Componente responsable de gestionar la sección de terceros relacionados en el formulario.
 * Permite agregar, modificar y eliminar registros de fabricantes, facturadores, proveedores, certificados analíticos y otros.
 * Incluye gestión de tablas dinámicas, modales y sincronización con el estado global de la consulta.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [CommonModule, TituloComponent, AlertComponent, TablaDinamicaComponent, ReactiveFormsModule, NotificacionesComponent],
  providers:[BsModalService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosRelacionadosComponent implements OnDestroy, OnChanges {
  /**
   * Realizar un seguimiento de qué acción de eliminación está pendiente de confirmación
   */
  private pendingDeleteType: 'fabricante' | 'facturador' | 'proveedor' | 'certificadoAnalitico' | 'otros' | null = null;
 /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Indica si el modal está en modo modificación.
  */
  esModificacion: boolean = false;

  /**
   * Nueva notificación para mostrar mensajes modales.
   * 
   * @public
   * @property {Notificacion} nuevaNotificacion
   */
    public nuevaNotificacion!: Notificacion;
  /**
   * Indica si el título del programa debe mostrarse en la vista.
   * @type {boolean}
   */
  @Input() public programTitle: boolean = false;
  /** Evento emitido cuando la tabla es válida. */
  @Output() tableValidEvent = new EventEmitter<string>();
  /**
   * Referencias a todos los componentes de tabla dinámica para poder limpiar sus selecciones.
   * @type {QueryList<TablaDinamicaComponent<unknown>>}
   */
  @ViewChildren(TablaDinamicaComponent) tablaComponents!: QueryList<TablaDinamicaComponent<unknown>>;

  /**
   * Formulario reactivo para la sección de terceros relacionados.
   * @type {FormGroup}
   */
  public tercerosRelacionadosTabla!: FormGroup;


  /**
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   * @type {ConsultaioState}
   */
  @Input() consultaState!: ConsultaioState;

  /**
   * Indica si el formulario debe estar deshabilitado (solo lectura).
   * @type {boolean}
   */
  @Input() formularioDeshabilitado: boolean = false;

/**
 * @property
 * @name permisoDefinitivoTitulo
 * @type {number[]}
 * @description Lista de identificadores de títulos de permisos definitivos asociados al trámite actual.
 */
  @Input() permisoDefinitivoTitulo: number[] = PERMISO_DEFINITIVO_TITULO;

/**
 * @property
 * @name permisoSeccion
 * @type {number}
 * @description Identificador de la sección de permisos en el sistema. Utilizado para asociar el componente con la sección correspondiente.
 */
  @Input() permisoSeccion: number[] = SECCION_PERMISOS;
    /** Indica si el campo de fabricante es inválido. */
    public isfabricanteInvalida: boolean = false;

    /** Indica si el campo de Proveedor es inválido. */
    public isotrosvalid: boolean = false;

   

    /**
   * @property
   * @name idProcedimiento
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  @Input() idProcedimiento!: number;

  @Input() procedureID! : number;

  /**
   * Referencia al modal de Bootstrap para gestionar cuadros de diálogo.
   * @type {BsModalRef | undefined}
   */
  bsModalRef?: BsModalRef;

  /**
   * Textos y configuraciones para la sección de terceros relacionados.
   * @type {any}
   */
  public TEXTOS = LASTABLA;

  /**
   * Datos de la tabla de fabricantes.
   * @type {Fabricante[]}
   */
  public fabricanteTablaDatos: Fabricante[] = [];

  /**
   * Datos de la tabla de facturadores.
   * @type {Fabricante[]}
   */
  public facturadorTablaDatos: Fabricante[] = [];

  /**
   * Datos de la tabla de proveedores.
   * @type {Fabricante[]}
   */
  public proveedorTablaDatos: Fabricante[] = [];

  /**
   * Datos de la tabla de certificados analíticos.
   * @type {Fabricante[]}
   */
  public certificadoAnaliticoTablaDatos: Fabricante[] = [];

  /**
   * Datos de la tabla de otros terceros relacionados.
   * @type {Otros260303[]}
   */
  public otrosTablaDatos: Otros260303[] = [];

  /**
   * Tipo de selección de casilla de verificación utilizado en las tablas.
   * @type {TablaSeleccion}
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  
  /**
   * Configuración de columnas para la tabla de fabricantes.
   * @type {any}
   */
  public configuracionFabricante = FABRICANTE_TABLA;

  /**
   * Configuración de columnas para la tabla de otros terceros.
   * @type {any}
   */
  public configuracionOtros = OTROS_TABLA;

  /**
   * Configuración de columnas para la tabla principal de fabricantes.
   * @type {ConfiguracionColumna<Fabricante>[]}
   */
  public configuracionTabla: ConfiguracionColumna<Fabricante>[] = TercerosRelacionadosComponent.generateConfiguracionTabla(this.configuracionFabricante);

  /**
   * Configuración de columnas para la tabla de facturadores.
   * @type {ConfiguracionColumna<Fabricante>[]}
   */
  public configuracionFacturadorTabla: ConfiguracionColumna<Fabricante>[] = TercerosRelacionadosComponent.generateConfiguracionTabla(this.configuracionFabricante);

  /**
   * Configuración de columnas para la tabla de proveedores.
   * @type {ConfiguracionColumna<Fabricante>[]}
   */
  public configuracionProveedorTabla: ConfiguracionColumna<Fabricante>[] = TercerosRelacionadosComponent.generateConfiguracionTabla(this.configuracionFabricante);

  /**
   * Configuración de columnas para la tabla de certificados analíticos.
   * @type {ConfiguracionColumna<Fabricante>[]}
   */
  public configuracionCertificadoAnaliticoTabla: ConfiguracionColumna<Fabricante>[] = TercerosRelacionadosComponent.generateConfiguracionTabla(this.configuracionFabricante);

  /**
   * Configuración de columnas para la tabla de otros terceros.
   * @type {ConfiguracionColumna<Otros260303>[]}
   */
  public configuracionOtrosTabla: ConfiguracionColumna<Otros260303>[] = TercerosRelacionadosComponent.generateConfiguracionTabla(this.configuracionOtros);

  /**
   * Notificador para destruir observables activos y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
    
  /**
   * Constructor del componente TercerosRelacionadosComponent.
   *
   * Inicializa el formulario reactivo para la sección de terceros relacionados.
   * Los valores de los inputs `consultaState`, `formularioDeshabilitado` y `idProcedimiento` pueden ser utilizados para controlar el estado y comportamiento del formulario.
   *
   * @param certificadosLicenciasSvc Servicio para manejar operaciones relacionadas con certificados, licencias y permisos.
   * @param modalService Servicio para gestionar cuadros de diálogo modales.
   * @param fb FormBuilder para crear y gestionar formularios reactivos.
   *
   * El formulario se inicializa vacío y se puede configurar dinámicamente según los datos recibidos.
   */
  constructor(
    private certificadosLicenciasSvc: CertificadosLicenciasPermisosService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
      private tramite2603Store: Tramite2603Store,
    private tramiteQuery: Tramite2603Query
    ) {
      this.tercerosRelacionadosTabla = this.fb.group({});
  }

  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitud) => {
      this.fabricanteTablaDatos= [...solicitud.fabricantetabla];
      this.otrosTablaDatos= [...solicitud.otrosTabla];
      this.proveedorTablaDatos= [...solicitud.proveedorTablaDatos];
      this.certificadoAnaliticoTablaDatos= [...solicitud.certificadoAnaliticoTablaDatos];
      this.facturadorTablaDatos= [...solicitud.facturadorTablaDatos];

    });


     

    
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * Este método inicializa el componente obteniendo datos para varias tablas, incluyendo:
   * - Fabricante
   * - Facturador
   * - Proveedor
   * - Certificado Analítico
   * - Otros
   *
   * Se invoca cada método correspondiente para recuperar y poblar los datos de las respectivas tablas.
   */

  /**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.markTouched();
      });
    }
  }
  /**
   * Crea una copia profunda del objeto proporcionado.
   * 
   * Este método serializa el objeto a una cadena JSON y luego lo analiza de nuevo a un nuevo objeto,
   * creando efectivamente una copia profunda. Tenga en cuenta que este enfoque puede no manejar funciones,
   * valores indefinidos o referencias circulares correctamente.
   * 
   * @param obj - El objeto que se va a copiar profundamente. Por defecto es un objeto vacío.
   * @returns Una copia profunda del objeto proporcionado.
   */
  public static deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Recupera los datos para la tabla de fabricantes realizando una llamada al servicio.
   * Se suscribe a la respuesta del método `getFabricanteDatos` del servicio,
   * crea una copia profunda de la respuesta y la asigna a la propiedad `fabricanteTablaDatos`.
   *
   * @returns {void}
   */
  public getFabricanteTablaDatos(): void {
    this.certificadosLicenciasSvc.getFabricanteDatos().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      const DATA = TercerosRelacionadosComponent.deepCopy<Fabricante[]>(response);
      this.fabricanteTablaDatos = DATA;
    });
  }

  /**
   * Recupera los datos para la tabla "Facturador" realizando una llamada al servicio para obtener los datos.
   * La respuesta se copia profundamente para garantizar la inmutabilidad y luego se asigna a la propiedad `facturadorTablaDatos`.
   *
   * @remarks
   * Este método se suscribe al observable devuelto por el método `getFacturadorDatos`
   * del servicio `certificadosLicenciasSvc`. La respuesta se procesa para evitar la mutación
   * directa de los datos originales.
   */
  public getFacturadorTablaDatos(): void {
    this.certificadosLicenciasSvc.getFacturadorDatos().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      const DATA = TercerosRelacionadosComponent.deepCopy<Fabricante[]>(response);
      this.facturadorTablaDatos = DATA;
    });
  }

  formularioSolicitudValidacion():boolean{
    if(this.fabricanteTablaDatos.length>0 && this.facturadorTablaDatos.length>0){
    return true;
    }
    else{
      return false;

    }

  }

  /**
   * Recupera los datos de proveedores desde el servicio y los asigna a la propiedad `proveedorTablaDatos`.
   * 
   * Este método llama al método `getProveedorDatos` del servicio `certificadosLicenciasSvc`,
   * se suscribe al observable y realiza una copia profunda de la respuesta antes de asignarla
   * a la propiedad `proveedorTablaDatos`.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  public getProveedorTablaDatos(): void {
    this.certificadosLicenciasSvc.getProveedorDatos().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      const DATA = TercerosRelacionadosComponent.deepCopy<Fabricante[]>(response);
      this.proveedorTablaDatos = DATA;
    });
  }

  /**
   * Recupera los datos del certificado analítico y los asigna a la propiedad `certificadoAnaliticoTablaDatos`.
   * 
   * Este método llama al método `getCertificadoDatos` del servicio para obtener los datos,
   * crea una copia profunda de la respuesta y la almacena en la propiedad `certificadoAnaliticoTablaDatos`.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  public getCertificadoAnaliticoTablaDatos(): void {
    this.certificadosLicenciasSvc.getCertificadoDatos().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      const DATA = TercerosRelacionadosComponent.deepCopy<Fabricante[]>(response);
      this.certificadoAnaliticoTablaDatos = DATA;
    });
  }

  /**
   * Recupera datos adicionales del servicio `certificadosLicenciasSvc` y actualiza la propiedad `otrosTablaDatos`.
   * 
   * Este método se suscribe al observable `getOtrosDatos` del servicio, realiza una copia profunda de la respuesta
   * y asigna los datos copiados a la propiedad `otrosTablaDatos`.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  public getOtrosTablaDatos(): void {
    this.certificadosLicenciasSvc.getOtrosDatos().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      const DATA = TercerosRelacionadosComponent.deepCopy<Otros260303[]>(response);
      this.otrosTablaDatos = DATA;
    });
  }


/**
 * Genera la configuración de columnas para una tabla dinámica.
 * 
 * @template T - El tipo de los datos que se mostrarán en la tabla.
 * @param datosArray - Un arreglo de objetos que contiene el encabezado y la clave de cada columna.
 * @returns Un arreglo de configuraciones de columna para la tabla.
 */
private static generateConfiguracionTabla<T>(
  datosArray: Array<{ encabezado: string; clave: keyof T }>
): ConfiguracionColumna<T>[] {
  return datosArray.map((field, index) => ({
    // Título de la columna que se mostrará en la tabla
    encabezado: field.encabezado,
    // Función que extrae el valor de la clave correspondiente del objeto de datos
    clave: (item: T): AllowedValue => item[field.clave] as AllowedValue,
    // Orden de la columna en la tabla
    orden: index + 1,
  }));
}

  /**
   * Abre un cuadro de diálogo modal para modificar un registro existente.
   *
   * @param titulo - El título que se mostrará en el cuadro de diálogo modal.
   * @param datosExistentes - Los datos existentes para prellenar el formulario.
   * @param tipoTabla - El tipo de tabla para determinar dónde actualizar los datos.
   */
  public abrirModalParaModificar(titulo: string, datosExistentes: Fabricante | Otros260303, tipoTabla: string): void {
    const INITIAL_STATE: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        titulo: titulo,
        datosExistentes: datosExistentes,
        esModificacion: true,
        permisoDefinitivoTitulo: this.permisoDefinitivoTitulo,
        permisoSeccion: this.permisoSeccion
      }
    };
    this.bsModalRef = this.modalService.show(FabricanteModalComponent, INITIAL_STATE);
    this.bsModalRef.content.tableValidEvent.subscribe((value: string) => {
  this.tableValidEvent.emit(value);
});

    this.bsModalRef.content.guardarFabricante.subscribe((datosModificados: Record<string, unknown>) => {
      // Forzar limpieza inmediata y con delay para asegurar actualización de UI
      this.forzarLimpiezaSelecciones();
      
      if (tipoTabla === 'otros') {
        const DATO_ACTUALIZADO = TercerosRelacionadosComponent.mapearDatosOtros(datosModificados);
        this.actualizarTablaConDatosModificados(tipoTabla, datosExistentes, DATO_ACTUALIZADO);
      } else {
        const DATO_ACTUALIZADO = TercerosRelacionadosComponent.mapearDatosFabricante(datosModificados);
        this.actualizarTablaConDatosModificados(tipoTabla, datosExistentes, DATO_ACTUALIZADO);
      }
    });
  }

  /**
   * Mapea los datos del formulario al formato esperado por las tablas Fabricante.
   */
  private static mapearDatosFabricante(nuevoDato: Record<string, unknown>): Fabricante {
    return {
      nombre: (nuevoDato as never)['razonSocial'] || (nuevoDato as never)['denominacionSocial'],
      rfc: (nuevoDato as never)['rfc'],
      curp: (nuevoDato as never)['curp'],
      telefono: (nuevoDato as never)['telefono'],
      correoElectronico: (nuevoDato as never)['correoElectronico'],
      calle: (nuevoDato as never)['calle'],
      numeroExterior: (nuevoDato as never)['numeroExterior'],
      numeroInterior: (nuevoDato as never)['numeroInterior'],
      pais: (nuevoDato as never)['pais'],
      colonia: (nuevoDato as never)['colonia'],
      municipio: (nuevoDato as never)['municipio'],
      localidad: (nuevoDato as never)['localidad'],
      entidadFederativa: 'valor ficticio',
      estado: (nuevoDato as never)['estado'],
      cp: (nuevoDato as never)['codigoPostal'],
      denominacionSocial: (nuevoDato as never)['denominacionSocial'],
      datosPersonalesNombre: (nuevoDato as never)['datosPersonalesNombre'],
      datosPersonalesPrimerApellido: (nuevoDato as never)['datosPersonalesPrimerApellido'],
      datosPersonalesSegundoApellido: (nuevoDato as never)['datosPersonalesSegundoApellido'],
      tipoPersona: (nuevoDato as never)['tipoPersona'],
      tercerosNacionalidad: (nuevoDato as never)['tercerosNacionalidad']
    };
  }

  /**
   * Mapea los datos del formulario al formato esperado por las tablas Otros.
   */
  private static mapearDatosOtros(nuevoDato: Record<string, unknown>): Otros260303 {
    return {
      tercero: (nuevoDato as never)['terceroNombre'],
      nombre: (nuevoDato as never)['razonSocial'] || (nuevoDato as never)['denominacionSocial'],
      rfc: (nuevoDato as never)['rfc'],
      curp: (nuevoDato as never)['curp'],
      telefono: (nuevoDato as never)['telefono'],
      correoElectronico: (nuevoDato as never)['correoElectronico'],
      calle: (nuevoDato as never)['calle'],
      numeroExterior: (nuevoDato as never)['numeroExterior'],
      numeroInterior: (nuevoDato as never)['numeroInterior'],
      pais: (nuevoDato as never)['pais'],
      colonia: (nuevoDato as never)['colonia'],
      municipio: (nuevoDato as never)['municipio'],
      localidad: (nuevoDato as never)['localidad'],
      entidadFederativa: 'valor ficticio',
      estado: (nuevoDato as never)['estado'],
      cp: (nuevoDato as never)['codigoPostal']
    };
  }

  /**
   * Actualiza la tabla correspondiente con los datos modificados.
   */
  private actualizarTablaConDatosModificados(tipoTabla: string, datosOriginales: Fabricante | Otros260303, datosActualizados: Fabricante | Otros260303): void {
    switch (tipoTabla) {
      case 'fabricante': {
        const INDICE_FABRICANTE = this.fabricanteTablaDatos.findIndex(item => item === datosOriginales);
        if (INDICE_FABRICANTE !== -1) {
          this.fabricanteTablaDatos[INDICE_FABRICANTE] = datosActualizados as Fabricante;
           this.tableValidEvent.emit('fabricante')
        }
        break;
      }
      case 'facturador': {
        const INDICE_FACTURADOR = this.facturadorTablaDatos.findIndex(item => item === datosOriginales);
        if (INDICE_FACTURADOR !== -1) {
          this.facturadorTablaDatos[INDICE_FACTURADOR] = datosActualizados as Fabricante;
        }
        break;
      }
      case 'proveedor': {
        const INDICE_PROVEEDOR = this.proveedorTablaDatos.findIndex(item => item === datosOriginales);
        if (INDICE_PROVEEDOR !== -1) {
          this.proveedorTablaDatos[INDICE_PROVEEDOR] = datosActualizados as Fabricante;
        }
        break;
      }
      case 'certificadoAnalitico': {
        const INDICE_CERTIFICADO = this.certificadoAnaliticoTablaDatos.findIndex(item => item === datosOriginales);
        if (INDICE_CERTIFICADO !== -1) {
          this.certificadoAnaliticoTablaDatos[INDICE_CERTIFICADO] = datosActualizados as Fabricante;
        }
        break;
      }
      case 'otros': {
        const INDICE_OTROS = this.otrosTablaDatos.findIndex(item => item === datosOriginales);
        if (INDICE_OTROS !== -1) {
          this.otrosTablaDatos[INDICE_OTROS] = datosActualizados as Otros260303;
           this.tableValidEvent.emit('otros')
        }
        break;
      }
      default: {
        console.warn(`Tipo de tabla no reconocido: ${tipoTabla}`);
        break;
      }
    }
  }

  /**
   * Limpia todas las selecciones de las tablas.
   */
  private limpiarSelecciones(): void {
    // Limpiar todas las selecciones de filas inmediatamente
    this.selectedFacturadorRows = [];
    this.selectedFabricanteRows = [];
    this.selectedCertificadoAnaliticoRows = [];
    this.selectedOtrosRows = [];
    this.selectedProveedorRows = [];

    // Usar setTimeout para asegurar que las tablas estén inicializadas
    setTimeout(() => {
      // Limpiar selecciones en todos los componentes de tabla
      if (this.tablaComponents) {
        this.tablaComponents.forEach(tabla => {
          if (tabla && typeof tabla.clearSelection === 'function') {
            tabla.clearSelection();
          }
        });
      }
    }, 0);
  }

  /**
   * Método público para limpiar todas las selecciones.
   * Útil para llamadas externas o para forzar la limpieza de selecciones.
   */
  public limpiarTodasLasSelecciones(): void {
    this.limpiarSelecciones();
    
    // Forzar limpieza adicional con más delay para casos problemáticos
    setTimeout(() => {
      this.limpiarSelecciones();
    }, 100);
  }

  /**
   * Fuerza la limpieza de selecciones en las tablas con un retraso mayor.
   * Útil para casos donde la UI necesita más tiempo para actualizar.
   */
  public forzarLimpiezaSelecciones(): void {
    // Limpieza inmediata
    this.limpiarSelecciones();
    
    // Forzar detección de cambios mediante reasignación de datos
    setTimeout(() => {
      this.forzarActualizacionTablas();
    }, 50);
    
    // Limpieza adicional con delay para asegurar que la UI se actualice
    setTimeout(() => {
      if (this.tablaComponents) {
        this.tablaComponents.forEach(tabla => {
          if (tabla && typeof tabla.clearSelection === 'function') {
            tabla.clearSelection();
          }
        });
      }
    }, 200);
  }

  /**
   * Fuerza la actualización de todas las tablas reasignando los datos.
   * Esto provoca que ngOnChanges se ejecute en las tablas, limpiando sus selecciones.
   */
  private forzarActualizacionTablas(): void {
    // Reasignar arrays para forzar detección de cambios
    this.fabricanteTablaDatos = [...this.fabricanteTablaDatos];
    this.facturadorTablaDatos = [...this.facturadorTablaDatos];
    this.proveedorTablaDatos = [...this.proveedorTablaDatos];
    this.certificadoAnaliticoTablaDatos = [...this.certificadoAnaliticoTablaDatos];
    this.otrosTablaDatos = [...this.otrosTablaDatos];
  }

  /**
   * Abre un cuadro de diálogo modal para gestionar un "Fabricante".
   *
   * @param titulo - El título que se mostrará en el cuadro de diálogo modal.
   */
  public abrirFabricanteModal(titulo: string): void {
    const INITIAL_STATE: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        titulo: titulo,
        permisoDefinitivoTitulo: this.permisoDefinitivoTitulo,
        permisoSeccion: this.permisoSeccion,
        procedureID: this.procedureID
      }
    };
    this.bsModalRef = this.modalService.show(FabricanteModalComponent, INITIAL_STATE);

    this.bsModalRef.content.guardarFabricante.subscribe((nuevoDato: Record<string, unknown>) => {
      // Limpiar selecciones después de agregar nuevo registro
      this.limpiarSelecciones();
      if (titulo === 'Agregar fabricante' || titulo === 'Agregar destinatario (destino final)') {
        const DATO = TercerosRelacionadosComponent.mapearDatosFabricante(nuevoDato);
        const updatedFabricantes = [...this.fabricanteTablaDatos, DATO];
        this.fabricanteTablaDatos = updatedFabricantes;
        this.tramite2603Store.setFabricantes(updatedFabricantes);
      } else if (titulo === 'Agregar facturador') {
        const DATO = TercerosRelacionadosComponent.mapearDatosFabricante(nuevoDato);
        const updatedFacturadores = [...this.facturadorTablaDatos, DATO];
        this.facturadorTablaDatos = updatedFacturadores;
        if (this.tramite2603Store.setFacturadores) {
          this.tramite2603Store.setFacturadores(updatedFacturadores);
        }
      } else if (titulo === 'Agregar proveedor/distribuidor') {
        const DATO = TercerosRelacionadosComponent.mapearDatosFabricante(nuevoDato);
        const updatedProveedores = [...this.proveedorTablaDatos, DATO];
        this.proveedorTablaDatos = updatedProveedores;
        if (this.tramite2603Store.setProveedores) {
          this.tramite2603Store.setProveedores(updatedProveedores);
        }
      } else if (titulo === 'Agregar certificado analítico') {
        const DATO = TercerosRelacionadosComponent.mapearDatosFabricante(nuevoDato);
        const updatedCertificados = [...this.certificadoAnaliticoTablaDatos, DATO];
        this.certificadoAnaliticoTablaDatos = updatedCertificados;
        if (this.tramite2603Store.setCertificadosAnaliticos) {
          this.tramite2603Store.setCertificadosAnaliticos(updatedCertificados);
        }
      } else if (titulo === 'Agregar otros') {
        const DATO = TercerosRelacionadosComponent.mapearDatosOtros(nuevoDato);
        const updatedOtros = [...this.otrosTablaDatos, DATO];
        this.otrosTablaDatos = updatedOtros;
        this.tramite2603Store.setOtros(updatedOtros);
      }
    });
  }


  /**
   * Filas seleccionadas en la tabla de facturadores.
   * @type {Fabricante[]}
   */
  public selectedFacturadorRows: Fabricante[] = [];

  /**
   * Filas seleccionadas en la tabla de fabricantes.
   * @type {Fabricante[]}
   */
  public selectedFabricanteRows: Fabricante[] = [];

  /**
   * Filas seleccionadas en la tabla de certificados analíticos.
   * @type {Fabricante[]}
   */
  public selectedCertificadoAnaliticoRows: Fabricante[] = [];

  /**
   * Filas seleccionadas en la tabla de otros terceros relacionados.
   * @type {Otros260303[]}
   */
  public selectedOtrosRows: Otros260303[] = [];

  /**
   * Filas seleccionadas en la tabla de proveedores.
   * @type {Fabricante[]}
   */
  public selectedProveedorRows: Fabricante[] = [];

  /**
   * Actualiza las filas seleccionadas en la tabla de facturadores.
   * @param selected - Array de facturadores seleccionados.
   */
  onSeleccionChangeFacturador(selected: Fabricante[]): void {
    this.selectedFacturadorRows = selected;
  }
  /**
   * Abre el modal para modificar el facturador seleccionado.
   * Solo permite modificar si hay exactamente una fila seleccionada.
   */
  modificarFacturador(): void {
    if (this.selectedFacturadorRows.length === 1) {
      const FACTURADOR_SELECCIONADO = this.selectedFacturadorRows[0];
      this.abrirModalParaModificar('Modificar facturador', FACTURADOR_SELECCIONADO, 'facturador');
    }
  }
  /**
   * Elimina los facturadores seleccionados de la tabla y limpia la selección.
   */
  eliminarFacturador(): void {
    if (this.selectedFacturadorRows.length) {
      this.pendingDeleteType = 'facturador';
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    }
  }

    /**
     * Actualiza las filas seleccionadas en la tabla de fabricantes.
     * @param selected - Array de fabricantes seleccionados.
     */
  onSeleccionChangeFabricante(selected: Fabricante[]): void {
    this.selectedFabricanteRows = selected;
  }
    /**
     * Abre el modal para modificar el fabricante seleccionado.
     * Solo permite modificar si hay exactamente una fila seleccionada.
     */
  modificarFabricante(): void {
    if (this.selectedFabricanteRows.length === 1) {
      const FABRICANTE_SELECCIONADO = this.selectedFabricanteRows[0];
      this.abrirModalParaModificar('Modificar fabricante', FABRICANTE_SELECCIONADO, 'fabricante');
    }
  }
    /**
     * Elimina los fabricantes seleccionados de la tabla y limpia la selección.
     */
  eliminarFabricante(): void {
    if (this.selectedFabricanteRows.length) {
      this.pendingDeleteType = 'fabricante';
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    }
  }

    /**
     * Actualiza las filas seleccionadas en la tabla de certificados analíticos.
     * @param selected - Array de certificados analíticos seleccionados.
     */
  onSeleccionChangeCertificadoAnalitico(selected: Fabricante[]): void {
    this.selectedCertificadoAnaliticoRows = selected;
  }
    /**
     * Abre el modal para modificar el certificado analítico seleccionado.
     * Solo permite modificar si hay exactamente una fila seleccionada.
     */
  modificarCertificadoAnalitico(): void {
    if (this.selectedCertificadoAnaliticoRows.length === 1) {
      const CERTIFICADO_SELECCIONADO = this.selectedCertificadoAnaliticoRows[0];
      this.abrirModalParaModificar('Modificar certificado analítico', CERTIFICADO_SELECCIONADO, 'certificadoAnalitico');
    }
  }
    /**
     * Elimina los certificados analíticos seleccionados de la tabla y limpia la selección.
     */
  eliminarCertificadoAnalitico(): void {
    if (this.selectedCertificadoAnaliticoRows.length) {
      this.pendingDeleteType = 'certificadoAnalitico';
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    }
  }

    /**
     * Actualiza las filas seleccionadas en la tabla de otros terceros relacionados.
     * @param selected - Array de otros terceros seleccionados.
     */
  onSeleccionChangeOtros(selected: Otros260303[]): void {
    this.selectedOtrosRows = selected;
  }
    /**
     * Abre el modal para modificar el registro de otros terceros seleccionado.
     * Solo permite modificar si hay exactamente una fila seleccionada.
     */
  modificarOtros(): void {
    if (this.selectedOtrosRows.length === 1) {
      const OTROS_SELECCIONADO = this.selectedOtrosRows[0];
      this.abrirModalParaModificar('Modificar otros', OTROS_SELECCIONADO, 'otros');
    }
  }
    /**
     * Elimina los registros de otros terceros seleccionados de la tabla y limpia la selección.
     */
  eliminarOtros(): void {
    if (this.selectedOtrosRows.length) {
      this.pendingDeleteType = 'otros';
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    }
  }

    /**
     * Actualiza las filas seleccionadas en la tabla de proveedores.
     * @param selected - Array de proveedores seleccionados.
     */
  onSeleccionChangeProveedor(selected: Fabricante[]): void {
    this.selectedProveedorRows = selected;
  }
    /**
     * Abre el modal para modificar el proveedor/distribuidor seleccionado.
     * Solo permite modificar si hay exactamente una fila seleccionada.
     */
  modificarProveedor(): void {
    if (this.selectedProveedorRows.length === 1) {
      const PROVEEDOR_SELECCIONADO = this.selectedProveedorRows[0];
      this.abrirModalParaModificar('Modificar proveedor/distribuidor', PROVEEDOR_SELECCIONADO, 'proveedor');
    }
  }
    /**
     * Elimina los proveedores seleccionados de la tabla y limpia la selección.
     */
  eliminarProveedor(): void {
    if (this.selectedProveedorRows.length) {
      this.pendingDeleteType = 'proveedor';
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    }
  }
  
  /**
   * Maneja la confirmación de la notificación de validación.
   * 
   * @param {boolean} confirmar - True si el usuario confirma, false si cancela
   * @memberof TercerosRelacionadosComponent
   */
  manejarConfirmacionNotificacion(confirmar: boolean): void {
    // Si es confirmación de eliminación, realiza la acción y programa el éxito
    if (this.nuevaNotificacion && this.nuevaNotificacion.categoria === 'danger' && this.pendingDeleteType) {
      if (confirmar) {
        switch (this.pendingDeleteType) {
          case 'fabricante':
            this.fabricanteTablaDatos = this.fabricanteTablaDatos.filter(
              fabricante => !this.selectedFabricanteRows.includes(fabricante)
            );
            this.selectedFabricanteRows = [];
            break;
          case 'facturador':
            this.facturadorTablaDatos = this.facturadorTablaDatos.filter(
              facturador => !this.selectedFacturadorRows.includes(facturador)
            );
            this.selectedFacturadorRows = [];
            break;
          case 'proveedor':
            this.proveedorTablaDatos = this.proveedorTablaDatos.filter(
              proveedor => !this.selectedProveedorRows.includes(proveedor)
            );
            this.selectedProveedorRows = [];
            break;
          case 'certificadoAnalitico':
            this.certificadoAnaliticoTablaDatos = this.certificadoAnaliticoTablaDatos.filter(
              certificado => !this.selectedCertificadoAnaliticoRows.includes(certificado)
            );
            this.selectedCertificadoAnaliticoRows = [];
            break;
          case 'otros':
            this.otrosTablaDatos = this.otrosTablaDatos.filter(
              otros => !this.selectedOtrosRows.includes(otros)
            );
            this.selectedOtrosRows = [];
            break;
          default:
            break;
        }
        this.pendingDeleteType = null;
        // Limpiar la notificación primero
        this.nuevaNotificacion = {} as Notificacion;
        // Luego mostrar el éxito con un delay
        setTimeout(() => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'INFORMACION',
            categoria: 'success',
            modo: 'action',
            titulo: 'Mensaje',
            mensaje: 'Datos eliminados correctamente',
            cerrar: false,
            tiempoDeEspera: 4000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: ''
          };
          this.cdr.detectChanges();
        }, 100);
        return;
      }
      this.pendingDeleteType = null;
    }
    // Siempre limpiar la notificación después de cualquier confirmación
    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * Obtiene el título dinámico del modal según el procedimiento y si es modificación.
   *
   * @returns {string} El título adecuado para el modal ("Agregar" o "Modificar" según el contexto).
   */
  get tituloModal(): string {
    return TercerosRelacionadosComponent.obtenerNombreDelTitulo(this.idProcedimiento, this.esModificacion);
  }

  /**
   * Obtiene el título adecuado según el idProcedimiento y si es modificación.
   * @param idProcedimiento - El identificador del procedimiento
   * @param esModificacion - Si el modal está en modo modificación
   */
  static obtenerNombreDelTitulo(idProcedimiento: number[] | number, esModificacion?: boolean): string {
    const ID = Array.isArray(idProcedimiento) ? idProcedimiento[0] : idProcedimiento;
    if (ID === 260302 || ID === 260304) {
      return esModificacion ? 'Modificar destinatario (destino final)' : 'Agregar destinatario (destino final)';
    }
    return esModificacion ? 'Modificar fabricante' : 'Agregar fabricante';
  }

  /** Marca como inválidos los campos si no contienen datos. */
  markTouched(): void {
    if (this.fabricanteTablaDatos.length===0) {
      this.isfabricanteInvalida=true;
    } else {
      this.isfabricanteInvalida=false;
    }
    if (this.otrosTablaDatos.length===0) {
      this.isotrosvalid=true; 
    } else {
      this.isotrosvalid=false;
    }
   
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
}