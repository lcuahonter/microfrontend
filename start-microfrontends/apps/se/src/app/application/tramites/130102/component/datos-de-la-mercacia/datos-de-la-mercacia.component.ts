import { REGEX_PERMITE_11_2_DIGITS, REGEX_PERMITE_11_3_DIGITS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
/* eslint-disable @nx/enforce-module-boundaries */
/**
 *compo doc
 * @fileoverview Componente DetosDelLaComponent: maneja la lógica del formulario
 * para la gestión de productos, fracciones arancelarias y unidades de medida.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule, 
  ValidationErrors,  
  Validators,
} from '@angular/forms';

import fractionValues from 'libs/shared/theme/assets/json/130102/fraccion_arancelaria.json';
import productoOptions from 'libs/shared/theme/assets/json/130102/producto-otions.json';
import unidadOptions from 'libs/shared/theme/assets/json/130102/unidad_da.json';

import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";

import { REG_X } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';

import { Solicitud130102State, Tramite130102Store } from '../../../130102/estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';

import { Subject, map, takeUntil } from 'rxjs';
import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { PartidaFormService } from '../../services/partida-form.service';


/**
 *compo doc
 * @class DetosDelMarcanciaComponent
 * @description Componente para la gestión de datos relacionados con productos,
 * fracciones arancelarias y unidades de medida en un formulario reactivo.
 */
@Component({
  selector: 'app-datos-de-la-mercacia',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './datos-de-la-mercacia.component.html',
  styleUrl: './datos-de-la-mercacia.component.scss',
})
export class DetosDelLaMarcaciaComponent implements OnInit , OnDestroy {
   defaultSelect: string = 'CONDMER.N';
  /** 
  * @description Indica si el formulario es de solo lectura.
  */
   esFormularioSoloLectura: boolean = false;
  /**
   * compo doc
   * @property {any} prodData - Datos de productos importados desde un archivo JSON.
   */
  public prodData = productoOptions;

  /**
   * compo doc
   * @property {FormGroup} formDelLa - Estructura del formulario reactivo.
   */
  formDelLa!: FormGroup;

  /**
   * compo doc
   * @property {Array<{ label: string; value: string }>} producto - Lista de productos disponibles.
   */
  producto: { label: string; value: string }[] = [];

  /**
   * compo doc
   * @property {string} selectedValue - Opción seleccionada por defecto.
   */
  selectedValue: string = 'Nuevo';

  /**
   * compo doc
   * @property {string} defaultSelect - Valor predeterminado para el selector de productos.
   */

  /**
   * compo doc
   * @property {Catalogo[]} Unidad - Catálogo de unidades de medida.
   */
  Unidad: Catalogo[] = unidadOptions;

  /**
   * compo doc
   * @property {Catalogo[]} fraccionF - Catálogo de fracciones arancelarias.
   */
  fraccionF: Catalogo[] = [];
/** 
* @description Estado de la solicitud 130102, obtenido desde el store.
*/
  public solicitudState!: Solicitud130102State;
  /**
   * compo doc
   * @property {Subject<void>} destroyNotifier$ - Observable para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * compo doc
   * @constructor
   * @param {HttpClient} http - Cliente HTTP para solicitudes.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   */
  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private tramite130102Store: Tramite130102Store,
    private tramite130102Query: Tramite130102Query,
    private formularioRegistroService: FormularioRegistroService,
    private consultaioQuery: ConsultaioQuery,
    private catOctavaTemporalService: CatOctavaTemporalService,
    private partidaFormService: PartidaFormService

  ) {
    this.consultaioQuery.selectConsultaioState$
         .pipe(
           takeUntil(this.destroyNotifier$),
           map((seccionState) => {
             this.esFormularioSoloLectura = seccionState.readonly;
             this.inicializarEstadoFormulario();
           })
         )
         .subscribe();
  }

  /**
   * compo doc
   * @method ngOnInit
   * @description Inicializa el formulario con validaciones y carga datos de productos.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.fetchProductoOptions();
    this.obtenerFracciones();
    // registrarFormulario se realiza cuando el form se crea dentro de inicializarFormulario
  }
  /**
   * compo doc
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según si es de solo lectura o editable.
   */

 inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
   
  }
  /**
   * Guarda los datos del formulario y ajusta su estado según si es de solo lectura o no.
   * @returns void
   * @description Guarda los datos del formulario y ajusta su estado según si es de solo lectura o no.
   */
    guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.formDelLa.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.formDelLa.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }
