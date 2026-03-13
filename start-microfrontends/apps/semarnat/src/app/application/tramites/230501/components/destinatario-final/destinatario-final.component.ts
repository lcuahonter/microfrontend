import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, InputRadioComponent, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Destinatario } from '../../models/terceros-relacionados.model';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/materiales-peligrosos.enum';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
/**
 * Componente para agregar un destinatario final (Destinatario) al formulario y almacenarlo.
 *
 * @example
 * <app-agregar-destinatario-final></app-agregar-destinatario-final>
 */
@Component({
  selector: 'app-destinatario-final',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
  ],
  providers: [MaterialesPeligrososService],
  templateUrl: './destinatario-final.component.html',
  styleUrl: './destinatario-final.component.scss',
})
/**
 * Componente que gestiona la información del destinatario final en un trámite.
 * Permite agregar, actualizar y visualizar datos de destinatarios finales.
 * También incluye funcionalidades para manejar el estado del formulario y sus validaciones.
 * 
 * @class DestinatarioFinalComponent
 * @implements OnDestroy, OnInit
 * 
 * @description Este componente utiliza formularios reactivos para capturar información del destinatario final.
 * Proporciona métodos para interactuar con el estado de la aplicación y servicios externos para cargar datos de catálogo.
 * Además, implementa mecanismos para prevenir fugas de memoria mediante la desuscripción de observables.
 * 
 * @example
 * ```typescript
 * <app-destinatario-final></app-destinatario-final>
 * ```
 * 
 * @author Muneeshwaran N
 */
export class DestinatarioFinalComponent implements OnDestroy, OnInit {


  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * Se completa en `ngOnDestroy()` para prevenir fugas de memoria.
   * @property {Subject<void>} unsubscribe$
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Grupo de formulario reactivo para recopilar los datos del destinatario final.
   * @property {FormGroup} agregarDestinatarioFinal
   */
  agregarDestinatarioFinal!: FormGroup;

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
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;

  /**
   * @public
   * @description Propiedad que almacena las opciones para el botón de radio.
   * @command Opciones definidas en la constante OPCIONES_DE_BOTON_DE_RADIO.
   */
  public radioOpcions = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Arreglo que almacena la lista de destinatarios.
   * @property {Destinatario[]} destinatarios
   */
  destinatarios: Destinatario[] = [];

  /**
   * Emite la lista de destinatarios actualizada para ser consumida por otros componentes.
   * @property {EventEmitter<Destinatario[]>} updateDestinatarioFinalTabla
   */
  @Output() updateDestinatarioFinalTablaDatos = new EventEmitter<Destinatario[]>();

