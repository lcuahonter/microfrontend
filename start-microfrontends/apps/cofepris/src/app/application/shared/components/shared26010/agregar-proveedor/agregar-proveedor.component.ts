import {
  CODIGO_POSTAL,
  Catalogo,
  CatalogoServices,
  REGEX_CORREO_ELECTRONICO,
  REGEX_NOMBRE,
  REGEX_TELEFONO,
  TipoPersona,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR, STR_NACIONAL } from '../constents/datos-solicitud.enum';
import { Subject, Subscription } from 'rxjs';
import {CatalogoSelectComponent} from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../services/datos-solicitud.service';
import { Proveedor } from '../models/terceros-relacionados.model';
import { TERCEROS_RELACIONADOS_DATOS_INICIALES } from '../models/terceros-fabricante.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { takeUntil } from 'rxjs/operators';

/**
 * @component AgregarProveedorComponent
 * @description Componente responsable de manejar el formulario para agregar proveedores.
 * Se encarga de obtener datos del catálogo (países), gestionar el formulario reactivo y
 * actualizar el estado del trámite con la información del proveedor capturado.
 */
@Component({
  selector: 'app-agregar-proveedor',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TituloComponent,
    TooltipModule,
  ],
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.css',
})
export class AgregarProveedorComponent implements OnDestroy, OnInit, OnChanges {
 /**
   * Indica si se ha realizado la verificación de validación al intentar guardar.
   * Esta bandera se utiliza para controlar la visualización de mensajes de error o advertencia
   * cuando el usuario intenta guardar el formulario sin cumplir con los requisitos de validación.
   */
  chequeoValidacionAlGuardar =false;
    /** Mensaje de error o información para mostrar al usuario */
  message: string | undefined;
  /**
   * Identificador del procedimiento actual.
   * Utilizado para controlar el flujo de la vista dependiendo del tipo de procedimiento.
   *
   * @input idProcedimiento - Cadena que representa el ID del procedimiento (por ejemplo: '260102').
   */
  @Input()
  idProcedimiento!: number;
  /**
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;
  /**
   * @property {Subject<void>} unsubscribe$
   * Subject para cancelar suscripciones activas y evitar fugas de memoria.
   * Se completa en el hook `ngOnDestroy`.
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * @property {Proveedor[]} proveedores
   * Arreglo de proveedores capturados en el formulario.
   */
  proveedores: Proveedor[] = [];

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
   * Arreglo que almacena los elementos requeridos.
   * @type {string[]}
   */
  public elementosRequeridos: string[] = [];

  /**
   * @property {Proveedor | undefined} datoSeleccionado
   * Dato seleccionado que se pasará al componente hijo `AgregarDestinatarioComponent`.
   */
  @Input() datoSeleccionado: Proveedor[] | undefined;

  /**
   * @property updateProveedorTablaDatos
   * @description Evento que emite una lista actualizada de objetos `Proveedor` hacia el componente padre.
   * Se utiliza para sincronizar los datos de la tabla o disparar acciones relacionadas.
   * @type {EventEmitter<Proveedor[]>}
   */
  @Output() updateProveedorTablaDatos = new EventEmitter<Proveedor[]>();
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

  /**
   * Lista de elementos deshabilitados en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben estar deshabilitados en el formulario.
   */
  public elementosDeshabilitados: string[] = [];

  /**
   * Controla si el desplegable de nacionalidad está deshabilitado.
   * @property {boolean} estaDeshabilitadoDesplegable
   */
  public estaDeshabilitadoDesplegable: boolean = true;

  /**
   * @property {boolean} habilitarNacionalidad
   * @description
   * Indica si el campo de nacionalidad debe estar habilitado en el formulario de proveedor.
   * Se activa dependiendo del procedimiento seleccionado.
   */
  public habilitarNacionalidad: boolean = false;

  /**
   * @property {string} nacionalStr
   * @description
   * Cadena constante que representa el valor nacional para el campo de nacionalidad.
   */
  public nacionalStr = STR_NACIONAL;

  /**
   * @property {boolean} estaOculto
   * @description
   * Indica si el componente debe estar oculto en la vista.
   * Se recibe como propiedad de entrada desde el componente padre.
   */
  @Input() estaOculto!: boolean;
    /**
     * Evento de salida que emite una señal para cancelar o cerrar el modal actual.
     * Los componentes padres pueden suscribirse a este evento para manejar la acción de cancelación.
     */
    @Output() cancelarmodal = new EventEmitter<void>();

