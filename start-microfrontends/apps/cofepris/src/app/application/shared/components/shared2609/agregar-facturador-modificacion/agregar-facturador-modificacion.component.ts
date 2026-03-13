import {
  CODIGO_POSTAL,
  Catalogo,
  CatalogoServices,
  REGEX_CORREO_ELECTRONICO,
  REGEX_IMPORTE_PAGO,
  REGEX_IMPORTE_PAGO_FACTURADO,
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
import { Subject, Subscription } from 'rxjs';
import {CatalogoSelectComponent} from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../../../services/datos-solicitud.service';
import { Facturador } from '../../../models/terceros-relacionados.model';
import { PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR } from '../../../constantes/datos-solicitud.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { takeUntil } from 'rxjs/operators';


/**
 * Componente para agregar un facturador (persona física o moral) al trámite actual.
 * Permite capturar datos generales y de contacto, y actualiza el store con el nuevo registro.
 */
@Component({
  selector: 'app-agregar-facturador-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TituloComponent,
    TooltipModule,
  ],
  templateUrl: './agregar-facturador.component.html',
  styleUrl: './agregar-facturador.component.css',
})
export class AgregarFacturadorModificacionComponent
  implements OnInit, OnDestroy, OnChanges
{
  /**
   * Identificador del procedimiento actual.
   * Utilizado para controlar el flujo de la vista dependiendo del tipo de procedimiento.
   *
   * @input idProcedimiento - Cadena que representa el ID del procedimiento (por ejemplo: '260102').
   */
  @Input()
  idProcedimiento!: number;

   /**
   * Indica si se ha realizado la verificación de validación al intentar guardar.
   * Esta bandera se utiliza para controlar la visualización de mensajes de error o advertencia
   * cuando el usuario intenta guardar el formulario sin cumplir con los requisitos de validación.
   */
  chequeoValidacionAlGuardar =false;
  /**
   * Lista de elementos deshabilitados en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben estar deshabilitados en el formulario.
   */
  public elementosDeshabilitados: string[] = [];
  /**
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;
  /**
   * Formulario reactivo para capturar los datos del facturador.
   * @property {FormGroup} agregarFacturadorForm
   */
  agregarFacturadorForm!: FormGroup;

  /**
   * Subject utilizado para desuscribirse automáticamente de observables al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Lista de países obtenidos del servicio.
   * @property {Catalogo[]} paisesDatos
   */
  paisesDatos: Catalogo[] = [];

  /**
   * Lista de facturadores almacenados localmente.
   * @property {Facturador[]} facturadores
   */
  facturadores: Facturador[] = [];

  @Input() facturadoresTablaDatos: Facturador[] = [];

  /**
   * @property {Facturador | undefined} datoSeleccionado
   * Dato seleccionado que se pasará al componente hijo `AgregarDestinatarioComponent`.
   */
  @Input() datoSeleccionado: Facturador[] | undefined;

  /**
   * Evento de salida que emite la lista de facturadores actualizada.
   * @property {EventEmitter<Facturador[]>} updateFacturadorTablaDatos
   */
  @Output() updateFacturadorTablaDatos = new EventEmitter<Facturador[]>();

  @Output() guardarYSalir = new EventEmitter<void>();

  @Output() cancelarDestinario = new EventEmitter<void>();

  /**
   * Controla si el desplegable de nacionalidad está deshabilitado.
   * @property {boolean} estaDeshabilitadoDesplegable
   */
  public estaDeshabilitadoDesplegable: boolean = true;

     
  /**
   * Identificador del trámite asociado a la ampliación de 3Rs.
   */
  @Input() tramiteID: string = '';
  /**
   * Suscripción para manejar observables.
   */
  private subscription: Subscription = new Subscription();
  /**
   * Constructor que inicializa el formulario y servicios necesarios.
   *
   * @param {FormBuilder} fb - FormBuilder para construir el formulario reactivo.
   * @param {DatosSolicitudService} datosSolicitudService - Servicio para obtener listas de catálogos.
   * @param {Tramite260204Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite260204Query} tramiteQuery - Servicio para consultar el estado actual del trámite.
   * @param {Location} ubicaccion - Servicio para manejar la navegación (volver atrás).
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
   * Hook de inicialización del componente. Carga los catálogos necesarios.
   */
  ngOnInit(): void {
    this.obtenerListaPaises(this.tramiteID);
    this.crearAgregarFormularioFacturador();
    this.changeNacionalidad();
     this.chequeoValidacionAlGuardar =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento)
        ? true
        :false;
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
   * Método que inicializa el formulario reactivo y valida los elementos según el procedimiento.
   * @returns {void}
   */
  crearAgregarFormularioFacturador(): void {
    this.agregarFacturadorForm = this.fb.group({
      tipoPersona: [this.obtenerValor('tipoPersona'), [Validators.required]],
      nombres: [
        this.obtenerValor('nombres'),
        [ Validators.pattern(REGEX_NOMBRE)],
      ],
      primerApellido: [
        this.obtenerValor('primerApellido'),
        [ Validators.pattern(REGEX_NOMBRE)],
      ],
      segundoApellido: [
        this.obtenerValor('segundoApellido'),
        [Validators.pattern(REGEX_NOMBRE)],
      ],
      pais: [this.obtenerValor('pais'), [Validators.required]],
      estado: [
        this.obtenerValor('estadoLocalidad'),
        [Validators.required, Validators.pattern( REGEX_IMPORTE_PAGO_FACTURADO)],
      ],
     codigoPostal: [
      this.obtenerValor('codigoPostal'),
      this.idProcedimiento === 260911
        ? [Validators.required, Validators.pattern(CODIGO_POSTAL)]
        : [Validators.pattern(CODIGO_POSTAL)]
    ],
      colonia: [this.obtenerValor('colonia')],
      calle: [this.obtenerValor('calle'), [Validators.required]],
      numeroExterior: [
        this.obtenerValor('numeroExterior'),
        [Validators.required],
      ],
      numeroInterior: [this.obtenerValor('numeroInterior')],
      lada: [this.obtenerValor('lada')],
      denominacionRazon: [
        '',
        [ Validators.pattern(REGEX_NOMBRE)],
      ],
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
    });
  }

  /**
   * Ciclo de vida de Angular: `ngOnChanges`.
   *
   * @param {SimpleChanges} currentValue - Objeto que contiene los cambios detectados
   * en las propiedades de entrada (`@Input`) del componente.
   */
  ngOnChanges(currentValue: SimpleChanges): void {
    if (currentValue['datoSeleccionado']) {
      this.datoSeleccionado = currentValue['datoSeleccionado'].currentValue;
      setTimeout(() => {
        if (this.datoSeleccionado?.[0]?.tipoPersona) {
          this.agregarFacturadorForm?.enable();
        }
        let valorPais = this.datoSeleccionado?.[0]?.pais;
        if (valorPais && this.paisesDatos.length > 0) {
          const PAIS_ENCONTRADO = this.paisesDatos.find(p => 
            p.descripcion === valorPais || 
            p.clave?.toString() === valorPais?.toString()
          );
          valorPais = PAIS_ENCONTRADO ? PAIS_ENCONTRADO.clave : valorPais;
        }
        this.agregarFacturadorForm.patchValue({
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
   * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
   * @param {keyof Facturador } field - Nombre del campo a obtener.
   * @returns {string | number | undefined | string[]} - Valor del campo especificado.
   */
  public obtenerValor(field: keyof Facturador): string | number | undefined | Catalogo {
    return this.datoSeleccionado?.[0]?.[field as keyof Facturador] ?? '';
  }

  /**
   * Carga los países desde el servicio y los almacena en `paisesDatos`.
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
 * Construye un objeto `Facturador` a partir del formulario,
 * lo agrega al arreglo `facturadores` y actualiza el store.
 * Después, limpia el formulario y regresa a la vista anterior.
 */
// eslint-disable-next-line complexity
guardarFacturador(): void {
  if(this.chequeoValidacionAlGuardar){
    if (this.agregarFacturadorForm.invalid) {
      // Marca todos los controles como tocados para mostrar errores de validación
      Object.values(this.agregarFacturadorForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      // NO redirigir ni emitir nada si el formulario es inválido
      return;
    }
  }

  const VALOR_FORMULARIO = this.agregarFacturadorForm.getRawValue();
  
  const NUEVO_FACTURADOR: Facturador = VALOR_FORMULARIO as Facturador;
  
  const PAIS_ID = this.agregarFacturadorForm.get('pais')?.value;
  const PAIS_OBJ = AgregarFacturadorModificacionComponent.generarCatalogoObjeto(this.paisesDatos, PAIS_ID);
  
  NUEVO_FACTURADOR.pais = PAIS_OBJ?.[0]?.descripcion ?? '';
  NUEVO_FACTURADOR.paisObj = PAIS_OBJ?.[0] ?? undefined;
  
  NUEVO_FACTURADOR.colonia = this.agregarFacturadorForm.get('colonia')?.value || '';
  NUEVO_FACTURADOR.municipioAlcaldia = '';
  NUEVO_FACTURADOR.localidad = '';
  NUEVO_FACTURADOR.entidadFederativa = '';
  NUEVO_FACTURADOR.estadoLocalidad = this.agregarFacturadorForm.get('estado')?.value || '';
  NUEVO_FACTURADOR.codigoPostal = this.agregarFacturadorForm.get('codigoPostal')?.value || '';
  NUEVO_FACTURADOR.coloniaEquivalente = '';

  let nombreRazonSocial: string;
  if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.MORAL) {
    nombreRazonSocial = VALOR_FORMULARIO.denominacionRazon;
  } else if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.FISICA) {
    nombreRazonSocial = `${VALOR_FORMULARIO.nombres} ${VALOR_FORMULARIO.primerApellido} ${VALOR_FORMULARIO.segundoApellido || ''}`.trim();
  } else {
    nombreRazonSocial = '';
  }
  NUEVO_FACTURADOR.nombreRazonSocial = nombreRazonSocial;

  NUEVO_FACTURADOR.nacionalidad = VALOR_FORMULARIO.nacionalidad || '';
  NUEVO_FACTURADOR.tipoPersona = VALOR_FORMULARIO.tipoPersona;
  NUEVO_FACTURADOR.rfc = '';
  NUEVO_FACTURADOR.curp = '';
  NUEVO_FACTURADOR.telefono = VALOR_FORMULARIO.telefono || '';
  NUEVO_FACTURADOR.correoElectronico = VALOR_FORMULARIO.correoElectronico || '';
  NUEVO_FACTURADOR.calle = VALOR_FORMULARIO.calle || '';
  NUEVO_FACTURADOR.numeroExterior = VALOR_FORMULARIO.numeroExterior || '';
  NUEVO_FACTURADOR.numeroInterior = VALOR_FORMULARIO.numeroInterior || '';
  NUEVO_FACTURADOR.nombres = VALOR_FORMULARIO.nombres;
  NUEVO_FACTURADOR.primerApellido = VALOR_FORMULARIO.primerApellido;
  NUEVO_FACTURADOR.segundoApellido = VALOR_FORMULARIO.segundoApellido;
  NUEVO_FACTURADOR.razonSocial = VALOR_FORMULARIO.denominacionRazon || '';
  NUEVO_FACTURADOR.lada = VALOR_FORMULARIO.lada;

  let UPDATED_FACTURADORES: Facturador[] = Array.isArray(this.facturadoresTablaDatos) 
    ? [...this.facturadoresTablaDatos] 
    : [];

  if (this.datoSeleccionado?.[0]?.id) {
    NUEVO_FACTURADOR.id = this.datoSeleccionado[0].id;
    UPDATED_FACTURADORES = UPDATED_FACTURADORES.map(f => 
      f.id === NUEVO_FACTURADOR.id ? NUEVO_FACTURADOR : f
    );
  } else {
    const NEXT_ID = UPDATED_FACTURADORES.length > 0 
      ? Math.max(...UPDATED_FACTURADORES.map(f => f.id || 0)) + 1 
      : 1;
    NUEVO_FACTURADOR.id = NEXT_ID;
    UPDATED_FACTURADORES.push(NUEVO_FACTURADOR);
  }

  this.updateFacturadorTablaDatos.emit(UPDATED_FACTURADORES);
  this.agregarFacturadorForm.reset();
  this.datoSeleccionado = [];
  this.guardarYSalir.emit();
}
  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `agregarFacturadorForm` para limpiar todos los campos.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  limpiarFormulario(): void {
    this.agregarFacturadorForm.markAsUntouched();
    this.agregarFacturadorForm.disable();
    this.agregarFacturadorForm.reset();
    this.estaDeshabilitadoDesplegable = true;
    this.agregarFacturadorForm.get('tipoPersona')?.enable();  
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
    this.cancelarDestinario.emit();
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.agregarFacturadorForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Habilita o deshabilita los controles del formulario según el valor de `tipoPersona`.
   * Si `tipoPersona` está vacío, deshabilita todos los campos excepto el propio `tipoPersona`.
   * Si tiene valor, habilita todos los campos y activa el desplegable de nacionalidad.
   *
   * @returns {void} No retorna ningún valor.
   */
  changeNacionalidad(): void {
    if (this.agregarFacturadorForm?.value?.tipoPersona === '') {
      Object.keys(this.agregarFacturadorForm.controls).forEach(
        (controlName) => {
          this.agregarFacturadorForm.get(controlName)?.disable();
          if (controlName === 'tipoPersona') {
            this.agregarFacturadorForm.get(controlName)?.enable();
          }
        }
      );
    } else {
      if (this.agregarFacturadorForm?.get('tipoPersona')?.value) {
        Object.keys(this.agregarFacturadorForm.controls).forEach(
          (controlName) => {
            if (
              controlName !== 'nacionalidad' &&
              controlName !== 'tipoPersona'
            ) {
              this.agregarFacturadorForm.get(controlName)?.reset();
            }
          }
        );
      }
      Object.keys(this.agregarFacturadorForm.controls).forEach(
        (controlName) => {
          this.agregarFacturadorForm.get(controlName)?.enable();
          this.estaDeshabilitadoDesplegable = false;
        }
      );
    }
    this.updateDenominacionRazonValidation();

  }

  
  /**
   * Actualiza la validación del campo denominacionRazon basado en el valor de tipoPersona
   */
private updateDenominacionRazonValidation(): void {
   const DENOMINACIONRAZONCONTROL = this.agregarFacturadorForm?.get('denominacionRazon');
  const NOMBRESCONTROL = this.agregarFacturadorForm?.get('nombres');
  const PRIMERAPELLIDOCONTROL = this.agregarFacturadorForm?.get('primerApellido');

  if (!DENOMINACIONRAZONCONTROL || !NOMBRESCONTROL || !PRIMERAPELLIDOCONTROL) {
    return;
  }
  
   const TIPOPERSONAVALUE = this.agregarFacturadorForm?.get('tipoPersona')?.value;
  
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
   * Hook de destrucción del componente. Libera recursos y detiene suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
