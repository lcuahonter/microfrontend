import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { PagoDeDerecho } from '../../../../shared/models/tercerosrelacionados.model';
import { PagoDeDerechoComponent } from '../../../../shared/components/pago-de-derecho/pago-de-derecho.component';
import { PagoDeDerechos } from '../../models/220201/capturar-solicitud.model';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
/**
 * @fileoverview Componente para la gestión del formulario de pago de derechos.
 * Este componente maneja la lógica y la presentación del formulario de pago de derechos,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module PagoDeDerechosComponent
 */

/**
 * Componente para el formulario de pago de derechos.
 * @class PagoDeDerechosComponent
 * @implements {OnInit, OnDestroy}
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
export class PagoDeDerechosComponent implements OnInit, OnDestroy {

  /**
   * Datos del pago de derechos.
   * @property {PagoDeDerechos} pagoData
   */
  pagoData: PagoDeDerechos = {} as PagoDeDerechos;

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();
  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * @property {Subject<void>} pagoSelect
   */
  pagoSelect: PagoDeDerecho = {
    bancoSelector: [],
    justificacionSelector: [],
  };

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @remarks
   * Cuando esta propiedad es `true`, los campos del formulario no serán editables por el usuario.
   *
   * @compodoc
   * @description
   * Determina si el formulario se presenta únicamente para consulta, deshabilitando la edición de los campos.
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;
  /**
* @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
*                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
* @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
*/
  @ViewChild('PagoDeDerecho') PagoDeDerechoComponent!: PagoDeDerechoComponent;

  /**
   * Constructor del componente. Inyecta los servicios y realiza una carga inicial de catálogos.
   * @method constructor
   * @param certificadoZoosanitarioServices Servicio para actualizar datos de pago.
   * @param certificadoZoosanitarioQuery Fuente de datos del estado actual de certificado.
   * @param consultaioQuery Fuente de datos del estado de consulta.
   * @param cdr ChangeDetectorRef para detectar cambios en el ciclo de vida.
   */
  constructor(
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private readonly certificadoZoosanitarioQuery: ZoosanitarioQuery,
    private readonly consultaioQuery: ConsultaioQuery,
    private readonly httpServicios: HttpClient,
    private catalogoService: CatalogosService,
  ) {
    this.obtenerBancoSelectorList();
    this.obtenerListaDeJustificaciones();
  }

  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * Suscribe al estado del formulario para rellenar datos y verificar validez.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.certificadoZoosanitarioQuery.seleccionarPagoDerechos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosDeLaSolicitud) => {
        if (datosDeLaSolicitud) {
          this.pagoData = datosDeLaSolicitud;
        }
      });
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

  }

  /**
   * Realiza una petición para obtener el catálogo de bancos.
   */
  obtenerBancoSelectorList(): void {

    this.catalogoService.obtieneCatalogoBancos(220201).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.pagoSelect.bancoSelector = data.datos ?? [];
    });
  }

  /**
   * Realiza una petición para obtener el catálogo de justificaciones.
   */
  obtenerListaDeJustificaciones(): void {

    this.catalogoService.obtieneCatalogoJustificacionesPago(220201).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.pagoSelect.justificacionSelector = data.datos ?? [];
    });
  }
  /**
   * Envía los valores actuales del formulario al store compartido.
   * @method onPagoChanged
   * @param {PagoDeDerechos} event - Datos actualizados del pago de derechos.
   */
  onPagoChanged(event: PagoDeDerechos): void {
    this.certificadoZoosanitarioServices.updatePagoDeDerechos(event as PagoDeDerechos);
  }
  /**
     * @method validarFormulario
     * @description
     * Verifies if the payment form (`pagoForm`) is valid. If the form is valid, returns `true`.
     * If the form is invalid, marks all form controls as touched to trigger validation messages and returns `false`.
     *
     * @returns {boolean} `true` if the form is valid, otherwise `false`.
     *
     * @memberof PagoDeDerechoComponent
     */
  validarFormulario(): boolean {
    if (this.PagoDeDerechoComponent) {
      return this.PagoDeDerechoComponent.validarFormulario();
    }
    return false;

  }

  /**
   * Guarda los datos de pago de derechos delegando en el componente hijo, si está disponible.
   * @returns void
   */
  guardarDatosPagoDeDerechos(): void {
    if (this.PagoDeDerechoComponent) {
      this.PagoDeDerechoComponent.guardarDatosPagoDeDerechos();
    }
  }
  /**
   * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}