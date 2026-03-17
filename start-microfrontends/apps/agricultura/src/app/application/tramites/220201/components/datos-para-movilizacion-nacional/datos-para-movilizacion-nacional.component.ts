import {
  Catalogo,
  CatalogoSelectComponent,
  SharedModule,
  TituloComponent
} from '@libs/shared/data-access-user/src';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { SharedFormService } from '../../services/220201/SharedForm.service';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * @fileoverview Componente para la gestión del formulario de datos para la movilización nacional.
 * Este componente se encarga de la lógica y la presentación del formulario de datos para la movilización nacional,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module datosParaMovilizacionNacional
 */

/**
 * Componente para el formulario de datos para la movilización nacional.
 * @class DatosParaMovilizacionNacionalComponent
 * @implements {OnInit, OnDestroy, AfterViewInit}
 */
@Component({
  selector: 'app-datos-para-movilizacion-nacional',
  templateUrl: './datos-para-movilizacion-nacional.component.html',
  styleUrl: './datos-para-movilizacion-nacional.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ]
})
export class DatosParaMovilizacionNacionalComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Grupo de controles del formulario para la movilización nacional.
   * @type {FormGroup}
   */
  movilizacionForm: FormGroup;

  /**
   * Lista de medios de transporte disponibles.
   * @type {Catalogo[]}
   */
  medioTransporteList: Catalogo[] = [];

  /**
   * Lista de identificaciones de transporte.
   * @type {Catalogo[]}
   */
  identificacionTransporteList: Catalogo[] = [];

  /**
   * Lista de nombres de empresas transportistas.
   * @type {Catalogo[]}
   */
  nombreDeLaEmpresaTransportista: Catalogo[] = [];

  /**
   * Lista de puntos de verificación federal.
   * @type {Catalogo[]}
   */
  puntoDeVerificacionFederal: Catalogo[] = [];

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Notificador para cancelar todas las suscripciones activas al destruir el componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @method constructor
   * @param fb Constructor de formularios reactivos.
   * @param httpServicios Cliente HTTP para llamadas a servicios.
   * @param certificadoZoosanitarioServices Servicio que gestiona la lógica del certificado zoosanitario.
   * @param certificadoZoosanitarioQuery Consulta para acceder al estado del certificado zoosanitario.
   * @param consultaQuery Consulta para determinar si el formulario es de solo lectura.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private consultaQuery: ConsultaioQuery,
    private catalogoService: CatalogosService,
    private sharedService: SharedFormService,
    public certificadoZoosanitarioStore: ZoosanitarioStore,
    private readonly certificadoZoosanitarioQuery: ZoosanitarioQuery,
  ) {
    this.movilizacionForm = this.fb.group({
      coordenadas: [''],
      nombre: ['', Validators.required],
      medio: ['', Validators.required],
      transporte: [''],
      punto: ['']
    });
  }

  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.obtenerListasDesplegables();
  }

  /**
   * Ciclo de vida que se ejecuta después de que la vista ha sido inicializada.
   * @method ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            this.movilizacionForm.disable();
          }
        })
      )
      .subscribe();
  }

  /**
   * Obtiene todas las listas desplegables requeridas en el formulario.
   * @method obtenerListasDesplegables
   */
  obtenerListasDesplegables(): void {
    this.obtenerTransporteListList();
    this.obtenernombreDeLaEmpresaTransportistaList();
    this.obtenerPuntoDeVerificaciónList();
    this.obtenerIdentificacionTransporteList();

    this.movilizacionForm.reset();
    // Suscribirse a los datos de prellenado de movilización desde el servicio compartido
    this.sharedService.data$.pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      if (data) {
        this.movilizacionForm.patchValue({
          coordenadas: data.coordenadas,
          medio: data.ide_medio_transporte,
          transporte: data.identificacion_transporte,
          punto: data.id_punto_verificacion,
          nombre: data.razon_social
        });
        this.certificadoZoosanitarioStore.actualizarDatosParaMovilizacionNacional(this.movilizacionForm.value);
      }
    });

    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.movilizacionForm.patchValue(datos.datosParaMovilizacionNacional ?? {});
      });
  }

  /**
   * Obtiene la lista de medios de transporte desde un archivo JSON.
   * @method obtenerTransporteListList
   */
  obtenerTransporteListList(): void {
    this.catalogoService.obtieneCatalogoMedioTransporte(220201).subscribe({
      next: data => {
        this.medioTransporteList = data.datos ?? [];
      }
    });
  }

  /**
   * Obtiene la lista de nombres de las empresas transportistas desde un archivo JSON.
   * @method obtenernombreDeLaEmpresaTransportistaList
   */
  obtenernombreDeLaEmpresaTransportistaList(): void {
    this.catalogoService.obtieneCatalogoMedioTransporte(220201).subscribe({
      next: data => {
        this.nombreDeLaEmpresaTransportista = data.datos ?? [];
      }
    });
  }

  /**
   * Obtiene la lista de puntos de verificación federal desde un archivo JSON.
   * @method obtenerPuntoDeVerificaciónList
   */
  obtenerPuntoDeVerificaciónList(): void {
    this.catalogoService.obtieneCatalogoPuntosVerificacion(220201).subscribe({
      next: (data) => {
        this.puntoDeVerificacionFederal = data.datos ?? [];
      }
    });
  }

  /**
   * Obtiene la lista de identificaciones del transporte desde un archivo JSON.
   * @method obtenerIdentificacionTransporteList
   */
  obtenerIdentificacionTransporteList(): void {
    this.catalogoService.obtieneCatalogoMedioTransporte(220201).subscribe({
      next: (data) => {
        this.identificacionTransporteList = data.datos ?? [];
      }
    });
  }

  /**
   * Envía los valores actuales del formulario al store del servicio para actualizar el estado global.
   * @method setValoresStore
   */
  setValoresStore(): void {
    const VALOR = this.movilizacionForm.value;
    this.certificadoZoosanitarioServices.updateDatosParaMovilizacionNacional(VALOR);
  }

  /**
   * @description
   * Valida el formulario de movilización. Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los campos como tocados para mostrar los errores y retorna `false`.
   *
   * @returns {boolean} `true` si el formulario es válido, de lo contrario `false`.
   */
  validarFormulario(): boolean {
    if (this.movilizacionForm.valid) {
      return true;
    }
    this.movilizacionForm.markAllAsTouched();
    return false;
  }

  /**
   * Guarda los datos actuales del formulario de movilización nacional en el servicio correspondiente.
   * @method guardarDatosparaMovilizacionNacional
   */
  guardarDatosparaMovilizacionNacional(): void {
    this.setValoresStore();
  }

  /**
   * Ciclo de vida que se ejecuta al destruir el componente. Libera recursos y cancela las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}