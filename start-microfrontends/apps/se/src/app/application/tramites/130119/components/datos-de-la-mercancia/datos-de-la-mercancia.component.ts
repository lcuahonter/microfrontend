/**
 * Componente encargado de gestionar los datos de la mercancía.
 */
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  CatalogoSelectComponent,
  InputFecha,
  InputFechaComponent,
  REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
  REGEX_NUMERIC_ONLY,
  REGEX_NUMERO_ENTERO_14_2,
  REGEX_PATRON_ALFANUMERICO,
  REGEX_PATRON_DECIMAL_15_4,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FECHA, ID_PROCEDIMIENTO } from '../../constants/aviso-importacion-maquinas.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';

/**
 * Componente encargado de gestionar los datos de la mercancía.
 */
@Component({
  selector: 'app-datos-de-la-mercancia',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, ReactiveFormsModule, InputFechaComponent, TooltipModule],
  templateUrl: './datos-de-la-mercancia.component.html',
  styleUrl: './datos-de-la-mercancia.component.scss',
})
/**
 * Componente encargado de gestionar los datos de la mercancía.
 */
export class DatosDeLaMercanciaComponent implements OnInit, OnDestroy {
  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esSoloLectura!: boolean;
  /**
   * Fecha final de entrada.
   */
  fechaFinalInput: InputFecha = FECHA;

  /**
   * Formulario para los datos de la mercancía.
   * @type {FormGroup}
   */
  datosDeLaMercanciaForm!: FormGroup;

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Opciones de fracción arancelaria.
   * @type {Catalogo[]}
   */
  opcionesFraccionArancelaria!: Catalogo[];

  /**
   * Opciones de países.
   * @type {Catalogo[]}
   */
  pasises!: Catalogo[];