  /**
   * Indica si el componente está en modo de edición.
   * Cuando es verdadero, permite modificar los datos existentes.
   * Cuando es falso, el componente opera en modo de solo lectura.
   */
  public esElModoDeEdicion = false;
  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;
  /**
   * Crea el componente e inicializa el grupo de formulario.
   *
   * @param {FormBuilder} fb - Inyector de FormBuilder para crear formularios reactivos.
   * @param {Tramite230501Store} tramiteStore - Servicio que maneja las actualizaciones de estado para "Tramite230501".
   * @param {Tramite230501Query} tramiteQuery - Servicio para consultar el estado de "Tramite230501".
   * @param {Location} ubicaccion - Servicio de Angular para navegar hacia atrás en el historial.
   * @param {MaterialesPeligrososService} materialesPeligrososService - Servicio para obtener diferentes listas de datos.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    public materialesPeligrososService: MaterialesPeligrososService,
    public tramiteStore: Tramite230501Store,
    public tramiteQuery: Tramite230501Query,
    public consultaQuery:ConsultaioQuery
  ) {
  }

  /**
   * Guarda un nuevo destinatario en la lista y actualiza el estado.
   * Resetea el formulario después de guardar y navega hacia atrás.
   * @method guardarDestinatario
   * @returns {void}
   */
  guardarDestinatario(): void {
    const NUEVO_DESTINATARIO: Destinatario = {
      segundoApellido: this.agregarDestinatarioFinal.value.segundoApellido,
      primerApellido: this.agregarDestinatarioFinal.value.primerApellido,
      nombres: this.agregarDestinatarioFinal.value.nombres,
      nombreRazonSocial: `${this.agregarDestinatarioFinal.value.nombres} ${this.agregarDestinatarioFinal.value.primerApellido
        } ${this.agregarDestinatarioFinal.value.segundoApellido || ''}`.trim(),
      rfc: this.agregarDestinatarioFinal.value.rfc,
      curp: '',
      lada: this.agregarDestinatarioFinal.value.lada,
      telefono: this.agregarDestinatarioFinal.value.telefono,
      correoElectronico: this.agregarDestinatarioFinal.value.correoElectronico,
      calle: this.agregarDestinatarioFinal.value.calle,
      numeroExterior: this.agregarDestinatarioFinal.value.numeroExterior,
      numeroInterior: this.agregarDestinatarioFinal.value.numeroInterior || '',
      pais: this.agregarDestinatarioFinal.value.pais,
      colonia: this.agregarDestinatarioFinal.value.colonia,
      municipioAlcaldia: this.agregarDestinatarioFinal.value.municipio,
      localidad: this.agregarDestinatarioFinal.value.localidad,
      entidadFederativa: '',
      estadoLocalidad: this.agregarDestinatarioFinal.value.estadoLocalidad,
      codigoPostal: this.agregarDestinatarioFinal.value.codigoPostal,
      coloniaEquivalente: this.agregarDestinatarioFinal.value.codie,
      tipoPersona: this.agregarDestinatarioFinal.value.tipoPersona,
    };

    if (this.agregarDestinatarioFinal.valid) {
      this.setFormValida(this.agregarDestinatarioFinal.valid);
      this.destinatarios.push(NUEVO_DESTINATARIO);
      if (this.esElModoDeEdicion) {
        this.updateDestinatarios(NUEVO_DESTINATARIO);
      } else {
        this.addDestinatarios(this.destinatarios);
      }
      this.agregarDestinatarioFinal.reset();
      this.ubicaccion.back();
    }

  }

