import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  ConsultaioQuery,
  JSONResponse,
  REGEX_NUMERO_DECIMAL_3_DIGITOS,
  REGEX_REMOVE_NON_NUMERIC_WITH_DECIMAL,
  REGEX_SIN_CARACTERES_ESPECIALES_KIMBERLEY,
  REGEX_SIN_DIGITOS,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import {
  Tramite130203State,
  Tramite130203Store,
} from '../../estados/tramites/tramites130203.store';
import { CatalogoSelectComponent, } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ExportacionDeDiamantesEnBrutoService } from '../../services/exportacion-de-diamantes-en-bruto.service';
import { ID_PROCEDIMIENTO } from '../../constants/exportacion-de-diamantes-en-bruto.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite130203Query } from '../../estados/queries/tramite130203.query';
import {
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';

/**
 * @description
 * Componente para gestionar el formulario del Certificado Kimberley.
 * Este componente es standalone y utiliza Reactive Forms para la gestión de formularios.
 */
@Component({
  selector: 'app-certificado-kimberley',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
  ],
  templateUrl: './certificado-kimberley.component.html',
  styleUrl: './certificado-kimberley.component.scss',
})
export class CertificadoKimberleyComponent implements OnInit, OnDestroy {
  // Error flags for validation display
  mostrarErroresEmpresa = false;
  mostrarErroresExportador = false;
  mostrarErroresImportador = false;
  mostrarErroresRemesa = false;
  mostrarErroresDiamantes = false;
  /**
   * @description
   * Formulario principal para la empresa.
   */
  public formularioEmpresa!: FormGroup;

  /**
   * @description
   * Estado actual del trámite.
   */
  public solicitudState!: Tramite130203State;

  /**
   * @description
   * Lista de países emisores.
   */
  public paisesEmisores: Catalogo[] = [];

  /**
   * @description
   * Lista de nombres en inglés.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public nombresIngles: any[] = [];

  /**
   * @description
   * Formulario para los datos del exportador.
   */
  datosDelExportador!: FormGroup;

  /**
   * @description
   * Formulario para los datos del importador.
   */
  datosDelImportador!: FormGroup;

  /**
   * @description
   * Formulario para los datos de la remesa.
   */
  datosDeLaRemesa!: FormGroup;

  /**
   * @description
   * Formulario para los datos de los diamantes.
   */
  datosDeLosDiamantes!: FormGroup;

  /**
   * @description
   * Observable para manejar la destrucción del componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Identificador del país emisor seleccionado.
   * Puede ser un número o `null` si no se ha seleccionado ninguno.
   */
  paisId: number | null = null;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /*
   * @description
   * Indica si el catálogo de país de origen está deshabilitado.
   */
  disabledCatalogoPaisOrigen: boolean = false;

  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130203State;

  /*
  * @description
  * Expresiones regulares para validaciones.
  */
  soloNumerosEnInputVar = true;