  /**
   * Constructor del componente DatosDeLaMercanciaComponent.
   * 
   * @param {FormBuilder} fb - El servicio FormBuilder proporcionado por Angular.
   * @param {DatosDeLaSolicitudService} service - El servicio para obtener los datos de la solicitud.
   * @param {Tramite130119Store} tramite130119Store - El store del trámite 130119.
   * @param {Tramite130119Query} tramite130119Query - La consulta del trámite 130119.
   */
  constructor(private fb: FormBuilder, 
    private service: DatosDeLaSolicitudService, 
    private tramite130119Store: Tramite130119Store, 
    private tramite130119Query: Tramite130119Query, 
    private consultaQuery: ConsultaioQuery) {

  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene las opciones de fracción arancelaria, países y los valores del store.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.getFraccionArancelaria();
    this.getPasises();
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });


  }
  /**
   * Inicializa el formulario para "Datos de la Mercancía" con sus controles y validadores.
   * También dispara la carga de fracciones arancelarias, países y valores desde el store.
   */
  inicializarFormulario(): void {
    this.datosDeLaMercanciaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL)]],
      fraccionArancelaria: ['', Validators.required],
      umt: [{ value: '', disabled: true }],
      cantidad: ['', [Validators.required, DatosDeLaMercanciaComponent.validacionCantidad]],
      valorFacturaUSD: ['', [Validators.required, Validators.pattern(REGEX_PATRON_DECIMAL_15_4)]],
      paisOrigen: ['', Validators.required],
      paisExportador: ['', Validators.required],
      numeroFactura: ['', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      fechaExpedicionFactura: ['', Validators.required],
      observaciones: ['', Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL)]
    });
    this.datosDeLaMercanciaForm.get('umt')?.enable();
    this.datosDeLaMercanciaForm.get('umt')?.setValue('');
    this.datosDeLaMercanciaForm.get('umt')?.disable();
    this.getValoresStore();
    setTimeout(() => {
      if (!this.datosDeLaMercanciaForm.get('umt')?.value) {
        this.datosDeLaMercanciaForm.get('umt')?.enable();
        this.datosDeLaMercanciaForm.get('umt')?.setValue('Pieza');
        this.datosDeLaMercanciaForm.get('umt')?.disable();
      }
    }, 0);
  }

  /**
   * Habilita o deshabilita el formulario según el estado de solo lectura.
   * Si es solo lectura, deshabilita todos los campos del formulario.
   * Si no, habilita todos los campos del formulario.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.datosDeLaMercanciaForm.disable();
      this.datosDeLaMercanciaForm.get('umt')?.disable();
    } else {
      this.datosDeLaMercanciaForm.enable();
      this.datosDeLaMercanciaForm.get('umt')?.disable();
    }
  }


  /**
   * Obtiene las opciones de fracción arancelaria desde el servicio.
   */
  getFraccionArancelaria(): void {
    this.service.getFraccionArancelaria(this.idProcedimiento.toString()).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.opcionesFraccionArancelaria = data;
    });
  }

  /**
   * @method getUMT
   * @description
   * Obtiene la Unidad de Medida y Tarifa (UMT) desde el catálogo según el valor de la
   * fracción arancelaria seleccionada en el formulario.  
   * 
   * Este método realiza lo siguiente:
   * - Obtiene el valor del campo `fraccionArancelaria` del formulario.
   * - Llama al servicio `getUMTCatalogo` enviando el id del procedimiento y la fracción.
   * - Suscribe a la respuesta y extrae la descripción de la UMT.
   * - Actualiza el formulario asignando la UMT al campo `umt`.
   * - Guarda el valor actualizado en el store llamando a `setValoresStore`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  getUMT(): void {
    const VALOR = this.datosDeLaMercanciaForm.get('fraccionArancelaria')?.value;
    this.service.getUMTCatalogo(this.idProcedimiento.toString(), VALOR).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      const UMT = data[0]?.descripcion || '';
      this.datosDeLaMercanciaForm.get('umt')?.setValue(UMT);
      this.setValoresStore(this.datosDeLaMercanciaForm, 'umt');
    });
  }

  /**
   * Obtiene las opciones de países desde el servicio.
   */
  getPasises(): void {
    this.service.getPais(this.idProcedimiento.toString()).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.pasises = data;
    });
  }

  /**
   * Maneja el cambio de la fracción arancelaria.
   * Establece los valores en el store y actualiza el campo 'umt'.
   */
  onFraccionArancelariaChange(): void {
    this.setValoresStore(this.datosDeLaMercanciaForm, 'fraccionArancelaria');
    this.getUMT();
  }

  /**
   * Establece los valores en el store.
   * @param {FormGroup} form - El formulario del cual se obtienen los valores.
   * @param {string} campo - El nombre del campo del formulario.
   * @param {keyof Tramite130119Store} metodoNombre - El nombre del método del store.
   */

  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite130119Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Obtiene los valores del store y los asigna al formulario.
   */
  getValoresStore(): void {
    this.tramite130119Query.selectTramite130119$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.datosDeLaMercanciaForm.patchValue({
            descripcion: seccionState.descripcion,
            fraccionArancelaria: seccionState.fraccionArancelaria,
            umt: seccionState.umt,
            cantidad: seccionState.cantidad,
            valorFacturaUSD: seccionState.valorFacturaUSD,
            paisOrigen: seccionState.paisOrigen,
            paisExportador: seccionState.paisExportador,
            numeroFactura: seccionState.numeroFactura,
            fechaExpedicionFactura: seccionState.fechaExpedicionFactura,
            observaciones: seccionState.observaciones
          });
        })
      )
      .subscribe();
  }
  /**
   * Valida el campo "numeroDePiezas" asegurando que solo contenga números y cumpla con el patrón es máximo 14 dígitos enteros y máximo 2 decimales.
   *
   * @param control - Control de formulario a validar.
   * @returns {ValidationErrors | null} Un objeto con los errores de validación si existen, o null si es válido.
   */
  private static validacionCantidad(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const VALIDACION_ERRORES: ValidationErrors = {};
    
    // Compruebe si contiene sólo caracteres válidos (dígitos y como máximo un punto decimal)
    const IS_VALID_BASIC_FORMAT = REGEX_NUMERIC_ONLY.test(VALUE);
    if (!IS_VALID_BASIC_FORMAT) {
      VALIDACION_ERRORES['soloNumerico'] = true;
      return VALIDACION_ERRORES; // Regrese temprano para caracteres no numéricos
    }
    
    // Compruebe el formato: máximo 14 dígitos enteros y máximo 2 decimales
    if (!REGEX_NUMERO_ENTERO_14_2.test(VALUE)) {
      VALIDACION_ERRORES['formatoInvalido'] = true;
    }
    
    return Object.keys(VALIDACION_ERRORES).length > 0 ? VALIDACION_ERRORES : null;
  }
  /**
    * Método para cambiar la fecha final.
    * @param nuevo_valor Nuevo valor de la fecha final.
    */
  cambioFechaFinal(nuevo_valor: string): void {
    this.datosDeLaMercanciaForm.patchValue({
      fechaExpedicionFactura: nuevo_valor,
    });
    this.setValoresStore(this.datosDeLaMercanciaForm, 'fechaExpedicionFactura');
  }
  
  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}