  /**
   * Actualiza la tabla de destinatarios finales en el estado de la aplicación.
   * @method addDestinatarios
   * @param newDestinatarios - Lista de objetos `Destinatario` a agregar.
   * @returns {void}
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.addDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * Actualiza un destinatario existente en la tabla de destinatarios finales.
   * @method updateDestinatarios
   * @param newDestinatarios - Objeto `Destinatario` a actualizar.
   * @returns {void}
   */
  updateDestinatarios(newDestinatarios: Destinatario): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }
  /**
   * Método del ciclo de vida de Angular que se invoca cuando el componente es inicializado.
   * Llama a `cargarDatos()` y suscribe a los datos del estado.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.createrDestinatrioForm();
    this.onTipoPersonaChange(this.tipoPersona.FISICA);
    this.cargarDatos();
    // Suscribirse a los cambios en la lista de destinatarios finales
    this.tramiteStore.destinatarioSujeto
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(destinatario => {
        if (destinatario) {
          this.agregarDestinatarioFinal.patchValue(destinatario);
        }
      });

    // Suscribirse a los cambios en el estado del modo de edición
    this.tramiteQuery.esDestinatarioFinalElModoDeEdicion$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(modo => {
        this.esElModoDeEdicion = modo;
      });

        this.consultaQuery.selectConsultaioState$
            .pipe(
              takeUntil(this.unsubscribe$),
              map((seccionState) => {
                this.esFormularioSoloLectura = seccionState.readonly;
                this.inicializarEstadoFormulario();
              })
            )
            .subscribe();
  }

  /**
   * Método que se suscribe a los cambios en el campo `tipoPersona` del formulario.
   * Dependiendo del valor seleccionado, establece o elimina las validaciones de otros campos.
   * @method onTipoPersonaChange
   * @returns {void}
   */
  onTipoPersonaChange(value: string): void {
    const IS_FISICA = value === 'FISICA' || value === this.tipoPersona.FISICA;
    const NOMBRES = this.agregarDestinatarioFinal.get('nombres');
    const PRIMER_APELLIDO = this.agregarDestinatarioFinal.get('primerApellido');
    const SEGUNDO_APELLIDO = this.agregarDestinatarioFinal.get('segundoApellido');
    const DENOMINACION_RAZON = this.agregarDestinatarioFinal.get('denominacionRazon');
    if (IS_FISICA) {
      NOMBRES?.setValidators([Validators.required]);
      PRIMER_APELLIDO?.setValidators([Validators.required]);
      SEGUNDO_APELLIDO?.setValidators([Validators.required]);
      DENOMINACION_RAZON?.clearValidators();
    } else {
      NOMBRES?.clearValidators();
      PRIMER_APELLIDO?.clearValidators();
      SEGUNDO_APELLIDO?.clearValidators();
      DENOMINACION_RAZON?.setValidators([Validators.required]);
    }

    NOMBRES?.updateValueAndValidity();
    PRIMER_APELLIDO?.updateValueAndValidity();
    SEGUNDO_APELLIDO?.updateValueAndValidity();
    DENOMINACION_RAZON?.updateValueAndValidity();
  }

  /**
   * Recupera varias listas de datos del servicio `materialesPeligrososService` y
   * las asigna a propiedades locales. Se desuscribe automáticamente en el hook de
   * destrucción usando `takeUntil(this.unsubscribe$)`.
   * @method cargarDatos
   * @returns {void}
   */
  cargarDatos(): void {
    this.materialesPeligrososService
      .obtenerListaCodigosPostales()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.codigosPostalesDatos = data;
      });

    this.materialesPeligrososService
      .obtenerListaPaises()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.paisesDatos = data;
      });

    this.materialesPeligrososService
      .obtenerListaEstados()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.estadosDatos = data;
      });

    this.materialesPeligrososService
      .obtenerListaMunicipios()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.municipiosDatos = data;
      });

    this.materialesPeligrososService
      .obtenerListaLocalidades()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.localidadesDatos = data;
      });

    this.materialesPeligrososService
      .obtenerListaColonias()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.coloniasDatos = data;
      });
  }

  /**
   * Resetea el formulario reactivo `agregarDestinatarioForm` para limpiar todos los campos.
   * @method limpiarFormulario
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.agregarDestinatarioFinal.reset();
  }

  /**
   * Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   * @method cancelar
   * @returns {void}
   */
  cancelar(): void {
    this.ubicaccion.back();
  }

  /**
  * Establece el estado de validación del formulario de destinatario.
  * 
  * @param valida - Un valor booleano que indica si el formulario de datos del destinatario es válido.
  */
  setFormValida(valida: boolean): void {
    this.tramiteStore.setFormValida({ destinatarioFinal: valida });
  }

  /**
   * Crea el formulario reactivo para agregar un destinatario final.
   * Define los campos y sus validaciones iniciales.
   * @method createrDestinatrioForm
   * @returns {void}
   */
  createrDestinatrioForm(): void {
    this.agregarDestinatarioFinal = this.fb.group({
      tipoPersona: ['Fisica', Validators.required],
      nombres: ['', Validators.required],
      denominacionRazon: [''],
      primerApellido: [''],
      segundoApellido: [''],
      pais: ['', Validators.required],
      estadoLocalidad: ['', Validators.required],
      municipio: [''],
      localidad: [''],
      codigoPostal: ['', Validators.required],
      colonia: [''],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: [''],
      lada: ['', Validators.required],
      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
  }


    /**
     * Inicializa el estado del formulario de destinatario final.
     * 
     * Este método se encarga de configurar el estado inicial del formulario 
     * según las condiciones establecidas. Si el formulario para agregar un 
     * destinatario final no está definido, se crea utilizando el método 
     * `createrDestinatrioForm`. Además, si el formulario está configurado 
     * como solo lectura, se deshabilita el control `agregarDestinatarioFinal`.
     * 
     * @returns {void} Este método no retorna ningún valor.
     */
     inicializarEstadoFormulario(): void {
      if(!this.agregarDestinatarioFinal){
        this.createrDestinatrioForm();
      }
      if (this.esFormularioSoloLectura) {
          this.agregarDestinatarioFinal.disable();
      }
    }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Este método desuscribe el componente de los observables para prevenir fugas de memoria.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.esElModoDeEdicion = false;
  }
}
