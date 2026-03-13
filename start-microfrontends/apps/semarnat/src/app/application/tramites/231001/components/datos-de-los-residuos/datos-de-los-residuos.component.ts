/**
 * @module DatosDeLosResiduosComponent
 * Este módulo define el componente `DatosDeLosResiduosComponent` que maneja la información de los residuos.
 */
import {
  Catalogo,
  REGEX_NUMERIC_ONLY,
  REGEX_SEIS_SIGNIFICATIVOS,
} from '@ng-mf/data-access-user';
import { Component, Output } from '@angular/core';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosPasos } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { REGEX_NUMEROS_DECIMALES } from '@ng-mf/data-access-user';

import {
  Solicitud231001State,
  Tramite231001Store,
} from '../../../../tramites/231001/estados/tramites/tramite231001.store';
import { CatalogosTramite231001Service } from '../../services/catalogos-tramite-231001.service';
import { ConvertNumberAmountToStringAmount } from '@libs/shared/data-access-user/src/core/utils/convertNumberAmountToStringAmount';
import { MateriaPrima231001 } from '../../models/datos.model';
import { MateriaprimaformserviceService } from '../../services/materia-prima-formservice.service';
import { SoloNumericaDecimalDirective } from '@libs/shared/data-access-user/src/tramites/directives/solo-numeros-punto/solo-numero-y-punto.directive';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite231001Query } from '../../../../tramites/231001/estados/queries/tramite231001.query';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente que maneja los datos relacionados con los residuos, incluidos los formularios y catálogos.
 */
@Component({
  selector: 'app-datos-de-los-residuos',
  templateUrl: './datos-de-los-residuos.component.html',
  styleUrl: './datos-de-los-residuos.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CommonModule,
    TituloComponent,
    SoloNumericaDecimalDirective,
  ],
})
export class DatosDeLosResiduosComponent implements OnInit, OnDestroy {
  @Output() cerrar = new Subject<void>();

  /**
   * @property {FormGroup} materiaPrimaForm
   * Formulario principal del componente para la gestión de datos de residuos.
   */
  materiaPrimaForm!: FormGroup;

  /**
   * @property {boolean} mostrarMsgCantSe06
   * Indica si se debe mostrar el mensaje de cantidad SE06.
   */
  mostrarMsgCantSe06: boolean = false;

  mercanciasTablaDatos: MateriaPrima231001[] = [];

  /**
   * @property {DatosPasos} datosPasosGuardar
   * Objeto que maneja los datos de los pasos del formulario.
   */
  datosPasosGuardar: DatosPasos = {
    txtBtnSig: 'Guardar',
    txtBtnAnt: 'Cancelar',
    indice: 2,
    nroPasos: 0,
  };

  /**
   * Opciones del catálogo de unidad de medida.
   */
  comboUnidadMedida!: Catalogo[];

  /**
   * Opciones del catálogo de capítulo de fracción.
   */
  comboCapituloFraccion!: Catalogo[];

  /**
   * Opciones del catálogo de partida de fracción.
   */
  comboPartidaFraccion!: Catalogo[];

  /**
   * Opciones del catálogo de subpartida de fracción.
   */
  comboSubPartidaFraccion!: Catalogo[];

  /**
   * Opciones del catálogo de fracción arancelaria.
   */
  comboFraccionArancelariaParametros!: Catalogo[];

  umcSeleccionada!: Catalogo;
  capituloSeleccionado!: Catalogo;
  partidaSeleccionada!: Catalogo;
  subPartidaSeleccionada!: Catalogo;
  fraccionSeleccionada!: Catalogo;

  /**
   * Subject utilizado para gestionar la destrucción del componente y la cancelación de suscripciones.
   */
  private destroyed$ = new Subject<void>();
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, todos los controles del formulario y elementos interactivos
   * se deshabilitan, impidiendo que el usuario realice cambios. Esta propiedad normalmente se
   * configura según el estado de la aplicación, por ejemplo, al visualizar una solicitud enviada
   * o cuando el usuario no tiene permisos de edición.
   */
  esFormularioSoloLectura: boolean = false;

  esFormaValido: boolean = true;
  formErrorAlert: string = 'Faltan campos por capturar.';
  public isCantidadFocused: boolean = false;
  /**
   * Estado actual de la sección del trámite 120501.
   * Esta propiedad almacena los datos del estado de la sección, obtenidos generalmente
   * desde el store o desde una consulta al backend. Se utiliza para inicializar y actualizar
   * los formularios del componente con los valores correspondientes a la solicitud en curso.
   */
  private seccionState!: Solicitud231001State;