/** 
  * compo doc
  * @method inicializarFormulario
  * @description Inicializa el formulario reactivo con los valores del estado de la solicitud.
  * Suscribe al estado de la solicitud para obtener los datos necesarios.
*/
  inicializarFormulario():void{

    this.formDelLa = this.fb.group({
      productos: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), DetosDelLaMarcaciaComponent.noLeadingSpacesValidator]],
      fraccionArancelaria: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      cantidad: ['', [Validators.required, DetosDelLaMarcaciaComponent.maxDigitsValidator(11, 3)]],
      valorFacturaUSD: ['', [Validators.required, DetosDelLaMarcaciaComponent.maxDigitsValidator(11, 2)]],
          
    });
    this.formularioRegistroService.registrarFormulario('datosMercancia', this.formDelLa);
    this.tramite130102Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;

          if (this.esFormularioSoloLectura) {
            this.formDelLa.disable();
          }

       
        
        })
      )
      .subscribe();
  }

  /**
   * Validador personalizado para el campo de cantidad.
   * Verifica que el valor ingresado contenga solo números y cumpla con el patrón de 11 o 3 dígitos permitidos.
   *
   * @static
   * @param {AbstractControl} control - Control del formulario a validar.
   * @returns {ValidationErrors | null} Objeto con los errores de validación o null si es válido.
   *
   * @example
   * this.formBuilder.control('', [CantidadValidator.cantidadPatternValidator])
   */
  public static cantidadPatternValidator(control: AbstractControl): ValidationErrors | null {
    const SOLO_NUMEROS = REG_X.SOLO_NUMEROS;
    const ONCE_TRES_DIGITS = REGEX_PERMITE_11_3_DIGITS;

    if (control.value && !new RegExp(SOLO_NUMEROS).test(control.value)) {
      return { soloNumeros: true };
    }

    if (control.value && !new RegExp(ONCE_TRES_DIGITS).test(control.value)) {
      return { onceTresDigits: true };
    }

    return null;
  }

  /**
   * Validador personalizado para el campo de valor de factura en USD.
   * Verifica que el valor ingresado tenga hasta dos decimales y cumpla con el patrón de 11 o 2 dígitos permitidos.
   *
   * @static
   * @param {AbstractControl} control - Control del formulario a validar.
   * @returns {ValidationErrors | null} Objeto con los errores de validación o null si es válido.
   *
   * @example
   * this.formBuilder.control('', [ValorFacturaValidator.valorFacturaUSDValidator])
   */
  public static valorFacturaUSDValidator(control: AbstractControl): ValidationErrors | null {
    const DECIMALES_DOS_LUGARES = REG_X.DECIMALES_DOS_LUGARES;
    const ONCE_DOS_DIGITS = REGEX_PERMITE_11_2_DIGITS;

    if (control.value && !new RegExp(DECIMALES_DOS_LUGARES).test(control.value)) {
      return { decimalesDosLugares: true };
    }

    if (control.value && !new RegExp(ONCE_DOS_DIGITS).test(control.value)) {
      return { onceDosDigits: true };
    }

    return null;
  }


    /**
   * Asigna un valor del formulario al store.
   *
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Campo del formulario a obtener.
   * @param {keyof Tramite130102Store} metodoNombre - Método del store donde se guardará el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite130102Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130102Store[metodoNombre] as (value: string | number) => void)(VALOR);
  }

  /**
   * compo doc
   * @method onValueChange
   * @description Actualiza el valor seleccionado.
   * @param {string | number} value - Nuevo valor seleccionado.
   *
   * Este método es para la etiqueta de radio de producto.
   */
  onValueChange(value: string | number): void {
    this.selectedValue = value.toString();
  }

  /**
   * compo doc
   * @method fetchProductoOptions
   * @description Carga las opciones de productos desde el JSON.
   */
  fetchProductoOptions(): void {
    this.producto = [
      { "label": "Nuevo", "value": "CONDMER.N" },
      { "label": "Usado", "value": "CONDMER.U" }
    ]
  }

  /**
   * compo doc
   * @method fetchFraccion
   * @description Obtiene información de fracción arancelaria.
   */
  fetchFraccion(): void {
    this.selectedValue = 'Nuevo';
  }

  /**
   * compo doc
   * @method fetchUnidad
   * @description Obtiene información de unidad de medida.
   */
  fetchUnidad(): void {
    this.selectedValue = 'Nuevo';
  }

  /**
 * Validador personalizado que verifica si un campo comienza con espacios en blanco.
 * Retorna un error si se detectan espacios al inicio.
 */
  private static noLeadingSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  }

  /*
    * Validador personalizado que verifica si un campo cumple con el formato de máximo dígitos.
  */
  private static maxDigitsValidator(maxEnteros: number, maxDecimales: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value == null || value === '') return null;
      const regex = new RegExp(`^\\d{1,${maxEnteros}}(\\.\\d{1,${maxDecimales}})?$`);
      return regex.test(value) ? null : { maxDigits: { maxEnteros, maxDecimales } };
    };
  }

  /**
   * Método para obtener las fracciones arancelarias desde el servicio CatOctavaTemporalService.
   * Actualiza el catálogo de fracciones arancelarias con los datos obtenidos.
   */
  obtenerFracciones(): void {
      this.catOctavaTemporalService.getFraccionArancelaria().pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => {
        this.fraccionF = data.datos.map((item, index) => ({
          id: index,
          clave: item.clave,
          descripcion: `${item.clave} - ${item.descripcion}`,
        }));  
      });
    }

  /**
   * Método para obtener las unidades de medida asociadas a una fracción arancelaria específica.
   * Actualiza el catálogo de unidades de medida con los datos obtenidos.
   * @param cveFraccion Clave de la fracción arancelaria para obtener las unidades de medida asociadas.
   */
  obtenerUnidadesMedida(cveFraccion: string): void {
      this.catOctavaTemporalService.getUnidadesMedida(cveFraccion).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => {
        this.Unidad = data.datos.map((item, index) => ({    
          id: index,
          clave: item.clave,
          descripcion: item.descripcion,
        }));  
      });
    }

  /**
   * Maneja el cambio en la fracción arancelaria seleccionada.
   * Obtiene las unidades de medida asociadas a la fracción seleccionada.
   * @param formDelLa Formulario reactivo que contiene el campo de fracción arancelaria.
   */
  onChangeFraccion(formDelLa: FormGroup): void {
    const CVE_FRACCION = formDelLa.get('fraccionArancelaria')?.value;
    
    this.obtenerUnidadesMedida(CVE_FRACCION);
  }
  
  

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Emite y completa el observable para evitar fugas de memoria.
   */

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
