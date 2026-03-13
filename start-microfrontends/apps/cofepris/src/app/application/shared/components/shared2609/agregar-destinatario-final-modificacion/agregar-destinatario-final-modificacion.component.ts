/* eslint-disable complexity */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  AlertComponent,
  Catalogo,
  CatalogoServices,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_CORREO_ELECTRONICO,
  REGEX_NOMBRE,
  REGEX_RFC_FISICA,
  REGEX_RFC_MORAL,
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
import { PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE,PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR } from '../../../constantes/datos-solicitud.enum';
import { Subject, Subscription } from 'rxjs';
import {CatalogoSelectComponent} from '@libs/shared/data-access-user/src';
import { DEFAULT_TABLA_ORDENS } from '../../../constantes/terceros-fabricante.enum';
import { DatosSolicitudService } from '../../../services/datos-solicitud.service';
import { Destinatario } from '../../../models/terceros-relacionados.model';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { takeUntil } from 'rxjs/operators';


/**
 * Componente para agregar un destinatario final (Destinatario) al formulario y almacenarlo.
 *
 * @example
 * <app-agregar-destinatario-final></app-agregar-destinatario-final>
 */
@Component({
  selector: 'app-agregar-destinatario-final-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    TooltipModule,
    NotificacionesComponent,
    AlertComponent
  ],
  templateUrl: './agregar-destinatario-final.component.html',
  styleUrl: './agregar-destinatario-final.component.css',
})
export class AgregarDestinatarioFinalModificacionComponent
  implements OnDestroy, OnInit, OnChanges {
   @Output() cancelarDestinario = new EventEmitter<void>();
  @Output() guardarYSalir = new EventEmitter<void>();
  @Input() destinatarioFinalTablaDatos: Destinatario[] = [];
  @Input() tramiteState: unknown;
  /**
   * Identificador del trámite asociado a la ampliación de 3Rs.
   */
  @Input() tramiteID: string = '';
  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * Se completa en `ngOnDestroy()` para prevenir fugas de memoria.
   * @property {Subject<void>} unsubscribe$
   * @private
   */
  private unsubscribe$ = new Subject<void>();

    /**
   * Indica si se ha realizado la verificación de validación al intentar guardar.
   * Esta bandera se utiliza para controlar la visualización de mensajes de error o advertencia
   * cuando el usuario intenta guardar el formulario sin cumplir con los requisitos de validación.
   */
  chequeoValidacionAlGuardar = false;
  
  /**
   * Flag to track if we're in edit mode (modifying existing record)
   * vs add mode (creating new record) - only used for modal scenario
   */
  isEditMode = false;
  /**
   * Grupo de formulario reactivo para recopilar los datos del destinatario final.
   * @property {FormGroup} agregarDestinatarioFinal
   */
  agregarDestinatarioFinal!: FormGroup;


  requiedField:boolean=false;

  /**
   * Datos de catálogo de países.
   * @property {Catalogo[]} paisesDatos
   */
  public paisesDatos: Catalogo[] = [];

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
   * Datos de catálogo de municipios.
   * @property {Catalogo[]} municipiosTempDatos
   */
  public municipiosTempDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de localidades.
   * @property {Catalogo[]} localidadesDatos
   */
  public localidadesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de localidades.
   * @property {Catalogo[]} localidadesTempDatos
   */
  public localidadesTempDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de colonias.
   * @property {Catalogo[]} coloniasDatos
   */
  public coloniasDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de colonias.
   * @property {Catalogo[]} coloniasTempDatos
   */
  public coloniasTempDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de códigos postales.
   * @property {Catalogo[]} codigosPostalesDatos
   */
  public codigosPostalesDatos: Catalogo[] = [];

  /**
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;

  /**
   * Arreglo que almacena la lista de destinatarios.
   * @property {Destinatario[]} destinatarios
   */
  destinatarios: Destinatario[] = [];

  /**
   * @property idProcedimiento
   * @description Identificador del procedimiento asociado a este componente.
   * @type {number}
   */
  @Input() idProcedimiento!: number;

  /**
   * @property mostrarCamposNoContribuyente
   * @description Controla la visibilidad de los campos específicos para no contribuyentes.
   * @type {boolean}
   * @default false
   */
  public mostrarCamposNoContribuyente: boolean = true;

  /**
   * Emite la lista de destinatarios actualizada para ser consumida por otros componentes.
   * @property {EventEmitter<Destinatario[]>} updateDestinatarioFinalTabla
   **/

  @Output() updateDestinatarioFinalTablaDatos = new EventEmitter<
    Destinatario[]
  >();

  /**
   * Lista de elementos deshabilitados en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben estar deshabilitados en el formulario.
   */
  public elementosDeshabilitados: string[] = [];

  /**
   * Lista de elementos requeridos en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben ser obligatorios en el formulario.
   */
  public elementosNoRequeridos: string[] = [];

  /**
   * Arreglo que almacena los elementos requeridos.
   * @type {string[]}
   */
  public elementosRequeridos: string[] = [];

  /**
   * Controla si el desplegable de nacionalidad está deshabilitado.
   * @property {boolean} estaDeshabilitadoDesplegable
   */
  public estaDeshabilitadoDesplegable: boolean = true;

  /**
   * @property {Destinatario | undefined} datoSeleccionado
   * Dato seleccionado que se pasará al componente hijo `AgregarDestinatarioComponent`.
   */
  @Input() datoSeleccionado: Destinatario[] | undefined;

  /**
   * Lista de destinatarios seleccionados que se reciben como entrada
   * desde un componente padre.
   *
   * @input
   * @type {Destinatario[] | undefined}
   */
  @Input() datoSeleccionadorfc: Destinatario[] | undefined;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;
    /**
     * Suscripción para manejar observables.
     */
    private subscription: Subscription = new Subscription();

  /**
   * Mensaje de error para mostrar en el formulario.
   * @property {string} mensajeDeError
   */
  mensajeDeError: string = '';

  /**
   * Crea el componente e inicializa el grupo de formulario.
   *
   * @param {FormBuilder} fb - Inyector de FormBuilder para crear formularios reactivos.
   * @param {Tramite260204Store} tramiteStore - Servicio que maneja las actualizaciones de estado para "Tramite260204".
   * @param {Tramite260204Query} tramiteQuery - Servicio para consultar el estado de "Tramite260204".
   * @param {Location} ubicaccion - Servicio de Angular para navegar hacia atrás en el historial.
   * @param {DatosSolicitudService} datosSolicitudService - Servicio para obtener diferentes listas de datos.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private datosSolicitudService: DatosSolicitudService,
     private catalogoServices: CatalogoServices
  ) {
    //constructor necesario para el servicio
  }

  /**
   * Hook de ciclo de vida de Angular que se llama cuando se detectan cambios en las propiedades de entrada.
   * Llama al método `mostrarCamposNoContribuyente()`.
   */
  ngOnChanges(currentValue: SimpleChanges): void {
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);
      
    if (currentValue['datoSeleccionado']) {
      this.datoSeleccionado = currentValue['datoSeleccionado'].currentValue;
      
      if (this.chequeoValidacionAlGuardar) {
        if (this.datoSeleccionado && this.datoSeleccionado.length > 0 && this.datoSeleccionado[0] && this.datoSeleccionado[0].id) {
          this.isEditMode = true;
          this.setupEditMode();
        } else {
          this.isEditMode = false;
          this.setupAddMode();
        }
      } else {
        this.setupNonModalMode();
      }
    }
  }
