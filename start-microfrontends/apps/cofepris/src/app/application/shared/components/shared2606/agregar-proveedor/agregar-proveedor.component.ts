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

import { doDeepCopy, esValidArray, getValidDatos } from '@ng-mf/data-access-user';

import { PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR, STR_NACIONAL } from '../../../constantes/shared2606/datos-solicitud.enum';
import { Subject, Subscription } from 'rxjs';
import {CatalogoSelectComponent} from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../../../services/shared2606/datos-solicitud.service';
import { Proveedor } from '../../../models/shared2606/terceros-relacionados.model';
import { TERCEROS_RELACIONADOS_DATOS_INICIALES } from '../../../constantes/shared2606/terceros-fabricante.enum';
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
    this.obtenerListaPaises(this.idProcedimiento.toString());
    this.validarElementos();
    this.chequeoValidacionAlGuardar =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento)
        ? false
        :true;
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
        this.obtenerValor('segundoApellido')
      ],
      pais: [this.obtenerValor('pais'), Validators.required],
      estado: [
        this.obtenerValor('estadoLocalidad'),
        (this.elementosRequeridos.includes('estado') || this.chequeoValidacionAlGuardar)
          ? [Validators.required, Validators.pattern('^[a-zA-Z0-9/s/(/)/-/./#&,]*$')]
          : [],
      ],
       codigoPostal: [
      this.obtenerValor('codigoPostal')
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
        }
      ],
      correoElectronico: [
        {
          value: this.elementosDeshabilitados.includes('correoElectronico')
            ? 'abc@njk.com'
            : this.obtenerValor('correoElectronico'),
          disabled: this.elementosDeshabilitados.includes('correoElectronico'),
        }
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
          nacionalidad: this.datoSeleccionado?.[0]?.nacionalidad,
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
      if (this.agregarProveedorForm.get('nacionalidad')?.value === this.nacionalStr) {
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
        this.agregarProveedorForm.get('rfc')?.clearValidators();
        this.agregarProveedorForm.get('curp')?.clearValidators();
      }
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
guardarProveedor(): void {
  if (!this.validarFormularioAntesDeSave()) {
    return;
  }

  const VALOR_FORMULARIO = this.agregarProveedorForm.getRawValue();
  const NUEVO_PROVEEDOR = this.crearObjetoProveedor(VALOR_FORMULARIO);
  const UPDATED_PROVEEDORES = this.actualizarListaProveedores(NUEVO_PROVEEDOR);

  if (!UPDATED_PROVEEDORES) {
    return;
  }

  this.finalizarGuardado(UPDATED_PROVEEDORES);
}

/**
 * Valida el formulario antes de guardar.
 */
private validarFormularioAntesDeSave(): boolean {
  if (this.chequeoValidacionAlGuardar && this.agregarProveedorForm.invalid) {
    this.marcarControlesComoTocados();
    this.message = 'Faltan campos por capturar.';
    return false;
  }
  return true;
}

/**
 * Marca todos los controles del formulario como tocados para mostrar errores.
 */
private marcarControlesComoTocados(): void {
  Object.values(this.agregarProveedorForm.controls).forEach(control => {
    control.markAsTouched();
    control.updateValueAndValidity();
  });
}

/**
 * Crea un objeto Proveedor a partir de los datos del formulario.
 */
private crearObjetoProveedor(valorFormulario: Proveedor): Proveedor {
  const NUEVO_PROVEEDOR: Proveedor = valorFormulario as Proveedor;
  
  this.asignarDatosPais(NUEVO_PROVEEDOR);
  this.asignarDatosUbicacion(NUEVO_PROVEEDOR, valorFormulario);
  this.asignarNombreRazonSocial(NUEVO_PROVEEDOR, valorFormulario);
  AgregarProveedorComponent.asignarDatosPersonales(NUEVO_PROVEEDOR, valorFormulario);

  return NUEVO_PROVEEDOR;
}

private asignarDatosPais(proveedor: Proveedor): void {
  let PAIS_ID = this.agregarProveedorForm.get('pais')?.value;

  // Check if PAIS_ID is a description (length > 3)
  if (PAIS_ID && PAIS_ID.length > 3) {
    const PAIS_CLAVE = this.generarClavesDesdeDescripcion(this.paisesDatos, PAIS_ID);
    PAIS_ID = PAIS_CLAVE ?? PAIS_ID; // Replace PAIS_ID with the corresponding clave if found
  }

  // Use the existing logic to find the catalog object
  const PAIS_OBJ = AgregarProveedorComponent.generarCatalogoObjeto(this.paisesDatos, PAIS_ID);

  // Assign values to the proveedor
  proveedor.pais = PAIS_OBJ?.[0]?.descripcion ?? '';
  proveedor.paisObj = PAIS_OBJ?.[0] ?? undefined;
}

/**
 * Asigna datos de ubicación al proveedor.
 */
private asignarDatosUbicacion(proveedor: Proveedor, valorFormulario: Proveedor): void {
  proveedor.colonia = this.agregarProveedorForm.get('colonia')?.value || '';
  proveedor.municipioAlcaldia = this.agregarProveedorForm.get('municipioAlcaldia')?.value || '';
  proveedor.localidad = this.agregarProveedorForm.get('localidad')?.value || '';
  proveedor.entidadFederativa = '';
  proveedor.estadoLocalidad = this.agregarProveedorForm.get('estado')?.value || '';
  proveedor.codigoPostal = this.agregarProveedorForm.get('codigoPostal')?.value || '';
  proveedor.coloniaEquivalente = '';
  proveedor.calle = valorFormulario.calle || '';
  proveedor.numeroExterior = valorFormulario.numeroExterior || '';
  proveedor.numeroInterior = valorFormulario.numeroInterior || '';
}

/**
 * Determina y asigna el nombre o razón social del proveedor.
 */
private asignarNombreRazonSocial(proveedor: Proveedor, valorFormulario: Proveedor): void {
  let nombreRazonSocial: string;
  
  if (valorFormulario.tipoPersona === this.tipoPersona.MORAL) {
    nombreRazonSocial = valorFormulario.denominacionRazon || '';
  } else if (valorFormulario.tipoPersona === this.tipoPersona.FISICA) {
    nombreRazonSocial = `${valorFormulario.nombres} ${valorFormulario.primerApellido} ${valorFormulario.segundoApellido || ''}`.trim();
  } else {
    nombreRazonSocial = '';
  }
  
  proveedor.nombreRazonSocial = nombreRazonSocial;
}

/**
 * Asigna datos personales y de contacto al proveedor.
 */
private static asignarDatosPersonales(proveedor: Proveedor, valorFormulario: Proveedor): void {
  proveedor.nacionalidad = valorFormulario.nacionalidad || '';
  proveedor.tipoPersona = valorFormulario.tipoPersona;
  proveedor.rfc = valorFormulario.rfc || '';
  proveedor.curp = valorFormulario.curp || '';
  proveedor.telefono = `${valorFormulario.lada || ''} ${valorFormulario.telefono || ''}`.trim();
  proveedor.correoElectronico = valorFormulario.correoElectronico || '';
  proveedor.nombres = valorFormulario.nombres;
  proveedor.primerApellido = valorFormulario.primerApellido;
  proveedor.segundoApellido = valorFormulario.segundoApellido;
  proveedor.razonSocial = valorFormulario.denominacionRazon || '';
  proveedor.lada = valorFormulario.lada;
}

/**
 * Actualiza la lista de proveedores con el nuevo proveedor.
 */
private actualizarListaProveedores(nuevoProveedor: Proveedor): Proveedor[] | null {
  const UPDATED_PROVEEDORES: Proveedor[] = Array.isArray(this.proveedorTablaDatos) 
    ? [...this.proveedorTablaDatos] 
    : [];

  if (this.datoSeleccionado?.[0]?.id) {
    return this.actualizarProveedorExistente(nuevoProveedor, UPDATED_PROVEEDORES);
  }
  return this.agregarNuevoProveedor(nuevoProveedor, UPDATED_PROVEEDORES);
}

/**
 * Actualiza un proveedor existente en la lista.
 */
private actualizarProveedorExistente(nuevoProveedor: Proveedor, proveedores: Proveedor[]): Proveedor[] {
  nuevoProveedor.id = this.datoSeleccionado?.[0]?.id;
  return proveedores.map(p => p.id === nuevoProveedor.id ? nuevoProveedor : p);
}

/**
 * Agrega un nuevo proveedor a la lista verificando duplicados.
 */
private agregarNuevoProveedor(nuevoProveedor: Proveedor, proveedores: Proveedor[]): Proveedor[] | null {
  if (AgregarProveedorComponent.esDuplicado(nuevoProveedor, proveedores)) {
    this.message = 'La información proporcionada de la persona ya existe, favor de verificar.';
    return null;
  }

  const NEXT_ID = proveedores.length > 0 
    ? Math.max(...proveedores.map(p => p.id || 0)) + 1 
    : 1;
  nuevoProveedor.id = NEXT_ID;
  proveedores.push(nuevoProveedor);
  
  return proveedores;
}

/**
 * Verifica si el proveedor es duplicado.
 */
private static esDuplicado(nuevoProveedor: Proveedor, proveedores: Proveedor[]): boolean {
  return proveedores.some(p => 
    (p.rfc && nuevoProveedor.rfc && p.rfc === nuevoProveedor.rfc) ||
    (p.nombreRazonSocial && p.nombreRazonSocial === nuevoProveedor.nombreRazonSocial)
  );
}

/**
 * Finaliza el proceso de guardado emitiendo eventos y limpiando formulario.
 */
private finalizarGuardado(proveedores: Proveedor[]): void {
  this.updateProveedorTablaDatos.emit(proveedores);
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
    //this.agregarProveedorForm.get('tipoPersona')?.enable();
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
    const nacionalidad = this.agregarProveedorForm.get('nacionalidad')?.value;
    const tipoPersona = this.agregarProveedorForm.get('tipoPersona');
    if ((!nacionalidad || (nacionalidad === this.nacionalStr && !tipoPersona?.value))||(nacionalidad === 'Extranjero' && !tipoPersona?.value)) {
       Object.keys(this.agregarProveedorForm.controls).forEach((controlName) => {
        this.agregarProveedorForm.get(controlName)?.disable();
        if (controlName === 'nacionalidad' || (controlName === 'tipoPersona' && (nacionalidad === this.nacionalStr || nacionalidad === 'Extranjero'))) {
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

// eslint-disable-next-line class-methods-use-this
  buscar(form: FormGroup): void {
    const PROCEDIMIENTO = String(this.idProcedimiento);
    let DATOS: Record<string, unknown> = {};
    if (form.get('rfc')?.valid && getValidDatos(form.get('rfc')?.value)) {
      const PAYLOAD = {
        "rfcRepresentanteLegal": form.get('rfc')?.value
      }
      this.datosSolicitudService.getRepresentanteLegala(PAYLOAD, PROCEDIMIENTO).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidArray(API_RESPONSE.datos)) {
          DATOS = AgregarProveedorComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
          form.patchValue(DATOS);
        }
      });
    } else if (form.get('curp')?.valid && getValidDatos(form.get('curp')?.value)) {
       const CURP = form.get('curp')?.value;
       this.datosSolicitudService.getCURP(CURP, PROCEDIMIENTO).pipe(takeUntil(this.unsubscribe$))
       .subscribe((response) => {
          const API_RESPONSE = doDeepCopy(response);
          if(esValidArray(API_RESPONSE.datos)) {
            DATOS = AgregarProveedorComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
            form.patchValue(DATOS);
          }
       });
    } else {
      form.get('rfc')?.markAsTouched();
      form.get('curp')?.markAsTouched();
    }
  }

  static mapApiResponseToForm(apiResponse: Record<string, unknown>): Record<string, unknown> {
     const CONTRIBUYENTE: unknown = apiResponse?.['contribuyente'] || {};
     const DOMICILIO =
       typeof CONTRIBUYENTE === 'object' && CONTRIBUYENTE !== null && 'domicilio' in CONTRIBUYENTE
         ? (CONTRIBUYENTE as { domicilio?: unknown }).domicilio || {}
         : {};
  
     return {
       ...AgregarProveedorComponent.mapPersonFields(apiResponse, CONTRIBUYENTE as {
         curp?: string;
         nombre?: string;
         primerApellido?: string;
         segundoApellido?: string;
         denominacionRazon?: string;
         telefono?: string;
         correo_electronico?: string;
       }),
       ...AgregarProveedorComponent.mapAddressFields(DOMICILIO),
       lada: '',
       extranjeroCodigo: '',
       extranjeroEstado: '',
       extranjeroColonia: '',
     };
   }

  private static mapPersonFields(
    apiResponse: { curp?: string; nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string } = {},
    CONTRIBUYENTE: { curp?: string; nombre?: string; apellido_paterno?: string; apellido_materno?: string; razon_social?: string; telefono?: string; correo_electronico?: string } = {}
  ): Record<string, unknown> {
    return {
      curp: apiResponse.curp ?? CONTRIBUYENTE.curp ?? '',
      nombre: apiResponse.nombre ?? CONTRIBUYENTE.nombre ?? '',
      nombres: apiResponse.nombre ?? CONTRIBUYENTE.nombre ?? '',
      primerApellido: apiResponse.apellidoPaterno ?? CONTRIBUYENTE.apellido_paterno ?? '',
      segundoApellido: apiResponse.apellidoMaterno ?? CONTRIBUYENTE.apellido_materno ?? '',
      denominacionRazon: CONTRIBUYENTE.razon_social ?? '',
      telefono: CONTRIBUYENTE.telefono ?? '',
      correoElectronico: CONTRIBUYENTE.correo_electronico ?? '',
    };
  }

  private static mapAddressFields(DOMICILIO: {
    pais?: { nombre?: string };
    entidad_federativa?: { nombre?: string };
    delegacion_municipio?: { nombre?: string };
    localidad?: { nombre?: string };
    estado?: { nombre?: string };
    cp?: string;
    colonia?: { nombre?: string };
    calle?: string;
    num_exterior?: string;
    num_interior?: string;
  } = {}): Record<string, unknown> {
    return {
      pais: DOMICILIO?.pais?.nombre ?? '',
      estadoLocalidad: DOMICILIO?.entidad_federativa?.nombre ?? '',
      municipioAlcaldia: DOMICILIO?.delegacion_municipio?.nombre ?? '',
      localidad: DOMICILIO?.localidad?.nombre ?? '',
      estado: DOMICILIO?.entidad_federativa?.nombre ?? '',
      entidadFederativa: DOMICILIO?.entidad_federativa?.nombre ?? '',
      codigoPostaloEquivalente: DOMICILIO?.cp ?? '',
      codigoPostal: DOMICILIO?.cp ?? '',
      colonia: DOMICILIO?.colonia?.nombre ?? '',
      coloniaoEquivalente: '',
      calle: DOMICILIO?.calle ?? '',
      numeroExterior: DOMICILIO?.num_exterior ?? '',
      numeroInterior: DOMICILIO?.num_interior ?? '',
    };
  }

  generarClavesDesdeDescripcion(
    catalogo: Catalogo[] | undefined | null,
    descripciones: string | string[]
  ): string[] | undefined {
    if (!catalogo || catalogo.length === 0 || !descripciones) {
      return undefined;
    }
  
    // Ensure descripciones is an array
    const descripcionesArray = Array.isArray(descripciones) ? descripciones : [descripciones];
  
    return catalogo
      .filter(item =>
        descripcionesArray.some(desc => desc.trim().toLowerCase() === item.descripcion.trim().toLowerCase())
      ) // Match descriptions (case-insensitive and trimmed)
      .map(item => item.clave) // Extract claves
      .filter((clave): clave is string => clave !== undefined); // Ensure no undefined values
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
