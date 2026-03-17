import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, ConsultaioQuery, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { USO_TABLA, Uso, UsoFinal } from '../../models/terceros-relacionados.model';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/materiales-peligrosos.enum';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';

/**
 * Componente Angular para gestionar el uso final de materiales peligrosos.
 * Permite a los usuarios ingresar información sobre el usuario final y el uso final de los materiales.
 * Utiliza formularios reactivos para la captura de datos y se integra con servicios para obtener catálogos.
 * 
 * @remarks
 * Este componente es parte del trámite 230501 y se encarga de manejar la sección de uso final,
 * incluyendo la validación de formularios y la interacción con el store del trámite.
 */
@Component({
  selector: 'app-uso-final',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
    TablaDinamicaComponent
  ],
  providers: [MaterialesPeligrososService],
  templateUrl: './uso-final.component.html',
  styleUrl: './uso-final.component.scss',
})
export class UsoFinalComponent implements OnDestroy, OnInit {

  /**
   * Enum TipoPersona utilizado para seleccionar el tipo de persona (Física o Moral).
   * @property {TipoPersona} tipoPersona
   */
  public tipoPersona = TipoPersona;

  /**
   * Formulario reactivo para capturar los datos del usuario final.
   * @property {FormGroup} usuarioFinalForm
   */
  usuarioFinalForm!: FormGroup;

  /**
   * Formulario reactivo para capturar los datos del uso final.
   * @property {FormGroup} usoFinalForm
   */
  usoFinalForm!: FormGroup;

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
   * Lista de usuarios finales almacenados localmente.
   * @property {UsoFinal[]} usuarioFinal
   */
  usuarioFinal: UsoFinal[] = [];

  /**
   * Lista de usos finales disponibles.
   * @property {Uso[]} usoFinals
   */
  usoFinals: Uso[] = [];

  /**
   * Configuración de columnas para la tabla de usuarios finales.
   * @property {ConfiguracionColumna<Uso>[]} configuracionTablaUso
   */
  configuracionTablaUso: ConfiguracionColumna<Uso>[] = USO_TABLA;

  /**
   * Tipo de selección para las filas en la tabla dinámica (checkbox).
   * @property {TablaSeleccion} tipoSeleccionTabla
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Datos de la tabla de uso final.
   * @property {Uso[]} UsuarioTablaDatos
   */
  UsuarioTablaDatos: Uso[] = [];

  /**
   * Fila de uso final seleccionada.
   * @property {Uso[]} usoFinalFilaSeleccionada
   */
  usoFinalFilaSeleccionada: Uso[] = [];

  /**
   * Indica si el componente está en modo de edición.
   * Cuando es verdadero, permite modificar los datos existentes.
   * Cuando es falso, el componente opera en modo de solo lectura.
   */
  public esElModoDeEdicion = false;