    /**
     * Arreglo que contiene la lista de proveedores mostrados en la tabla.
     * Se recibe como propiedad de entrada desde el componente padre.
     */
    @Input() proveedorTablaDatos: Proveedor[] = [];
    /**
     * Arreglo que contiene los proveedores seleccionados en la tabla.
     */
    @Output() guardarYSalir = new EventEmitter<void>();
        /**
     * Suscripción para manejar observables.
     */
    private subscription: Subscription = new Subscription();
    
  /**
   * Identificador del trámite asociado a la ampliación de 3Rs.
   */
  @Input() tramiteID: string = '';
  /**
   * Constructor del componente AgregarProveedorComponent.
   *
   * @param fb - Inyección del servicio FormBuilder para la creación y manejo de formularios reactivos.
   * @param datosSolicitudService - Servicio para gestionar los datos de la solicitud.
   * @param ubicaccion - Servicio Location para manejar la navegación y ubicación dentro de la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private ubicaccion: Location,
    private catalogoServices: CatalogoServices,
  ) {
    // Constructor vacío, se inyectan las dependencias para su uso en el componente.
  }

  /**
   * @method ngOnInit
   * @description Hook de inicialización del componente. Llama a `cargarDatos()` para obtener catálogos.
   */
  ngOnInit(): void {
    this.cambiarHabilitacionNacionalidad();
    this.obtenerListaPaises(this.tramiteID);
    this.validarElementos();
    this.chequeoValidacionAlGuardar =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento)
        ? true
        :false;
    this.crearAgregarFormularioProveedor();
    this.actualizarValidaciones();
    this.changeNacionalidad();
     
  }

  /**
   * @method cambiarHabilitacionNacionalidad
   * @description
   * Habilita el campo de nacionalidad en el formulario si el procedimiento actual está incluido en la lista `TERCEROS_RELACIONADOS_DATOS_INICIALES`.
   * Cambia el valor de la propiedad `habilitarNacionalidad` a `true` si la condición se cumple.
   *
   * @returns {void}
   */
  public cambiarHabilitacionNacionalidad(): void {
    if (TERCEROS_RELACIONADOS_DATOS_INICIALES.includes(this.idProcedimiento)) {
      this.habilitarNacionalidad = true;
    }
  }

  /**
   * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
   * @param {keyof Proveedor } field - Nombre del campo a obtener.
   * @returns {string | number | undefined | string[] | Catalogo} - Valor del campo especificado.
   */
  public obtenerValor(field: keyof Proveedor): string | number | undefined | Catalogo {
    return this.datoSeleccionado?.[0]?.[field as keyof Proveedor] ?? '';
  }

  /**
   * @method crearAgregarFormularioProveedor
   * @description Crea el formulario reactivo `agregarProveedorForm` con sus respectivos controles y validaciones.
   */
  crearAgregarFormularioProveedor(): void {
    this.agregarProveedorForm = this.fb.group({
      nacionalidad: [''],
      tipoPersona: [this.obtenerValor('tipoPersona'), Validators.required],
      rfc: [this.obtenerValor('rfc')],
      curp: [this.obtenerValor('curp')],
      denominacionRazon: [
        this.obtenerValor('nombreRazonSocial'),
        [ Validators.pattern(REGEX_NOMBRE)],
      ],
      nombres: [
        this.obtenerValor('nombres'),
        [Validators.required, Validators.pattern(REGEX_NOMBRE)],
      ],
      primerApellido: [
        this.obtenerValor('primerApellido'),
        [Validators.required, Validators.pattern(REGEX_NOMBRE)],
      ],
      segundoApellido: [
        this.obtenerValor('segundoApellido'),
        [Validators.pattern(REGEX_NOMBRE)],
      ],
      pais: [this.obtenerValor('pais'), Validators.required],
      estado: [
        this.obtenerValor('estadoLocalidad'),
        (this.elementosRequeridos.includes('estado') || this.chequeoValidacionAlGuardar)
          ? [Validators.required, Validators.pattern('^[a-zA-Z0-9/s/(/)/-/./#&,]*$')]
          : [],
      ],
       codigoPostal: [
      this.obtenerValor('codigoPostal'),
      this.idProcedimiento === 260911
        ? [Validators.required, Validators.pattern(CODIGO_POSTAL)]
        : [Validators.pattern(CODIGO_POSTAL)]
    ],
      colonia: [this.obtenerValor('colonia')],
      calle: [this.obtenerValor('calle'), Validators.required],
      numeroExterior: [
        this.obtenerValor('numeroExterior'),
        Validators.required,
      ],
      numeroInterior: [this.obtenerValor('numeroInterior')],
      lada: [this.obtenerValor('lada')],
      telefono: [
        {
          value: this.elementosDeshabilitados.includes('telefono')
            ? '3461235'
            : this.obtenerValor('telefono'),
          disabled: this.elementosDeshabilitados.includes('telefono'),
        },
        [Validators.pattern(REGEX_TELEFONO)],
      ],
      correoElectronico: [
        {
          value: this.elementosDeshabilitados.includes('correoElectronico')
            ? 'abc@njk.com'
            : this.obtenerValor('correoElectronico'),
          disabled: this.elementosDeshabilitados.includes('correoElectronico'),
        },
        [Validators.pattern(REGEX_CORREO_ELECTRONICO)],
      ],
      municipioAlcaldia: [this.obtenerValor('municipioAlcaldia')],
      localidad: [this.obtenerValor('localidad')],
    });
  }

  /**
   * Ciclo de vida de Angular: `ngOnChanges`.
   *
   * @param {SimpleChanges} currentValue - Objeto con los cambios detectados en las propiedades de entrada (`@Input`) del componente.
   *
   * @description
   * Este método se ejecuta automáticamente cuando una de las propiedades de entrada del componente cambia.
   *
   * - Si `datoSeleccionado` ha cambiado:
   *   1. Se asigna el nuevo valor a la propiedad local `datoSeleccionado`.
   *   2. Después de un retraso de 500 ms (para asegurar la disponibilidad del formulario),
   *      se habilita el formulario `agregarProveedorForm` si el campo `tipoPersona` está definido.
   *   3. Se actualizan los campos del formulario con la información del primer elemento de `datoSeleccionado`.
   */
  ngOnChanges(currentValue: SimpleChanges): void {
    if (currentValue['datoSeleccionado']) {
      this.datoSeleccionado = currentValue['datoSeleccionado'].currentValue;
      setTimeout(() => {
        if (this.datoSeleccionado?.[0]?.tipoPersona) {
          this.agregarProveedorForm?.enable();
        }
        let valorPais = this.datoSeleccionado?.[0]?.pais;
        if (valorPais && this.paisesDatos.length > 0) {
          const PAIS_ENCONTRADO = this.paisesDatos.find(p => 
            p.descripcion === valorPais || 
            p.clave?.toString() === valorPais?.toString()
          );
          valorPais = PAIS_ENCONTRADO ? PAIS_ENCONTRADO.clave : valorPais;
        }
        this.agregarProveedorForm.patchValue({
          tipoPersona: this.datoSeleccionado?.[0]?.tipoPersona,
          nombres: this.datoSeleccionado?.[0]?.nombres,
          primerApellido: this.datoSeleccionado?.[0]?.primerApellido,
          segundoApellido: this.datoSeleccionado?.[0]?.segundoApellido,
          pais: valorPais,
          estado: this.datoSeleccionado?.[0]?.estadoLocalidad,
          codigoPostal: this.datoSeleccionado?.[0]?.codigoPostal,
          colonia: this.datoSeleccionado?.[0]?.colonia,
          calle: this.datoSeleccionado?.[0]?.calle,
          numeroExterior: this.datoSeleccionado?.[0]?.numeroExterior,
          numeroInterior: this.datoSeleccionado?.[0]?.numeroInterior,
          lada: this.datoSeleccionado?.[0]?.lada,
          denominacionRazon: this.datoSeleccionado?.[0]?.nombreRazonSocial,
          telefono: this.datoSeleccionado?.[0]?.telefono,
          correoElectronico: this.datoSeleccionado?.[0]?.correoElectronico,
        });
      }, 500);
    }
  }

  /**
   * @method actualizarValidaciones
   * @description
   * Actualiza las validaciones de los campos 'nacionalidad', 'rfc' y 'curp' en el formulario de proveedor.
   * Si `habilitarNacionalidad` es verdadero, establece los validadores requeridos en dichos campos.
   * Si es falso, elimina los validadores de los mismos campos.
   * Finalmente, actualiza el estado y la validez de los controles afectados.
   *
   * @returns {void}
   */
  actualizarValidaciones(): void {
    if (this.habilitarNacionalidad) {
      this.agregarProveedorForm
        .get('nacionalidad')
        ?.setValidators([Validators.required]);
      this.agregarProveedorForm
        .get('rfc')
        ?.setValidators([
          Validators.required,
          Validators.pattern(REGEX_NOMBRE),
        ]);
      this.agregarProveedorForm
        .get('curp')
        ?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z]{4}\d{6}[HM][A-Za-z]{5}\d{2}$/)]);
    } else {
      this.agregarProveedorForm.get('nacionalidad')?.clearValidators();
      this.agregarProveedorForm.get('rfc')?.clearValidators();
      this.agregarProveedorForm.get('curp')?.clearValidators();
    }
    this.agregarProveedorForm.get('nacionalidad')?.updateValueAndValidity();
    this.agregarProveedorForm.get('rfc')?.updateValueAndValidity();
    this.agregarProveedorForm.get('curp')?.updateValueAndValidity();
  }
  /**
   * Valida elementos según el `idProcedimiento` y establece
   * las listas de elementos no válidos y añadidos.
   * @returns {void} Lista de elementos no válidos.
   */
  validarElementos(): void {
    switch (this.idProcedimiento) {
      case 260201:
      case 260219:
        this.elementosRequeridos = ['estado'];
        break;
      case 260214:
        this.elementosRequeridos = ['estado'];
        break;
      case 260601:
        this.elementosRequeridos = ['estado'];
        break;
      default:
        this.elementosDeshabilitados = [];
        this.elementosRequeridos = [];
    }
  }

  /**
   * @method cargarDatos
   * @description Obtiene la lista de países del servicio de datos y la almacena en `paisesDatos`.
   */
  cargarDatos(): void {
    this.datosSolicitudService
      .obtenerListaPaises()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.paisesDatos = data;
      });
  }
  /**
   * Obtiene la lista de países según el trámite especificado.
   */
 obtenerListaPaises(tramite: string): void {
    this.subscription.add(this.catalogoServices.paisesCatalogo(tramite).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.paisesDatos = DATOS;
    }));
}
  /**
   * @method guardarProveedor
   * @description Toma los datos del formulario, crea un objeto `Proveedor`, lo agrega al arreglo
   * local, actualiza el store del trámite y luego limpia el formulario y regresa a la vista anterior.
   */
