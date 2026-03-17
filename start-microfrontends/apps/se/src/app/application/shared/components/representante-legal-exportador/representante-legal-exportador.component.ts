/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Catalogo,
  CatalogoSelectComponent,
  REGEX_SOLO_NUMEROS,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PAIS_CATALOGO, REPRESENTATE_LEGAL_EXPORTADOR_CONFIG } from '../../constantes/representate-legal-exportador-config.enum';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FieldConfig } from '../../models/representate-legal-exportador.model';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ValidarInicialmenteCertificadoService } from '../../../tramites/110221/services/validar-inicialmente-certificado.service';

/**
 * @descripcion
 * El componente `RepresentanteLegalExportadorComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el representante legal del exportador en el formulario.
 */
@Component({
  selector: 'app-representante-legal-exportador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    CatalogoSelectComponent,
    TituloComponent
  ],
  templateUrl: './representante-legal-exportador.component.html',
  styleUrl: './representante-legal-exportador.component.scss',
})

/**
 * @Component
 * @description
 * Componente para gestionar el formulario del representante legal del exportador,
 * incluyendo modo solo lectura, y guarda los valores ingresados en el store.
 */
export class RepresentanteLegalExportadorComponent
  implements OnDestroy, OnInit, OnChanges
{
  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Evento para indicar si el formulario es válido */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /**
   * @property procedimiento
   * @description Identificador del procedimiento actual.
   * Este valor es requerido y se utiliza para determinar la configuración del formulario.
   * @type {string}
   */
  @Input() procedimiento!: string;

  /**
   * @property form
   * @description FormGroup que contiene los controles del formulario.
   * Se inicializa en el método ngOnInit.
   * @type {FormGroup}
   */
  @Input()
  form!: FormGroup;

  /**
   * @property campos
   * @description Arreglo de configuraciones de campos para el formulario.
   * Se carga en el método ngOnInit basado en el procedimiento.
   * @type {FieldConfig[]}
   */
  campos: FieldConfig[] = [];

  /**
   * @property paisDestinoCatalog
   * @description Catálogo de países de destino para el campo correspondiente.
   * Se obtiene desde el servicio ValidarInicialmenteCertificadoService.
   * @type {Catalogo[]}
   */
  paisDestinoCatalog!: Catalogo[];

  /**
   * Datos del formulario para inicializar los valores
   * @type {Record<string, any>}
   */
  @Input() datosForm: Record<string, any> = {};

  /**
   * Evento que se emite cuando cambian los datos del formulario del destinatario
   * @type {EventEmitter<undefined>}
   */
  @Output() formDatosDelDestinatarioEvent: EventEmitter<{
    formGroupName: string;
    campo: string;
    VALOR: undefined;
    METODO_NOMBRE: string;
  }> = new EventEmitter<{
    formGroupName: string;
    campo: string;
    VALOR: undefined;
    METODO_NOMBRE: string;
  }>();

  /**
   * Subject para manejar la destrucción de suscripciones
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {ValidarInicialmenteCertificadoService} ValidarInicialmenteCertificadoService - Servicio para obtener datos relacionados con el certificado.
   */
  constructor(
    private fb: FormBuilder,
     private validacionesService: ValidacionesFormularioService,
    private ValidarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService
  ) {}

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Configura el formulario y obtiene los catálogos necesarios.
   * @returns {void}
   */
  ngOnInit(): void {
    this.campos =
      REPRESENTATE_LEGAL_EXPORTADOR_CONFIG[this.procedimiento] || [];

    this.form = this.fb.group({});
    this.crearFormulario();

    if (PAIS_CATALOGO.includes(this.procedimiento)) {
      this.obtenerPaisDestinoCatalogo();
    }
  }

    /**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

   /** Método público para marcar todos los campos como tocados y mostrar errores */
  public markAllFieldsTouched(): boolean {
       if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }


  /**
   * @descripcion
   * Crea los controles del formulario basados en la configuración de campos.
   * Si el formulario ya existe, no hace nada.
   * @returns {void}
   */
  crearFormulario(): void {
    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.campos.forEach((campo) => {
      if (!this.form.contains(campo.nombre)) {
        const VALOR_INICIAL = this.datosForm?.[campo.nombre] ?? '';
        const VALIDATORS = [];
        if (campo.required) {
          VALIDATORS.push(Validators.required);
        }
        if (campo.maxlength) {
          VALIDATORS.push(Validators.maxLength(Number(campo.maxlength)));
        } else {
          if (campo.nombre === 'lugar' || campo.nombre === 'exportador') {
            VALIDATORS.push(Validators.maxLength(70));
          }
          if (campo.nombre === 'exportador') {
            VALIDATORS.push(Validators.maxLength(250));
          }
          if (campo.nombre === 'empresa') {
            VALIDATORS.push(Validators.maxLength(90));
          }
           if (campo.nombre === 'cargo') {
            VALIDATORS.push(Validators.maxLength(30));
          }
            if (campo.nombre === 'registroFiscal') {
            VALIDATORS.push(Validators.maxLength(13));
          }
          if (campo.nombre === 'correo' || campo.nombre === 'correoElectronico') {
            VALIDATORS.push(Validators.maxLength(320));
          }
          if (campo.nombre === 'telefono') {
            VALIDATORS.push(Validators.maxLength(20));
          }
        }
        if (campo.nombre === 'correo' || campo.nombre === 'correoElectronico') {
          VALIDATORS.push(Validators.email);
        }
        if (campo.nombre === 'telefono' || campo.nombre === 'fax' || campo.nombre === 'lada') {
          VALIDATORS.push(Validators.pattern(REGEX_SOLO_NUMEROS));
        }
        this.form.addControl(
          campo.nombre,
          this.fb.control(
            VALOR_INICIAL,
            VALIDATORS
          )
        );
      }
    });

    /**
     * Utiliza queueMicrotask para actualizar la validez del formulario y sincronizar el estado en el store.
     *
     * Esta llamada asegura que la validación y el estado del formulario se actualicen correctamente
     * después de la inicialización, evitando problemas de sincronización en el ciclo de vida de Angular.
     * Se actualiza la validez del formulario sin emitir eventos y se registra el estado de validez en el store.
     */
    queueMicrotask(() => {
      this.form.updateValueAndValidity({ emitEvent: false });
      this.formaValida.emit(this.form.valid);
    });

    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.validarFormularios();
      });
    }
  }
  
  /**
   * @descripcion
   * Hook del ciclo de vida que se llama cuando cambian las propiedades de entrada del componente.
   * @param {SimpleChanges} changes - Cambios en las propiedades de entrada.
   * @returns {void}
   */
