import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, catchError, combineLatest, distinctUntilChanged, filter, lastValueFrom, map, of, take, takeUntil } from 'rxjs';
import { CatalogosTramiteService } from '../../services/catalogosTramite.service';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosGrupos } from '../../models/permiso-importacion-modification.model';
import { FECHA_FACTURA } from '../../constants/permiso-importacion-modification.enum';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';

import { FormValidationService } from '../../services/formValidation.service';

/**
 * @component DatosMercanciaComponent
 * @description Componente responsable de gestionar el formulario de datos de mercancía para el trámite de permiso de importación.
 * Carga catálogos, construye el formulario reactivo y realiza los cálculos necesarios para valores de factura.
 */
@Component({
  selector: 'app-datos-mercancia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, TituloComponent, InputFechaComponent],
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
})
export class DatosMercanciaComponent implements OnInit, OnDestroy {

  /** @property {FormGroup} datosMercanica Formulario reactivo para capturar datos de la mercancía. */
  datosMercanica!: FormGroup;

  /** @property {boolean} esFormularioSoloLectura Indica si el formulario se encuentra en modo de solo lectura. */
  esFormularioSoloLectura: boolean = false;

  /** @property {Catalogo[]} tipoEntradaOpcion Opciones disponibles para el tipo de entrada. */
  tipoEntradaOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} fraccionOpcion Opciones disponibles para fracción arancelaria. */
  fraccionOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} nicoOpcion Opciones disponibles para NICO. */
  nicoOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} umtOpcion Opciones disponibles para unidad de medida de tarifa. */
  umtOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} umcOpcion Opciones disponibles para unidad de medida comercial. */
  umcOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} monedaComercializacionOpcion Opciones disponibles para moneda de comercialización. */
  monedaComercializacionOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} paisExportadorOpcion Opciones disponibles para país exportador. */
  paisExportadorOpcion: Catalogo[] = [];

  /** @property {Catalogo[]} paisOrigenOpcion Opciones disponibles para país de origen. */
  paisOrigenOpcion: Catalogo[] = [];

  /** @property {InputFecha} fechaFactura Campo que representa la fecha de la factura. */
  fechaFactura: InputFecha = FECHA_FACTURA;

  /** @property {Subject<void>} destroyNotifier$ Notificador para limpiar suscripciones en ngOnDestroy. */
  public destroyNotifier$: Subject<void> = new Subject();

  /** @property {number} otroUmcIncrement Incrementador auxiliar para el campo otro_umc. */
  private otroUmcIncrement = 0;

  /** @property {DatosGrupos} DatosState Estado actual de los datos del formulario. */
  private DatosState!: DatosGrupos;

  /**
    * Nueva notificación para mostrar mensajes de error o información al usuario.
    */
  nuevaNotificacion: Notificacion | null = null;

  VALOR_MONEDA: number = 1;

  /**
   * @constructor
   * @param {FormBuilder} fb Constructor de formularios reactivos.
   * @param {PermisoImportacionStore} store Store para manejar el estado de permiso de importación.
   * @param {Tramite130120Query} query Query para obtener el estado de los datos del trámite.
   * @param {ConsultaioQuery} consultaQuery Query para obtener el estado de consulta IO.
   * @param {PermisoImportacionService} permisoImportacionService Servicio para obtener catálogos y datos relacionados.
   * @description Inicializa las dependencias necesarias para el componente DatosMercanciaComponent.
   */
  constructor(
    public fb: FormBuilder,
    public store: PermisoImportacionStore,
    public query: Tramite130120Query,
    public consultaQuery: ConsultaioQuery,
    public permisoImportacionService: PermisoImportacionService,
    private catalogosService: CatalogosTramiteService,
    private cdr: ChangeDetectorRef,
    private formValidation: FormValidationService
  ) { }

  /**
   * @method ngOnInit
   * @description Inicializa el componente, construye el formulario y carga catálogos necesarios.
   */
  async ngOnInit(): Promise<void> {
    this.query.selectDatos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.DatosState = state as DatosGrupos;
        })
      )
      .subscribe();

    await this.initActionFormBuild();

    combineLatest([
      this.query.select(state => state.datosRealizer.regimen),
      this.query.select(state => state.datosRealizer.classificion_regimen)
    ])
      .pipe(
        takeUntil(this.destroyNotifier$),
        // eslint-disable-next-line no-implicit-coercion
        filter(([regimen, clasificacion]) => !!regimen && !!clasificacion), // solo cuando existan ambos
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)) // evita llamadas repetidas
      )
      .subscribe(([regimen, clasificacion]) => {
        this.ObtenerFraccionOpcion(regimen, clasificacion);
      });

    this.ObtenerTipoEntradaOpcion();
    this.obtenerMonedaComercializacionOpcion();
    this.obternerPaisExportadorOpcion();
    this.obtenerPaisOrigenOpcion();
    this.obtenerUmcOpcion();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    const CVEFRACCION = this.datosMercanica.get('fraccion')?.value;
    if (CVEFRACCION) {
      this.onFraccionArancelariaSeleccionada();
    }
    if (this.esFormularioSoloLectura) {
      this.datosMercanica.disable();
    }
  }

  /**
   * @method initActionFormBuild
   * @description Construye el formulario con validaciones e inicializa los valores con datos del estado.
   */
  initActionFormBuild(): void {
    this.datosMercanica = this.fb.group({
      descripcion: [this.DatosState.datosMercanica.descripcion, [Validators.required, Validators.maxLength(4000)]],
      marca: [this.DatosState.datosMercanica.marca, [Validators.required, Validators.maxLength(256), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      tipo_entrada: [this.DatosState.datosMercanica.tipo_entrada || null, Validators.required],
      fraccion: [this.DatosState.datosMercanica.fraccion || null, Validators.required],
      nico: [this.DatosState.datosMercanica.nico || null, Validators.required],
      umt: [this.DatosState.datosMercanica.umt || null, Validators.required],
      factura_numero: [this.DatosState.datosMercanica.factura_numero, Validators.required],
      factura_fecha: [this.DatosState.datosMercanica.factura_fecha, Validators.required],
      umc: [this.DatosState.datosMercanica.umc || null, Validators.required],
      otro_umc: [{ value: this.DatosState.datosMercanica.otro_umc, disabled: true }, [Validators.required]],
      cantidad_umc: [this.DatosState.datosMercanica.cantidad_umc, Validators.required],
      factor_conversion: [{ value: this.DatosState.datosMercanica.factor_conversion, disabled: true }, Validators.required],
      cantidad_umt: [{ value: this.DatosState.datosMercanica.cantidad_umt, disabled: true }, Validators.required],
      valor_factura: [this.DatosState.datosMercanica.valor_factura, Validators.required],
      moneda_comercializacion: [this.DatosState.datosMercanica.moneda_comercializacion || null, Validators.required],
      valor_factura_usd: [{ value: this.DatosState.datosMercanica.valor_factura_usd, disabled: true }, Validators.required],
      precio_unitario_usd: [{ value: this.DatosState.datosMercanica.precio_unitario_usd, disabled: true }, Validators.required],
      pais_exportador: [this.DatosState.datosMercanica.pais_exportador || null, Validators.required],
      pais_origen: [this.DatosState.datosMercanica.pais_origen || null, Validators.required],
      valor_total_factura: [this.DatosState.datosMercanica.valor_total_factura, Validators.required],
      valor_total_factura_usd: [{ value: this.DatosState.datosMercanica.valor_total_factura_usd, disabled: true }, Validators.required],
    });
  }

  /** @method ObtenerTipoEntradaOpcion Carga las opciones del catálogo de tipo de entrada. */
  ObtenerTipoEntradaOpcion(): void {
    this.catalogosService.getCatTiposAduanas().subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.tipoEntradaOpcion = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /** @method ObtenerFraccionOpcion Carga las opciones del catálogo de fracción arancelaria. */
  ObtenerFraccionOpcion(CVEREGIMEN: string, CVECLASIFICACIONREGIMEN: string): void {
    if (!CVEREGIMEN || !CVECLASIFICACIONREGIMEN) {
      return;
    }

    this.catalogosService.getCatFraccionesArrancelarias(CVEREGIMEN, CVECLASIFICACIONREGIMEN).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.fraccionOpcion = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /**
   * @method onFraccionArancelariaSeleccionada Maneja la selección de una fracción arancelaria.
   */
  onFraccionArancelariaSeleccionada(): void {
    const CVEFRACCION = this.datosMercanica.get('fraccion')?.value;
    this.store.setFraccion(CVEFRACCION);
    if (CVEFRACCION) {
      this.obtenerUmtOpcion(CVEFRACCION);
      this.obtenerNicoOpcion(CVEFRACCION);
    } else {
      this.umtOpcion = [];
      this.datosMercanica.get('umt')?.reset();
    }
  }

  /** @method obtenerNicoOpcion Carga las opciones del catálogo de NICO. */
  obtenerNicoOpcion(cveFraccion: string): void {
    this.catalogosService.getCatFraccionesArrancelariasSubdivisiones(cveFraccion)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO && resp.datos && resp.datos.length > 0) {
            this.nicoOpcion = resp.datos;
            if (!this.esFormularioSoloLectura) {
              this.datosMercanica.get('nico')?.enable();
            } else {
              this.datosMercanica.get('nico')?.disable();
            }
          } else {
            this.nicoOpcion = [];
            this.datosMercanica.get('nico')?.reset();
          }
        },
        error: (err) => {
          console.error('Error al cargar clasificación de régimen', err);
          this.nicoOpcion = [];
          this.datosMercanica.get('nico')?.reset();
        }
      });
  }

  /** @method obtenerUmtOpcion Carga las opciones del catálogo de unidad de medida tarifaria. */
  obtenerUmtOpcion(cveFraccion: string): void {
    this.catalogosService.getCatUnidadesMedidasTarifarias(cveFraccion)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO && resp.datos && resp.datos.length > 0) {
            this.umtOpcion = resp.datos;
            if (!this.esFormularioSoloLectura) {
              this.datosMercanica.get('umt')?.enable();
            } else {
              this.datosMercanica.get('umt')?.disable();
            }
          } else {
            this.umtOpcion = [];
            this.datosMercanica.get('umt')?.reset();
          }
        },
        error: (err) => {
          console.error('Error al cargar clasificación de régimen', err);
          this.umtOpcion = [];
          this.datosMercanica.get('umt')?.reset();
        }
      });
  }

  /** @method obtenerUmcOpcion Carga las opciones del catálogo de unidad de medida comercial. */
  obtenerUmcOpcion(): void {
    this.catalogosService.getCatUnidadesMedida()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO && resp.datos && resp.datos.length > 0) {
            this.umcOpcion = resp.datos;
            if (!this.esFormularioSoloLectura) {
              this.datosMercanica.get('umc')?.enable();
            } else {
              this.datosMercanica.get('umc')?.disable();
            }
          } else {
            this.umcOpcion = [];
            this.datosMercanica.get('umc')?.reset();
          }
        },
        error: (err) => {
          console.error('Error al cargar clasificación de régimen', err);
          this.umcOpcion = [];
          this.datosMercanica.get('umc')?.reset();
        }
      });
  }

  /** @method obtenerMonedaComercializacionOpcion Carga las opciones del catálogo de moneda de comercialización. */
  obtenerMonedaComercializacionOpcion(): void {
    this.catalogosService.getCatTiposMonedas().subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.monedaComercializacionOpcion = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /** @method obternerPaisExportadorOpcion Carga las opciones del catálogo de país exportador. */
  obternerPaisExportadorOpcion(): void {
    this.catalogosService.getCatPaises().subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.paisExportadorOpcion = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /** @method obtenerPaisOrigenOpcion Carga las opciones del catálogo de país de origen. */
  obtenerPaisOrigenOpcion(): void {
    this.catalogosService.getCatPaises().subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.paisOrigenOpcion = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /**
   * @method fechaCambiado
   * @param {string} evento Nueva fecha seleccionada.
   * @description Actualiza el campo de fecha de factura en el formulario y almacena en el estado.
   */
  fechaCambiado(evento: string): void {
    this.datosMercanica.patchValue({ factura_fecha: evento });
    this.store.setFacturaFecha(evento);
  }

  /** @method setTotalMercanciaImportar Calcula y actualiza el valor total de la factura en USD. */
  setTotalMercanciaImportar(subformName: FormGroup, campo: string, metodoNombre: keyof PermisoImportacionStore): void {
    this.setValoresStore(subformName, campo, metodoNombre);
    const DATOSMERCANICA = this.datosMercanica;
    const VALARTOTALFACTURACONTROL = DATOSMERCANICA.get('valor_total_factura');
    const VALORTOTALFACTURA = parseFloat(VALARTOTALFACTURACONTROL && VALARTOTALFACTURACONTROL.value ? VALARTOTALFACTURACONTROL.value : '0');
    const MONDEDACOMERCIALIZACION = DATOSMERCANICA.get('moneda_comercializacion');
    let RESULTADO;
    if (Number(MONDEDACOMERCIALIZACION?.value) === 2) {
      RESULTADO = VALORTOTALFACTURA * 3.32;
    }
    const VALORTOTALFACTURAUSDCONTROL = DATOSMERCANICA.get('valor_total_factura_usd');
    if (VALORTOTALFACTURAUSDCONTROL) {
      VALORTOTALFACTURAUSDCONTROL.setValue(RESULTADO, { emitEvent: false });
      VALORTOTALFACTURAUSDCONTROL.markAsDirty();
      VALORTOTALFACTURAUSDCONTROL.markAsTouched();
    }
  }

  /** @method setMercanciaImportar Calcula y actualiza el valor de factura y precio unitario en USD. */
  setMercanciaImportar(subformName: FormGroup, campo: string, metodoNombre: keyof PermisoImportacionStore): void {
    this.setValoresStore(subformName, campo, metodoNombre);
    const DATOSMERCANICA = this.datosMercanica;
    const VALOR_FACTURA = parseFloat(DATOSMERCANICA.get('valor_factura')?.value);
    const MONDEDACOMERCIALIZACION = DATOSMERCANICA.get('moneda_comercializacion');
    const PRECIOUNITARIOUSDCONTROL = DATOSMERCANICA.get('precio_unitario_usd');
    let valorFacturaUsd = VALOR_FACTURA;
    if (Number(MONDEDACOMERCIALIZACION?.value) === 2) {
      valorFacturaUsd = VALOR_FACTURA ? VALOR_FACTURA * 3.32 : 0;
    } else {
      valorFacturaUsd = Number(VALOR_FACTURA) * 1;
    }
    const PRECIOUNITARUSD = (DATOSMERCANICA.get('cantidad_umc')?.value && valorFacturaUsd)
      ? Number((valorFacturaUsd / DATOSMERCANICA.get('cantidad_umc')?.value).toFixed(2))
      : 0;
    const VALORFACTURAUSDCONTROL = DATOSMERCANICA.get('valor_factura_usd');
    if (VALORFACTURAUSDCONTROL) {
      VALORFACTURAUSDCONTROL.setValue(valorFacturaUsd, { emitEvent: false });
      VALORFACTURAUSDCONTROL.markAsDirty();
      VALORFACTURAUSDCONTROL.markAsTouched();
    }
    if (PRECIOUNITARIOUSDCONTROL) {
      PRECIOUNITARIOUSDCONTROL.setValue(PRECIOUNITARUSD, { emitEvent: false });
      PRECIOUNITARIOUSDCONTROL.markAsDirty();
      PRECIOUNITARIOUSDCONTROL.markAsTouched();
    }
  }

  /**
   * @method setValoresStore Actualiza el estado del store con los valores del formulario.
   */
  configurarComboUMT() {
    this.habilitarCampoFactorConversion();
    this.calcularUMT();
  }

  /**
   * @method setValoresStore Actualiza el estado del store con los valores del formulario.
   */
  configurarComboUMC() {
    this.habilitarCampoFactorConversion();
    this.habilitarCampoOtroUmc();
    this.calcularUMT();
  }

  /**
   * @method setValoresStore Actualiza el estado del store con los valores del formulario.
   */
  habilitarCampoOtroUmc(): void {
    const TIPO_UMC = this.datosMercanica.get('umc')?.value;
    const CAMPO_OTRO_UMC = this.datosMercanica.get('otro_umc');
    if (TIPO_UMC === 'Otros') {
      if (!this.esFormularioSoloLectura) {
        CAMPO_OTRO_UMC?.enable(); // permite editar el campo
      } else {
        CAMPO_OTRO_UMC?.disable();
      }
    } else {
      CAMPO_OTRO_UMC?.setValue(''); // limpia el campo
      CAMPO_OTRO_UMC?.disable(); // lo pone como readonly/deshabilitado
    }
  }

  /**
   * @method habilitarCampoFactorConversion Habilita o deshabilita el campo de factor de conversión basado en las unidades seleccionadas.
   */
  habilitarCampoFactorConversion(): void {
    const TIPO_UMC = this.datosMercanica.get('umc')?.value;
    const TIPO_UMT = this.datosMercanica.get('umt')?.value;
    const ID_SOL: string = '';
    const CAMPO_CAPACIDAD = this.datosMercanica.get('factor_conversion');
    const VALOR_CAPACIDAD = CAMPO_CAPACIDAD?.value;
    if (TIPO_UMC === TIPO_UMT) {
      CAMPO_CAPACIDAD?.patchValue(1);
      CAMPO_CAPACIDAD?.disable();
    } else {
      if (!ID_SOL || ID_SOL.toString().length < 2) {
        if (VALOR_CAPACIDAD === 1 || VALOR_CAPACIDAD === '1') {
          CAMPO_CAPACIDAD?.patchValue('');
        }
      }
      if (!this.esFormularioSoloLectura) {
        CAMPO_CAPACIDAD?.enable();
      } else {
        CAMPO_CAPACIDAD?.disable();
      }
    }

    this.calcularUmtPrecioUnitario();
  }

  /**
   * @method calcularUMT Calcula y actualiza el valor de cantidad en UMT basado en la cantidad en UMC y el factor de conversión.
   */
  calcularUMT(): void {
    const FACTOR_CONVERSION = (this.datosMercanica.get('factor_conversion')?.value ?? 0);
    const VALOR_UMC = (this.datosMercanica.get('cantidad_umc')?.value ?? 0);
    const VALOR_UMT_AUX = Number((FACTOR_CONVERSION * VALOR_UMC).toFixed(3));

    this.datosMercanica.get('cantidad_umt')?.setValue(VALOR_UMT_AUX);
    this.store.setCantidadUmt(String(VALOR_UMT_AUX));
  }

  /**
   * @method calcularUmtPrecioUnitario Calcula y actualiza los valores de cantidad en UMT y precio unitario en USD.
   */
  async calcularUmtPrecioUnitario(): Promise<void> {
    this.calcularUMT();
    await this.calcularPrecioUnitarioUSD();
  }

  /**
   * @method calcularValorMoneda Calcula y actualiza los valores relacionados con la moneda de comercialización.
   */
  async calcularValorMoneda(): Promise<void> {
    await this.calcularValorTotalFacturaUSD();
    await this.calcularValorFacturaDolaresMercancia();
    await this.calcularPrecioUnitarioUSD();
  }

  /**
   * @method calcularValoresDolares Calcula y actualiza los valores de factura y precio unitario en dólares.
   */
  async calcularValoresDolares(): Promise<void> {
    await this.calcularValorFacturaDolaresMercancia();
    await this.calcularPrecioUnitarioUSD();
  }

  /**
   * @method calcularValorTotalFacturaUSD Calcula y actualiza el valor total de la factura en USD basado en la moneda de comercialización.
   */
  async calcularValorTotalFacturaUSD(): Promise<void> {
    const VALOR_TOTAL_FACTURA_STR = this.datosMercanica.get('valor_total_factura')?.value;
    if (!VALOR_TOTAL_FACTURA_STR || VALOR_TOTAL_FACTURA_STR.toString().trim().length < 1) {
      return;
    }
    const VALOR_TOTAL_FACTURA = parseFloat(VALOR_TOTAL_FACTURA_STR);
    if (isNaN(VALOR_TOTAL_FACTURA) || VALOR_TOTAL_FACTURA <= 0) {
      return;
    }
    try {
      const TIPO_MONEDA = this.datosMercanica.get('moneda_comercializacion')?.value;
      const VALOR_MONEDA = await lastValueFrom(this.obtenerMonedaConversion(TIPO_MONEDA));
      const FACTOR = 10000000;
      const RESULT_FACT_AUX = (VALOR_MONEDA * FACTOR * VALOR_TOTAL_FACTURA) / FACTOR;
      const RESULT_FACT = DatosMercanciaComponent.truncar(RESULT_FACT_AUX);
      this.datosMercanica.get('valor_total_factura_usd')?.setValue(RESULT_FACT);
      this.store.setValorTotalFacturaUsd((RESULT_FACT).toString());
    } catch (ERROR) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error al mostrar la firma.',
        mensaje: 'Ocurrió un error al mostrar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * @method calcularValorFacturaDolaresMercancia Calcula y actualiza el valor de la factura en dólares basado en la moneda de comercialización.
   */
  async calcularValorFacturaDolaresMercancia(): Promise<void> {
    const VALOR_FACTURA_STR = this.datosMercanica.get('valor_factura')?.value;
    const VALOR_FACTURA = parseFloat(VALOR_FACTURA_STR);
    if (isNaN(VALOR_FACTURA) || VALOR_FACTURA <= 0) {
      return;
    }
    try {
      const TIPO_MONEDA = this.datosMercanica.get('moneda_comercializacion')?.value;
      const VALOR_MONEDA = await lastValueFrom(this.obtenerMonedaConversion(TIPO_MONEDA));
      const VALOR_FACTURA_USD = DatosMercanciaComponent.truncar(VALOR_FACTURA * VALOR_MONEDA);
      this.datosMercanica.get('valor_factura_usd')?.setValue(VALOR_FACTURA_USD);
      this.store.setValorFacturaUsd((VALOR_FACTURA_USD).toString());
    } catch (ERROR) {
      console.error('Error calculando el valor de la factura en USD:', ERROR);
    }
  }
  /**
   * Obtiene el monto de conversión para una moneda específica.
   * @param TIPO Tipo de moneda para la conversión.
   * @returns Observable con el monto de conversión.
   */
  obtenerMonedaConversion(TIPO: string): Observable<number> {
    if (!TIPO?.trim()) {
      return of(1);
    }

    return this.catalogosService.getMontoConversion(TIPO).pipe(
      take(1),
      map(RESPONSE => {
        const RAW = RESPONSE?.datos;
        const PARSED = parseFloat(String(RAW));
        return Number.isFinite(PARSED) ? PARSED : 1;
      }),
      catchError(ERROR => {
        return of(1);
      })
    );
  }


  /**
   * Redondea un número a la cantidad de decimales especificada.
   * @param n Número a redondear.
   * @param decimals Cantidad de decimales a conservar.
   * @returns Número redondeado.
   */
  static roundWDecimals(n: number, decimals: number = 0): string | number {
    if (isNaN(n) || !isFinite(n)) {
      return NaN;
    }

    // Redondeo numérico según los decimales deseados
    const DECIMAL_POWER = Math.pow(10, decimals);
    const PUNTO_DEC = (Math.round(n * DECIMAL_POWER) / DECIMAL_POWER).toString();

    // Asegura que siempre haya parte decimal (".00" si no existe)
    const RETORNO = (PUNTO_DEC.includes('.') ? PUNTO_DEC : `${PUNTO_DEC}.00`).split('.');
    const DECIMALES = RETORNO[1].length;

    // Devuelve con máximo 2 decimales visibles
    return `${RETORNO[0]}.${DECIMALES > 2 ? RETORNO[1].substring(0, 2) : RETORNO[1]}`;
  }

  /**
   * @method calcularPrecioUnitarioUSD Calcula y actualiza el precio unitario en USD basado en la cantidad en UMT y el valor de la factura en USD.
   */
  calcularPrecioUnitarioUSD(): void {
    const CANTIDAD_UMT = this.datosMercanica.get('cantidad_umt')?.value;
    const MERCANCIA_AVISO = this.datosMercanica.get('valor_factura_usd')?.value;

    if ((CANTIDAD_UMT !== null && CANTIDAD_UMT.toString().trim().length >= 1) &&
      (MERCANCIA_AVISO !== null && MERCANCIA_AVISO.toString().trim().length >= 1)) {
      if (CANTIDAD_UMT === 0 || CANTIDAD_UMT.toString().trim().length === 0) {
        this.datosMercanica.get('precio_unitario_usd')?.setValue(0);
        this.store.setPrecioUnitarioUsd((0).toString());
        return;
      }
      const FACTOR = 10000000;
      let RESULTADO_PRECIO_UNITARIO = 0;
      if ((MERCANCIA_AVISO * 1000) < CANTIDAD_UMT) {
        RESULTADO_PRECIO_UNITARIO = 0;
      } else {
        // Simulación del cálculo decimal con precisión
        let RESULTADO_AUX = (MERCANCIA_AVISO * FACTOR) / CANTIDAD_UMT / FACTOR;
        const AJUSTE_AUX = parseFloat(RESULTADO_AUX.toString());
        const ES_NOTACION_CIENTIFICA = String(AJUSTE_AUX).match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/);
        if (ES_NOTACION_CIENTIFICA) {
          const PRECISION = DatosMercanciaComponent.getPrecision(AJUSTE_AUX);
          RESULTADO_AUX = parseFloat(AJUSTE_AUX.toFixed(PRECISION));
        }
        RESULTADO_PRECIO_UNITARIO = DatosMercanciaComponent.truncar(RESULTADO_AUX);
      }
      this.datosMercanica.get('precio_unitario_usd')?.setValue(RESULTADO_PRECIO_UNITARIO);
      this.store.setPrecioUnitarioUsd((RESULTADO_PRECIO_UNITARIO).toString());
    }
  }

  /**
   * Trunca un número a 2 decimales.
   * @param num Número a truncar.
   * @returns Número truncado.
   */
  static truncar(num: number): number {
    const NUM_STR = num.toString();

    if (NUM_STR.includes('.')) {
      const NUM_ARR = NUM_STR.split('.');
      if (NUM_ARR.length === 1) {
        return Number(NUM_STR);
      }
      const PARTE_ENTERA = NUM_ARR[0];
      const PARTE_DECIMAL = NUM_ARR[1].substring(0, 2); // solo 2 dígitos
      return Number(`${PARTE_ENTERA}.${PARTE_DECIMAL}`);
    }

    return Number(NUM_STR);
  }

  /**
   * @method truncateDecimals
   * @param {number} num Número a truncar.
   * @param {number} digits Número de dígitos decimales a conservar.
   * @returns {number} Número truncado con la cantidad especificada de dígitos decimales.
   * @description Trunca un número a una cantidad específica de dígitos decimales sin redondear.
   */
  static truncateDecimals(num: number, digits: number): number {
    const NUM_STR = num.toString();
    const DEC_POS = NUM_STR.indexOf('.');
    const SUBSTR_LENGTH = DEC_POS === -1 ? NUM_STR.length : 1 + DEC_POS + digits;
    const TRIMMED_RESULT = NUM_STR.substring(0, SUBSTR_LENGTH);
    const FINAL_RESULT = isNaN(Number(TRIMMED_RESULT)) ? 0 : Number(TRIMMED_RESULT);

    return parseFloat(FINAL_RESULT.toString());
  }

  /**
   * @method getPrecision
   * @param {number} valor Número del cual se desea obtener la precisión decimal.
   * @returns {number} Precisión decimal del número proporcionado.
   * @description Obtiene la precisión decimal de un número, especialmente útil para números en notación científica.
   */
  static getPrecision(valor: number): number {
    const PARTES = valor.toString().split('e-');
    if (PARTES.length === 2) {
      return parseInt(PARTES[1], 10);
    }
    return 6;
  }

  /**
   * @method onUmcChange
   * @param {FormGroup} subformName Subformulario actual.
   * @param {string} campo Campo del formulario que ha cambiado.
   * @param {keyof PermisoImportacionStore} metodoNombre Método del store que será ejecutado.
   * @description Maneja la lógica cuando cambia la unidad de medida comercial (UMC).
   */
  onUmcChange(subformName: FormGroup, campo: string, metodoNombre: keyof PermisoImportacionStore): void {
    this.setValoresStore(subformName, campo, metodoNombre);
    const CONTROL = subformName.get(`${campo}`);
    const UMT = subformName.get('umt');
    const FACTORCONVERSION = subformName.get('factor_conversion');
    const VALOR = CONTROL?.value;
    const UMCCATALOG = this.umcOpcion;
    if (UMCCATALOG && UMCCATALOG.length > 0) {
      const SELECTED = UMCCATALOG.find((item: { id: number, descripcion: string }) => item.id === Number(VALOR));
      if (SELECTED) {
        this.otroUmcIncrement = 10 * Number(SELECTED.id);
        const OTROUMCCONTROL = this.datosMercanica?.get('otro_umc');
        if (OTROUMCCONTROL) {
          OTROUMCCONTROL.setValue(this.otroUmcIncrement);
          OTROUMCCONTROL.markAsDirty();
          OTROUMCCONTROL.markAsTouched();
          this.store.setOtroUmc(this.otroUmcIncrement.toString());
        }
      }
      if (VALOR === UMT?.value) {
        FACTORCONVERSION?.setValue(1);
        FACTORCONVERSION?.disable();
      } else {
        if (!this.esFormularioSoloLectura) {
          FACTORCONVERSION?.enable();
        } else {
          FACTORCONVERSION?.disable();
        }
      }
    }
  }

  /** @method onCantidadUmcOrFactorChange Calcula y actualiza el valor de cantidad en UMT. */
  onCantidadUmcOrFactorChange(): void {
    const CANTIDAD_UMC = parseFloat(this.datosMercanica.get('cantidad_umc')?.value);
    const FACTORCONVERSION = parseFloat(this.datosMercanica.get('factor_conversion')?.value);
    if (!isNaN(CANTIDAD_UMC) && !isNaN(FACTORCONVERSION)) {
      const RESULTADO = (CANTIDAD_UMC * FACTORCONVERSION).toFixed(2);
      const CANTIDAD_UMT_CONTROL = this.datosMercanica?.get('cantidad_umt');
      if (CANTIDAD_UMT_CONTROL) {
        CANTIDAD_UMT_CONTROL.setValue(RESULTADO);
        CANTIDAD_UMT_CONTROL.markAsDirty();
        CANTIDAD_UMT_CONTROL.markAsTouched();
      }
    }
  }

  /**
   * @method setValoresStore
   * @param {FormGroup} form Formulario actual.
   * @param {string} campo Nombre del campo.
   * @param {keyof PermisoImportacionStore} metodoNombre Método de actualización en el store.
   * @description Actualiza el estado en la store con el valor del campo especificado.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof PermisoImportacionStore): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * @method validarFormulario
   * @returns {boolean} Indica si el formulario es válido.
   * @description Valida el formulario y marca los campos como tocados para mostrar errores.
   */
  validarFormulario(): boolean {
    this.formValidation.marcarFormularioComoTocado(this.datosMercanica);
    this.cdr.detectChanges();
    return this.datosMercanica.valid;
  }

  /**
   * @method ngOnDestroy
   * @description Libera los recursos y detiene todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
