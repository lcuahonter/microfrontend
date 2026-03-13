import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  CAMPO_OBLIGATORIO_DESTINATARIO,
  MOSTRAR_ASTERISCO,
  MOSTRAR_INFORMACION,
  NUMERO_TRAMITE,
  PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE,
  PROVEEDOR_TITULO_CUSTOM,
  TERCEROS_NACIONALIDAD_OPCIONES,
  TERCEROS_NACIONALIDAD_OPCIONES_EXTRANJERO,
  TIPO_PERSONA_OPCIONES,
  TIPO_PERSONA_OPCIONES_NO_CONTRIBUYENTE,
} from '../../constants/datos-solicitud.enum';
import { Catalogo, CatalogoSelectComponent, CategoriaMensaje, InputRadioComponent, Notificacion, NotificacionesComponent, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule, Location } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../models/terceros-relacionados.model';
import { ES_CURP, ES_NACIONAL, ES_RFC } from '../../constants/datos-del-tramilte.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { GuardarProveedorPayloadCustom } from '../../models/guardar-payload.model';

/**
 * @component AgregarProveedorComponent
 * @description Componente responsable de manejar el formulario para agregar proveedores.
 * Se encarga de obtener datos del catálogo (países), gestionar el formulario reactivo y
 * actualizar el estado del trámite con la información del proveedor capturado.
 */
