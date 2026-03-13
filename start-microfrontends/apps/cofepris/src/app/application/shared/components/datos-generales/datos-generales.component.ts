import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CatalogoServices } from '@ng-mf/data-access-user';
import TipoPersonaBtn from '@libs/shared/theme/assets/json/260402/tipoPersonaBtn.json';

import { DATOS_GENERALES_TRAMITES_COFEPRIS } from '../../constantes/datos-generales.enum';
import { TercerosProcedenciaService } from '../../services/terceros-procedencia.service';
import { TipoMoModel } from '../../models/permiso-importacion-biologica.models';
@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss',
})
export class DatosGeneralesComponent implements OnInit, OnDestroy {
  @Input() selectedRowData: string[] = [];
  /**
   * @private
   * @description Sujeto utilizado para manejar la desuscripción de observables y evitar fugas de memoria.
   * Se emite un valor `void` cuando el componente se destruye.
   */
  private unsubscribe$ = new Subject<void>();
  /**
   * Evento que emite los datos del formulario cuando este es válido.
   */
  @Output() formularioGuardar = new EventEmitter<TipoMoModel>();
  /**
   * Evento que emite cuando se cancela la sección de datos generales.
   */
  @Output() cancelDatosGenerales = new EventEmitter<void>();
  /**
   * Variable que contiene los datos del botón de tipo de persona.
   */
  radioBtn = TipoPersonaBtn;
  /**
   * Formulario reactivo que contiene los datos generales.
   */
  datosGeneralesForm!: FormGroup;

  pais: Catalogo[] = [];

  /** Sujeto que notifica la destrucción del componente,  
 *  usado para completar suscripciones y evitar fugas de memoria. */
  private destroyNotifier$ = new Subject<void>();

  /** Propiedad que recibe desde el componente padre el código del trámite,  
 *  utilizado para controlar la lógica y los datos que se muestran. */
  @Input() tramites!: string;

  private procedures = DATOS_GENERALES_TRAMITES_COFEPRIS;

  constructor(private tercerosProcedenciaService: TercerosProcedenciaService,private catalogoService: CatalogoServices) {}
  /**
   * @comdoc
   * Cierra el componente de datos generales.
   * Emite un evento para notificar que se ha cancelado la operación de datos generales.
   */
  closeDatosGenerales(): void {
    this.cancelDatosGenerales.emit();
  }

  /**
   * @override
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a la función `informacionProcedencia` para cargar la información inicial necesaria.
   */
  ngOnInit(): void {
    this.informacionProcedencia();
    this.obtenerPaises$()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(response => {
      this.pais = response?.datos ?? [];
      if (this.selectedRowData.length > 0) {
        const [LADA, TELEFONO] = this.selectedRowData[3].split('-');
        this.datosGeneralesForm.patchValue({
          nombre: this.selectedRowData[0],
          primerApellido: this.selectedRowData[0],
          segundoApellido: this.selectedRowData[0],
          correoElectronico: this.selectedRowData[4],
          calle: this.selectedRowData[5],
          numeroExterior: this.selectedRowData[6],
          numeroInterior: this.selectedRowData[7],
          estado: this.selectedRowData[13],
          codigoPostal: this.selectedRowData[14],
          lada: LADA,
          telefono: TELEFONO,
          pais: DatosGeneralesComponent.obtenerClave(this.pais, this.selectedRowData[8]),
        }); 
      }
    });
  }

  obtenerPaises$() {
    return this.catalogoService.paisesCatalogo(this.tramites);
  }

