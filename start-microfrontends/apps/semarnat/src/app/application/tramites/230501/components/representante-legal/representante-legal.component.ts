import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, InputRadioComponent, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/materiales-peligrosos.enum';
import { Representante } from '../../models/terceros-relacionados.model';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';

/**
 * @component RepresentanteLegalComponent
 * @description Componente responsable de manejar el formulario para  representantes.
 * Se encarga de obtener datos del catálogo (países), gestionar el formulario reactivo y
 * actualizar el estado del trámite con la información del representantes capturado.
 */
@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
  ],
  providers: [MaterialesPeligrososService],
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.scss'],
})
export class RepresentanteLegalComponent implements OnDestroy, OnInit {

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
   * @property {Representante[]} representantes
   * Arreglo de representantes capturados en el formulario.
   * Utilizado para almacenar los datos de los representantes antes de enviarlos al store.
   */
  representantes: Representante[] = [];

  /**
   * @property {FormGroup} representanteLegalForm
   * Formulario reactivo utilizado para capturar los datos del representante.
   * Este formulario contiene validaciones para los campos requeridos.
   */
  representanteLegalForm!: FormGroup;
  /**
   * @public
   * @description Propiedad que almacena las opciones para el botón de radio.
   * @command Opciones definidas en la constante OPCIONES_DE_BOTON_DE_RADIO.
   */
  public radioOpcions = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {Catalogo[]} paisesDatos
   * Lista de países obtenida del servicio de datos.
   * Esta lista se usa para poblar un componente select con opciones de países.
   */
  public paisesDatos: Catalogo[] = [];

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
   * @constructor
   * Inicializa el formulario reactivo y los servicios necesarios para el componente.
   * Realiza la configuración del formulario y las dependencias necesarias.
   *
   * @param fb - FormBuilder para construir el formulario reactivo.
   * @param materialesPeligrososService - Servicio para obtener datos del backend (como países).
   * @param tramiteStore - Store que administra el estado del trámite actual.
   * @param tramiteQuery - Servicio para consultar el estado del trámite.
   * @param ubicaccion - Servicio de Angular para navegación de retroceso.
   * @param consultaQuery - Consulta para obtener el estado de la sección de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private materialesPeligrososService: MaterialesPeligrososService,
    private ubicaccion: Location,
    private tramiteStore: Tramite230501Store,
    public tramiteQuery: Tramite230501Query,
    private consultaQuery:ConsultaioQuery
  ) {
    //No hacer nada
  }
  /**
   * Método que se suscribe a los cambios en el campo `tipoPersona` del formulario.
   * Dependiendo del valor seleccionado, establece o elimina las validaciones de otros campos.
   * @method onTipoPersonaChange
   * @returns {void}
   */
  onTipoPersonaChange(value: string): void {
    const IS_FISICA = value === 'FISICA' || value === this.tipoPersona.FISICA;
    const NOMBRES = this.representanteLegalForm.get('nombres');
    const PRIMER_APELLIDO = this.representanteLegalForm.get('primerApellido');
    const SEGUNDO_APELLIDO = this.representanteLegalForm.get('segundoApellido');
    const DENOMINACION_RAZON = this.representanteLegalForm.get('denominacionRazon');
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
   * @method ngOnInit
   * @description Hook de inicialización del componente. Llama a `cargarDatos()` para obtener los catálogos.
   * También suscribe a los datos del store para cargar la información del trámite.
   */
  ngOnInit(): void {
    this.createRepresentForm();
    this.onTipoPersonaChange(this.tipoPersona.FISICA);
    this.cargarDatos();
    // Suscripción a los datos del store para cargar el representante legal
    this.tramiteStore.representanteSujeto
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(representante => {
        if (representante) {
          this.representanteLegalForm.patchValue(representante);
        }
      });

    // Suscripción al estado del modo de edición del representante legal
    this.tramiteQuery.esRepresentanteLegalElModoDeEdicion$.pipe(takeUntil(this.unsubscribe$))
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
   * @method cargarDatos
   * @description Obtiene la lista de países del servicio `materialesPeligrososService` y la almacena en `paisesDatos`.
   * Esto permite cargar los catálogos de países necesarios para el formulario.
   */
  cargarDatos(): void {
    this.materialesPeligrososService
      .obtenerListaPaises()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.paisesDatos = data;
      });
  }


  /**
   * Guarda un nuevo representante legal en la lista de representantes y realiza las acciones correspondientes
   * según el modo de edición actual. Este método valida el formulario, crea un objeto de tipo `Representante`,
   * y lo agrega a la lista de representantes. Además, actualiza o agrega el representante legal dependiendo
   * del estado de edición y reinicia el formulario al finalizar.
   *
   * @remarks
   * - Si el formulario es válido, se procede a guardar el representante.
   * - En modo de edición, se actualiza el representante existente.
   * - En modo de creación, se agrega un nuevo representante a la lista.
   * - Al finalizar, se reinicia el formulario y se navega hacia atrás en la ubicación actual.
   *
   * @example
   * // Ejemplo de uso:
   * guardarRepresentante();
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarRepresentante(): void {
    const NUEVO_REPRESENTANTE: Representante = {
      segundoApellido: this.representanteLegalForm.value.segundoApellido,
      primerApellido: this.representanteLegalForm.value.primerApellido,
      nombres: this.representanteLegalForm.value.nombres,
      nombreRazonSocial: `${this.representanteLegalForm.value.nombres} ${this.representanteLegalForm.value.primerApellido
        } ${this.representanteLegalForm.value.segundoApellido || ''}`.trim(),
      rfc: this.representanteLegalForm.value.rfc,
      curp: '',
      lada: this.representanteLegalForm.value.lada,
      telefono: this.representanteLegalForm.value.telefono,
      correoElectronico: this.representanteLegalForm.value.correoElectronico,
      calle: this.representanteLegalForm.value.calle,
      numeroExterior: this.representanteLegalForm.value.numeroExterior,
      numeroInterior: this.representanteLegalForm.value.numeroInterior || '',
      pais: this.representanteLegalForm.value.pais,
      colonia: this.representanteLegalForm.value.colonia,
      municipioAlcaldia: this.representanteLegalForm.value.municipio,
      localidad: this.representanteLegalForm.value.localidad,
      entidadFederativa: '',
      estadoLocalidad: this.representanteLegalForm.value.estadoLocalidad,
      codigoPostal: this.representanteLegalForm.value.codigoPostal,
      coloniaEquivalente: this.representanteLegalForm.value.codie,
      tipoPersona: this.representanteLegalForm.value.tipoPersona,
    };

    if (this.representanteLegalForm.valid) {
      this.setFormValida(this.representanteLegalForm.valid);
      this.representantes.push(NUEVO_REPRESENTANTE);
      if (this.esElModoDeEdicion) {
        this.updateRepresentanteLegal(NUEVO_REPRESENTANTE);
      } else {
        this.addRepresentanteLegal(this.representantes);
      }
      this.representanteLegalForm.reset();
      this.ubicaccion.back();
    }
  }

  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `representanteLegalForm` para limpiar todos los campos.
   * Esto puede ser útil si se desea cancelar o reiniciar el formulario.
   */
  limpiarFormulario(): void {
    this.representanteLegalForm.reset();
  }

  /**
   * @method cancelar
   * @description Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   * Esto puede ser útil si el usuario desea cancelar el proceso.
   */
  cancelar(): void {
    this.ubicaccion.back();
  }

  /**
* Establece el estado de validación del formulario de representanteLegal.
* 
* @param valida - Un valor booleano que indica si el formulario de datos del representante es válido.
*/
  setFormValida(valida: boolean): void {
    this.tramiteStore.setFormValida({ representanteLegal: valida });
  }

  /**
   * @method addRepresentanteLegal
   * @description Agrega nuevos representantes a la tabla de datos del trámite.
   * Actualiza el estado del trámite con los datos de los representantes capturados.
   *
   * @param newRepresentante - Lista de objetos `Representante` a agregar.
   */
  addRepresentanteLegal(newRepresentante: Representante[]): void {
    this.tramiteStore.addRepresentanteLegalTablaDatos(newRepresentante);
  }

  /**
   * Actualiza la información del representante legal en el almacenamiento del trámite.
   * 
   * @param newRepresentante - Objeto que contiene los datos actualizados del representante legal.
   */
  updateRepresentanteLegal(newRepresentante: Representante): void {
    this.tramiteStore.updateRepresentanteLegalTablaDatos(newRepresentante);
  }

  /**
   * Crea el formulario reactivo para agregar un representanteLegal.
   * Define los campos y sus validaciones iniciales.
   * @method createRepresentForm
   * @returns {void}
   */
  createRepresentForm(): void {
    this.representanteLegalForm = this.fb.group({
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
   * Inicializa el estado del formulario de representante legal.
   * 
   * Este método verifica si el formulario `representanteLegalForm` ha sido creado.
   * Si no existe, se invoca el método `createRepresentForm` para inicializarlo.
   * Además, si el formulario está configurado como de solo lectura (`esFormularioSoloLectura`),
   * se deshabilita para evitar modificaciones.
   * 
   * @returns {void} No retorna ningún valor.
   */
  inicializarEstadoFormulario(): void {
    if (!this.representanteLegalForm) {
      this.createRepresentForm();
    }
    if (this.esFormularioSoloLectura) {
      this.representanteLegalForm.disable();
    }
  }

  /**
   * @method ngOnDestroy
   * @description Hook de destrucción del componente. Libera las suscripciones activas.
   * Esto es crucial para evitar fugas de memoria cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.esElModoDeEdicion = false;
  }
}