  /**
   * @public
   * @description Propiedad que almacena las opciones para el botón de radio.
   * @command Opciones definidas en la constante OPCIONES_DE_BOTON_DE_RADIO.
   */
  public radioOpcions = OPCIONES_DE_BOTON_DE_RADIO;
    /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor que inicializa el formulario y servicios necesarios.
   *
   * @param {FormBuilder} fb - FormBuilder para construir el formulario reactivo.
   * @param {MaterialesPeligrososService} materialesPeligrososService - Servicio para obtener listas de catálogos.
   * @param {Location} ubicaccion - Servicio para manejar la navegación (volver atrás).
   * @param {Tramite230501Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite230501Query} tramiteQuery - Servicio para consultar el estado actual del trámite.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la sección de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private materialesPeligrososService: MaterialesPeligrososService,
    private ubicaccion: Location,
    private tramiteStore: Tramite230501Store,
    public tramiteQuery: Tramite230501Query,
    public consultaQuery: ConsultaioQuery
  ) {

    //No hacer nada

  }
  /**
 * Método que se suscribe a los cambios en el campo `tipoPersona` del formulario.
 * Dependiendo del valor seleccionado, establece o elimina las validaciones de otros campos.
 * @method usuarioFinalForm
 * @returns {void}
 */
  onTipoPersonaChange(value: string): void {
    const IS_FISICA = value === 'FISICA' || value === this.tipoPersona.FISICA;
    const NOMBRES = this.usuarioFinalForm.get('nombres');
    const PRIMER_APELLIDO = this.usuarioFinalForm.get('primerApellido');
    const SEGUNDO_APELLIDO = this.usuarioFinalForm.get('segundoApellido');
    const DENOMINACION_RAZON = this.usuarioFinalForm.get('denominacionRazon');
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
   * Inicializa el estado del formulario de uso final.
   * Si el formulario no existe, lo crea. Si el formulario está en modo solo lectura, lo desactiva.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (!this.usoFinalForm) {
      this.createUsoFinalForm();
    }
    if (this.esFormularioSoloLectura) {
      this.usoFinalForm.disable();
    }
  }

  /**
   * Hook de inicialización del componente. Carga los catálogos necesarios.
   */
  ngOnInit(): void {
    this.createUsuarioFinalForm();
    this.createUsoFinalForm()
    this.onTipoPersonaChange(this.tipoPersona.FISICA);
    this.cargarDatos();

    // Suscripción a datos de uso final desde el store
    this.tramiteQuery.getusoTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.usoFinals = data;
      });

    // Suscripción para cargar datos existentes del usuario final en el formulario
    this.tramiteStore.usuarioSujeto
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(usuario => {
        if (usuario) {
          this.usuarioFinalForm.patchValue(usuario);
        }
      });

    // Suscripción para obtener el estado de edición del usuario final
    this.tramiteQuery.esUsuarioElModoDeEdicion$.pipe(takeUntil(this.unsubscribe$))
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
   * Carga los países desde el servicio y los almacena en `paisesDatos`.
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
   * Guarda los datos del nuevo usuario final en el arreglo `usuarioFinal` y actualiza el store.
   * Luego, resetea el formulario y regresa a la vista anterior.
   */
  guardarUsuarioFinal(): void {
    const NUEVO_USUARIOFINAL: UsoFinal = {
      segundoApellido: this.usuarioFinalForm.value.segundoApellido,
      primerApellido: this.usuarioFinalForm.value.primerApellido,
      nombres: this.usuarioFinalForm.value.nombres,
      nombreRazonSocial: `${this.usuarioFinalForm.value.nombres} ${this.usuarioFinalForm.value.primerApellido
        } ${this.usuarioFinalForm.value.segundoApellido || ''}`.trim(),
      rfc: this.usuarioFinalForm.value.rfc,
      curp: '',
      lada: this.usuarioFinalForm.value.lada,
      telefono: this.usuarioFinalForm.value.telefono,
      correoElectronico: this.usuarioFinalForm.value.correoElectronico,
      calle: this.usuarioFinalForm.value.calle,
      numeroExterior: this.usuarioFinalForm.value.numeroExterior,
      numeroInterior: this.usuarioFinalForm.value.numeroInterior || '',
      pais: this.usuarioFinalForm.value.pais,
      colonia: this.usuarioFinalForm.value.colonia,
      municipioAlcaldia: this.usuarioFinalForm.value.municipio,
      localidad: this.usuarioFinalForm.value.localidad,
      entidadFederativa: '',
      estadoLocalidad: this.usuarioFinalForm.value.estadoLocalidad,
      codigoPostal: this.usuarioFinalForm.value.codigoPostal,
      coloniaEquivalente: this.usuarioFinalForm.value.codie,
      tipoPersona: this.usuarioFinalForm.value.tipoPersona,
    };

    if (this.usuarioFinalForm.valid) {
      this.setFormValida(this.usuarioFinalForm.valid);
      this.usuarioFinal.push(NUEVO_USUARIOFINAL);
      if (this.esElModoDeEdicion) {
        this.updateUsuario(NUEVO_USUARIOFINAL);
      } else {
        this.addUsuario(this.usuarioFinal);
      }
      this.usuarioFinalForm.reset();
      this.ubicaccion.back();
    }
  }

  /**
   * Crea el formulario reactivo `usuarioFinalForm` con los campos necesarios y sus validaciones.
   * @returns {void}
   */
  createUsuarioFinalForm(): void {
    this.usuarioFinalForm = this.fb.group({
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
 * Crea el formulario reactivo `usoFinalForm` con los campos necesarios y sus validaciones.
 * @returns {void}
 */
  createUsoFinalForm(): void {
    this.usoFinalForm = this.fb.group({
      descripcion: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  /**
   * Resetea el formulario reactivo `usuarioFinalForm` para limpiar todos los campos.
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.usuarioFinalForm.reset();
  }

  /**
   * Cancela la acción actual y navega hacia la vista anterior utilizando el servicio `Location`.
   * @returns {void}
   */
  cancelar(): void {
    this.ubicaccion.back();
  }

  /**
   * Agrega nuevos usuarios finales a la tabla de datos del trámite.
   * @param newUsuario - Lista de objetos `UsoFinal` a agregar.
   */
  addUsuario(newUsuario: UsoFinal[]): void {
    this.tramiteStore.addUsuarioTablaDatos(newUsuario);
  }

  /**
   * Actualiza la información del usuario en la tabla de datos del trámite.
   * 
   * @param newUsuario - Objeto de tipo `UsoFinal` que contiene los datos actualizados del usuario.
   * 
   * @remarks
   * Este método utiliza el servicio `tramiteStore` para actualizar los datos del usuario
   * en la tabla correspondiente dentro del flujo del trámite.
   */
  updateUsuario(newUsuario: UsoFinal): void {
    this.tramiteStore.updateUsuarioTablaDatos(newUsuario);
  }

  /**
   * Agrega nuevos usos finales a la tabla de datos del trámite.
   * Este método crea un nuevo objeto `Uso` con los datos del formulario `usoFinalForm` y lo agrega al arreglo `usoFinals`.
   * Luego, resetea el formulario y actualiza la tabla con los nuevos datos.
   */
  addUsoFinalTabla(): void {
    const NUEVO_USOFINAL: Uso = {
      descripcion: this.usoFinalForm.value.descripcion,
      pais: this.usoFinalForm.value.pais
    };

    // Si el arreglo de usos finales está congelado, lo reemplaza con una nueva instancia.
    if (Object.isFrozen(this.usoFinals)) {
      this.usoFinals = [...this.usoFinals, NUEVO_USOFINAL];
    } else {
      this.usoFinals.push(NUEVO_USOFINAL);
    }

    this.usoFinalForm.reset();
    this.addUsoFinal(this.usoFinals);
  }

  /**
   * Elimina un uso final seleccionado de la tabla de datos del trámite.
   */
  eliminarUsoFinal(): void {
    if (this.usoFinalFilaSeleccionada.length) {
      this.tramiteStore.eliminarUsoFinal(this.usoFinalFilaSeleccionada[0]);
    }
  }

  /**
   * Agrega nuevos usos finales a la tabla de datos del trámite.
   * @param newUso - Lista de objetos `Uso` a agregar.
   */
  addUsoFinal(newUso: Uso[]): void {
    this.tramiteStore.updateUsoFinalTabla(newUso);
  }

  /**
* Establece el estado de validación del formulario de representanteLegal.
* 
* @param valida - Un valor booleano que indica si el formulario de datos del representante es válido.
*/
  setFormValida(valida: boolean): void {
    this.tramiteStore.setFormValida({ UsuarioFinal: valida });
  }

  /**
   * Hook de destrucción del componente. Libera recursos y detiene suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.esElModoDeEdicion = false;
  }
}
