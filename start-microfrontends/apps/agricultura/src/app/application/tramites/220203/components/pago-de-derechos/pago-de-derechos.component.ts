import {
  Catalogo,
  ConsultaioState,
  formatearFechaDdMmYyyy,
} from '@ng-mf/data-access-user';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {CatalogosService} from '../../services/220203/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudService } from '../../services/220203/consulta-solicitud/consulta-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultarPagoDerechosResponse } from '../../models/220203/response/consultar-pago-derechos-response.model';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { PagoDeDerecho } from '../../../../shared/models/tercerosrelacionados.model';
import { PagoDeDerechoComponent } from '../../../../shared/components/pago-de-derecho/pago-de-derecho.component';
import { PagoDeDerechos } from '../../models/220203/importacion-de-acuicultura.module';


/**
 * @fileoverview
 * Componente para el pago de derechos en el trámite de importación de acuicultura 220203.
 * Permite capturar, validar y actualizar la información relacionada al pago, incluyendo exención, justificación, banco y fecha.
 * Cobertura de documentación completa: cada clase, método, propiedad y evento está documentado en español.
 * @module PagoDeDerechosComponent
 */

/**
 * Componente principal para la gestión del pago de derechos en el trámite de importación de acuicultura 220203.
 * Permite capturar, validar y actualizar la información relacionada al pago, incluyendo exención, justificación, banco y fecha.
 * Maneja formularios reactivos con validaciones específicas y carga de catálogos dinámicos.
 * 
 * @class PagoDeDerechosComponent
 * @implements {OnDestroy}
 * @memberof PagoDeDerechosComponent
 */
@Component({
  selector: 'app-pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PagoDeDerechoComponent
  ]
})
export class PagoDeDerechosComponent implements OnInit,OnDestroy {
  /**
   * Referencia al componente hijo de pago de derechos.
   * Permite acceder a los métodos y propiedades del componente PagoDeDerechoComponent.
   * 
   * @public
   * @type {PagoDeDerechoComponent}
   * @memberof PagoDeDerechosComponent
   */
  @ViewChild('pagoDerechosRef') pagoDerechos!: PagoDeDerechoComponent;

  /**
   * Datos del pago de derechos para el formulario.
   * Contiene toda la información relacionada con el pago incluyendo exención, banco, justificación y fecha.
   * 
   * @public
   * @type {PagoDeDerechos}
   * @memberof PagoDeDerechosComponent
   */
  pagoData: PagoDeDerechos = {} as PagoDeDerechos;