  /**
     * @property {string} idProcedimiento
     * @description
     * Identificador del procedimiento.
     */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @description
   * Evento para emitir la acción de guardar.
   */
  @Output() emitGuardarBtn: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @description
   * Constructor del componente.
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param tramite130203Store Store para gestionar el estado del trámite.
   * @param tramite130203Query Query para obtener datos del estado del trámite.
   * @param exportacionDeDiamantesEnBrutoService Servicio para obtener datos relacionados con la exportación.
   * @param consultaioQuery Query para obtener datos de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130203Store: Tramite130203Store,
    private tramite130203Query: Tramite130203Query,
    private exportacionDeDiamantesEnBrutoService: ExportacionDeDiamantesEnBrutoService,
    private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService,
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
   * @description
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.loadData();
    this.subscribeToState();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
  * @method
  * @name guardarDatosFormulario
  * @description
  * Inicializa los formularios y obtiene los datos de la tabla.
  * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
  * deshabilita o habilita todos los formularios del componente.
  * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
  * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
  *
  * @returns {void}
  */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formularioEmpresa.disable();
      this.datosDelExportador.disable();
      this.datosDelImportador.disable();
      this.datosDeLaRemesa.disable();
      this.datosDeLosDiamantes.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formularioEmpresa.enable();
      this.datosDelExportador.enable();
      this.datosDelImportador.enable();
      this.datosDeLaRemesa.enable();
      this.datosDeLosDiamantes.enable();
    }
  }

  /**
   * @description
   * Se suscribe al estado del store y actualiza los formularios con los valores del estado.
   */
  subscribeToState(): void {
    this.tramite130203Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((seccionState) => {
        this.formularioEmpresa.patchValue({
          especifique: seccionState.especifique,
          numero: seccionState.numero,
          nombre: seccionState.nombre,
          tipoEmpresa: seccionState.tipoEmpresa,
          paisOrigen: seccionState.paisOrigen,
          lineaCheckbox: seccionState.lineaCheckbox
        });
        this.datosDelExportador.patchValue({
          direccionExportador: seccionState.direccionExportador,
        });
        this.datosDelImportador.patchValue({
          nombreImportador: seccionState.nombreImportador,
          direccionImportador: seccionState.direccionImportador,
        });
        this.datosDeLaRemesa.patchValue({
          numeroEnLetraDeLosLotes: seccionState.numeroEnLetraDeLosLotes,
          numeroEnLetraDeLosLotesEnIngles:
            seccionState.numeroEnLetraDeLosLotesEnIngles,
          numeroDeFactura: seccionState.numeroDeFactura,
        });
        this.datosDeLosDiamantes.patchValue({
          cantidadEnQuilates: seccionState.cantidadEnQuilates,
          valorDeLosDiamantes: seccionState.valorDeLosDiamantes,
        });
      });
  }

  /**
   * @description
   * Carga los datos iniciales desde el servicio.
   */
  loadData(): void {
    this.exportacionDeDiamantesEnBrutoService
      .getPaisesEmisores(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paises) => {
        this.paisesEmisores = paises;
      });

    this.exportacionDeDiamantesEnBrutoService
      .getNombresIngles()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((nombres) => {
        this.nombresIngles = nombres;
      });

    this.exportacionDeDiamantesEnBrutoService.getNombreExporter()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((nombreExportador) => {
        this.datosDelExportador.patchValue({
          nombreExportador: nombreExportador,
        });
      });
  }

  /**
   * @description
   * Inicializa el formulario principal.
   */
  public inicializarFormulario(): void {
    this.subscription.add(
      this.tramite130203Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.seccionState = seccionState;
          })
        )
        .subscribe()
    );
    this.formularioEmpresa = this.fb.group({
      especifique: [
        { value: this.seccionState?.especifique, disabled: true },
        [Validators.maxLength(20)],
      ],
      numero: [this.seccionState?.numero, [Validators.required, Validators.maxLength(50)]],
      tipoEmpresa: [this.seccionState?.tipoEmpresa, [Validators.required]],
      nombre: [this.seccionState?.nombre, [Validators.required]],
      lineaCheckbox: this.seccionState?.lineaCheckbox,
      paisOrigen: [this.seccionState?.paisOrigen, [Validators.required]],
    });

    this.datosDelExportador = this.fb.group({
      nombreExportador: [
        { value: this.seccionState?.nombreExportador, disabled: true },
      ],
      direccionExportador: [
        this.seccionState?.direccionExportador,
        [Validators.required, Validators.maxLength(200)],
      ],
    });

    this.datosDelImportador = this.fb.group({
      nombreImportador: [
        this.seccionState?.nombreImportador,
        [Validators.required, Validators.maxLength(120), Validators.pattern(REGEX_SIN_CARACTERES_ESPECIALES_KIMBERLEY)],
      ],
      direccionImportador: [
        this.seccionState?.direccionImportador,
        [Validators.required, Validators.maxLength(200), Validators.pattern(REGEX_SIN_CARACTERES_ESPECIALES_KIMBERLEY)],
      ],
    });

    this.datosDeLaRemesa = this.fb.group({
      numeroEnLetraDeLosLotes: [
        this.seccionState?.numeroEnLetraDeLosLotes,
        [Validators.required, Validators.pattern(REGEX_SIN_CARACTERES_ESPECIALES_KIMBERLEY), Validators.maxLength(200)],
      ],
      numeroEnLetraDeLosLotesEnIngles: [
        this.seccionState?.numeroEnLetraDeLosLotesEnIngles,
        [Validators.required, Validators.pattern(REGEX_SIN_CARACTERES_ESPECIALES_KIMBERLEY), Validators.maxLength(250)],
      ],
      numeroDeFactura: [
        this.seccionState?.numeroDeFactura,
        [Validators.required, Validators.maxLength(50)],
      ],
    });

    this.datosDeLosDiamantes = this.fb.group({
      cantidadEnQuilates: [
        this.seccionState?.cantidadEnQuilates,
        [Validators.required, this.maxDigitsValidator(11), Validators.pattern(REGEX_NUMERO_DECIMAL_3_DIGITOS)],
      ],
      valorDeLosDiamantes: [
        this.seccionState?.valorDeLosDiamantes,
        [Validators.required, this.maxDigitsValidator(11), Validators.pattern(REGEX_NUMERO_DECIMAL_3_DIGITOS)],
      ],
    });
  }

  /**
   * @description
   * Actualiza el nombre en inglés basado en el ID del país.
   * @param paisId ID del país seleccionado.
   */
  public updateNombreIngles(paisId: number): void {
    this.paisId = paisId;
    const MATCHING_ITEMS = this.nombresIngles.filter(
      (item) => item.idDelPais === this.paisId
    );
    const NOMBRE = MATCHING_ITEMS.length > 0 ? MATCHING_ITEMS[0].name : '';

    this.formularioEmpresa.get('nombre')?.setValue(NOMBRE);
    this.setValoresStore(this.formularioEmpresa, 'nombre');
  }

  /**
   * @description
   * Actualiza el valor en el store basado en el formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite130203Store.actualizarEstado({ [campo]: VALOR });
    if (campo === 'tipoEmpresa') {
      this.updateNombreIngles(Number(VALOR));
      this.getNombreEmisorKimberley(VALOR);
    }
  }

  /**
   * @description
   * Validador personalizado para limitar la cantidad máxima de dígitos antes del punto decimal.
   * @param maxDigits Número máximo de dígitos permitidos antes del punto decimal.
   * @param paisId 
   */
  getNombreEmisorKimberley(paisId: string): void {
    this.exportacionDeDiamantesEnBrutoService.getPaisesEmisor(paisId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: JSONResponse) => {
        if (response && response.codigo === '00' && response.datos && response.datos[0]) {
          const NOMBRE_EMISOR: string = response.datos[0] as string;
          this.tramite130203Store.actualizarEstado({ nombre: NOMBRE_EMISOR });
        }
      });
  }

  /**
   * @description
   * Verifica si un control del formulario es inválido.
   * @param controlName Nombre del control.
   * @returns `true` si el control es inválido, de lo contrario `false`.
   */
  isInvalid(controlName: string, formGroup: FormGroup = this.formularioEmpresa): boolean {
    const CONTROL = formGroup.get(controlName);
    return CONTROL ? CONTROL.invalid && (CONTROL.dirty || CONTROL.touched) : false;
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.datosDeLaRemesa.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @description
   * Obtiene el nombre del exportador desde el formulario y lo guarda en el store.
   */
  getNombreExportador(): void {
    const NOMBRE_EXPORTADOR =
      this.datosDelExportador.get('nombreExportador')?.value;
    this.tramite130203Store.actualizarEstado(NOMBRE_EXPORTADOR);
  }

  /**
   * @description
   * Obtiene la dirección del exportador desde el formulario y la guarda en el store.
   */
  getDireccionExportador(): void {
    const DIRECCION_EXPORTADOR = this.datosDelExportador.get(
      'direccionExportador'
    )?.value;
    this.tramite130203Store.actualizarEstado(DIRECCION_EXPORTADOR);
  }

  /**
   * @description
   * Obtiene el nombre del importador desde el formulario y lo guarda en el store.
   */
  getNombreImportador(): void {
    const NOMBRE_IMPORTADOR =
      this.datosDelImportador.get('nombreImportador')?.value;
    this.tramite130203Store.actualizarEstado(NOMBRE_IMPORTADOR);
  }

  /**
   * @description
   * Obtiene la dirección del importador desde el formulario y la guarda en el store.
   */
  getDireccionImportador(): void {
    const DIRECCION_IMPORTADOR = this.datosDelImportador.get(
      'direccionImportador'
    )?.value;
    this.tramite130203Store.actualizarEstado(DIRECCION_IMPORTADOR);
  }

  /**
   * @description
   * Obtiene el número en letra de los lotes desde el formulario y lo guarda en el store.
   */
  getNumeroEnLetraDeLosLotes(): void {
    const NUMERO_EN_LETRA_DE_LOS_LOTES = this.datosDeLaRemesa.get(
      'numeroEnLetraDeLosLotes'
    )?.value;
    this.tramite130203Store.actualizarEstado(
      NUMERO_EN_LETRA_DE_LOS_LOTES
    );
  }
  /**
   * @description
   * Obtiene el número en letra de los lotes en inglés desde el formulario y lo guarda en el store.
   */
  getNumeroEnLetraDeLosLotesEnIngles(): void {
    const NUMERO_EN_LETRA_DE_LOS_LOTES_EN_INGLES = this.datosDeLaRemesa.get(
      'numeroEnLetraDeLosLotesEnIngles'
    )?.value;
    this.tramite130203Store.actualizarEstado(
      NUMERO_EN_LETRA_DE_LOS_LOTES_EN_INGLES
    );
  }
  /**
   * @description
   * Obtiene el número de factura desde el formulario y lo guarda en el store.
   */
  getNumeroDeFactura(): void {
    const NUMERO_DE_FACTURA =
      this.datosDeLaRemesa.get('numeroDeFactura')?.value;
    this.tramite130203Store.actualizarEstado(NUMERO_DE_FACTURA);
  }

  /**
   * @description
   * Obtiene la cantidad en quilates desde el formulario y la guarda en el store.
   */
  getCantidadEnQuilates(): void {
    const CANTIDAD_EN_QUILATES =
      this.datosDeLosDiamantes.get('cantidadEnQuilates')?.value;
    this.tramite130203Store.actualizarEstado(CANTIDAD_EN_QUILATES);
  }

  /**
   * @description
   * Obtiene el valor de los diamantes desde el formulario y lo guarda en el store.
   */
  getValorDeLosDiamantes(): void {
    const VALOR_DE_LOS_DIAMANTES = this.datosDeLosDiamantes.get(
      'valorDeLosDiamantes'
    )?.value;
    this.tramite130203Store.actualizarEstado(VALOR_DE_LOS_DIAMANTES);
  }

  /**
   * @description
   * Método para limpiar las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  /*
   * @description
   * Maneja el evento de cambio del checkbox.
   * Habilita o deshabilita el catálogo de país de origen basado en el estado del checkbox.
   * @param event Evento de cambio del checkbox.
   */
  cambioAviso(event: Event): void {
    const CHECKED = (event.target as HTMLInputElement).checked;
    this.disabledCatalogoPaisOrigen = CHECKED;
  }

  /**
  * @method isValid
  * @description Valida un campo del formulario.
  */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * @description
   * Custom validator para contar solo dígitos enteros (excluyendo punto decimal y dígitos decimales).
   * @param maxDigits Número máximo de dígitos enteros permitidos.
   */
  private maxDigitsValidator(maxDigits: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Obtener solo la parte entera (antes del punto decimal)
      const VALUE_STRING = String(control.value);
      const INTEGER_PART = VALUE_STRING.includes('.') ?
        VALUE_STRING.split('.')[0] : VALUE_STRING;

      // Contar solo los dígitos de la parte entera
      const INTEGER_DIGITS = INTEGER_PART.replace(REGEX_SIN_DIGITOS, '');

      if (INTEGER_DIGITS.length > maxDigits) {
        return { maxDigits: { actualLength: INTEGER_DIGITS.length, maxLength: maxDigits } };
      }

      return null;
    };
  }

  /**
   * @description
   * Método para filtrar caracteres no numéricos del input.
   * Solo permite números y puntos decimales.
   * @param event Evento del input.
   */
  onNumericKeyUp(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const VALUE = INPUT.value;
    const FIELD_ID = INPUT.id; // Obtener el ID del campo (valorDeLosDiamantes o cantidadEnQuilates)

    // Filtrar solo números y puntos decimales
    const FILTERED_VALUE = String(VALUE).replace(REGEX_REMOVE_NON_NUMERIC_WITH_DECIMAL, '');

    // Solo actualizar si el valor cambió después del filtro
    if (VALUE !== FILTERED_VALUE) {
      INPUT.value = FILTERED_VALUE;

      // Actualizar el valor en el formulario y forzar la validación
      const CONTROL = this.datosDeLosDiamantes.get(FIELD_ID);
      CONTROL?.setValue(FILTERED_VALUE);
      CONTROL?.updateValueAndValidity();

      this.setValoresStore(this.datosDeLosDiamantes, FIELD_ID);
    }
  }

  /**
   * @description
   * Método para prevenir la entrada de caracteres no numéricos.
   * Solo permite números y punto decimal.
   * @param event Evento del teclado.
   */
  onKeyPress(event: KeyboardEvent): boolean {
    const CHAR_CODE = event.which ? event.which : event.keyCode;

    // Permitir solo números (0-9) y punto decimal (.)
    if ((CHAR_CODE >= 48 && CHAR_CODE <= 57) || CHAR_CODE === 46) {
      const INPUT = event.target as HTMLInputElement;
      const CURRENT_VALUE = INPUT.value;

      // Permitir solo un punto decimal
      if (CHAR_CODE === 46 && CURRENT_VALUE.includes('.')) {
        event.preventDefault();
        return false;
      }
      return true;
    }

    // Bloquear alphabets y special characters
    event.preventDefault();
    return false;
  }

  guardar(): void {
    if (!this.validarFormularios()) {
      return;
    }
     this.tramite130203Store.actualizarEstado({
      especifique: this.formularioEmpresa.get('especifique')?.value,
      numero: this.formularioEmpresa.get('numero')?.value,
      tipoEmpresa: this.formularioEmpresa.get('tipoEmpresa')?.value,
      nombre: this.formularioEmpresa.get('nombre')?.value,
      lineaCheckbox: this.formularioEmpresa.get('lineaCheckbox')?.value,
      paisOrigen: this.formularioEmpresa.get('paisOrigen')?.value,
      nombreExportador: this.datosDelExportador.get('nombreExportador')?.value,
      direccionExportador: this.datosDelExportador.get('direccionExportador')?.value,
      nombreImportador: this.datosDelImportador.get('nombreImportador')?.value,
      direccionImportador: this.datosDelImportador.get('direccionImportador')?.value,
      numeroEnLetraDeLosLotes: this.datosDeLaRemesa.get('numeroEnLetraDeLosLotes')?.value,
      numeroEnLetraDeLosLotesEnIngles: this.datosDeLaRemesa.get('numeroEnLetraDeLosLotesEnIngles')?.value,
      numeroDeFactura: this.datosDeLaRemesa.get('numeroDeFactura')?.value,
      cantidadEnQuilates: this.datosDeLosDiamantes.get('cantidadEnQuilates')?.value,
      valorDeLosDiamantes: this.datosDeLosDiamantes.get('valorDeLosDiamantes')?.value
    });
    this.emitGuardarBtn.emit(true);
  }

  /**
   * Valida todos los formularios y muestra los errores si existen.
   * @returns {boolean} true si todos los formularios son válidos, false si hay errores.
   */
  validarFormularios(): boolean {
    let isValid = true;
    // this.formularioEmpresa.markAllAsTouched();
    // this.datosDelExportador.markAllAsTouched();
    // this.datosDelImportador.markAllAsTouched();
    // this.datosDeLaRemesa.markAllAsTouched();
    // this.datosDeLosDiamantes.markAllAsTouched();

    // Empresa
    if (this.formularioEmpresa.invalid) {
      this.formularioEmpresa.markAllAsTouched();
      this.mostrarErroresEmpresa = true;
      isValid = false;
    }
    // Exportador
    if (this.datosDelExportador.invalid) {
      this.datosDelExportador.markAllAsTouched();
      this.mostrarErroresExportador = true;
      isValid = false;
    }
    // Importador
    if (this.datosDelImportador.invalid) {
      this.datosDelImportador.markAllAsTouched();
      this.mostrarErroresImportador = true;
      isValid = false;
    }
    // Remesa
    if (this.datosDeLaRemesa.invalid) {
      this.datosDeLaRemesa.markAllAsTouched();
      this.mostrarErroresRemesa = true;
      isValid = false;
    }
    // Diamantes
    if (this.datosDeLosDiamantes.invalid) {
      this.datosDeLosDiamantes.markAllAsTouched();
      this.mostrarErroresDiamantes = true;
      isValid = false;
    }
    return isValid;
  }

  // // Reset error flags only when the user corrects the field
  // public onFieldValueChange(formGroup: FormGroup, errorFlag: 'mostrarErroresEmpresa' | 'mostrarErroresExportador' | 'mostrarErroresImportador' | 'mostrarErroresRemesa' | 'mostrarErroresDiamantes'): void {
  //   if (formGroup.valid) {
  //     this[errorFlag] = false;
  //   }
  // }
}

