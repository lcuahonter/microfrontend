import {
  AGREGARPROVEEDORFORM,
  CAMPO_OBLIGATORIO_PROVEEDOR,
  TIPO_PERSONA_OPCIONES,
} from '../../constants/datos-solicitud.enum';

import {
  Catalogo,
  CategoriaMensaje,
  ConsultaioQuery,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TipoPersona,
  TituloComponent,
} from '@ng-mf/data-access-user';

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
  DestinoFinal,
  Proveedor,
} from '../../models/terceros-relacionados.model';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GuardarProveedorPayload } from '../../models/guardar-payload.model';

/**
 * @component AgregarProveedorComponent
 * @description
 * Componente responsable de capturar y validar la información
 * de proveedores asociados a un trámite.
 */
@Component({
  selector: 'app-agregar-proveedor',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    TooltipModule,
    NotificacionesComponent,
  ],
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.scss',
})
export class AgregarProveedorComponent implements OnInit, OnDestroy {

  /**
   * Notificación actual del sistema
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Enum de tipos de persona
   */
  public tipoPersona = TipoPersona;

  /**
   * Subject para finalizar suscripciones
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Lista de proveedores existentes
   */
  @Input() proveedores: Proveedor[] = [];

  /**
   * Formulario reactivo del proveedor
   */
  agregarProveedorForm!: FormGroup;

  /**
   * Catálogo de países
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Identificador del procedimiento
   */
  @Input() idProcedimiento!: number;

  /**
   * Indica si el formulario es solo lectura
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Emite la lista actualizada de proveedores
   */
  @Output() updateProveedorTablaDatos = new EventEmitter<Proveedor[]>();

  /**
   * Evento de cancelación (boolean)
   */
  @Output() cancelarEventListener = new EventEmitter<boolean>();

  /**
   * Evento de cancelación (void)
   */
  @Output() cancelarEventListenerCancel = new EventEmitter<void>();

  /**
   * Datos recibidos para edición
   */
  @Input() formaDatos!: DestinoFinal | Proveedor | null | undefined;

  /**
   * Opciones del radio de tipo de persona
   */
  tipoPersonaRadioOpciones = TIPO_PERSONA_OPCIONES;

  /**
   * Indica si ciertos campos son obligatorios
   */
  public campoObligatorio = false;

  /**
   * @constructor
   * Inicializa el componente y escucha cambios del estado del trámite
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: { readonly: boolean }) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormaulario();
    }
  }

  /**
   * Configura el formulario en modo lectura o edición
   */
  guardarDatosFormulario(): void {
    this.crearFormaulario();
    if (this.esFormularioSoloLectura) {
      this.agregarProveedorForm.disable();
    } else {
      this.agregarProveedorForm.enable();
    }
  }