@Component({
  selector: 'app-agregar-proveedor-custom',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './agregar-proveedor-custom.component.html',
  styleUrl: './agregar-proveedor-custom.component.scss',
})
export class AgregarProveedorCustomComponent
  implements OnDestroy, OnInit, OnChanges, AfterViewInit {

  /**
* @property idProcedimiento
* @description Identificador del procedimiento asociado a este componente.
* @type {number}
*/
  @Input() idProcedimiento!: number;

  /**
* Indica si el formulario debe mostrarse solo en modo de lectura.
*
* @type {boolean}
* @default false
* @see https://compodoc.app/
*
* @description
* Si es `true`, el formulario se mostrará en modo solo lectura y no permitirá modificaciones.
* Si es `false`, el formulario será editable.
*/
  @Input() esFormularioSoloLectura: boolean = false;

  /**
 * Datos del formulario que pueden ser de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
 * Este input se utiliza para recibir la información necesaria desde el componente padre.
 *
 * @type {Proveedor | DestinoFinal | null | undefined}
 */
  @Input() formaDatos!: Proveedor | DestinoFinal | null | undefined;

  /**
  * Lista de proveedores existentes
  */
  @Input() proveedores: Proveedor[] = [];

  /**
  * @property proveedorTablaDatos
  * @description Datos de la tabla de proveedores.
  * Se utiliza para mostrar la información de los proveedores en el componente.
  * @type {Proveedor[]}
  */
  @Input() proveedorTablaDatos: Proveedor[] = [];

  /**
   * @property updateProveedorTablaDatos
   * @description Evento que emite una lista actualizada de objetos `Proveedor` hacia el componente padre.
   * Se utiliza para sincronizar los datos de la tabla o disparar acciones relacionadas.
   * @type {EventEmitter<Proveedor[]>}
   */
  @Output() updateProveedorTablaDatos = new EventEmitter<Proveedor[]>();

  /**
   * @property actualizaExistenteEnProveedorDatos
   * @description Evento que emite una lista de objetos `Proveedor` hacia el componente padre.
   * Se utiliza para actualizar un proveedor existente en la tabla.
   * @type {EventEmitter<Proveedor[]>}
   */
  @Output() actualizaExistenteEnProveedorDatos = new EventEmitter<Proveedor[]>();

  /**
   * Evento que se emite cuando el usuario desea cancelar una acción.
   * @property {EventEmitter<boolean>} cancelarEventListener
   */
  @Output() cancelarEventListener = new EventEmitter<boolean>();

  /**
   * @property {Subject<void>} unsubscribe$
   * Subject para cancelar suscripciones activas y evitar fugas de memoria.
   * Se completa en el hook `ngOnDestroy`.
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Notificación actual del sistema.
   * Puede contener información de éxito, advertencia o error que se
   * mostrará al usuario; en caso contrario, será null.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;

  /**
   * @property {FormGroup} agregarProveedorForm
   * Formulario reactivo utilizado para capturar los datos del proveedor.
   */
  agregarProveedorForm!: FormGroup;

  /**
   * @property {Catalogo[]} paisesDatos
   * Lista de países obtenida del servicio de datos.
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * @property isProveedorModificar
   * @description Indica si el proveedor está en modo de modificación.
   * Se utiliza para determinar si se debe mostrar el título de modificación o creación.
   * @type {boolean}
   */
  isProveedorModificar: boolean = false;

  /**
   * @property titluoMensaje
   * @description Título del mensaje que se muestra en el formulario.
   * Se utiliza para indicar si se está creando o modificando un proveedor.
   * @type {string}
   */
  titluoMensaje: string = 'Agregar Proveedor';

  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOpciones = TIPO_PERSONA_OPCIONES;

  /**
   * @description Opciones de tipo de persona para radio buttons, específicas para no contribuyentes.
   * @command Opciones utilizadas para determinar el tipo de persona en el formulario de proveedor.
   */
  tipoPersonaRadioOpcionesNoContribuyente = TIPO_PERSONA_OPCIONES_NO_CONTRIBUYENTE;

  /**
   * @property mostrarCamposNoContribuyente
   * @description Controla la visibilidad de los campos específicos para no contribuyentes.
   * @type {boolean}
   * @default false
   */
  public mostrarCamposNoContribuyente: boolean = false;

  /*
   * Opciones de nacionalidad para el formulario.
   */
  tercerosNacionalidadOpciones = TERCEROS_NACIONALIDAD_OPCIONES;

  /**
   * Datos de catálogo de estados.
   * @property {Catalogo[]} estadosDatos
   */
  public estadosDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de municipios.
   * @property {Catalogo[]} municipiosDatos
   */
  public municipiosDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de localidades.
   * @property {Catalogo[]} localidadesDatos
   */
  public localidadesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de colonias.
   * @property {Catalogo[]} coloniasDatos
   */
  public coloniasDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de códigos postales.
   * @property {Catalogo[]} codigosPostalesDatos
   */
  public codigosPostalesDatos: Catalogo[] = [];

  /**
   * @property esCURP
   * @description Controla la visibilidad de los campos específicoS C.U.R.P.
   * @type {boolean}
   * @default false
   */
  public esCURP = false;

  /**
   * @property esNacional
   * @description Controla la visibilidad de los campos específicoS C.U.R.P.
   * @type {boolean}
   * @default false
   */
  public esNacional = false;

  /**
   * @property {boolean} esRFC
   * @description Indica si el valor actual corresponde a un RFC (Registro Federal de Contribuyentes).
   * @default false
   */
  public esRFC = false;

  /**
   * @property campoObligatorioProveedor
   * @description Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   * @type {boolean}
   * @default true
   */
  public campoObligatorioProveedor = false;

  /**
   * @property mostrarAsterisco
   * @description Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   * @type {boolean}
   * @default true
   */
  public mostrarAsterisco = false;

  /**
   * @property MOSTRAR_INFORMACION
   * @description Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   * @type {boolean}
   * @default true
   */
  public mostrarInformacion = false;

  /**
   * @constructor
   * Inicializa el formulario y los servicios necesarios para el componente.
   *
   * @param fb - FormBuilder para construir el formulario reactivo.
   * @param datosSolicitudService - Servicio para obtener datos del backend.
   * @param tramiteStore - Store que administra el estado del trámite actual.
   * @param tramiteQuery - Servicio para consultar el estado del trámite.
   * @param ubicaccion - Servicio de Angular para navegación de retroceso.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private ubicaccion: Location // eslint-disable-next-line no-empty-function
  ) { }

  /**
   * @method ngOnChanges
   * @description Hook de ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada (@Input).
   *              Actualiza la visibilidad de los campos específicos para no contribuyentes según el procedimiento.
   */
  ngOnChanges(): void {
    if (this.idProcedimiento) {
      this.mostrarCamposNoContribuyente =
        PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);

      this.campoObligatorioProveedor =
        CAMPO_OBLIGATORIO_DESTINATARIO.includes(this.idProcedimiento);
    }
  }

  /**
   * @method ngAfterViewInit
   * @description Hook de ciclo de vida de Angular que se ejecuta después de que la vista y sus hijos han sido inicializados.
   *              Habilita o deshabilita el formulario completo según si está en modo solo lectura.
   */
  ngAfterViewInit(): void {
    if (this.esFormularioSoloLectura) {
      this.agregarProveedorForm.disable();
    } else {
      this.agregarProveedorForm.enable();
    }
  }

  /**
   * Crea el formulario reactivo `agregarDestinatarioFinal` utilizando `FormBuilder`.
   * Define los campos y sus validaciones.
   */
  Formulario(): void {
    this.agregarProveedorForm = this.fb.group({
      tipoPersona: ['', Validators.required],
      denominacionRazon: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', Validators.maxLength(200)],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      colonia: ['', Validators.required],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: ['', Validators.required],
      lada: ['', Validators.required],
      telefono: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      rfc: [
        '',
        [
          Validators.minLength(12),
          Validators.maxLength(15),
        ],
      ],
      curp: [
        '',
        [
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
    this.agregarProveedorForm.disable();
    this.agregarProveedorForm.get('tipoPersona')?.enable();
    this.agregarProveedorForm.get('nacionalidad')?.enable();

    if (this.idProcedimiento !== 260102) {
      this.agregarProveedorForm.get('colonia')?.clearValidators();
      this.agregarProveedorForm.get('colonia')?.updateValueAndValidity();
      this.agregarProveedorForm.get('rfc')?.clearValidators();
      this.agregarProveedorForm.get('rfc')?.updateValueAndValidity();
      this.agregarProveedorForm.get('curp')?.clearValidators();
      this.agregarProveedorForm.get('curp')?.updateValueAndValidity();
      this.agregarProveedorForm.get('municipio')?.clearValidators();
      this.agregarProveedorForm.get('municipio')?.updateValueAndValidity();
      this.agregarProveedorForm.get('localidad')?.clearValidators();
      this.agregarProveedorForm.get('localidad')?.updateValueAndValidity();
    }
  }

  /**
   * Hook de inicialización del componente. Llama a `cargarDatos()` para obtener catálogos.
   */
  ngOnInit(): void {
    this.Formulario();
    this.getCatalogoPaises();

    this.esCURP = ES_CURP.includes(this.idProcedimiento);
    this.esNacional = ES_NACIONAL.includes(this.idProcedimiento);
    this.esRFC = ES_RFC.includes(this.idProcedimiento);

    if (!this.campoObligatorioProveedor) {
      this.getLocalidad();
    }

    this.mostrarAsterisco = MOSTRAR_ASTERISCO.includes(this.idProcedimiento);
    this.mostrarInformacion = MOSTRAR_INFORMACION.includes(
      this.idProcedimiento
    );
    this.isProveedorModificar = PROVEEDOR_TITULO_CUSTOM.includes(
      this.idProcedimiento
    );
    if (this.isProveedorModificar) {
      this.titluoMensaje = 'Modificar Proveedor';
    }

    if (this.formaDatos) {
      this.agregarProveedorForm.patchValue(this.formaDatos);
      this.agregarProveedorForm.enable();
    }
    if (this.proveedorTablaDatos.length > 0) {
      this.agregarProveedorForm.patchValue(this.proveedorTablaDatos[0]);
      this.tipoPersonaCambioDeValor('Moral');
      this.terecerosNacionalidadCambioDeValor('Nacional');
    }
    this.nacionalidadOpciones();
    this.mostrarAsterisco = true;
    this.mostrarInformacion = true;
    if (!this.campoObligatorioProveedor) {
      this.agregarProveedorForm.get('estado')?.valueChanges
        .pipe(
          takeUntil(this.unsubscribe$),
          distinctUntilChanged()
        )
        .subscribe(value => {
          if (value) {
            this.getListaMunicipios();
          } else {
            this.municipiosDatos = [];
          }
        });

      this.agregarProveedorForm
        .get('municipio')
        ?.valueChanges.pipe(
          takeUntil(this.unsubscribe$),
          distinctUntilChanged()
        )
        .subscribe((municipioId) => {
          if (municipioId) {
            this.cargarDatos(municipioId);
          }
        });
    }
  }

  /**
   * Obtiene la lista de municipios según el estado seleccionado.
   */
  getListaMunicipios(): void {
    this.datosSolicitudService
      .obtenerListaMunicipios(
        this.agregarProveedorForm.get('estado')?.value,
        this.idProcedimiento
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.municipiosDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Obtiene el catálogo de países desde el servicio correspondiente.
   */
  getCatalogoPaises(): void {
    this.datosSolicitudService
      .obtenerListaPaises(this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.paisesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Obtiene la lista de estados asociados al procedimiento actual.
   */
  getLocalidad(): void {
    this.datosSolicitudService
      .obtenerListaEstados(this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.estadosDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Carga los datos dependientes del municipio seleccionado.
   */
  cargarDatos(value: number): void {
    this.datosSolicitudService
      .obtenerListaLocalidades(value, this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.localidadesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });

    this.datosSolicitudService
      .obtenerListaColonias(value, this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.coloniasDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Maneja el cambio de localidad seleccionada.
   */
  onLocalidadChange(event: Catalogo): void {
    if (!event) return;
    this.agregarProveedorForm.get('localidad')?.setValue(event.id);
    const postalCode = event.descripcion.split("CP ")[1];
    this.agregarProveedorForm.get('codigoPostal')?.setValue(postalCode);
  }

  /**
   * Guarda los datos del proveedor en el formulario.
   */
  guardarProveedor(): void {
    const FORM_VALUE = this.agregarProveedorForm.getRawValue();
    if (this.agregarProveedorForm.invalid) {
      this.agregarProveedorForm.markAllAsTouched();
      return;
    }
    const pais = this.paisesDatos.find((pais: Catalogo) => pais.id === FORM_VALUE.pais);
    const municipio = this.municipiosDatos.find((municipio: Catalogo) => municipio.id === FORM_VALUE.municipio);
    const colonia = this.coloniasDatos.find((colonia: Catalogo) => colonia.id === FORM_VALUE.colonia);
    const localidad = this.localidadesDatos.find((localidad: Catalogo) => localidad.id === FORM_VALUE.localidad);
    const estado = this.estadosDatos.find((estado: Catalogo) => estado.id === FORM_VALUE.estado);

    const validationBody: GuardarProveedorPayloadCustom = {
      rfc: null,
      curp: null,
      nombre: null,
      nacionalidad: FORM_VALUE.nacionalidad?.toUpperCase() || '',
      tipo_persona: FORM_VALUE.tipoPersona?.toUpperCase() || '',
      primer_apellido: FORM_VALUE.primer_apellido,
      segundo_apellido: FORM_VALUE.segundo_apellido,
      razon_social: FORM_VALUE.denominacionRazon || FORM_VALUE.razonSocial,
      cve_pais: FORM_VALUE.pais,
      pais: pais?.descripcion,
      estado: this.idProcedimiento === 240117 ? FORM_VALUE.estado : estado?.descripcion,
      cve_estado: this.idProcedimiento === 240117 ? null : FORM_VALUE.estado || null,
      municipio: municipio?.descripcion,
      cve_municipio: FORM_VALUE.municipio || null,
      colonia: colonia?.descripcion,
      cve_colonia: FORM_VALUE.colonia ? FORM_VALUE.colonia : null,
      calle: FORM_VALUE.calle,
      numero_exterior: FORM_VALUE.numeroExterior,
      numero_interior: FORM_VALUE.numeroInterior || null,
      lada: FORM_VALUE.lada,
      telefono: FORM_VALUE.telefono,
      correo_electronico: FORM_VALUE.correoElectronico,
      localidad: localidad?.descripcion,
      cve_localidad: FORM_VALUE.localidad || null,
      codigo_postal: FORM_VALUE.codigoPostal || null,
    };

    if (FORM_VALUE.nacionalidad === 'Mexicana' && FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
      validationBody.rfc = FORM_VALUE.rfc;
      validationBody.curp = FORM_VALUE.curp;
      validationBody.nombre = FORM_VALUE.nombres;
      validationBody.primer_apellido = FORM_VALUE.primerApellido;
      validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
    }
    else if (FORM_VALUE.nacionalidad === 'Mexicana' && FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
      validationBody.rfc = FORM_VALUE.rfc;
    }
    else if (FORM_VALUE.nacionalidad === 'Nacional' && FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
      validationBody.rfc = FORM_VALUE.rfc || null;
      validationBody.nombre = FORM_VALUE.nombres;
      validationBody.primer_apellido = FORM_VALUE.primerApellido;
      validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
    } else if (FORM_VALUE.nacionalidad === 'Nacional' && FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
      validationBody.rfc = FORM_VALUE.rfc || null;
    } else if (FORM_VALUE.nacionalidad === 'Extranjero' && FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
      validationBody.nombre = FORM_VALUE.nombres;
      validationBody.primer_apellido = FORM_VALUE.primerApellido;
      validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
      validationBody.estado = FORM_VALUE.estado;
      validationBody.cve_estado = FORM_VALUE.estado || '09';
    } else if (FORM_VALUE.nacionalidad === 'Extranjero' && FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
      validationBody.estado = FORM_VALUE.estado;
      validationBody.cve_estado = FORM_VALUE.estado || '09';
    }

    this.datosSolicitudService.validarProveedor(validationBody, this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
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
          const MENSAJE = err?.error?.error || 'Error inesperado al iniciar trámite.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        },
      });
  }

  /**
   * Crea un objeto `Proveedor` a partir de los valores del formulario.
   */
  private crearProveedorDesdeFormulario(): Proveedor {
    const FORM_VALUE = this.agregarProveedorForm.value;
    const TIPO_PERSONA = FORM_VALUE.tipoPersona?.toUpperCase() || '';
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
      tipoPersona: TIPO_PERSONA,
      nacionalidad: FORM_VALUE.nacionalidad?.toUpperCase() || '',
      nombreRazonSocial: this.obtenerNombreRazonSocial(FORM_VALUE),
      rfc: FORM_VALUE.rfc || '',
      curp: FORM_VALUE.curp || '',
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
      colonia: FORM_VALUE.colonia || '',
      municipioAlcaldia: FORM_VALUE.municipio || '',
      localidad: FORM_VALUE.localidad || '',
      entidadFederativa: FORM_VALUE.estado || '',
      estado: FORM_VALUE.estado || '',
      estadoLocalidad: FORM_VALUE.estado || '',
      codigoPostal: FORM_VALUE.codigoPostal || '',
      denominacionRazon: FORM_VALUE.denominacionRazon || null
    };
  }

  /**
   * Construye el nombre o razón social del proveedor basado en el tipo de persona.
   */
  private obtenerNombreRazonSocial(formValue: Proveedor): string {
    if (formValue.tipoPersona === this.tipoPersona.FISICA) {
      const NOMBRES = formValue.nombres || '';
      const APELLIDO1 = formValue.primerApellido || '';
      const APELLIDO2 = formValue.segundoApellido || '';
      return `${NOMBRES} ${APELLIDO1} ${APELLIDO2}`.trim();
    } else if (formValue.tipoPersona === this.tipoPersona.MORAL) {
      return (this.agregarProveedorForm?.get('denominacionRazon')?.value || '');
    }
    return '';
  }

  /**
   * Resetea el formulario reactivo `agregarProveedorForm` para limpiar todos los campos.
   */
  limpiarFormulario(): void {
    this.agregarProveedorForm.reset();
    this.agregarProveedorForm.disable();
    this.agregarProveedorForm.get('tipoPersona')?.enable();
    this.agregarProveedorForm.get('nacionalidad')?.enable();
  }

  /**
   * Navega hacia la vista anterior utilizando el servicio de ubicación.
   */
  cancelar(): void {
    this.cancelarEventListener.emit(true);
  }

  /**
   * Método que se ejecuta cuando se selecciona un tipo de persona.
   */
  tipoPersonaCambioDeValor(event: string | number): void {
    const nombres = this.agregarProveedorForm.get('nombres');
    const primerApellido = this.agregarProveedorForm.get('primerApellido');
    const segundoApellido = this.agregarProveedorForm.get('segundoApellido');
    const denominacion = this.agregarProveedorForm.get('denominacionRazon');

    if (event === 'Moral') {
      nombres?.clearValidators();
      primerApellido?.clearValidators();
      segundoApellido?.clearValidators();

      denominacion?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]);
    } else {
      nombres?.setValidators([Validators.required, Validators.maxLength(200)]);
      primerApellido?.setValidators([Validators.required, Validators.maxLength(200)]);
      segundoApellido?.setValidators([Validators.maxLength(200)]);

      denominacion?.clearValidators();
    }

    if (event === 'NoContribyunte') {
      nombres?.clearValidators();
      primerApellido?.clearValidators();
    }

    nombres?.updateValueAndValidity();
    primerApellido?.updateValueAndValidity();
    segundoApellido?.updateValueAndValidity();
    denominacion?.updateValueAndValidity();
    this.agregarProveedorForm.enable();
    this.agregarProveedorForm.patchValue({
      tipoPersona: event,
    });
  }

  /**
   * Método que se ejecuta cuando se selecciona la nacionalidad.
   */
  terecerosNacionalidadCambioDeValor(event: string | number): void {
    this.agregarProveedorForm.patchValue({
      nacionalidad: event,
    });
    this.changeNacionalidad();
  }

  /**
   * Configura las opciones de nacionalidad según el procedimiento.
   */
  nacionalidadOpciones(): void {
    switch (this.idProcedimiento) {
      case NUMERO_TRAMITE.TRAMITE_240114:
      case NUMERO_TRAMITE.TRAMITE_240117:
      case NUMERO_TRAMITE.TRAMITE_240118:
      case NUMERO_TRAMITE.TRAMITE_240120:
      case NUMERO_TRAMITE.TRAMITE_240121:
      case NUMERO_TRAMITE.TRAMITE_240321:
        this.tercerosNacionalidadOpciones =
          TERCEROS_NACIONALIDAD_OPCIONES_EXTRANJERO;
        break;

      default:
        this.tercerosNacionalidadOpciones = TERCEROS_NACIONALIDAD_OPCIONES;
    }
  }

  /**
   * Habilita o deshabilita los controles del formulario según la nacionalidad.
   */
  changeNacionalidad(): void {
    const NACIONALIDAD = this.agregarProveedorForm.get('nacionalidad')?.value;
    const PAIS_CTRL = this.agregarProveedorForm.get('pais');
    this.agregarProveedorForm.enable({ emitEvent: false });
    this.agregarProveedorForm.get('tipoPersona')?.enable({ emitEvent: false });
    if (NACIONALIDAD === 'Mexicana') {
      PAIS_CTRL?.setValue('MEX', { emitEvent: false });
      PAIS_CTRL?.clearValidators();
      PAIS_CTRL?.disable({ emitEvent: false });
    } else {
      PAIS_CTRL?.setValue(null, { emitEvent: false });
      PAIS_CTRL?.setValidators([Validators.required]);
      PAIS_CTRL?.enable({ emitEvent: false });
    }

    PAIS_CTRL?.updateValueAndValidity({ emitEvent: false });
    this.mostrarCamposNoContribuyente = NACIONALIDAD === 'Extranjero';
  }

  /**
   * Cambia las validaciones de los campos del formulario según el procedimiento.
   */
  campoObligatorioChange(): void {
    const RFC_CTRL = this.agregarProveedorForm.get('rfc');
    const CURP_CTRL = this.agregarProveedorForm.get('curp');
    if (this.campoObligatorioProveedor) {
      RFC_CTRL?.setValidators([Validators.required]);
      CURP_CTRL?.setValidators([Validators.required]);
    } else {
      RFC_CTRL?.clearValidators();
      CURP_CTRL?.clearValidators();
    }
    RFC_CTRL?.updateValueAndValidity();
    CURP_CTRL?.updateValueAndValidity();
  }

  /**
   * @method ngOnDestroy
   * @description Hook de ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   *              Se utiliza para liberar recursos y evitar fugas de memoria, especialmente
   *              para cancelar suscripciones activas en observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
