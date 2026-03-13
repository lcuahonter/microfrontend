import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  DestinatarioForm,
  TercerosrelacionadosdestinoTable,
} from '../../models/220203/importacion-de-acuicultura.module';
import { Subject, takeUntil } from 'rxjs';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { AgregardestinatarioComponent } from '../agregardestinatario/agregardestinatario.component';
import { AgregardestinatariofinalComponent } from '../agregardestinatariofinal/agregardestinatariofinal.component';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudService } from '../../services/220203/consulta-solicitud/consulta-solicitud.service';
import {
  ConsultarTercerosRelacionadosResponse
} from '../../models/220203/response/consultar-terceros-relacionados-response.model';
import { DatosDeLaSolicitud} from '../../../../shared/models/tercerosrelacionados.model';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosrelacionadosComponent } from '../../../../shared/components/tercerosrelacionados/tercerosrelacionados.component';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';

/**
 * @fileoverview
 * Componente para la gestión de terceros relacionados en el trámite de importación de acuicultura 220203.
 * Permite visualizar, agregar, editar y eliminar terceros relacionados, así como controlar el modo de solo lectura del formulario.
 * Cobertura de documentación completa: cada clase, método, propiedad y evento está documentado en español.
 * @module TercerospageComponent
 */
/**
 * Componente principal para la gestión de terceros relacionados en el trámite de importación de acuicultura 220203.
 * Permite visualizar, agregar, editar y eliminar terceros relacionados, así como controlar el modo de solo lectura del formulario.
 * Maneja la comunicación con modales para agregar destinatarios y exportadores finales.
 * 
 * @class TercerospageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
 * @memberof TercerospageComponent
 */
