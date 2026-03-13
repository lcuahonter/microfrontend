import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  COLONIA_FIELD_FLAG,
  DESTINATARIO_TITULO_CUSTOM,
  PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE,
  TERCEROS_NACIONALIDAD_OPCIONES,
  TIPO_PERSONA_OPCIONES
} from '../../constants/datos-solicitud.enum';
import { Catalogo, CatalogoSelectComponent, CategoriaMensaje, InputRadioComponent, Notificacion, NotificacionesComponent, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { DestinoFinal, Proveedor } from '../../models/terceros-relacionados.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { GuardarDestinatarioPayloadCustom } from '../../models/guardar-payload.model';

@Component({
  selector: 'app-agregar-destinatario-custom',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './agregar-destinatario-custom.component.html',
  styleUrl: './agregar-destinatario-custom.component.scss',
})
export class AgregarDestinatarioCustomComponent
  implements OnDestroy, OnInit, OnChanges, AfterViewInit {
    
  /**
   * Identificador del procedimiento asociado al componente.
   * Se utiliza para determinar reglas de negocio y comportamiento dinámico.
   */
  @Input() idProcedimiento!: number;

  /**
   * Datos iniciales del formulario recibidos desde el componente padre.
   * Puede contener información para crear o editar un destinatario final.
   *
   * Tipos permitidos:
   * - DestinoFinal
   * - Proveedor
   * - null
   * - undefined
   */
  @Input() formaDatos!: DestinoFinal | Proveedor | null | undefined;

  /**
   * Indica si el formulario debe operar en modo solo lectura.
   * Cuando es verdadero, todos los controles del formulario se deshabilitan.
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Arreglo local que mantiene la lista de
   * destinatarios finales registrados.
   */
  @Input() destinatarios: DestinoFinal[] = [];

  /**
   * Lista de destinatarios finales mostrados en la tabla.
   * Se utiliza para precargar datos y gestionar ediciones.
   */
  @Input() destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
 * Emite la lista actualizada de destinatarios finales
 * para sincronizar la información con el componente padre.
 */
  @Output() updateDestinatarioFinalTablaDatos =
    new EventEmitter<DestinoFinal[]>();

  /**
   * Emite los datos actualizados cuando se modifica
   * un destinatario final existente.
   */
  @Output() actualizaExistenteEnDestinatarioDatos =
    new EventEmitter<DestinoFinal[]>();

  /**
   * Evento que se emite cuando el usuario cancela
   * la operación en curso.
   */
  @Output() cancelarEventListener = new EventEmitter<boolean>();

  /**
   * Contiene la notificación actual del sistema.
   * Se utiliza para mostrar mensajes de éxito o error al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Subject utilizado para controlar la cancelación
   * de suscripciones a observables mediante `takeUntil`,
   * evitando fugas de memoria.
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Formulario reactivo utilizado para capturar
   * la información del destinatario final.
   */
  agregarDestinatarioFinal!: FormGroup;

  /**
   * Referencia al enum `TipoPersona`, expuesto
   * para su uso en el template HTML.
   */
  public tipoPersona = TipoPersona;
  
  /**
   * Texto utilizado como título cuando el formulario
   * se encuentra en modo de modificación.
   */
  destinatarioTituloModificar = DESTINATARIO_TITULO_CUSTOM;

  /**
   * Indica si el componente se encuentra
   * en modo de edición de destinatario.
   */
  isDestinatarioModificar: boolean = false;

  /**
   * Determina si deben mostrarse los campos
   * específicos para no contribuyentes.
   */
  public mostrarCamposNoContribuyente: boolean = false;

  /**
   * Controla la visibilidad y obligatoriedad
   * del campo colonia según el procedimiento.
   */
  public colonia_visibilidad: boolean = false;

  /**
   * Opciones disponibles para el selector
   * de tipo de persona (FÍSICA / MORAL).
   */
  tipoPersonaRadioOpciones = TIPO_PERSONA_OPCIONES;

  /**
   * Opciones disponibles para seleccionar
   * la nacionalidad de terceros.
   */
  tercerosNacionalidadOpciones = TERCEROS_NACIONALIDAD_OPCIONES;

  /**
   * Catálogo de países disponibles.
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Catálogo de estados disponibles.
   */
  public estadosDatos: Catalogo[] = [];

  /**
   * Catálogo de municipios disponibles.
   */
  public municipiosDatos: Catalogo[] = [];

  /**
   * Catálogo de localidades disponibles.
   */
  public localidadesDatos: Catalogo[] = [];

  /**
   * Catálogo de colonias disponibles.
   */
  public coloniasDatos: Catalogo[] = [];

  /**
   * Catálogo de códigos postales disponibles.
   */
  public codigosPostalesDatos: Catalogo[] = [];

  /**
   * Constructor del componente.
   * Inyecta las dependencias necesarias y
   * establece valores iniciales de configuración.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService
  ) {
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);
  }

  /**
 * Hook del ciclo de vida de Angular que se ejecuta
 * cuando cambian los valores de las propiedades `@Input`.
 *
 * Actualiza la visibilidad de los campos para
 * procedimientos de no contribuyente.
 */
  ngOnChanges(): void {
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * - Determina la visibilidad del campo colonia
   * - Define si el formulario está en modo modificación
   * - Inicializa el formulario reactivo
   * - Carga catálogos necesarios
   * - Precarga datos si existen valores recibidos
   */
  ngOnInit(): void {
    this.colonia_visibilidad = COLONIA_FIELD_FLAG.includes(this.idProcedimiento);

    this.isDestinatarioModificar =
      DESTINATARIO_TITULO_CUSTOM.includes(this.idProcedimiento);

    this.crearFormaulario();
    this.getCatalogoPaises();
    if (this.formaDatos) {
      this.agregarDestinatarioFinal.patchValue(this.formaDatos);
      this.agregarDestinatarioFinal.enable();
    }

    if (this.destinatarioFinalTablaDatos.length > 0) {
      this.agregarDestinatarioFinal.patchValue(
        this.destinatarioFinalTablaDatos[0]
      );
      this.tipoPersonaCambioDeValor('Fisica');
    }
  }

  /**
   * Hook del ciclo de vida que se ejecuta
   * después de que la vista del componente ha sido inicializada.
   *
   * Habilita o deshabilita el formulario dependiendo
   * del modo de solo lectura.
   */
  ngAfterViewInit(): void {
    this.esFormularioSoloLectura
      ? this.agregarDestinatarioFinal.disable()
      : this.agregarDestinatarioFinal.enable();
  }

  /**
 * Crea e inicializa el formulario reactivo para el destinatario final.
 * Define los controles, validaciones y estados iniciales del formulario.
 *
 * También:
 * - Ajusta validaciones dinámicas según la visibilidad de colonia
 * - Deshabilita el formulario completo inicialmente
 * - Habilita únicamente los campos necesarios para iniciar la captura
 * - Precarga los datos si existen valores previos en `formaDatos`
 */
  crearFormaulario(): void {
    this.agregarDestinatarioFinal = this.fb.group({
      tipoPersona: [''],
      rfc: [''],
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      denominacionRazon: ['', [Validators.required, Validators.maxLength(254)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', Validators.maxLength(200)],
      pais: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(120)]],
      municipio: [''],
      localidad: [''],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      colonia: ['', Validators.required],
      calle: ['', [Validators.required, Validators.maxLength(300)]],
      numeroExterior: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInterior: ['', [Validators.required, Validators.maxLength(55)]],
      lada: ['', [Validators.required, Validators.maxLength(30)]],
      telefono: ['', [Validators.required, Validators.maxLength(24)]],
      correoElectronico: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(320)],
      ],
      nacionalidad: [''],
    });

    if (this.colonia_visibilidad) {
      this.agregarDestinatarioFinal.get('colonia')?.clearValidators();
      this.agregarDestinatarioFinal
        .get('colonia')
        ?.updateValueAndValidity({ emitEvent: false });
    }

    this.agregarDestinatarioFinal.disable();
    this.agregarDestinatarioFinal.get('tipoPersona')?.enable();
    this.agregarDestinatarioFinal.get('nacionalidad')?.enable();

    if (this.formaDatos) {
      this.agregarDestinatarioFinal.patchValue(this.formaDatos);
    }
  }

  /**
   * Limpia el formulario del destinatario final y restablece
   * su estado inicial deshabilitado.
   *
   * Habilita únicamente el campo `tipoPersona`
   * para permitir una nueva captura.
   */
  limpiarFormulario(): void {
    this.agregarDestinatarioFinal.reset();
    this.agregarDestinatarioFinal.disable();
    this.agregarDestinatarioFinal.get('tipoPersona')?.enable();
  }

  /**
   * Valida el formulario de destinatario final, construye el objeto
   * `DestinoFinal` con la información capturada y ejecuta la validación
   * backend correspondiente.
   *
   * Si la validación es exitosa:
   * - Agrega o actualiza el destinatario en la lista local
   * - Emite los cambios al componente padre
   * - Resetea el formulario
   *
   * En caso de error:
   * - Muestra una notificación con el mensaje correspondiente
   *
   * @returns {Promise<boolean>} Promesa utilizada para controlar el flujo del guardado
   */
  guardarDestinatario(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.agregarDestinatarioFinal.invalid) {
        this.agregarDestinatarioFinal.markAllAsTouched();
        return;
      }
      
      const pais = this.paisesDatos.find((pais: Catalogo) => pais.id === this.agregarDestinatarioFinal.value.pais);
      const municipio = this.municipiosDatos.find((municipio: Catalogo) => municipio.id === this.agregarDestinatarioFinal.value.municipio);
      const localidad = this.localidadesDatos.find((localidad: Catalogo) => localidad.id === this.agregarDestinatarioFinal.value.localidad);
      const colonia = this.coloniasDatos.find((colonia: Catalogo) => colonia.id === this.agregarDestinatarioFinal.value.colonia);
     
      const DENOMINACIONRAZON_ONLY_FLAG =
        this.agregarDestinatarioFinal.value.tipoPersona === TipoPersona.MORAL
    
      const NUEVO_DESTINATARIO: DestinoFinal = {
        id: this.agregarDestinatarioFinal.value.id
          ? this.agregarDestinatarioFinal.value?.id
          : Math.floor(Math.random() * 1000000),
        nombreRazonSocial: DENOMINACIONRAZON_ONLY_FLAG
          ? `${this.agregarDestinatarioFinal.value.denominacionRazon}`.trim()
          : `${this.agregarDestinatarioFinal.value.nombres} ${this.agregarDestinatarioFinal.value.primerApellido} ${this.agregarDestinatarioFinal.value.segundoApellido || ''}`.trim(),
        rfc: this.agregarDestinatarioFinal.value.rfc,
        curp: '',
        telefono: `${this.agregarDestinatarioFinal.value.lada} ${this.agregarDestinatarioFinal.value.telefono}`.trim(),
        lada: this.agregarDestinatarioFinal.value.lada,
        correoElectronico: this.agregarDestinatarioFinal.value.correoElectronico,
        calle: this.agregarDestinatarioFinal.value.calle,
        numeroExterior: this.agregarDestinatarioFinal.value.numeroExterior,
        numeroInterior: this.agregarDestinatarioFinal.value.numeroInterior,
        cve_pais: String(pais?.id) ?? '',
        pais: pais?.descripcion ?? '',
        cve_colonia: this.agregarDestinatarioFinal.value.colonia,
        colonia: colonia?.descripcion ?? '',
        municipioAlcaldia: municipio?.descripcion ?? '',
        cve_municipio: this.agregarDestinatarioFinal.value.municipio,
        localidad: localidad?.descripcion ?? '',
        cve_localidad: this.agregarDestinatarioFinal.value.localidad,
        entidadFederativa: '',
        estadoLocalidad: this.agregarDestinatarioFinal.value.estado,
        codigoPostal: this.agregarDestinatarioFinal.value.codigoPostal,
        tipoPersona: this.agregarDestinatarioFinal.value.tipoPersona?.toUpperCase() || '',
        nacionalidad: 'NACIONAL',
        denominacionRazon: this.agregarDestinatarioFinal.value.denominacionRazon,
        nombres: this.agregarDestinatarioFinal.value.nombres,
        primerApellido: this.agregarDestinatarioFinal.value.primerApellido,
        segundoApellido: this.agregarDestinatarioFinal.value.segundoApellido,
        estado: this.agregarDestinatarioFinal.value.estado,
      };

      const validationBody: GuardarDestinatarioPayloadCustom = {
        nacionalidad: 'NACIONAL',
        tipo_persona:
          this.agregarDestinatarioFinal.value.tipoPersona === TipoPersona.MORAL
            ? 'MORAL'
            : 'FISICA',
        rfc: NUEVO_DESTINATARIO.rfc,
        nombre: NUEVO_DESTINATARIO.nombres || '',
        primer_apellido: NUEVO_DESTINATARIO.primerApellido || '',
        segundo_apellido: NUEVO_DESTINATARIO.segundoApellido || '',
        razon_social: DENOMINACIONRAZON_ONLY_FLAG
          ? `${this.agregarDestinatarioFinal.value.denominacionRazon}`.trim()
          : `${this.agregarDestinatarioFinal.value.nombres} ${this.agregarDestinatarioFinal.value.primerApellido} ${this.agregarDestinatarioFinal.value.segundoApellido || ''}`.trim(),
        cve_pais: pais?.id != null ? String(pais.id) : 'MEX',
        pais: pais?.id != null ? String(pais.descripcion) : 'MEXICO',
        estado: NUEVO_DESTINATARIO.estado,
        cve_estado: this.agregarDestinatarioFinal.value.estado?.clave,
        municipio: this.agregarDestinatarioFinal.value.municipio?.descripcion,
        cve_municipio: this.agregarDestinatarioFinal.value.municipio?.clave,
        localidad: this.agregarDestinatarioFinal.value.localidad?.descripcion,
        cve_localidad: this.agregarDestinatarioFinal.value.localidad?.clave,
        codigo_postal: NUEVO_DESTINATARIO.codigoPostal,
        colonia: this.agregarDestinatarioFinal.value.colonia,
        cve_colonia: this.agregarDestinatarioFinal.value.colonia?.clave,
        calle: NUEVO_DESTINATARIO.calle,
        numero_exterior: NUEVO_DESTINATARIO.numeroExterior,
        numero_interior: NUEVO_DESTINATARIO.numeroInterior || '',
        lada: NUEVO_DESTINATARIO.lada,
        telefono: this.agregarDestinatarioFinal.value.telefono,
        correo_electronico: NUEVO_DESTINATARIO.correoElectronico,
      };

      this.datosSolicitudService
        .validarDestinatario(validationBody, this.idProcedimiento)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (resp) => {
            if (resp.codigo !== '00') {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: '',
                mensaje: resp.error || 'Error al generar la cadena original.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              return;
            }

            const INDEX = this.destinatarios.findIndex(
              (d) => d.id === NUEVO_DESTINATARIO.id
            );

            if (INDEX > -1) {
              this.destinatarios[INDEX] = NUEVO_DESTINATARIO;
              this.destinatarios = [...this.destinatarios];
            } else {
              this.destinatarios = [...this.destinatarios, NUEVO_DESTINATARIO];
            }

            this.updateDestinatarioFinalTablaDatos.emit(this.destinatarios);
            this.formaDatos = null;
            this.agregarDestinatarioFinal.reset();
          },
          error: (err) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje:
                err?.error?.error ||
                'Error inesperado al iniciar trámite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          },
        });
    });
  }

  /**
 * Se ejecuta cuando cambia el tipo de persona (FÍSICA o MORAL).
 * Habilita el formulario, actualiza el valor seleccionado
 * y ajusta dinámicamente las validaciones correspondientes.
 *
 * @param {string | number} event Tipo de persona seleccionado
 */
  tipoPersonaCambioDeValor(event: string | number): void {
    this.agregarDestinatarioFinal.enable();
    this.agregarDestinatarioFinal.patchValue({ tipoPersona: event });
    this.changeTipoPersona();
  }

  /**
   * Se ejecuta cuando cambia la nacionalidad del tercero.
   * Actualiza el valor del campo `nacionalidad` en el formulario.
   *
   * @param {string | number} event Nacionalidad seleccionada
   */
  terecerosNacionalidadCambioDeValor(event: string | number): void {
    this.agregarDestinatarioFinal.patchValue({ nacionalidad: event });
  }

  /**
   * Cancela la operación actual y notifica al componente padre
   * mediante el evento `cancelarEventListener`.
   */
  cancelar(): void {
    this.cancelarEventListener.emit(true);
  }

  /**
   * Ajusta dinámicamente las validaciones del formulario
   * dependiendo del tipo de persona seleccionado.
   * - Para persona MORAL, se eliminan validaciones de nombres y apellidos.
   * - Para persona FÍSICA, se elimina la validación de denominación social.
   */
  changeTipoPersona(): void {
    const TIPO_PERSONA =
      this.agregarDestinatarioFinal.get('tipoPersona')?.value;

    const DENOMINACION_CTRL =
      this.agregarDestinatarioFinal.get('denominacionRazon');
    const NOMBRES_CTRL =
      this.agregarDestinatarioFinal.get('nombres');
    const PRIMERAPELLIDO_CTRL =
      this.agregarDestinatarioFinal.get('primerApellido');
    const SEGUNDOAPELLIDO_CTRL =
      this.agregarDestinatarioFinal.get('segundoApellido');

    if (TIPO_PERSONA === TipoPersona.MORAL) {
      NOMBRES_CTRL?.clearValidators();
      PRIMERAPELLIDO_CTRL?.clearValidators();
      SEGUNDOAPELLIDO_CTRL?.clearValidators();
    }

    if (TIPO_PERSONA === TipoPersona.FISICA) {
      DENOMINACION_CTRL?.clearValidators();
    }

    DENOMINACION_CTRL?.updateValueAndValidity({ emitEvent: false });
    NOMBRES_CTRL?.updateValueAndValidity({ emitEvent: false });
    PRIMERAPELLIDO_CTRL?.updateValueAndValidity({ emitEvent: false });
    SEGUNDOAPELLIDO_CTRL?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Obtiene el catálogo de países desde el servicio
   * y lo mapea al formato requerido para el formulario.
   */
  getCatalogoPaises(): void {
    this.datosSolicitudService
      .obtenerListaPaises(this.idProcedimiento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.paisesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion,
        }));
      });
  }

  /**
   * Hook del ciclo de vida que se ejecuta justo
   * antes de que el componente sea destruido.
   *
   * Emite y completa el subject `unsubscribe$`
   * para cancelar suscripciones activas y
   * prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