  /**
   * Instancia de FormBuilder para crear formularios.
   *  Servicio para realizar solicitudes HTTP.
   */
  constructor(
    private fb: FormBuilder,
    private service: MateriaprimaformserviceService,
    private catalogoService: CatalogosTramite231001Service,
    private tramite231001Query: Tramite231001Query,
    private tramite231001Store: Tramite231001Store,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @ngOnInit
   * Método que se ejecuta cuando el componente es inicializado. Carga los catálogos de unidad de medida y capítulo de fracción.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getUnidadMedida();
    this.getCapitulos();
  }

  REGEX_NUMERIC_ONLY = REGEX_NUMERIC_ONLY;

  /**
   * Recupera el estado de la solicitud desde el query y asigna los datos a variables locales.
   * La suscripción se cancela usando `takeUntil(this.destroyed$)`.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite231001Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Solicitud231001State) => {
        this.seccionState = data;
        this.mercanciasTablaDatos = this.seccionState.mercancias;
      });
  }

  /**
   * Convierte la cantidad numérica a su equivalente en texto.
   */
  obtenerLetraCantidad(cantidad: string): void {
    this.materiaPrimaForm.get('cantidadEnLetra')?.enable();
    this.materiaPrimaForm.patchValue({
      cantidadEnLetra: ConvertNumberAmountToStringAmount.convierteNumerosALetra(
        parseFloat(cantidad)
      ),
    });
    this.materiaPrimaForm.get('cantidadEnLetra')?.disable();
  }

