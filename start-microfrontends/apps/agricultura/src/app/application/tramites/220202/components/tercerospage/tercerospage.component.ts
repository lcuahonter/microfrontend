/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * Componente para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Permite visualizar, actualizar y eliminar la lista de personas asociadas como terceros,
 * así como controlar el modo de solo lectura del formulario y cargar catálogos de países y estados.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module TercerospageComponent
 */

import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, Notificacion } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { TercerosRelacionados,TercerosrelacionadosExportadorTable, TercerosrelacionadosdestinoTable } from '../../models/220202/fitosanitario.model';
import { AgregarExportadorComponent } from '../agregar-exportador/agregar-exportador.component';
import { AgregardestinatarioComponent } from '../agregardestinatario/agregardestinatario.component';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudService } from '../../services/220202/consulta-solicitud/consulta-solicitud.service';
import {
  ConsultarTercerosRelacionadosResponse
} from '../../models/220202/response/consultar-terceros-relacionados-response.model';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosrelacionadosComponent } from '../../shared/tercerosrelacionados/tercerosrelacionados.component';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';

/**
 * Componente para la gestión de terceros relacionados en el trámite.
 * Permite visualizar, actualizar y eliminar la lista de personas asociadas como terceros,
 * así como controlar el modo de solo lectura del formulario y cargar catálogos de países y estados.
 *
 * @class TercerospageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
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
})
export class TercerospageComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Se emite cuando el componente se destruye, permitiendo cancelar las suscripciones a observables.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Lista de personas asociadas como terceros en el trámite actual.
   * @type {TercerosrelacionadosdestinoTable[]}
   */
  personas: TercerosrelacionadosdestinoTable[] = [];

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Determina si el formulario debe mostrarse únicamente para lectura, sin permitir modificaciones.
   * @type {boolean}
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Catálogos de datos de la solicitud, como países y estados.
   * @type {DatosDeLaSolicitud}
   */
  catalogosDatos: TercerosRelacionados = {} as TercerosRelacionados;

  /**
   * Datos de la forma relacionados con terceros.
   * Esta propiedad almacena los datos específicos de la forma que se relacionan con los terceros.
   * @type {TercerosrelacionadosExportadorTable[]}
   */
  datosForma: TercerosrelacionadosExportadorTable[] = [];

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos.
   * @type {modalRef}
   */
  @ViewChild('modalRef') modalRef!: ModalComponent;

  /**
 * Representa una nueva notificación que será utilizada en el componente.
 * @type {Notificacion}
 */
  public nuevaNotificacion!: Notificacion;

  /**
* Indica si debe mostrar error de campo obligatorio en la tabla.
*/
  mensajeErrorTablaExportador: boolean = false;

  /**
* Indica si debe mostrar error de campo obligatorio en la tabla.
*/
  mensajeErrorTablaDestinatario: boolean = false;
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
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de solo lectura.
   * @param agriculturaApiService Servicio para actualizar terceros relacionados.
   * @param fitosanitarioQuery Servicio para consultar el estado de terceros relacionados.
   * @param tercerosrelacionadosService Servicio para obtener catálogos de terceros relacionados.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private readonly agriculturaApiService: AgriculturaApiService,
    private readonly fitosanitarioQuery: FitosanitarioQuery,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    public fitosanitarioStore: FitosanitarioStore,
    public consultaSolicitudService: ConsultaSolicitudService
  ) { }

  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * Suscribe al estado de solo lectura y a la lista de terceros relacionados.
   * @method ngOnInit
   */
  ngOnInit(): void {
  this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      });
      
    // Suscríbete reactivamente para almacenar cambios para terceros relacionados (destinatario)
    this.fitosanitarioStore._select(state => state.tercerosRelacionados)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tercerosRelacionados) => {
        this.personas = tercerosRelacionados || [];
      });

    // Suscribirse reactivamente para almacenar cambios en los datos del exportador
    this.fitosanitarioStore._select(state => state.datosForma)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosForma) => {
        this.datosForma = datosForma || [];
      });
    if (this.ocultarForm) {
      this.obtenerDataTercerosRelacionados();
    }
  }

  /**
   * Ciclo de vida de Angular que se ejecuta después de inicializar la vista.
   * Carga los catálogos de países y estados.
   * @method ngAfterViewInit
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
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response?.codigo === '00' && response?.datos) {
          this.llenarTablasRespuesta(response.datos);
        }
      })
  }

  /**
 * Llena las tablas de terceros relacionados con los datos recibidos.
 * @param datos Datos de la respuesta de la consulta.
 * @returns {void}
 */
  llenarTablasRespuesta(datos: ConsultarTercerosRelacionadosResponse): void {
    // Guardar terceros relacionados exportador.
    const ARRAY_TERCEROS_EXPORTADOR: TercerosrelacionadosExportadorTable[] = [];
    datos.terceros_exportador.forEach((item) => {
      const GUARDAR_VALORES_TERCEROS_EXPORTADOR: TercerosrelacionadosExportadorTable =
        {
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
      ARRAY_TERCEROS_EXPORTADOR.push(
        GUARDAR_VALORES_TERCEROS_EXPORTADOR
      );
      (
        this.agriculturaApiService.updateTercerosExportador as (
          value: TercerosrelacionadosExportadorTable[]
        ) => void
      )(ARRAY_TERCEROS_EXPORTADOR);
      this.datosForma = ARRAY_TERCEROS_EXPORTADOR;
    });
    // guardar terceros relacionados destino.
    const ARRAY_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable[] =
      [];
    datos.terceros_destinatario.forEach((item) => {
      const GUARDAR_VALORES_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable =
        {
          tipoMercancia: '',
          nombre: item.nombre,
          primerApellido: item.apellido_paterno,
          segundoApellido: item.apellido_materno,
          razonSocial: item.razon_social !== null ? item.razon_social : '',
          pais: item.pais,
          codigoPostal: item.codigo_postal,
          estado: item.cve_entidad,
          municipio: item.cve_deleg_mun,
          colonia: item.cve_colonia,
          calle: item.calle,
          numeroExterior: item.num_exterior,
          numeroInterior: item.num_interior !== null ? item.num_interior : '',
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
      (
        this.agriculturaApiService.updateTercerosRelacionado as (
          value: TercerosrelacionadosdestinoTable[]
        ) => void
      )(ARRAY_TERCEROS_DESTINO);
      this.personas = ARRAY_TERCEROS_DESTINO;
    });
  }

  /**
   * Carga el catálogo de países y lo asigna a la propiedad catalogosDatos.paises.
   * @method pairsCatalogChange
   */
  pairsCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('paisprocedencia.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.catalogosDatos.paises = data;
      });
  }

  /**
   * Carga el catálogo de estados y lo asigna a la propiedad catalogosDatos.estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('estados.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.catalogosDatos.estados = data;
      });
  }

  /**
   * Elimina todos los terceros relacionados y actualiza el servicio correspondiente.
   * @method handleEliminar
   */
  handleEliminarDestinatario(): void {
    this.personas = [];
    this.agriculturaApiService.updateTercerosRelacionado([] as TercerosrelacionadosdestinoTable[]);
  }

  /**
   * Elimina todos los exportadores relacionados y actualiza el servicio correspondiente.
   * @method handleEliminarExportador
   */
  handleEliminarExportador(): void {
    this.datosForma = [];
    this.agriculturaApiService.updateTercerosExportador([] as TercerosrelacionadosExportadorTable[]);
  }

  /**
   * Ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Abre el modal para agregar o editar un exportador.
   * Si se proporciona datos, los utiliza para prellenar el formulario del modal.
   * @param {any} data Datos del exportador a editar (opcional).
   */
  abrirModalExportador(data: any): void { 
    if (data) {
      this.fitosanitarioStore.actualizarSelectedExdora(data);
    }else {
      this.fitosanitarioStore.actualizarSelectedExdora({} as any);
    }
    this.modalRef.abrir(AgregarExportadorComponent);
  }

  /**
   * Abre el modal para agregar o editar un destinatario.
   * Si se proporciona datos, los utiliza para prellenar el formulario del modal.
   * @param {any} data Datos del destinatario a editar (opcional).
   */
  abrirModalDestinatario(data?: any): void {
    if (data) {
      this.fitosanitarioStore.actualizarSelectedTerceros(data);
    }
    this.modalRef.abrir(AgregardestinatarioComponent);
  }

  /**
  * @description Valida todos los campos del formulario y marca los campos como touched
  * para mostrar los errores de validación en los componentes app-catalogo-select
  * @method validarFormulario
  * @returns { valido: boolean; mensaje?: string } true si el formulario es válido, false en caso contrario
  */
  public validarFormulario(): { valido: boolean; mensaje?: string } {
    let valido = true;
    // Verificar si hay datos en la tabla
    const TABLE_DESTINATARIO = this.fitosanitarioStore.getValue().tercerosRelacionados;
    const TABLE_EXPORTADOR = this.fitosanitarioStore.getValue().datosForma;

    if (!TABLE_EXPORTADOR || TABLE_EXPORTADOR.length === 0) {
      this.mensajeErrorTablaExportador = true
      valido = false;
    }
    else {
      this.mensajeErrorTablaExportador = false;
    }
    if (!TABLE_DESTINATARIO || TABLE_DESTINATARIO.length === 0) {
      this.mensajeErrorTablaDestinatario = true
      valido = false;
    }
    else {
      this.mensajeErrorTablaDestinatario = false;
    }
    return { valido: valido };
  }

}