// eslint-disable-next-line complexity
guardarProveedor(): void {
  if(this.chequeoValidacionAlGuardar){
    if (this.agregarProveedorForm.invalid) {
      // Marca todos los controles como tocados para mostrar errores de validación
      Object.values(this.agregarProveedorForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
        this.message = 'Faltan campos por capturar.';
      });
      
      // NO redirigir ni emitir nada si el formulario es inválido
      return;
    }
  }

  const VALOR_FORMULARIO = this.agregarProveedorForm.getRawValue();
  
  const NUEVO_PROVEEDOR: Proveedor = VALOR_FORMULARIO as Proveedor;
  
  const PAIS_ID = this.agregarProveedorForm.get('pais')?.value;
  const PAIS_OBJ = AgregarProveedorComponent.generarCatalogoObjeto(this.paisesDatos, PAIS_ID);
  
  NUEVO_PROVEEDOR.pais = PAIS_OBJ?.[0]?.descripcion ?? '';
  NUEVO_PROVEEDOR.paisObj = PAIS_OBJ?.[0] ?? undefined;
  
  NUEVO_PROVEEDOR.colonia = this.agregarProveedorForm.get('colonia')?.value || '';
  NUEVO_PROVEEDOR.municipioAlcaldia = this.agregarProveedorForm.get('municipioAlcaldia')?.value || '';
  NUEVO_PROVEEDOR.localidad = this.agregarProveedorForm.get('localidad')?.value || '';
  NUEVO_PROVEEDOR.entidadFederativa = '';
  NUEVO_PROVEEDOR.estadoLocalidad = this.agregarProveedorForm.get('estado')?.value || '';
  NUEVO_PROVEEDOR.codigoPostal = this.agregarProveedorForm.get('codigoPostal')?.value || '';
  NUEVO_PROVEEDOR.coloniaEquivalente = '';

  let nombreRazonSocial: string;
  if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.MORAL) {
    nombreRazonSocial = VALOR_FORMULARIO.denominacionRazon;
  } else if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.FISICA) {
    nombreRazonSocial = `${VALOR_FORMULARIO.nombres} ${VALOR_FORMULARIO.primerApellido} ${VALOR_FORMULARIO.segundoApellido || ''}`.trim();
  } else {
    nombreRazonSocial = '';
  }
  NUEVO_PROVEEDOR.nombreRazonSocial = nombreRazonSocial;

  NUEVO_PROVEEDOR.nacionalidad = VALOR_FORMULARIO.nacionalidad || '';
  NUEVO_PROVEEDOR.tipoPersona = VALOR_FORMULARIO.tipoPersona;
  NUEVO_PROVEEDOR.rfc = VALOR_FORMULARIO.rfc || '';
  NUEVO_PROVEEDOR.curp = VALOR_FORMULARIO.curp || '';
  NUEVO_PROVEEDOR.telefono = `${VALOR_FORMULARIO.lada || ''} ${VALOR_FORMULARIO.telefono || ''}`.trim();
  NUEVO_PROVEEDOR.correoElectronico = VALOR_FORMULARIO.correoElectronico || '';
  NUEVO_PROVEEDOR.calle = VALOR_FORMULARIO.calle || '';
  NUEVO_PROVEEDOR.numeroExterior = VALOR_FORMULARIO.numeroExterior || '';
  NUEVO_PROVEEDOR.numeroInterior = VALOR_FORMULARIO.numeroInterior || '';
  NUEVO_PROVEEDOR.nombres = VALOR_FORMULARIO.nombres;
  NUEVO_PROVEEDOR.primerApellido = VALOR_FORMULARIO.primerApellido;
  NUEVO_PROVEEDOR.segundoApellido = VALOR_FORMULARIO.segundoApellido;
  NUEVO_PROVEEDOR.razonSocial = VALOR_FORMULARIO.denominacionRazon || '';
  NUEVO_PROVEEDOR.lada = VALOR_FORMULARIO.lada;

  let UPDATED_PROVEEDORES: Proveedor[] = Array.isArray(this.proveedorTablaDatos) 
    ? [...this.proveedorTablaDatos] 
    : [];

  if (this.datoSeleccionado?.[0]?.id) {
    NUEVO_PROVEEDOR.id = this.datoSeleccionado[0].id;
    UPDATED_PROVEEDORES = UPDATED_PROVEEDORES.map(p => 
      p.id === NUEVO_PROVEEDOR.id ? NUEVO_PROVEEDOR : p
    );
  } else {
    const IS_DUPLICATE = UPDATED_PROVEEDORES.some(p => 
      (p.rfc && NUEVO_PROVEEDOR.rfc && p.rfc === NUEVO_PROVEEDOR.rfc) ||
      (p.nombreRazonSocial && p.nombreRazonSocial === NUEVO_PROVEEDOR.nombreRazonSocial)
    );
    
    if (IS_DUPLICATE) {
      this.message = 'La información proporcionada de la persona ya existe, favor de verificar.';
      return;
    }

    const NEXT_ID = UPDATED_PROVEEDORES.length > 0 
      ? Math.max(...UPDATED_PROVEEDORES.map(p => p.id || 0)) + 1 
      : 1;
    NUEVO_PROVEEDOR.id = NEXT_ID;
    UPDATED_PROVEEDORES.push(NUEVO_PROVEEDOR);
  }

  this.updateProveedorTablaDatos.emit(UPDATED_PROVEEDORES);
  this.agregarProveedorForm.reset();
  this.datoSeleccionado = [];
  this.guardarYSalir.emit();
}

  /**
 * Genera un arreglo de objetos de catálogo que coinciden con el identificador proporcionado.
 *
 * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
 * @param {string} id - Identificador para filtrar los objetos del catálogo.
 * @returns {Catalogo[] | undefined} - Arreglo de objetos de catálogo que coinciden con el identificador, o undefined si no hay coincidencias.
 */