/**
 * Sets up the form in edit mode, loading dependent catalogs as needed
 */
private setupEditMode(): void {
  setTimeout(() => {
    this.agregarDestinatarioFinal.enable();
    const VALOR_ESTADO = this.datoSeleccionado?.[0]?.estadoLocalidad;
    let claveEstado = '';
    if (VALOR_ESTADO && this.estadosDatos.length > 0) {
      const ESTADO_ENCONTRADO = this.estadosDatos.find(e => 
        e.descripcion === VALOR_ESTADO || 
        e.clave?.toString() === VALOR_ESTADO?.toString()
      );
      claveEstado = ESTADO_ENCONTRADO ? (ESTADO_ENCONTRADO.clave || '') : '';
    }
    
    const VALOR_MUNICIPIO = this.datoSeleccionado?.[0]?.municipioAlcaldia;
    let claveMunicipio = '';
    
    if (claveEstado) {
      this.subscription.add(this.catalogoServices.municipiosDelegacionesCatalogo(this.tramiteID, claveEstado).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.municipiosDatos = DATOS;
        
        if (VALOR_MUNICIPIO && this.municipiosDatos.length > 0) {
          const MUNICIPIO_ENCONTRADO = this.municipiosDatos.find(m => 
            m.descripcion === VALOR_MUNICIPIO || 
            m.clave?.toString() === VALOR_MUNICIPIO?.toString()
          );
          claveMunicipio = MUNICIPIO_ENCONTRADO ? (MUNICIPIO_ENCONTRADO.clave || '') : '';
        }
        
        if (claveMunicipio) {
          this.subscription.add(this.catalogoServices.localidadesCatalogo(this.tramiteID, claveMunicipio).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe((localidadesData) => {
            const LOCALIDADES_DATOS = localidadesData.datos as Catalogo[];
            this.localidadesDatos = LOCALIDADES_DATOS;
          }));

          // Load colonias
          this.subscription.add(this.catalogoServices.coloniasCatalogo(this.tramiteID, claveMunicipio).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe((coloniasData) => {
            const COLONIAS_DATOS = coloniasData.datos as Catalogo[];
            this.coloniasDatos = COLONIAS_DATOS;
            
            // Load postal codes after municipio and colonias are loaded, then apply values
            this.subscription.add(this.catalogoServices.codigoCatalogo(this.tramiteID, claveMunicipio).pipe(
              takeUntil(this.unsubscribe$)
            ).subscribe((codigosData) => {
              const CODIGOS_DATOS = codigosData.datos as Catalogo[];
              this.codigosPostalesDatos = AgregarDestinatarioFinalModificacionComponent.normalizarCodigoPostal(CODIGOS_DATOS);
              this.aplicarValoresDespuesDeCarga();
            }));
          }));

        } else {
          this.aplicarValoresDespuesDeCarga();
        }
      }));
    } else {
      this.aplicarValoresDespuesDeCarga();
    }
  }, 50);
}

/**
 * Patches form values after all required catalogs have been loaded
 */
private aplicarValoresDespuesDeCarga(): void {
  setTimeout(() => {
    // País
    let valorPais = this.datoSeleccionado?.[0]?.pais;
    if (valorPais && this.paisesDatos.length > 0) {
      const PAIS_ENCONTRADO = this.paisesDatos.find(p => 
        p.descripcion === valorPais || 
        p.clave?.toString() === valorPais?.toString()
      );
      valorPais = PAIS_ENCONTRADO ? PAIS_ENCONTRADO.clave : valorPais;
    }
    
    // Estado
    let valorEstado = this.datoSeleccionado?.[0]?.estadoLocalidad;
    if (valorEstado && this.estadosDatos.length > 0) {
      const ESTADO_ENCONTRADO = this.estadosDatos.find(e => 
        e.descripcion === valorEstado || 
        e.clave?.toString() === valorEstado?.toString()
      );
      valorEstado = ESTADO_ENCONTRADO ? ESTADO_ENCONTRADO.clave : valorEstado;
    }
    
    // Municipio
    let valorMunicipio = this.datoSeleccionado?.[0]?.municipioAlcaldia;
    if (valorMunicipio && this.municipiosDatos.length > 0) {
      const MUNICIPIO_ENCONTRADO = this.municipiosDatos.find(m => 
        m.descripcion === valorMunicipio || 
        m.clave?.toString() === valorMunicipio?.toString()
      );
      valorMunicipio = MUNICIPIO_ENCONTRADO ? MUNICIPIO_ENCONTRADO.clave : valorMunicipio;
    }

    // Localidad
    let valorLocalidad = this.datoSeleccionado?.[0]?.localidad;
    if (valorLocalidad && this.localidadesDatos.length > 0) {
      const LOCALIDAD_ENCONTRADA = this.localidadesDatos.find(l => 
        l.descripcion === valorLocalidad || 
        l.clave?.toString() === valorLocalidad?.toString()
      );
      valorLocalidad = LOCALIDAD_ENCONTRADA ? LOCALIDAD_ENCONTRADA.clave : valorLocalidad;
    }

    // Código Postal
    let valorCodigoPostal = this.datoSeleccionado?.[0]?.codigoPostal;
    if (valorCodigoPostal && this.codigosPostalesDatos.length > 0) {
       const CODIGO_POSTAL_ENCONTRADO = this.codigosPostalesDatos.find(cp => 
         cp.descripcion === valorCodigoPostal ||
         cp.clave === valorCodigoPostal);
      valorCodigoPostal = CODIGO_POSTAL_ENCONTRADO ? CODIGO_POSTAL_ENCONTRADO.clave : valorCodigoPostal;
    }

    // Colonia
    let valorColonia = this.datoSeleccionado?.[0]?.colonia;
    if (valorColonia && this.coloniasDatos.length > 0) {
      const COLONIA_ENCONTRADA = this.coloniasDatos.find(c => 
        c.descripcion === valorColonia || 
        c.clave?.toString() === valorColonia?.toString()
      );
      valorColonia = COLONIA_ENCONTRADA ? COLONIA_ENCONTRADA.clave : valorColonia;
    }

    this.agregarDestinatarioFinal.patchValue({
      tipoPersona: this.datoSeleccionado?.[0]?.tipoPersona,
      rfc: this.datoSeleccionado?.[0]?.rfc,
      curp: this.datoSeleccionado?.[0]?.curp,
      nombres: this.datoSeleccionado?.[0]?.nombres,
      primerApellido: this.datoSeleccionado?.[0]?.primerApellido,
      segundoApellido: this.datoSeleccionado?.[0]?.segundoApellido,
      denominacionRazon: this.datoSeleccionado?.[0]?.razonSocial,
      pais: valorPais,
      estado: valorEstado,
      municipio: valorMunicipio,
      localidad: valorLocalidad,
      codigoPostal: valorCodigoPostal,
      colonia: valorColonia,
      calle: this.datoSeleccionado?.[0]?.calle,
      numeroExterior: this.datoSeleccionado?.[0]?.numeroExterior,
      numeroInterior: this.datoSeleccionado?.[0]?.numeroInterior,
      lada: this.datoSeleccionado?.[0]?.lada,
      telefono: this.datoSeleccionado?.[0]?.telefono,
      correoElectronico: this.datoSeleccionado?.[0]?.correoElectronico,
      coloniaOEquivalente: this.datoSeleccionado?.[0]?.coloniaEquivalente,
    });
    
    this.estaDeshabilitadoDesplegable = false;
    this.actualizarEstadoHabilitacionDesplegables();
    
    if (this.elementosDeshabilitados.includes('pais')) {
      this.agregarDestinatarioFinal.get('pais')?.disable();
    }
    
    this.forzarDeshabilitarPais();
   
  }, 100);
}
/**
 * Sets up the form in add mode (chequeoValidacionAlGuardar === true)
 */
  private setupAddMode(): void {
    setTimeout(() => {
      if (this.chequeoValidacionAlGuardar) {
        this.agregarDestinatarioFinal.reset();
        Object.keys(this.agregarDestinatarioFinal.controls).forEach(controlName => {
          const CONTROL = this.agregarDestinatarioFinal.get(controlName);
          if (controlName === 'tipoPersona') {
            CONTROL?.enable();
            CONTROL?.setValue('');
          } else {
            CONTROL?.disable();
            CONTROL?.setValue(null);
          }
        });
        this.agregarDestinatarioFinal.patchValue({pais: 'DEU'});
        this.forzarDeshabilitarPais();
        this.estaDeshabilitadoDesplegable = true;
      }
    }, 50);
  }