  /**
   * @ngOnDestroy
   * Método que se ejecuta cuando el componente es destruido, limpiando los recursos y cancelando las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  /**
   * Inicializa el estado de los formularios según el modo de solo lectura.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
   * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }
  /**
   * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
   *
   * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
   * o los habilita si está en modo edición.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.materiaPrimaForm.disable();
    } else {
      this.materiaPrimaForm.enable();
    }
  }
  /**
   * Inicializa los formularios principales del componente con los valores actuales del estado.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.materiaPrimaForm = this.fb.group({
      nombreDeLaMateriaPrima: [
        '',
        [Validators.required, Validators.maxLength(120)],
      ],
      cantidad: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX_NUMEROS_DECIMALES),
          Validators.pattern(REGEX_SEIS_SIGNIFICATIVOS),
          Validators.maxLength(18),
        ],
      ],
      cantidadEnLetra: [
        { value: '', disabled: true },
        Validators.maxLength(256),
      ],
      unidadMedidaComercial: ['', Validators.required],
      capituloFraccion: ['', Validators.required],
      partidaFraccion: ['', Validators.required],
      subPartidaFraccion: ['', Validators.required],
      fraccion: ['', Validators.required],
    });
  }

  /**
   * Solicita y mapea el catálogo de unidades de medida para el trámite 231001.
   * La respuesta se transforma al formato `Catalogo` esperado por los selects del componente.
   */
  getUnidadMedida(): void {
    this.catalogoService
      .getUnidadMedida()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.comboUnidadMedida = data.datos.map((item) => ({
          id: Number(item.clave),
          clave: item.clave,
          descripcion: item.descripcion,
        }));
      });
  }

  /**
   * Maneja el cambio de capítulo de fracción.
   * - Si el valor es vacío, resetea controles dependientes.
   * - Si tiene valor, normaliza la clave a 2 dígitos y solicita las partidas asociadas.
   */
  changeCapituloFraccion(): void {
    this.comboPartidaFraccion = [];
    this.comboSubPartidaFraccion = [];
    this.comboFraccionArancelariaParametros = [];
    if (!this.materiaPrimaForm) {
      return;
    }
    const RAW_VALUE = this.materiaPrimaForm.get('capituloFraccion')?.value;
    if (RAW_VALUE === null || RAW_VALUE === undefined || RAW_VALUE === '') {
      ['partidaFraccion', 'subPartidaFraccion', 'fraccion'].forEach((ctrl) => {
        const CONTROL = this.materiaPrimaForm.get(ctrl);
        CONTROL?.reset(null);
        CONTROL?.markAsPristine();
        CONTROL?.markAsUntouched();
        CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });
      this.materiaPrimaForm.get('descFraccion')?.reset(null);
      this.materiaPrimaForm
        .get('descFraccion')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      return;
    }

    const CLAVE = String(RAW_VALUE).padStart(2, '0');
    ['partidaFraccion', 'subPartidaFraccion', 'fraccion'].forEach((ctrl) => {
      const CONTROL = this.materiaPrimaForm.get(ctrl);
      CONTROL?.reset(null);
      CONTROL?.markAsPristine();
      CONTROL?.markAsUntouched();
      CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    this.materiaPrimaForm.get('descFraccion')?.reset(null);
    this.materiaPrimaForm
      .get('descFraccion')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.obtenerPartidasFraccion(CLAVE);
  }

  /**
   * Maneja el cambio de partida de fracción.
   * - Si el valor es vacío, resetea controles dependientes.
   * - Si tiene valor, normaliza claves a 2 dígitos y solicita las subpartidas asociadas.
   */
  changePartidaFraccion(): void {
    this.comboSubPartidaFraccion = [];
    this.comboFraccionArancelariaParametros = [];
    if (!this.materiaPrimaForm) {
      return;
    }
    const RAW_VALUE = this.materiaPrimaForm.get('partidaFraccion')?.value;
    if (RAW_VALUE === null || RAW_VALUE === undefined || RAW_VALUE === '') {
      ['subPartidaFraccion', 'fraccion'].forEach((ctrl) => {
        const CONTROL = this.materiaPrimaForm.get(ctrl);
        CONTROL?.reset(null);
        CONTROL?.markAsPristine();
        CONTROL?.markAsUntouched();
        CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });
      this.materiaPrimaForm.get('descFraccion')?.reset(null);
      this.materiaPrimaForm
        .get('descFraccion')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      return;
    }

    const PARTIDA_CLAVE = String(RAW_VALUE).padStart(2, '0');
    const CAPITULO_CLAVE = this.materiaPrimaForm
      .get('capituloFraccion')
      ?.value.padStart(2, '0');
    ['subPartidaFraccion', 'fraccion'].forEach((ctrl) => {
      const CONTROL = this.materiaPrimaForm.get(ctrl);
      CONTROL?.reset(null);
      CONTROL?.markAsPristine();
      CONTROL?.markAsUntouched();
      CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    this.materiaPrimaForm.get('descFraccion')?.reset(null);
    this.materiaPrimaForm
      .get('descFraccion')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.obtenerSubPartidasFraccion(CAPITULO_CLAVE, PARTIDA_CLAVE);
  }

  /**
   * Maneja el cambio de subpartida de fracción.
   * - Si el valor es vacío, resetea controles dependientes.
   * - Si tiene valor, normaliza claves a 2 dígitos y solicita las fracciones arancelarias asociadas.
   */
  changeSubPartidaFraccion(): void {
    this.comboFraccionArancelariaParametros = [];
    if (!this.materiaPrimaForm) {
      return;
    }
    const RAW_VALUE = this.materiaPrimaForm.get('subPartidaFraccion')?.value;
    if (RAW_VALUE === null || RAW_VALUE === undefined || RAW_VALUE === '') {
      ['fraccion'].forEach((ctrl) => {
        const CONTROL = this.materiaPrimaForm.get(ctrl);
        CONTROL?.reset(null);
        CONTROL?.markAsPristine();
        CONTROL?.markAsUntouched();
        CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });
      this.materiaPrimaForm.get('descFraccion')?.reset(null);
      this.materiaPrimaForm
        .get('descFraccion')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      return;
    }

    const SUB_PARTIDA_CLAVE = String(RAW_VALUE).padStart(2, '0');
    const PARTIDA_CLAVE = this.materiaPrimaForm
      .get('partidaFraccion')
      ?.value.padStart(2, '0');
    const CAPITULO_CLAVE = this.materiaPrimaForm
      .get('capituloFraccion')
      ?.value.padStart(2, '0');
    ['fraccion'].forEach((ctrl) => {
      const CONTROL = this.materiaPrimaForm.get(ctrl);
      CONTROL?.reset(null);
      CONTROL?.markAsPristine();
      CONTROL?.markAsUntouched();
      CONTROL?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    this.materiaPrimaForm.get('descFraccion')?.reset(null);
    this.materiaPrimaForm
      .get('descFraccion')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.getFracciones(CAPITULO_CLAVE, PARTIDA_CLAVE, SUB_PARTIDA_CLAVE);
  }

  /**
   * Obtiene la lista de capítulos desde el servicio de catálogos y mapea la respuesta
   * al formato de `Catalogo` usado por los selects del componente.
   *
   * Realiza la suscripción con `takeUntil(this.destroyed$)` para evitar fugas.
   */
  getCapitulos(): void {
    this.catalogoService
      .getCapitulos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.comboCapituloFraccion = data.datos.map((item) => ({
          id: Number(item.clave),
          descripcion: item.descripcion,
          clave: item.clave,
        }));
      });
  }

  /**
   * Obtiene las partidas asociadas a un capítulo de fracción.
   * @param cveCapitulo - Clave del capítulo (ya formateada a dos dígitos al ser llamada).
   */
  obtenerPartidasFraccion(cveCapitulo: string): void {
    this.catalogoService
      .getPartidas(cveCapitulo)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.comboPartidaFraccion = data.datos.map((item) => ({
          id: Number(item.clave),
          descripcion: item.descripcion,
          clave: item.clave,
        }));
      });
  }

  /**
   * Obtiene las subpartidas asociadas a una partida y capítulo de fracción.
   * @param cveCapitulo - Clave del capítulo (2 dígitos).
   * @param cvePartida - Clave de la partida (2 dígitos).
   */
  obtenerSubPartidasFraccion(cveCapitulo: string, cvePartida: string): void {
    this.catalogoService
      .getSubPartidas(cveCapitulo, cvePartida)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.comboSubPartidaFraccion = data.datos.map((item) => ({
          id: Number(item.clave),
          descripcion: item.descripcion,
          clave: item.clave,
        }));
      });
  }

  /**
   * Obtiene las fracciones arancelarias correspondientes a la combinación capítulo/partida/subpartida.
   * @param cveCapitulo - Clave del capítulo (2 dígitos).
   * @param cvePartida - Clave de la partida (2 dígitos).
   * @param cveSubPartida - Clave de la subpartida (2 dígitos).
   */
  getFracciones(
    cveCapitulo: string,
    cvePartida: string,
    cveSubPartida: string
  ): void {
    this.catalogoService
      .getFraccionesArancelarias(cveCapitulo, cvePartida, cveSubPartida)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.comboFraccionArancelariaParametros = data.datos.map((item) => ({
          id: Number(item.clave),
          descripcion: item.descripcion,
          clave: item.clave,
        }));
      });
  }

  /**
   * Cierra el modal de alta de materia prima:
   * - Restablece el formulario.
   * - Emite el evento `cerrar` para notificar al componente padre.
   */
  closeModal(): void {
    this.esFormaValido = true;
    this.materiaPrimaForm.reset();
    this.cerrar.next();
  }

  /**
   * Guarda la materia prima validando el formulario, construyendo el objeto `MateriaPrima231001`,
   * actualizando el store y limpiando el formulario/modal.
   *
   * - Valida controles y muestra errores si aplica.
   * - Mapea valores y normaliza claves (padStart).
   * - Actualiza el estado global vía `tramite231001Store`.
   */
  guardarMateriaPrima(): void {
    const DESC_UM = this.comboUnidadMedida.find(
      (umc) =>
        umc.clave === this.materiaPrimaForm.get('unidadMedidaComercial')?.value
    )?.descripcion;

    if (this.materiaPrimaForm.invalid) {
      this.materiaPrimaForm.markAllAsTouched();
      this.esFormaValido = false;
      return;
    }
    this.esFormaValido = true;
    this.materiaPrimaForm.get('cantidadEnLetra')?.enable();
    const VAL = this.materiaPrimaForm.value;

    const NEU: MateriaPrima231001 = {
      descripcionMercancia: VAL.nombreDeLaMateriaPrima,
      generica2: VAL.cantidad,
      cantidadEnLetra: VAL.cantidadEnLetra,
      unidadMedidaComercialClave: VAL.unidadMedidaComercial.padStart(2, '0'),
      descUnidadMedida: DESC_UM || '',
      generica1: VAL.fraccion,
      descFraccion: VAL.fraccion,
      capituloFraccion: VAL.capituloFraccion.padStart(2, '0'),
      clavePartida: VAL.partidaFraccion.padStart(2, '0'),
      claveSubPartida: VAL.subPartidaFraccion.padStart(2, '0'),
    };

    this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, NEU];
    this.tramite231001Store.actualizarEstado({
      mercancias: this.mercanciasTablaDatos,
    });
    this.materiaPrimaForm.reset();
    this.materiaPrimaForm.get('cantidadEnLetra')?.disable();
    this.closeModal();
  }

  /**
   * Revisa si el control es valido
   */
  isInvalid(controlName: string): boolean | undefined {
    const CONTROL = this.materiaPrimaForm?.get(controlName);
    return CONTROL?.invalid && (CONTROL?.dirty || CONTROL?.touched);
  }
}