static generarCatalogoObjeto(catalogo: Catalogo[], id: string): Catalogo[] | undefined {
  return catalogo.filter(item => item.clave === id);
}
  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `agregarProveedorForm` para limpiar todos los campos.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  limpiarFormulario(): void {
    this.agregarProveedorForm.markAsUntouched();
    this.agregarProveedorForm.reset();
    this.agregarProveedorForm.disable();
    this.estaDeshabilitadoDesplegable= true;
    this.agregarProveedorForm.get('tipoPersona')?.enable();
  }
  /**
   * @method cancelar
   * @description Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  cancelar(): void {
    this.limpiarFormulario();
    this.datoSeleccionado = [];
    this.cancelarmodal.emit();
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.agregarProveedorForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @description Habilita o deshabilita los controles del formulario según el valor del campo 'tipoPersona'.
   * Si 'tipoPersona' está vacío, desactiva todos los campos excepto 'tipoPersona'.
   * En caso contrario, habilita todos los campos y marca el desplegable como habilitado.
   */
  changeNacionalidad(): void {
    if (this.agregarProveedorForm?.value?.tipoPersona === '') {
      Object.keys(this.agregarProveedorForm.controls).forEach((controlName) => {
        this.agregarProveedorForm.get(controlName)?.disable();
        if (controlName === 'nacionalidad' || controlName === 'tipoPersona') {
          this.agregarProveedorForm.get(controlName)?.enable();
        }
      });
    } else if (
      this.agregarProveedorForm?.value?.nacionalidad === this.nacionalStr &&
      (this.agregarProveedorForm?.value?.tipoPersona ===
        this.tipoPersona.FISICA ||
        this.agregarProveedorForm?.value?.tipoPersona ===
          this.tipoPersona.MORAL)
    ) {
      Object.keys(this.agregarProveedorForm.controls).forEach((controlName) => {
        this.agregarProveedorForm.get(controlName)?.disable();
        if (
          controlName === 'nacionalidad' ||
          controlName === 'rfc' ||
          controlName === 'tipoPersona'
        ) {
          this.agregarProveedorForm.get(controlName)?.enable();
        }
      });
    } else if (
      this.agregarProveedorForm?.value?.nacionalidad === this.nacionalStr &&
      this.agregarProveedorForm?.value?.tipoPersona ===
        this.tipoPersona.NO_CONTRIBUYENTE
    ) {
      Object.keys(this.agregarProveedorForm.controls).forEach((controlName) => {
        this.agregarProveedorForm.get(controlName)?.disable();
        if (
          controlName === 'nacionalidad' ||
          controlName === 'tipoPersona' ||
          controlName === 'curp'
        ) {
          this.agregarProveedorForm.get(controlName)?.enable();
        }
      });
    } else {
      if (this.agregarProveedorForm?.get('tipoPersona')?.value) {
        Object.keys(this.agregarProveedorForm.controls).forEach(
          (controlName) => {
            if (
              controlName !== 'nacionalidad' &&
              controlName !== 'tipoPersona'
            ) {
              this.agregarProveedorForm.get(controlName)?.reset();
            }
          }
        );
      }
      Object.keys(this.agregarProveedorForm.controls).forEach((controlName) => {
        this.agregarProveedorForm.get(controlName)?.enable();
        this.estaDeshabilitadoDesplegable = false;
      });
    }
     this.updateDenominacionRazonValidation();
  }

  /**
   * Actualiza las validaciones del campo denominacionRazon basado en el valor de tipoPersona
   */