  /**
   * Crea el formulario reactivo y sus validaciones
   */
  crearFormaulario(): void {
    this.agregarProveedorForm = this.fb.group({
      tipoPersona: ['', Validators.required],
      denominacionRazon: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(254),
      ]],
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', Validators.maxLength(200)],
      pais: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(120)]],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      colonia: ['', Validators.required],
      calle: ['', [Validators.required, Validators.maxLength(300)]],
      numeroExterior: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInterior: ['', [Validators.required, Validators.maxLength(55)]],
      lada: ['', [Validators.required, Validators.maxLength(5)]],
      telefono: ['', [Validators.required, Validators.maxLength(24)]],
      correoElectronico: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
      ]],
    });
    this.agregarProveedorForm.disable();
    this.agregarProveedorForm.get('tipoPersona')?.enable();
  }

  /**
   * Hook de inicialización
   */
  ngOnInit(): void {
    this.crearFormaulario();
    this.campoObligatorio = CAMPO_OBLIGATORIO_PROVEEDOR.includes(
      this.idProcedimiento
    );

    this.campoObligatorioChange();

    if (AGREGARPROVEEDORFORM.includes(this.idProcedimiento)) {
      this.agregarProveedorForm.enable();
    } else {
      this.agregarProveedorForm.disable();
      this.agregarProveedorForm.get('tipoPersona')?.enable();
    }

    this.cargarDatos();

    if (this.formaDatos?.tipoPersona) {
      this.agregarProveedorForm.patchValue(this.formaDatos);
      this.agregarProveedorForm.enable();
      this.actualizarValidacionesPorTipoPersona(this.formaDatos.tipoPersona);
    }
  }

  /**
   * Actualiza validaciones según campos obligatorios
   */
  campoObligatorioChange(): void {
    const NOMBRES = this.agregarProveedorForm.get('nombres');
    const PRIMERAPELLIDO = this.agregarProveedorForm.get('primerApellido');
    const ESTADO = this.agregarProveedorForm.get('estado');
    const CODIGOPOSTAL = this.agregarProveedorForm.get('codigoPostal');
    const CALLE = this.agregarProveedorForm.get('calle');
    const COLONIA = this.agregarProveedorForm.get('colonia');
    const NUMEROEXTERIOR = this.agregarProveedorForm.get('numeroExterior');

    if (this.campoObligatorio) {
      NOMBRES?.setValidators([Validators.required]);
      PRIMERAPELLIDO?.setValidators([Validators.required]);
      ESTADO?.setValidators([Validators.required]);
      CODIGOPOSTAL?.setValidators([Validators.required]);
      CALLE?.setValidators([Validators.required]);
      NUMEROEXTERIOR?.setValidators([Validators.required]);
      COLONIA?.clearValidators();
    } else {
      NOMBRES?.clearValidators();
      PRIMERAPELLIDO?.clearValidators();
      ESTADO?.clearValidators();
      CODIGOPOSTAL?.clearValidators();
      CALLE?.clearValidators();
      NUMEROEXTERIOR?.clearValidators();
    }

    [
      NOMBRES,
      PRIMERAPELLIDO,
      ESTADO,
      CODIGOPOSTAL,
      CALLE,
      COLONIA,
      NUMEROEXTERIOR,
    ].forEach(control => control?.updateValueAndValidity());
  }

  /**
   * Obtiene el catálogo de países
   */
  cargarDatos(): void {
    this.datosSolicitudService
      .obtenerListaPaises(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.paisesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion,
        }));
      });
  }

  /**
   * Construye el nombre o razón social
   */
  private obtenerNombreRazonSocial(formValue: Proveedor): string {
    if (formValue.tipoPersona === this.tipoPersona.FISICA) {
      return `${formValue.nombres || ''} ${formValue.primerApellido || ''} ${formValue.segundoApellido || ''}`.trim();
    }

    if (formValue.tipoPersona === this.tipoPersona.MORAL) {
      return this.agregarProveedorForm.get('denominacionRazon')?.value || '';
    }

    return '';
  }

  /**
   * Crea un proveedor desde el formulario
   */
  private crearProveedorDesdeFormulario(): Proveedor {
    const FORM_VALUE = this.agregarProveedorForm.value;

    const EXISTING_INDEX = this.proveedores.findIndex(
      d => d.id === FORM_VALUE.id
    );

     const paisEncontrado = this.paisesDatos.find(
      pais => pais.id === FORM_VALUE.pais
    );

    return {
      id: EXISTING_INDEX !== -1
        ? this.proveedores[EXISTING_INDEX].id
        : this.proveedores.length + 1,
      tipoPersona: FORM_VALUE.tipoPersona?.toUpperCase(),
      nombreRazonSocial: this.obtenerNombreRazonSocial(FORM_VALUE),
      rfc: '',
      curp: '',
      nombres: FORM_VALUE.nombres || '',
      primerApellido: FORM_VALUE.primerApellido || '',
      segundoApellido: FORM_VALUE.segundoApellido || '',
      telefono: `${FORM_VALUE.lada} ${FORM_VALUE.telefono}`.trim(),
      correoElectronico: FORM_VALUE.correoElectronico || '',
      calle: FORM_VALUE.calle || '',
      numeroExterior: FORM_VALUE.numeroExterior || '',
      numeroInterior: FORM_VALUE.numeroInterior || '',
      cve_pais: FORM_VALUE.pais || '',
      pais: paisEncontrado?.descripcion || '',
      colonia: FORM_VALUE.colonia || null,
      municipioAlcaldia: '',
      localidad: FORM_VALUE.localidad || '',
      entidadFederativa: FORM_VALUE.estado || '',
      estado: FORM_VALUE.estado || '',
      estadoLocalidad: FORM_VALUE.estadoLocalidad || '',
      codigoPostal: FORM_VALUE.codigoPostal || '',
      denominacionRazon: FORM_VALUE.denominacionRazon || null
    };
  }

  /**
   * Guarda o actualiza un proveedor
   */
  guardarProveedor(): void {
    const FORM_VALUE = this.agregarProveedorForm.getRawValue();

    if (this.agregarProveedorForm.invalid) {
      this.agregarProveedorForm.markAllAsTouched();
      return;
    }

    const paisEncontrado = this.paisesDatos.find(
      pais => pais.id === FORM_VALUE.pais
    );

    const validationBody: GuardarProveedorPayload = {
      tipo_persona: FORM_VALUE.tipoPersona?.toUpperCase() || '',
      nombre: FORM_VALUE.number,
      primer_apellido: FORM_VALUE.primer_apellido,
      segundo_apellido: FORM_VALUE.segundo_apellido,
      razon_social: null,
      cve_pais: FORM_VALUE.pais,
      pais: paisEncontrado?.descripcion,
      calle: FORM_VALUE.calle,
      numero_exterior: FORM_VALUE.numeroExterior,
      numero_interior: FORM_VALUE.numeroInterior || null,
      lada: FORM_VALUE.lada,
      telefono: FORM_VALUE.telefono,
      correo_electronico: FORM_VALUE.correoElectronico,
      colonia: FORM_VALUE.colonia || null,
      estado: 'Nuevo León ',
      codigo_postal:  FORM_VALUE.codigoPostal,
      cve_estado: FORM_VALUE.estado,
    };

    if (FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
      validationBody.nombre = FORM_VALUE.nombres;
      validationBody.primer_apellido = FORM_VALUE.primerApellido;
      validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
    }

    if (FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
      validationBody.razon_social = FORM_VALUE.denominacionRazon;
    }

    this.datosSolicitudService
      .validarProveedor(validationBody, this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (res) => {
          if (res.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: res.error || 'Error al generar la cadena original.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            return;
          }

          const NUEVO_PROVEEDOR = this.crearProveedorDesdeFormulario();

          if (!FORM_VALUE.id) {
            FORM_VALUE.id = this.proveedores.length > 0
              ? Math.max(...this.proveedores.map(p => Number(p.id))) + 1
              : 1;

            NUEVO_PROVEEDOR.id = FORM_VALUE.id;
          }

          const EXISTING_INDEX = this.proveedores.findIndex(
            p => p.id === FORM_VALUE.id
          );

          if (EXISTING_INDEX !== -1) {
            this.proveedores[EXISTING_INDEX] = NUEVO_PROVEEDOR;
          } else {
            this.proveedores = [...this.proveedores, NUEVO_PROVEEDOR];
          }

          this.updateProveedorTablaDatos.emit(this.proveedores);
          this.formaDatos = null;
          this.agregarProveedorForm.reset();
        },
        error: (err) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: err?.error?.error || 'Error inesperado al iniciar trámite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario(): void {
    this.agregarProveedorForm.reset();
    this.agregarProveedorForm.disable();
    this.agregarProveedorForm.get('tipoPersona')?.enable();
  }

  /**
   * Cancela la acción
   */
  cancelar(): void {
    this.formaDatos = null;
    this.cancelarEventListenerCancel.emit();
    this.cancelarEventListener.emit(true);
  }

  /**
   * Maneja cambio de tipo de persona
   */
  tipoPersonaCambioDeValor(event: string | number): void {
    this.agregarProveedorForm.enable();
    this.agregarProveedorForm.patchValue({ tipoPersona: event });
    this.actualizarValidacionesPorTipoPersona(event);
  }

  /**
   * Actualiza validaciones según tipo de persona
   */
  actualizarValidacionesPorTipoPersona(tipoPersona: string | number): void {
    const FORM = this.agregarProveedorForm;

    if (tipoPersona === TipoPersona.FISICA) {
      FORM.get('denominacionRazon')?.clearValidators();
      FORM.get('nombres')?.setValidators([Validators.required, Validators.maxLength(200)]);
      FORM.get('primerApellido')?.setValidators([Validators.required, Validators.maxLength(200)]);
      FORM.get('segundoApellido')?.setValidators([Validators.maxLength(200)]);
    }

    if (tipoPersona === TipoPersona.MORAL) {
      FORM.get('nombres')?.clearValidators();
      FORM.get('primerApellido')?.clearValidators();
      FORM.get('segundoApellido')?.clearValidators();
      FORM.get('denominacionRazon')?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(254),
      ]);
    }

    ['denominacionRazon', 'nombres', 'primerApellido', 'segundoApellido']
      .forEach(campo => FORM.get(campo)?.updateValueAndValidity());
  }

  /**
   * Hook de destrucción
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