/**
 * Sets up the form in non-modal mode (chequeoValidacionAlGuardar === false)
 */
private setupNonModalMode(): void {
  setTimeout(() => {
    if (this.datoSeleccionado?.[0]?.tipoPersona) {
      this.agregarDestinatarioFinal.enable();
    }
    
    const VALOR_ESTADO = this.datoSeleccionado?.[0]?.estadoLocalidad;
    let claveEstado = '';
    if (VALOR_ESTADO && this.estadosDatos.length > 0) {
      const ESTADO_ENCONTRADO = this.estadosDatos.find(e => 
        e.descripcion === VALOR_ESTADO || 
        e.clave?.toString() === VALOR_ESTADO?.toString()
      );
      claveEstado = ESTADO_ENCONTRADO ? (ESTADO_ENCONTRADO.clave || '') : '';
    }
    
    const VAOR_MUNICIPIO = this.datoSeleccionado?.[0]?.municipioAlcaldia;
    let claveMunicipio = '';
    
    if (claveEstado) {
      this.subscription.add(this.catalogoServices.municipiosDelegacionesCatalogo(this.tramiteID, claveEstado).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.municipiosDatos = DATOS;
        
        if (VAOR_MUNICIPIO && this.municipiosDatos.length > 0) {
          const MUNICIPIO_ENCONTRADO = this.municipiosDatos.find(m => 
            m.descripcion === VAOR_MUNICIPIO || 
            m.clave?.toString() === VAOR_MUNICIPIO?.toString()
          );
          claveMunicipio = MUNICIPIO_ENCONTRADO ? (MUNICIPIO_ENCONTRADO.clave || '') : '';
        }
        
        if (claveMunicipio) {
          this.subscription.add(this.catalogoServices.localidadesCatalogo(this.tramiteID, claveMunicipio).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe((localidadesData) => {
            const LOCALIDADES_DATOS = localidadesData.datos as Catalogo[];
            this.localidadesDatos = LOCALIDADES_DATOS;
          }));

          this.subscription.add(this.catalogoServices.coloniasCatalogo(this.tramiteID, claveMunicipio).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe((coloniasData) => {
            const COLONIAS_DATOS = coloniasData.datos as Catalogo[];
            this.coloniasDatos = COLONIAS_DATOS;
            
            // Load postal codes after municipio and colonias are loaded, then apply values
            this.subscription.add(this.catalogoServices.codigoCatalogo(this.tramiteID, claveMunicipio).pipe(
              takeUntil(this.unsubscribe$)
            ).subscribe((codigosData) => {
              const CODIGOS_DATOS = codigosData.datos as Catalogo[];
              this.codigosPostalesDatos = AgregarDestinatarioFinalModificacionComponent.normalizarCodigoPostal(CODIGOS_DATOS);
              this.aplicarValoresDespuesDeCarga();
            }));
          }));
        } else {
          this.aplicarValoresDespuesDeCarga();
        }
      }));
    } else {
      this.aplicarValoresDespuesDeCarga();
    }
  }, 500);
}

/**
 * Loads localidades and colonias, then applies form values.
 */
private loadLocalidadesAndColonias(claveMunicipio: string): void {
  // Load localidades
  this.subscription.add(
    this.catalogoServices.localidadesCatalogo(this.tramiteID, claveMunicipio).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((localidadesData) => {
      const LOCALIDADES_DATOS = localidadesData.datos as Catalogo[];
      this.localidadesDatos = LOCALIDADES_DATOS;

      // Load colonias
      this.subscription.add(
        this.catalogoServices.coloniasCatalogo(this.tramiteID, claveMunicipio).pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((coloniasData) => {
          const COLONIAS_DATOS = coloniasData.datos as Catalogo[];
          this.coloniasDatos = COLONIAS_DATOS;

          // Load postal codes
          this.loadCodigosPostales(claveMunicipio);
        })
      );
    })
  );
}
/**
   * Normaliza el catálogo de códigos postales.
   * Si la clave es null, la reemplaza por la descripción.
   * @param data Arreglo de objetos de catálogo.
   * @returns Arreglo de objetos de catálogo con claves normalizadas.
   */
  static normalizarCodigoPostal(data: Catalogo[]): Catalogo[] {
    // Solo manipula si clave es null
    return data.map((item) => {
      if (item.clave === null) {
        return {
          ...item,
          clave: item.descripcion,
        };
      }
      return item;
    });
  }
/**
 * Loads postal codes, then applies form values.
 */