private updateDenominacionRazonValidation(): void {
   const DENOMINACIONRAZONCONTROL = this.agregarProveedorForm?.get('denominacionRazon');
  const NOMBRESCONTROL = this.agregarProveedorForm?.get('nombres');
  const PRIMERAPELLIDOCONTROL = this.agregarProveedorForm?.get('primerApellido');

  if (!DENOMINACIONRAZONCONTROL || !NOMBRESCONTROL || !PRIMERAPELLIDOCONTROL) {
    return;
  }
  
   const TIPOPERSONAVALUE = this.agregarProveedorForm?.get('tipoPersona')?.value;
  
  if (TIPOPERSONAVALUE === this.tipoPersona.MORAL) {
    DENOMINACIONRAZONCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    
    NOMBRESCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    PRIMERAPELLIDOCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);

  } else if (TIPOPERSONAVALUE === this.tipoPersona.FISICA || TIPOPERSONAVALUE === this.tipoPersona.NO_CONTRIBUYENTE) {
    DENOMINACIONRAZONCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    
    NOMBRESCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    PRIMERAPELLIDOCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    
  } else {
    DENOMINACIONRAZONCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    NOMBRESCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    PRIMERAPELLIDOCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
  }
  
  DENOMINACIONRAZONCONTROL.updateValueAndValidity();
  NOMBRESCONTROL.updateValueAndValidity();
  PRIMERAPELLIDOCONTROL.updateValueAndValidity();
}

  /**
   * @method ngOnDestroy
   * @description Hook de destrucción del componente. Libera las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