@Component({
  selector: 'app-tercerospage',
  standalone: true,
  imports: [
     CommonModule,
     TercerosrelacionadosComponent,
     ModalComponent
  ],
  templateUrl: './tercerospage.component.html',
  styleUrl: './tercerospage.component.scss',
})
export class TercerospageComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * Se utiliza con el operador takeUntil para completar suscripciones al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof TercerospageComponent
   */
  private DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Lista de personas asociadas como terceros relacionados en el trámite actual.
   * Contiene información de destinatarios y otros terceros involucrados en la importación.
   * 
   * @public
   * @type {TercerosrelacionadosdestinoTable[]}
   * @memberof TercerospageComponent
   */
  personas: TercerosrelacionadosdestinoTable[] = [];

  /**
   * Referencia al componente modal para mostrar formularios de destinatarios.
   * Permite abrir y cerrar modales para agregar o editar información de terceros.
   * 
   * @public
   * @type {ModalComponent}
   * @memberof TercerospageComponent
   */
  @ViewChild('modalRef') modalRef!: ModalComponent;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, deshabilita la edición de campos y funciones de modificación.
   * 
   * @public
   * @type {boolean}
   * @default false
   * @memberof TercerospageComponent
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Catálogos de datos de la solicitud incluyendo países, estados y otros elementos de selección.
   * Contiene las opciones disponibles para los campos de selección en los formularios.
   * 
   * @public
   * @type {DatosDeLaSolicitud}
   * @memberof TercerospageComponent
   */
  catalogosDatos: DatosDeLaSolicitud = {} as DatosDeLaSolicitud;

  /**
   * Datos del formulario relacionados con destinatarios finales.
   * Almacena la información específica de los destinatarios exportadores.
   * 
   * @public
   * @type {DestinatarioForm[]}
   * @memberof TercerospageComponent
   */
  datosForma: DestinatarioForm[] = [];

  /**
   * Referencia al componente de terceros relacionados.
   * Permite acceder a los métodos y propiedades del componente TercerosrelacionadosComponent.
   * 
   * @public
   * @type {TercerosrelacionadosComponent}
   * @memberof TercerospageComponent
   */
  @ViewChild('tercerosRelacionadosRef') tercerosRelacionados!: TercerosrelacionadosComponent;

  /**
   * @property {ConsultaioState[]} consultaState
   * @description Consulta solicitud.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * booleano para ocultar el formulario
   * @property {boolean} ocultarForm
   */
  @Input() ocultarForm: boolean = false;
  /**
   * Constructor del componente TercerospageComponent.
   * Inicializa las dependencias necesarias para el funcionamiento del componente de terceros relacionados.
   * Configura los servicios para consultas, manejo de datos y operaciones con terceros.
   * 
   * @constructor
   * @param {ConsultaioQuery} consultaQuery - Query para consultas del estado de solo lectura
   * @param {ImportacionDeAcuiculturaService} certificadoZoosanitarioServices - Servicio para operaciones de importación de acuicultura
   * @param {TercerosrelacionadosService} tercerosrelacionadosService - Servicio para obtener catálogos de terceros relacionados
   * @param {AcuiculturaStore} certificadoZoosanitarioStore - Store para el manejo del estado de acuicultura
   * @memberof TercerospageComponent
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private readonly certificadoZoosanitarioServices: ImportacionDeAcuiculturaService,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    public certificadoZoosanitarioStore: AcuiculturaStore,
    public consultaSolicitudService: ConsultaSolicitudService
  ) { }

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa las suscripciones para el estado de solo lectura y los datos de terceros relacionados.
   * Configura la observación de cambios en el estado del formulario y los datos del trámite.
   * 
   * @public
   * @method ngOnInit
   * @memberof TercerospageComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState?.readonly;
      });
    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((datosDeLaSolicitud) => {
        if (datosDeLaSolicitud) {
          this.personas = datosDeLaSolicitud.tercerosRelacionados;
          this.datosForma = datosDeLaSolicitud.datosForma;
        }
      });
    if (this.ocultarForm) {
      this.obtenerDataTercerosRelacionados();
    }
  }

  /**
   * Método del ciclo de vida AfterViewInit de Angular.
   * Se ejecuta después de que la vista del componente se ha inicializado completamente.
   * Carga los catálogos necesarios para los campos de selección de países y estados.
   * 
   * @public
   * @method ngAfterViewInit
   * @memberof TercerospageComponent
   * @returns {void}
   */
  ngAfterViewInit(): void {
    this.pairsCatalogChange();
    this.estadoCatalogChange();
  }

  /**
   * Obtiene los datos de una solicitud mediante un folio especifico y procesa la respuesta
   * para llenar un formulario y realiza diversas acciones basadas en los datos recibidos.
   * @method obtenerDataTercerosRelacionados
   * @returns {void}
   */
  obtenerDataTercerosRelacionados(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetalleTercerosRelacionados(Number(this.consultaState.procedureId), FOLIO)
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((response) => {
        if (response?.mensaje === 'Operación exitosa.' && response?.datos) {
          this.llenarTablasRespuesta(response.datos);
        }
      })
  }

  /**
   * llena tabla desde servicio de la BD
   * @param datos
   */
  llenarTablasRespuesta(datos: ConsultarTercerosRelacionadosResponse) {
    // Guardar terceros relacionados exportador.
    const ARRAY_TERCEROS_EXPORTADOR: DestinatarioForm[] = [];
    datos.terceros_exportador.forEach(item => {
      const GUARDAR_VALORES_TERCEROS_EXPORTADOR: DestinatarioForm = {
        tipoMercancia: item.persona_moral ? 'yes' : 'no',
        nombre: item.nombre,
        razonSocial: item.razon_social !== null ? item.razon_social : '',
        pais: item.pais,
        telefono: item.telefonos,
        domicilio: item.descripcion_ubicacion,
        correo: item.correo,
        primerApellido: item.apellido_paterno,
        segundoApellido: item.apellido_materno,
        lada: item.lada,
      };
      ARRAY_TERCEROS_EXPORTADOR.push(GUARDAR_VALORES_TERCEROS_EXPORTADOR);
      this.certificadoZoosanitarioStore.updatedatosForma(ARRAY_TERCEROS_EXPORTADOR);

      // guardar terceros relacionados destino.
      const ARRAY_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable[] = [];
      datos.terceros_destinatario.forEach(item => {
        const GUARDAR_VALORES_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable = {
          tipoMercancia: item.persona_moral ? 'yes' : 'no',
          nombre: item.nombre,
          primerApellido: item.apellido_paterno,
          segundoApellido: item.apellido_materno,
          razonSocial: item.razon_social ? item.razon_social : '',
          pais: item.pais,
          codigoPostal: item.codigo_postal,
          estado: item.cve_entidad,
          municipio: item.cve_deleg_mun,
          colonia: item.cve_colonia,
          calle: item.calle,
          numeroExterior: item.num_exterior,
          numeroInterior: item.num_interior ? item.num_interior : '',
          lada: item.lada,
          telefono: item.telefonos,
          correo: item.correo,
          planta: '',
          domicilio: '',
          municipioDescripcion: '',
          estadoDescripcion: '',
          paisDescripcion: '',
          coloniaDescripcion: '',
        };
        ARRAY_TERCEROS_DESTINO.push(GUARDAR_VALORES_TERCEROS_DESTINO);
        this.certificadoZoosanitarioServices.updateTercerosRelacionado(ARRAY_TERCEROS_DESTINO);
      })
    })
  }

  /**
   * Método para cargar el catálogo de países de procedencia.
   * Obtiene la lista de países disponibles desde el servicio de terceros relacionados.
   * Asigna los datos del catálogo a la propiedad catalogosDatos.paises para su uso en formularios.
   * 
   * @public
   * @method pairsCatalogChange
   * @memberof TercerospageComponent
   * @returns {void}
   */
  pairsCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('paisprocedencia.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.catalogosDatos.paises = data;
      });
  }

  /**
   * Método para cargar el catálogo de estados o entidades federativas.
   * Obtiene la lista de estados disponibles desde el servicio de terceros relacionados.
   * Asigna los datos del catálogo a la propiedad catalogosDatos.estados para su uso en formularios.
   * 
   * @public
   * @method estadoCatalogChange
   * @memberof TercerospageComponent
   * @returns {void}
   */
  estadoCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('estados.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.catalogosDatos.estados = data;
      });
  }

  /**
   * Método para eliminar todos los terceros relacionados.
   * Limpia la lista de personas y actualiza el servicio correspondiente con una lista vacía.
   * Se utiliza para resetear completamente los terceros relacionados del trámite.
   * 
   * @public
   * @method handleEliminar
   * @memberof TercerospageComponent
   * @returns {void}
   */
  handleEliminar(): void {
    this.personas = [];
    this.certificadoZoosanitarioServices.updateTercerosRelacionado([] as TercerosrelacionadosdestinoTable[]);
  }

  /**
   * Método para eliminar todos los exportadores/destinatarios finales.
   * Limpia la lista de datos del formulario y actualiza el store correspondiente con una lista vacía.
   * Se utiliza para resetear completamente los destinatarios finales del trámite.
   * 
   * @public
   * @method handleEliminarExportador
   * @memberof TercerospageComponent
   * @returns {void}
   */
  handleEliminarExportador(): void {
    this.personas = [];
    this.certificadoZoosanitarioStore.updatedatosForma([] as DestinatarioForm[]);
  }


  /**
   * Método del ciclo de vida OnDestroy de Angular.
   * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
   * Completa el subject DESTROY_NOTIFIER$ para cancelar todas las suscripciones activas.
   * 
   * @public
   * @method ngOnDestroy
   * @memberof TercerospageComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }

  /**
   * Método para abrir el modal de agregar/editar destinatario.
   * Si se proporciona data, actualiza el store con la información del tercero seleccionado.
   * Abre el modal con el componente AgregardestinatarioComponent.
   * 
   * @public
   * @method abrirModalDestinatario
   * @param {TercerosrelacionadosdestinoTable} [data] - Datos del tercero a editar (opcional)
   * @memberof TercerospageComponent
   * @returns {void}
   */
  abrirModalDestinatario(data?: TercerosrelacionadosdestinoTable): void {
    if (data) {
      this.certificadoZoosanitarioStore.actualizarSelectedTerceros(data);
    }else {
      this.certificadoZoosanitarioStore.actualizarSelectedTerceros({} as TercerosrelacionadosdestinoTable);
    }
    this.modalRef.abrir(AgregardestinatarioComponent);
  }

  /**
   * Método para abrir el modal de agregar/editar exportador final.
   * Actualiza el store con la información del destinatario seleccionado.
   * Abre el modal con el componente AgregardestinatariofinalComponent.
   * 
   * @public
   * @method abrirModalExportador
   * @param {DestinatarioForm} data - Datos del destinatario a editar
   * @memberof TercerospageComponent
   * @returns {void}
   */
  abrirModalExportador(data: DestinatarioForm): void {
    if (data) {
      this.certificadoZoosanitarioStore.actualizarSelectedExdora(data);
    }else {
      this.certificadoZoosanitarioStore.actualizarSelectedExdora({} as DestinatarioForm);
    }
    this.modalRef.abrir(AgregardestinatariofinalComponent);
  }

  /**
   * Método para validar el formulario de terceros relacionados.
   * Delega la validación al componente hijo TercerosrelacionadosComponent.
   * Retorna el estado de validación del formulario completo.
   * 
   * @public
   * @method validarFormulario
   * @memberof TercerospageComponent
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  validarFormulario(): boolean {
    return this.tercerosRelacionados.validarFormulario();
  }

} 