  /**
   * @method informacionProcedencia
   * @description Configura y crea un formulario reactivo para capturar información de procedencia.
   * Este formulario incluye campos como tipo de persona, razón social, dirección, contacto,
   * y otros datos personales necesarios.
   *
   * @returns {void} No retorna ningún valor.
   */
  informacionProcedencia(): void {
    this.datosGeneralesForm = new FormGroup({
      tipoPersona: new FormControl('', Validators.required),
      razonSocial: new FormControl(''),
      pais: new FormControl('', Validators.required),
      estado: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]),
      codigoPostal: new FormControl('', [Validators.pattern(/^\d{5}$/)]),
      calle: new FormControl('', Validators.required),
      numeroExterior: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      numeroInterior: new FormControl('', [Validators.pattern(/^\d*$/)]),
      lada: new FormControl('', [Validators.pattern(/^\d{1,5}$/)]),
      telefono: new FormControl('', [Validators.pattern(/^\d{10}$/)]),
      correoElectronico: new FormControl('', this.procedures.includes(Number(this.tramites)) ? [Validators.email] : [Validators.required, Validators.email]),
      nombre: new FormControl(''),
      primerApellido: new FormControl(''),
      segundoApellido: new FormControl(''),
    });
  }

  /** Determina si el correo electrónico es opcional según si el trámite actual está incluido en la lista de procedimientos. */
  get isCorreoOptional(): boolean {
    return this.procedures.includes(Number(this.tramites));
  }

  /** Determina si el correo electrónico es opcional según si el trámite actual está incluido en la lista de procedimientos. */
  get titulo(): string {
    if (this.procedures.includes(Number(this.tramites))) {
      return 'Agregar destinatario (destino final)';
    }
    return 'Agregar información de procedencia'; 
  }


  /**
   * @method enviarFormulario
   * @description Envía el formulario si es válido. Si el formulario `datosGeneralesForm` pasa la validación,
   * emite los valores del formulario a través del evento `formularioGuardar`. Si no es válido,
   * marca todos los campos como tocados para mostrar los mensajes de error.
   *
   * @returns {void} No retorna ningún valor.
   */
  enviarFormulario(): void {
    if (this.datosGeneralesForm.valid) {
      const DATOS = {
        ...this.datosGeneralesForm.value,
        pais: DatosGeneralesComponent.obtenerDescripcion(this.pais, this.datosGeneralesForm.get('pais')?.value),
      };
      this.formularioGuardar.emit(DATOS);
      this.closeDatosGenerales();
    } else {
      this.datosGeneralesForm.markAllAsTouched();
  }
  }

  /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], clave: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => ele.clave === clave)?.descripcion; 
    return DESCRIPCION ?? '';
  }

  /**
 * @method obtenerClave
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerClave(array: Catalogo[], desc: string): string {
    const CLAVE = array.find((ele: Catalogo) => ele.descripcion === desc)?.clave; 
    return CLAVE ?? '';
  }

  /**
   * @method onChangeTipoPersona
   * @description Maneja el cambio en el tipo de persona seleccionado en el formulario.
   * Actualiza las validaciones de los campos del formulario según el tipo de persona seleccionado.
   * @param formGroup El grupo de formulario que contiene los controles a actualizar.
   */
  onChangeTipoPersona(formGroup: FormGroup): void {
    if(formGroup.get('tipoPersona')?.value === 'Moral') {
      formGroup.get('razonSocial')?.setValidators([Validators.required]);
      formGroup.get('nombre')?.clearValidators();
      formGroup.get('primerApellido')?.clearValidators();
      formGroup.get('segundoApellido')?.clearValidators();
      formGroup.get('razonSocial')?.updateValueAndValidity();
      formGroup.get('nombre')?.updateValueAndValidity();
      formGroup.get('primerApellido')?.updateValueAndValidity();
      formGroup.get('segundoApellido')?.updateValueAndValidity();
    } else if(formGroup.get('tipoPersona')?.value === 'Física') {
      formGroup.get('razonSocial')?.clearValidators();
      formGroup.get('nombre')?.setValidators([Validators.required,Validators.pattern(/^[a-zA-Z\s]+$/)]);
      formGroup.get('primerApellido')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]);
      formGroup.get('razonSocial')?.updateValueAndValidity();
      formGroup.get('nombre')?.updateValueAndValidity();
      formGroup.get('primerApellido')?.updateValueAndValidity();
      
      if (!this.procedures.includes(Number(this.tramites))) {
        formGroup.get('segundoApellido')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]);
        formGroup.get('segundoApellido')?.updateValueAndValidity();
      }
    }
  }

  /**
   * @method onLimpiarClick
   * @description Maneja el evento del botón "Limpiar". Limpia todos los datos del formulario.
   */
  onLimpiarClick(): void {
    
    this.datosGeneralesForm.reset();
    this.datosGeneralesForm.patchValue({
      tipoPersona: '',
      razonSocial: '',
      pais: '',
      estado: '',
      codigoPostal: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      lada: '',
      telefono: '',
      correoElectronico: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: ''
    });
  }

/** Obtiene el catálogo de países según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `pais`. */
 obtenerPaises(): void {
  this.catalogoService.paisesCatalogo(this.tramites)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: async (response) => {
        this.pais = await response?.datos ?? []
    }
  });
}

  /**
   * @inheritdoc
   * @description Este método se ejecuta automáticamente cuando el componente se destruye.
   * Se utiliza para completar y limpiar cualquier suscripción activa, evitando fugas de memoria.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