private loadCodigosPostales(claveMunicipio: string): void {
  this.subscription.add(
    this.catalogoServices.codigoCatalogo(this.tramiteID, claveMunicipio).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((codigosData) => {
      const CODIGOS_DATOS = codigosData.datos as Catalogo[];
      this.codigosPostalesDatos = CODIGOS_DATOS;

      // Apply form values after all catalogs are loaded
      this.aplicarValoresDespuesDeCarga();
    })
  );
}

  /**
   * Guarda un nuevo destinatario en el arreglo local `destinatarios`
   * y actualiza la información en el store. Finalmente, resetea el formulario
   * y navega hacia atrás en el historial.
   */
  guardarDestinatario(): void {
    // if (this.chequeoValidacionAlGuardar) {
    //   return this.guardarDestinatarioModal();
    // }
    return this.guardarDestinatarioNormal();
  }

/**
 * Handles modal form save logic for chequeoValidacionAlGuardar === true
 */
private guardarDestinatarioModal(): void {
    const VALIDATION_ERRORS = this.validateModalForm();
    if (VALIDATION_ERRORS.length > 0) {
      Object.values(this.agregarDestinatarioFinal.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
        this.mensajeDeError = 'Faltan campos por capturar.';
      });
      return;
    }
    this.mensajeDeError = '';
    const VALOR_FORMULARIO = this.agregarDestinatarioFinal.getRawValue();
    
    const NUEVO_DESTINATARIO: Destinatario = VALOR_FORMULARIO as Destinatario;
    
    const PAIS_ID = this.agregarDestinatarioFinal.get('pais')?.value;
    const PAIS_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.paisesDatos, PAIS_ID);
    NUEVO_DESTINATARIO.pais = PAIS_OBJ?.[0]?.descripcion ?? '';
    
    const COLONIA_ID = this.agregarDestinatarioFinal.get('colonia')?.value;
    const COLONIA_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.coloniasDatos, COLONIA_ID);
    NUEVO_DESTINATARIO.colonia = COLONIA_OBJ?.[0]?.descripcion ?? '';
    
    const MUNICIPIO_ID = this.agregarDestinatarioFinal.get('municipio')?.value;
    const MUNICIPIO_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.municipiosDatos, MUNICIPIO_ID);
    NUEVO_DESTINATARIO.municipioAlcaldia = MUNICIPIO_OBJ?.[0]?.descripcion ?? '';
    
    const LOCALIDAD_ID = this.agregarDestinatarioFinal.get('localidad')?.value;
    const LOCALIDAD_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.localidadesDatos, LOCALIDAD_ID);
    NUEVO_DESTINATARIO.localidad = LOCALIDAD_OBJ?.[0]?.descripcion ?? '';
    
    const ESTADO_ID = this.agregarDestinatarioFinal.get('estado')?.value;
    const ESTADO_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.estadosDatos, ESTADO_ID);
    NUEVO_DESTINATARIO.estadoLocalidad = ESTADO_OBJ?.[0]?.descripcion ?? '';
    
    const CODIGO_POSTAL_ID = this.agregarDestinatarioFinal.get('codigoPostal')?.value;
    const CODIGO_POSTAL_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.codigosPostalesDatos, CODIGO_POSTAL_ID);
    NUEVO_DESTINATARIO.codigoPostal = CODIGO_POSTAL_OBJ?.[0]?.descripcion ?? '';
    
    let nombreRazonSocial: string;
    if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.MORAL) {
        nombreRazonSocial = VALOR_FORMULARIO.denominacionRazon;
    } else if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.FISICA) {
        nombreRazonSocial = `${VALOR_FORMULARIO.nombres} ${VALOR_FORMULARIO.primerApellido} ${VALOR_FORMULARIO.segundoApellido || ''}`.trim();
    } else {
        nombreRazonSocial = '';
    }
    NUEVO_DESTINATARIO.nombreRazonSocial = nombreRazonSocial;
    
    NUEVO_DESTINATARIO.telefono = `${VALOR_FORMULARIO.lada || ''} ${VALOR_FORMULARIO.telefono || ''}`.trim();
    
    NUEVO_DESTINATARIO.nacionalidad = VALOR_FORMULARIO.nacionalidad || '';
    NUEVO_DESTINATARIO.entidadFederativa = '';
    NUEVO_DESTINATARIO.coloniaEquivalente = VALOR_FORMULARIO.coloniaEquivalente || '';
    NUEVO_DESTINATARIO.razonSocial = VALOR_FORMULARIO.denominacionRazon || '';
    
    let UPDATED_DESTINATARIOS: Destinatario[] = Array.isArray(this.destinatarioFinalTablaDatos) 
      ? [...this.destinatarioFinalTablaDatos] 
      : [];
    
    if (this.isEditMode) {
      const CURRENT_ID = this.datoSeleccionado && this.datoSeleccionado[0] ? this.datoSeleccionado[0].id : undefined;
      NUEVO_DESTINATARIO.id = CURRENT_ID;
      UPDATED_DESTINATARIOS = UPDATED_DESTINATARIOS.map(d => 
        d.id === NUEVO_DESTINATARIO.id ? NUEVO_DESTINATARIO : d
      );
    } else {
      const IS_DUPLICATE = UPDATED_DESTINATARIOS.some(d => d.rfc === NUEVO_DESTINATARIO.rfc);
      
      if (IS_DUPLICATE) {
        return;
      }
      const NEXT_ID = UPDATED_DESTINATARIOS.length > 0 ? Math.max(...UPDATED_DESTINATARIOS.map(d => d.id || 0)) + 1 : 1;
      NUEVO_DESTINATARIO.id = NEXT_ID;
      UPDATED_DESTINATARIOS.push(NUEVO_DESTINATARIO);
    }
    
    this.updateDestinatarioFinalTablaDatos.emit(UPDATED_DESTINATARIOS);
    this.agregarDestinatarioFinal.reset();
    this.datoSeleccionado = [];
    this.isEditMode = false;
    this.setupAddMode();
    
    this.guardarYSalir.emit();
}

/**
 * Handles normal form save logic for chequeoValidacionAlGuardar === false
 */