  /**
   * Objeto que contiene los catálogos de selección para el pago de derechos.
   * Incluye selectores para bancos y justificaciones disponibles.
   * 
   * @public
   * @type {PagoDeDerecho}
   * @memberof PagoDeDerechosComponent
   */
  pagoSelect: PagoDeDerecho = {
    bancoSelector: [],
    justificacionSelector: [],
  };

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * Se utiliza con el operador takeUntil para completar suscripciones al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof PagoDeDerechosComponent
   */
  private DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos para consulta de datos existentes.
   * 
   * @public
   * @type {boolean}
   * @default false
   * @memberof PagoDeDerechosComponent
   */
  esFormularioSoloLectura: boolean = false;

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
   * Constructor del componente PagoDeDerechosComponent.
   * Inicializa las dependencias necesarias para el funcionamiento del formulario de pago de derechos.
   * Configura los servicios para manejo de formularios, catálogos y consultas de estado.
   * 
   * @constructor
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {ImportacionDeAcuiculturaService} importacionAcuiculturaServicio - Servicio para operaciones de importación de acuicultura
   * @param {ConsultaioQuery} consultaQuery - Query para consultas del estado de solo lectura
   * @param {ChangeDetectorRef} cdr - Referencia para detección de cambios manual
   * @memberof PagoDeDerechosComponent
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly importacionAcuiculturaServicio: ImportacionDeAcuiculturaService,
    private consultaQuery: ConsultaioQuery,
    private readonly cdr: ChangeDetectorRef,
    public catalogosService: CatalogosService,
    private consultaSolicitudService: ConsultaSolicitudService
  ) {
   

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }
  ngOnInit(): void {
     this.importacionAcuiculturaServicio.obtenerDatos()
       .pipe(takeUntil(this.DESTROY_NOTIFIER$))
       .subscribe((datos) => {
      this.pagoData = datos.pagoDeDerechos || {} as PagoDeDerechos;
    })
    const CARGACATALOGOS = async() => {
      await this.obtenerCatalogosTransporte();
      await this.obtenerCatalogosjustificacionTransporte();
    }
    CARGACATALOGOS().then(() => {
      if (this.ocultarForm) {
        this.obtenerDataPagoDerechos();
      }
    })
  }

  /**
   * Obtiene los datos de una solicitud mediante un folio especifico y procesa la respuesta
   * para llenar un formulario y realiza diversas acciones basadas en los datos recibidos.
   * @method obtenerDataMovilizacion
   * @returns {void}
   */
  obtenerDataPagoDerechos(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetallePagoDerechos(Number(this.consultaState.procedureId), FOLIO)
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(async (response) => {
        if (response?.codigo === '00' && response?.datos) {
          await this.obtenerCatalogosTransporte();
          await this.obtenerCatalogosjustificacionTransporte();
          this.llenarFormularioDesdeRespuesta(response.datos);
        }
      })
  }

  /**
   * llena el formulario con los datos de base
   * @param datos
   */
  llenarFormularioDesdeRespuesta(datos: ConsultarPagoDerechosResponse): void {
    const GUARDAR_VALORES: PagoDeDerechos = {
      exentoPago: datos.exento_pago ? 'si' : 'no',
      justificacion: datos.ide_motivo_exento_pago,
      claveReferencia: datos.cve_referencia_bancaria,
      cadenaDependencia: datos.cadena_pago_dependencia,
      banco: datos.cve_banco,
      llavePago: datos.llave_pago,
      importePago: datos.imp_pago.toString(),
      fechaPago: formatearFechaDdMmYyyy(datos.fec_pago),
    };
    this.importacionAcuiculturaServicio.actualizarPagoDeDerechos(GUARDAR_VALORES);
  }
  /**
   * Método para obtener el catálogo de bancos disponibles.
   * Carga los datos del catálogo de bancos desde el servicio de importación de acuicultura.
   * Maneja la subscripción con patrón takeUntil para evitar memory leaks.
   * 
   * @public
   * @method obtenerCatalogosTransporte
   * @memberof PagoDeDerechosComponent
   * @returns {void}
   */
  public obtenerCatalogosTransporte(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoBanco(220203)
        .pipe(
          takeUntil(this.DESTROY_NOTIFIER$)
        ).subscribe(
        (data): void => {
          this.pagoSelect.bancoSelector = data.datos ?? [];
          resolve()
        }
      );
    })

  }
  /**
   * Método para obtener el catálogo de justificaciones disponibles.
   * Carga los datos del catálogo de justificaciones desde el servicio de importación de acuicultura.
   * Utilizado para poblar el selector de justificaciones en el formulario de pago.
   * 
   * @public
   * @method obtenerCatalogosjustificacionTransporte
   * @memberof PagoDeDerechosComponent
   * @returns {void}
   */
  public obtenerCatalogosjustificacionTransporte(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoJustificacionesPago(220203)
        .pipe(
          takeUntil(this.DESTROY_NOTIFIER$)
        ).subscribe(
        (data): void => {
          this.pagoSelect.justificacionSelector = data.datos ?? [];
          resolve();
        }
      );
    })

  }
  /**
   * Método para manejar los cambios en los datos del pago de derechos.
   * Recibe los datos actualizados del formulario y los envía al servicio para su actualización.
   * Se ejecuta cuando hay cambios en el formulario de pago de derechos.
   * 
   * @public
   * @method onPagoChanged
   * @param {PagoDeDerechos} event - Datos actualizados del pago de derechos
   * @memberof PagoDeDerechosComponent
   * @returns {void}
   */
  onPagoChanged(event: PagoDeDerechos): void {
    this.importacionAcuiculturaServicio.actualizarPagoDeDerechos(event as PagoDeDerechos);
  }

  /**
   * Método para validar el formulario de pago de derechos.
   * Delega la validación al componente hijo PagoDeDerechoComponent.
   * Retorna el estado de validación del formulario completo.
   * 
   * @public
   * @method validarFormulario
   * @memberof PagoDeDerechosComponent
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  validarFormulario(): boolean {
    return this.pagoDerechos.validarFormulario();
  }
  /**
   * Método del ciclo de vida OnDestroy de Angular.
   * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
   * Completa el subject DESTROY_NOTIFIER$ para cancelar todas las suscripciones activas.
   * 
   * @public
   * @method ngOnDestroy
   * @memberof PagoDeDerechosComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }
}