ngOnChanges(changes: SimpleChanges): void {
  if (changes['datosForm'] && this.form) {
   this.form.patchValue(this.datosForm);
  }
}
  /**
   * @descripcion
   * Obtiene el catálogo de países de destino desde el servicio.
   * @returns {void}
   */
  obtenerPaisDestinoCatalogo(): void {
    this.ValidarInicialmenteCertificadoService.getPaisDestino()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          this.paisDestinoCatalog = resp.data as Catalogo[];
        }
      });
  }

  /**
   * @descripcion
   * Maneja el cambio en el campo de país de destino.
   * Actualiza el estado del formulario en el store.
   * @returns {void}
   */
  cambioPaisDestino(): void {
    this.setValoresStore('form', 'paisDestino', 'setPaisDestino');
  }

  /**
   * @descripcion
   * Actualiza el estado del store con los datos del formulario.
   * Emite un evento con el campo y valor actualizado.
   * @param formGroupName - Nombre del grupo de formulario.
   * @param campo - Nombre del campo que ha cambiado.
   * @param metodoNombre - Nombre del método en el store para actualizar el valor.
   * @returns {void}
   */
  setValoresStore(
    formGroupName: string,
    campo: string,
    metodoNombre: string
  ): void {
    const VALOR = this.form.get(campo)?.getRawValue();
    this.formaValida.emit(this.form.valid);
    this.formDatosDelDestinatarioEvent.emit({
      formGroupName,
      campo,
      VALOR: VALOR,
      METODO_NOMBRE: metodoNombre,
    });
  }
  /**
   * Valida el formulario y marca los campos como tocados si es inválido
   */
   validarFormularios(): boolean {
     if (this.form.invalid) {
       this.form.markAllAsTouched();
       return false;
     }
     return true;
     
   }
  /**
   * @description
   * Método del ciclo de vida ngOnDestroy. Se utiliza para cancelar las suscripciones y evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}