private guardarDestinatarioNormal(): void {
    if (this.chequeoValidacionAlGuardar && this.agregarDestinatarioFinal.invalid) {
      Object.values(this.agregarDestinatarioFinal.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      this.mensajeDeError = 'Faltan campos por capturar.';
      return;
    }
    this.mensajeDeError = '';
    const VALOR_FORMULARIO = this.agregarDestinatarioFinal.getRawValue();
    
  let nombreRazonSocial: string;

  if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.MORAL) {
    nombreRazonSocial = VALOR_FORMULARIO.denominacionRazon;
  } else if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.FISICA) {
    nombreRazonSocial = `${VALOR_FORMULARIO.nombres} ${VALOR_FORMULARIO.primerApellido} ${VALOR_FORMULARIO.segundoApellido || ''}`.trim();
  } else {
    nombreRazonSocial = '';
  }
    
    const NUEVO_DESTINATARIO: Destinatario = VALOR_FORMULARIO as Destinatario;
    
    const PAIS_ID = this.agregarDestinatarioFinal.get('pais')?.value;
    const PAIS_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.paisesDatos, PAIS_ID);
    
    const ESTADO_ID = this.agregarDestinatarioFinal.get('estado')?.value;
    const ESTADO_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.estadosDatos, ESTADO_ID);
    
    const MUNICIPIO_ID = this.agregarDestinatarioFinal.get('municipio')?.value;
    const MUNICIPIO_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.municipiosDatos, MUNICIPIO_ID);
    
    const LOCALIDAD_ID = this.agregarDestinatarioFinal.get('localidad')?.value;
    const LOCALIDAD_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.localidadesDatos, LOCALIDAD_ID);
    
    const CODIGO_POSTAL_ID = this.agregarDestinatarioFinal.get('codigoPostal')?.value;
    const CODIGO_POSTAL_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.codigosPostalesDatos, CODIGO_POSTAL_ID);
    
    const COLONIA_ID = this.agregarDestinatarioFinal.get('colonia')?.value;
    const COLONIA_OBJ = AgregarDestinatarioFinalModificacionComponent.generarCatalogoObjeto(this.coloniasDatos, COLONIA_ID);
    
    NUEVO_DESTINATARIO.pais = PAIS_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.paisObj = PAIS_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.estadoLocalidad = ESTADO_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.estadoObj = ESTADO_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.municipioAlcaldia = MUNICIPIO_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.municipioObj = MUNICIPIO_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.localidad = LOCALIDAD_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.localidadObj = LOCALIDAD_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.codigoPostal = CODIGO_POSTAL_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.codigoPostalObj = CODIGO_POSTAL_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.colonia = COLONIA_OBJ?.[0]?.descripcion ?? '';
    NUEVO_DESTINATARIO.coloniaObj = COLONIA_OBJ?.[0] ?? undefined;
    
    NUEVO_DESTINATARIO.entidadFederativa = '';
    NUEVO_DESTINATARIO.coloniaEquivalente = VALOR_FORMULARIO.coloniaEquivalente || '';

    NUEVO_DESTINATARIO.denominacionRazon = nombreRazonSocial;
    
    NUEVO_DESTINATARIO.nacionalidad = VALOR_FORMULARIO.nacionalidad || '';
    NUEVO_DESTINATARIO.tipoPersona = VALOR_FORMULARIO.tipoPersona;
    NUEVO_DESTINATARIO.rfc = VALOR_FORMULARIO.rfc || '';
    NUEVO_DESTINATARIO.curp = VALOR_FORMULARIO.curp || '';
    NUEVO_DESTINATARIO.telefono = `${VALOR_FORMULARIO.lada || ''} ${VALOR_FORMULARIO.telefono || ''}`.trim();
    NUEVO_DESTINATARIO.correoElectronico = VALOR_FORMULARIO.correoElectronico || '';
    NUEVO_DESTINATARIO.calle = VALOR_FORMULARIO.calle || '';
    NUEVO_DESTINATARIO.numeroExterior = VALOR_FORMULARIO.numeroExterior || '';
    NUEVO_DESTINATARIO.numeroInterior = VALOR_FORMULARIO.numeroInterior || '';
    NUEVO_DESTINATARIO.nombres = VALOR_FORMULARIO.nombres;
    NUEVO_DESTINATARIO.primerApellido = VALOR_FORMULARIO.primerApellido;
    NUEVO_DESTINATARIO.segundoApellido = VALOR_FORMULARIO.segundoApellido;
    NUEVO_DESTINATARIO.razonSocial = VALOR_FORMULARIO.denominacionRazon || '';
    NUEVO_DESTINATARIO.lada = VALOR_FORMULARIO.lada;
    
    let UPDATED_DESTINATARIOS: Destinatario[] = Array.isArray(this.destinatarioFinalTablaDatos) 
      ? [...this.destinatarioFinalTablaDatos] 
      : [];
    
    if (this.datoSeleccionado?.[0]?.id) {
      NUEVO_DESTINATARIO.id = this.datoSeleccionado[0].id;
      UPDATED_DESTINATARIOS = UPDATED_DESTINATARIOS.map(d => 
        d.id === NUEVO_DESTINATARIO.id ? NUEVO_DESTINATARIO : d
      );
    } else {
      const IS_DUPLICATE = UPDATED_DESTINATARIOS.some(d => d.rfc === NUEVO_DESTINATARIO.rfc);
      
      if (IS_DUPLICATE) {
        this.abrirModal('La información proporcionada de la persona ya existe, favor de verificar.');
        return;
      }
      const NEXT_ID = UPDATED_DESTINATARIOS.length > 0 ? Math.max(...UPDATED_DESTINATARIOS.map(d => d.id || 0)) + 1 : 1;
      NUEVO_DESTINATARIO.id = NEXT_ID;
      UPDATED_DESTINATARIOS.push(NUEVO_DESTINATARIO);
    }
    
    this.updateDestinatarioFinalTablaDatos.emit(UPDATED_DESTINATARIOS);
    this.agregarDestinatarioFinal.reset();
    this.datoSeleccionado = [];
    this.isEditMode = false;
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
   * Custom validation for modal form scenario
   * Only validates business rules for chequeoValidacionAlGuardar === true
   */
  private validateModalForm(): string[] {
    const ERRORS: string[] = [];
    const TIPO_PERSONA = this.agregarDestinatarioFinal.get('tipoPersona')?.value;
    if (!TIPO_PERSONA) {
      ERRORS.push('tipoPersona is required');
    }
    
    if (TIPO_PERSONA === this.tipoPersona.MORAL) {
      const DENOMINACION_RAZON = this.agregarDestinatarioFinal.get('denominacionRazon')?.value;
      if (!DENOMINACION_RAZON) {
        ERRORS.push('denominacionRazon is required for MORAL');
      }
    }
    
    if (TIPO_PERSONA === this.tipoPersona.FISICA) {
      const NOMBRES = this.agregarDestinatarioFinal.get('nombres')?.value;
      const PRIMER_APELLIDO = this.agregarDestinatarioFinal.get('primerApellido')?.value;
      
      if (!NOMBRES) {
        ERRORS.push('nombres is required for FISICA');
      }
      if (!PRIMER_APELLIDO) {
        ERRORS.push('primerApellido is required for FISICA');
      }
    }
    
    return ERRORS;
  }

  /**
   * Hook del ciclo de vida que se invoca cuando se inicializa el componente.
   * Llama al método `cargarDatos()`.
   */
  ngOnInit(): void {
    this.requiedField = DEFAULT_TABLA_ORDENS.includes(this.idProcedimiento);
    this.cargarDatos(this.tramiteID);
    this.validarElementos();
    this.crearAgregarFormularioAgregarDestinatarioFinal();
    this.campoValidar()
    this.changeNacionalidad();
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);
    this.chequeoValidacionAlGuardar =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento)
        ? true
        : false;
    this.forzarDeshabilitarPais();
     this.actualizarValidadoresCalleNumeroExterior();
    if (this.chequeoValidacionAlGuardar) {
      this.isEditMode = false;
      this.setupAddMode();
    }
  }

  /**
   * Actualiza los validadores de los campos 'calle' y 'numeroExterior' en el formulario 'agregarDestinatarioFinal'.
   * 
   * Si la propiedad `chequeoValidacionAlGuardar` es verdadera, se asigna el validador `Validators.required` a ambos campos,
   * obligando al usuario a proporcionar estos valores. Si es falsa, se eliminan los validadores requeridos.
   * 
   * Finalmente, se actualiza el estado y la validez de ambos controles para reflejar los cambios en los validadores.
   *
   * @private
   */
  private actualizarValidadoresCalleNumeroExterior(): void {
  const CALLE_CONTROL = this.agregarDestinatarioFinal.get('calle');
  const NUMERO_EXTERIOR_CONTROL = this.agregarDestinatarioFinal.get('numeroExterior');
  if (this.chequeoValidacionAlGuardar) {
    CALLE_CONTROL?.setValidators([Validators.required]);
    NUMERO_EXTERIOR_CONTROL?.setValidators([Validators.required]);
  } else {
    CALLE_CONTROL?.clearValidators();
    NUMERO_EXTERIOR_CONTROL?.clearValidators();
  }
  CALLE_CONTROL?.updateValueAndValidity();
  NUMERO_EXTERIOR_CONTROL?.updateValueAndValidity();
}
  /**
   * Recupera varias listas de datos del servicio `DatosSolicitudService` y
   * las asigna a propiedades locales. Se desuscribe automáticamente en el hook de
   * destrucción usando `takeUntil(this.unsubscribe$)`.
   */
  cargarDatos(tramite: string): void {
    this.subscription.add(this.catalogoServices.paisesCatalogo(tramite).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.paisesDatos = DATOS;
  }));
  
    this.subscription.add(this.catalogoServices.estadosCatalogo(tramite).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.estadosDatos = DATOS;
  }));

  }

  campoValidar(): void {
    const CALLE_CONTROL = this.agregarDestinatarioFinal?.get('calle');
    const NUMERO_EXTERIOR_CONTROL = this.agregarDestinatarioFinal?.get('numeroExterior');
    if((this.elementosRequeridos.includes('calle')||
        this.chequeoValidacionAlGuardar) && this.idProcedimiento !== 260214 ){
      CALLE_CONTROL?.setValidators([Validators.required]);
    }
    else if((this.elementosRequeridos.includes('numeroExterior') || this.chequeoValidacionAlGuardar) && this.idProcedimiento !== 260214){
      NUMERO_EXTERIOR_CONTROL?.setValidators([Validators.required]);
    }
     else {
      CALLE_CONTROL?.clearValidators();
      NUMERO_EXTERIOR_CONTROL?.clearValidators();
    }
    CALLE_CONTROL?.updateValueAndValidity();
    NUMERO_EXTERIOR_CONTROL?.updateValueAndValidity();
  }

  /**
   * @method crearAgregarFormularioAgregarDestinatarioFinal
   * @description
   * This method initializes the `FormGroup` for the "Agregar Destinatario Final" component.
   * It sets up the form controls with their default values, validation rules, and disabled states
   * based on the `elementosDeshabilitados` and `elementosNoRequeridos` arrays.
   * @returns {void} This method does not return any value.
   */
  crearAgregarFormularioAgregarDestinatarioFinal(): void {
    this.agregarDestinatarioFinal = this.fb.group({
      tipoPersona: ['', [Validators.required]],
      rfc: [
        this.obtenerValor('rfc'),
      ],
      curp: [''],
      nombres: [
        {
          value: this.elementosDeshabilitados.includes('nombres')
            ? 'EUROFOODZDEMEXICO'
            : this.obtenerValor('nombres'),
          disabled: this.elementosDeshabilitados.includes('nombres'),
        },
        [Validators.pattern(REGEX_NOMBRE)],
      ],
      denominacionRazon: [
        this.obtenerValor('razonSocial'),
        [Validators.pattern(REGEX_NOMBRE)],
      ],
      primerApellido: [
        {
          value: this.elementosDeshabilitados.includes('primerApellido')
            ? ''
            : this.obtenerValor('primerApellido'),
          disabled: this.elementosDeshabilitados.includes('primerApellido'),
        },
       [Validators.pattern(REGEX_NOMBRE)],
      ],
      segundoApellido: [
        {
          value: this.elementosDeshabilitados.includes('segundoApellido')
            ? 'PINAL'
            : this.obtenerValor('segundoApellido'),
          disabled: this.elementosDeshabilitados.includes('segundoApellido'),
        },
        [Validators.pattern(REGEX_NOMBRE)],
      ],
     pais: [
      {
        value: this.elementosDeshabilitados.includes('pais')
          ? '1'
          : this.obtenerValor('pais'),
        disabled: this.elementosDeshabilitados.includes('pais') || this.chequeoValidacionAlGuardar,
      },
      [Validators.required],
    ],
      estado: [this.obtenerValor('estadoLocalidad'), [Validators.required]],
      municipio: [
        this.obtenerValor('municipioAlcaldia'),
        [Validators.required],
      ],
      localidad: [this.obtenerValor('localidad'), [Validators.required]],
      codigoPostal: [this.obtenerValor('codigoPostal'), [Validators.required]],
      colonia: [
        this.obtenerValor('colonia'),
        !this.elementosNoRequeridos.includes('colonia')
          ? [Validators.required]
          : [],
      ], 
      calle: [
        this.obtenerValor('calle')
      ],
      numeroExterior: [
        this.obtenerValor('numeroExterior')
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
    });
    
    if (this.chequeoValidacionAlGuardar) {
      Object.keys(this.agregarDestinatarioFinal.controls).forEach(
        (controlName) => {
          if (controlName !== 'tipoPersona') {
            this.agregarDestinatarioFinal.get(controlName)?.disable();
          }
        }
      );
    }
  }

  /**
   * Initializes the form for adding a new entry (not editing)
   * Clears any existing datoSeleccionado to ensure we're in add mode
   */
  public initializeForNewEntry(): void {
    if (this.chequeoValidacionAlGuardar) {
      this.agregarDestinatarioFinal.reset();
      Object.keys(this.agregarDestinatarioFinal.controls).forEach(
        (controlName) => {
          if (controlName !== 'tipoPersona') {
            this.agregarDestinatarioFinal.get(controlName)?.disable();
          } else {
            this.agregarDestinatarioFinal.get(controlName)?.enable();
            this.agregarDestinatarioFinal.get(controlName)?.setValue('');
          }
        }
      );
      
      this.agregarDestinatarioFinal.patchValue({pais: 'DEU'});
      
      this.estaDeshabilitadoDesplegable = true;
      
      this.forzarDeshabilitarPais();
    }
  }

  /**
   * @private
   * Fuerza la deshabilitación del campo 'pais' en el formulario de agregar destinatario final.
   * 
   * Si la variable `chequeoValidacionAlGuardar` es verdadera, deshabilita el control 'pais'
   * dentro del formulario reactivo `agregarDestinatarioFinal`.
   * 
   * Útil para evitar que el usuario modifique el país cuando ciertas condiciones de validación se cumplen al guardar.
   */
  private forzarDeshabilitarPais(): void {
  if (this.chequeoValidacionAlGuardar) {
    this.agregarDestinatarioFinal.get('pais')?.disable();
  }
}
  /**
   * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
   * @param {keyof Destinatario } field - Nombre del campo a obtener.
   * @returns {string | number | undefined | string[]} - Valor del campo especificado.
   */
  public obtenerValor(field: keyof Destinatario): string | number | undefined | Catalogo {
    return this.datoSeleccionado?.[0]?.[field as keyof Destinatario] ?? '';
  }


  /**
   * Validador personalizado para RFC según el tipo de persona (Física o Moral).
   *
   * @param TIPO_PERSONA El tipo de persona para el cual se debe validar el RFC.
   * @returns Una función validadora que verifica si el valor cumple con el formato RFC correspondiente.
   *          Si el valor es inválido, retorna un objeto con la clave de error específica.
   *          Si el tipo de persona es desconocido o el valor está vacío, retorna null.
   */
  static rfcFisicaValidator(TIPO_PERSONA: TipoPersona): (CONTROL: AbstractControl) => ValidationErrors | null {
    return (CONTROL: AbstractControl): ValidationErrors | null => {
      const VALUE = CONTROL?.value;

      if (!VALUE) {
        return null;
      }

      let REGEX;
      let ERROR_KEY;

      if (TIPO_PERSONA === TipoPersona.FISICA) {
        REGEX = REGEX_RFC_FISICA;
        ERROR_KEY = { INVALID_RFC_FISICA: true };
      } else if (TIPO_PERSONA === TipoPersona.MORAL) {
        REGEX = REGEX_RFC_MORAL;
        ERROR_KEY = { INVALID_RFC_MORAL: true };
      } else {
        return null;
      }

      return REGEX.test(VALUE) ? null : ERROR_KEY;
    };

  }

  /**
   * Valida elementos según el `idProcedimiento` y establece
   * las listas de elementos no válidos y añadidos.
   * @returns {void} Lista de elementos no válidos.
   */
  validarElementos(): void {
    switch (this.idProcedimiento) {
      case 260207:
      case 260209:
      case 260208:
        case 260210:
      case 260218:
        this.elementosDeshabilitados = ['pais'];
        this.elementosNoRequeridos = ['colonia'];
        break;
      case 260201:
        this.elementosDeshabilitados = ['pais'];
        this.elementosNoRequeridos = ['localidad', 'colonia'];
        this.elementosRequeridos = [];
        break;
      case 260219:
        this.elementosRequeridos = ['calle', 'numeroExterior'];
        this.elementosDeshabilitados = ['pais'];
        this.elementosNoRequeridos = ['colonia'];
        break;
      case 260213:
        this.elementosRequeridos = ['calle', 'numeroExterior'];
        this.elementosDeshabilitados = ['pais'];
        break;
      case 260214:
        this.elementosRequeridos = ['calle', 'numeroExterior'];
        this.elementosDeshabilitados = ['pais'];
        this.elementosNoRequeridos = ['colonia'];
        break;
         case 260911:
        this.elementosNoRequeridos = [];
        break;
      default:
        this.elementosDeshabilitados = [];
        this.elementosNoRequeridos = [];
        this.elementosRequeridos = [];
    }
  }

  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `agregarDestinatarioFinal` para limpiar todos los campos.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  limpiarFormulario(): void {
    this.agregarDestinatarioFinal.reset();
    this.agregarDestinatarioFinal.markAsUntouched();
    this.agregarDestinatarioFinal.markAsPristine();
    this.agregarDestinatarioFinal.disable();
    this.estaDeshabilitadoDesplegable=true;
    this.agregarDestinatarioFinal.get('tipoPersona')?.enable();
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
    const CONTROL = this.agregarDestinatarioFinal.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Habilita o deshabilita los controles del formulario según el valor de 'tipoPersona'.
   *
   * Si 'tipoPersona' está vacío, deshabilita todos los controles excepto 'tipoPersona'.
   * Si 'tipoPersona' tiene un valor, habilita todos los controles y activa el desplegable.
   *
   * @returns {void} No retorna ningún valor.
   */
 changeNacionalidad(): void {
    if (this.agregarDestinatarioFinal?.value?.tipoPersona === '') {
      Object.keys(this.agregarDestinatarioFinal.controls).forEach((controlName) => {
        this.agregarDestinatarioFinal.get(controlName)?.disable();
        if (controlName === 'tipoPersona') {
          this.agregarDestinatarioFinal.get(controlName)?.enable();
        }
      });
    } else {
      if (this.agregarDestinatarioFinal?.get('tipoPersona')?.value) {
        Object.keys(this.agregarDestinatarioFinal.controls).forEach(
          (controlName) => {
            if (
              controlName !== 'tipoPersona'
            ) {
              this.agregarDestinatarioFinal.get(controlName)?.reset();
            }
          }
        );
      }
      Object.keys(this.agregarDestinatarioFinal.controls).forEach((controlName) => {
        this.agregarDestinatarioFinal.get(controlName)?.enable();
        this.estaDeshabilitadoDesplegable = false;
      });
    }
    this.agregarDestinatarioFinal.patchValue({pais: 'DEU'});
    this.forzarDeshabilitarPais();
    this.updateDenominacionRazonValidation();
  }

  /**
   * Actualiza las validaciones del campo denominacionRazon basado en el valor de tipoPersona
   */
private updateDenominacionRazonValidation(): void {
   const DENOMINACIONRAZONCONTROL = this.agregarDestinatarioFinal?.get('denominacionRazon');
  const NOMBRESCONTROL = this.agregarDestinatarioFinal?.get('nombres');
  const PRIMERAPELLIDOCONTROL = this.agregarDestinatarioFinal?.get('primerApellido');
  const RFC = this.agregarDestinatarioFinal?.get('rfc');
  const CURP = this.agregarDestinatarioFinal?.get('curp');
  if (!DENOMINACIONRAZONCONTROL || !NOMBRESCONTROL || !PRIMERAPELLIDOCONTROL || !RFC || !CURP) {
    return;
  }
  
   const TIPOPERSONAVALUE = this.agregarDestinatarioFinal?.get('tipoPersona')?.value;
  
  if (TIPOPERSONAVALUE === this.tipoPersona.MORAL) {
    DENOMINACIONRAZONCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    
    NOMBRESCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    PRIMERAPELLIDOCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    RFC.setValidators([Validators.required]);


  } else if (TIPOPERSONAVALUE === this.tipoPersona.FISICA) {
    DENOMINACIONRAZONCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    RFC.setValidators([Validators.required]);
    
    NOMBRESCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    PRIMERAPELLIDOCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    
  }
  else if(TIPOPERSONAVALUE === this.tipoPersona.NO_CONTRIBUYENTE){
    CURP.setValidators([Validators.required]);
     NOMBRESCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);
    PRIMERAPELLIDOCONTROL.setValidators([
      Validators.required,
      Validators.pattern(REGEX_NOMBRE)
    ]);

  } 
  else {
    DENOMINACIONRAZONCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    NOMBRESCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    PRIMERAPELLIDOCONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
  }
  
  DENOMINACIONRAZONCONTROL.updateValueAndValidity();
  NOMBRESCONTROL.updateValueAndValidity();
  PRIMERAPELLIDOCONTROL.updateValueAndValidity();
  RFC.updateValueAndValidity();
  CURP.updateValueAndValidity();

}

  /**
   * Carga la lista de estados cuando se selecciona un catálogo válido.
   *
   * @param evento Objeto de tipo `Catalogo` que contiene la información seleccionada.
   *
   * ### Descripción:
   * - Si el `id` del evento es mayor que 0, asigna la lista temporal de municipios (`municipiosTempDatos`)
   *   a la lista principal (`municipiosDatos`).
   */
  cargarEstados(evento: Catalogo): void {
    if (evento.clave) {
    this.subscription.add(this.catalogoServices.municipiosDelegacionesCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.municipiosDatos = DATOS;
    }));
  } else {
    this.municipiosDatos = [];
  }
  }
  /**
   * Carga la lista de municipios, localidades y colonias cuando se selecciona un catálogo válido.
   *
   * @param evento Objeto de tipo `Catalogo` que contiene la información seleccionada.
   *
   * ### Descripción:
   * - Si el `id` del evento es mayor que 0:
   *   - Asigna la lista temporal de localidades (`localidadesTempDatos`) a la lista principal (`localidadesDatos`).
   *   - Asigna la lista temporal de colonias (`coloniasTempDatos`) a la lista principal (`coloniasDatos`).
   */
  cargarMunicipios(evento: Catalogo): void {
    if (evento.clave) {
    this.subscription.add(this.catalogoServices.localidadesCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.localidadesDatos = DATOS;
    }));
    this.subscription.add(this.catalogoServices.coloniasCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.coloniasDatos = DATOS;
    }));
    } else {
      this.localidadesDatos = [];
      this.coloniasDatos = [];
    }

  }


   getMunicipioSeleccionado(val: string): string {
    if (!val || this.municipiosDatos.length === 0) {
      return '';
    }
    
    // First try to find by description
    const MUNICIPIO_POR_DESCRIPCION = this.municipiosDatos.find(res => res.descripcion === val);
    if (MUNICIPIO_POR_DESCRIPCION) {
      return MUNICIPIO_POR_DESCRIPCION.clave || '';
    }
    
    // If not found by description, check if it's already a clave
    const MUNICIPIO_POR_CLAVE = this.municipiosDatos.find(res => res.clave === val);
    if (MUNICIPIO_POR_CLAVE) {
      return val; // It's already a clave
    }
    
    return '';
  }
  
  /**
   * Carga la lista de códigos postales cuando se selecciona una localidad.
   *
   * @param _evento Objeto de tipo `Catalogo` que contiene la información seleccionada de la localidad.
   *
   * ### Descripción:
   * - Obtiene el municipio seleccionado del formulario.
   * - Si el formulario contiene el campo 'municipio', solicita los códigos postales asociados al municipio seleccionado.
   * - Asigna la lista recibida a la propiedad `codigosPostalesDatos`.
   * - Si no existe el campo 'municipio', limpia la lista de códigos postales.
   */
  cargarLocalidades(_evento?: Catalogo): void {
    const MUNICIPIO_SELECCIONADO = this.agregarDestinatarioFinal.get('municipio')?.value;
    
    // Convert description to clave if needed
    const MUNICIPIO_CLAVE = this.getMunicipioSeleccionado(MUNICIPIO_SELECCIONADO);
    
    if (this.agregarDestinatarioFinal.contains('municipio') && (MUNICIPIO_CLAVE || MUNICIPIO_SELECCIONADO)) {
      // Use the clave if we found it, otherwise use the original value
      const FINAL_MUNICIPIO_VALUE = MUNICIPIO_CLAVE || MUNICIPIO_SELECCIONADO;
      
      this.subscription.add(this.catalogoServices.codigoCatalogo(this.tramiteID, FINAL_MUNICIPIO_VALUE).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.codigosPostalesDatos = AgregarDestinatarioFinalModificacionComponent.normalizarCodigoPostal(DATOS);
      }));
    } else {
      this.codigosPostalesDatos = [];
    }
  }

  /**
   * Maneja el evento de cambio en el campo de RFC.
   *
   * @param {Event} event - Evento que se dispara al cambiar el valor del campo de entrada (input).
   */
  onChangeRfc(event: Event): void {
    const RFC_VALUE = (event.target as HTMLInputElement).value;
    this.datoSeleccionadorfc?.forEach((dato) => {
      if (dato.rfc === RFC_VALUE) {
        const PEDIMENTO = {
          patente: 0,
          pedimento: 0,
          aduana: 0,
          idTipoPedimento: 0,
          descTipoPedimento: 'Por evaluar',
          numero: '',
          comprobanteValor: '',
          pedimentoValidado: false,
        };
        this.abrirModal(
          'La información proporcionada de la persona ya existe, favor de verificar.'
        );
        this.pedimentos.push(PEDIMENTO);
      }
    });
  }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


/**
 * Updates the estaDeshabilitadoDesplegable flag and enables all form controls
 * This mirrors the logic from fabricante component
 */
private actualizarEstadoHabilitacionDesplegables(): void {
  const TIPO_PERSONA = this.agregarDestinatarioFinal?.get('tipoPersona')?.value;
  
  if (TIPO_PERSONA) {
    this.estaDeshabilitadoDesplegable = false;
    
    Object.keys(this.agregarDestinatarioFinal.controls).forEach((controlName) => {
      if (!this.elementosDeshabilitados.includes(controlName)) {
        this.agregarDestinatarioFinal.get(controlName)?.enable();
      }
    });
  } else {
    this.estaDeshabilitadoDesplegable = true;
  }
}
}
