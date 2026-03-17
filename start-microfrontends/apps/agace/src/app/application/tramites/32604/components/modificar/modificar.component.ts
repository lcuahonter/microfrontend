import { CommonModule } from '@angular/common';
  
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';

import { Domicilios, InputRadio, SolicitudRadioLista } from '../../models/empresas-comercializadoras.model';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
  ],
  templateUrl: './modificar.component.html',
  styleUrl: './modificar.component.scss',
})
export class ModificarComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - `true` si el control es inválido, de lo contrario `false`.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Verifica si un campo de radio debe mostrar error de validación
   * @param {string} nombreControl - Nombre del control de radio
   * @returns {boolean} - `true` si debe mostrar error, `false` en caso contrario
   */
  deberiasMostrarErrorRadio(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    const USUARIO_SELECCIONADA = this.radiosSeleccionadas[nombreControl as keyof typeof this.radiosSeleccionadas];
    const DEBERIA_MOSTRAR_RROR = (this.intentoEnvio && !USUARIO_SELECCIONADA) || 
                             (CONTROL?.invalid && (CONTROL.touched || CONTROL.dirty));
    
    return Boolean(DEBERIA_MOSTRAR_RROR);
  }
  /**
   * Formulario reactivo para la modificación de domicilio
   */
  form!: FormGroup;

  /** Modelo para la opción de tipo sí/no representado como radio button */
  sinoOpcion: InputRadio = {} as InputRadio;

  /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Seguimiento de selecciones de radio del usuario */
  private radiosSeleccionadas = {
    instalacionPrincipal: false,
    procesoProductivo: false,
    acreditaInmueble: false
  };

  /** Indicador de si el usuario ha intentado enviar el formulario */
  public intentoEnvio = false;

  /**
   * Lista de contenedores/tipos de instalación.
   */
  contenedores: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Datos del domicilio a modificar
   */
  @Input() domicilioAModificar: Domicilios | null = null;

  /**
   * Emisor de eventos para enviar el domicilio modificado al componente padre
   */
  @Output() domicilioModificado = new EventEmitter<Domicilios>();

  /**
   * Emisor de eventos para notificar al componente padre que debe cerrar el modal
   */
  @Output() cerrarModalEvento = new EventEmitter<void>();

  /**
   * Constructor de la clase ModificarComponent.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param empresasComercializadorasService Servicio para operaciones relacionadas con empresas comercializadoras.
   * @param solicitud32604Store Almacén para el manejo del estado de la solicitud 32604.
   * @param solicitud32604Query Consulta para obtener información del estado de la solicitud 32604.
   * @param consultaioQuery Consulta para obtener información adicional relacionada.
   * 
   * Inicializa la propiedad `contenedores` con valores predeterminados para los catálogos y etiquetas de la interfaz.
   */
  constructor(
    public fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    this.contenedores = {
      catalogos: [],
      labelNombre: 'Tipo de instalacion',
      primerOpcion: 'Seleccione una opción',
    };
    this.inicializarFormulario();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener la opción seleccionada del radio y cargar los catálogos necesarios.
   */
  ngOnInit(): void {
    this.conseguirOpcionDeRadio();
    this.cargarCatalogos();
    // Asegúrese de que los controles de radio comiencen vacíos
    this.resetearControlesRadio();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada.
   * Actualiza el formulario cuando se recibe un nuevo domicilio para modificar.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['domicilioAModificar'] && changes['domicilioAModificar'].currentValue) {
      // Solo llenar el formulario si los catálogos ya están cargados
      if (this.contenedores.catalogos && this.contenedores.catalogos.length > 0) {
        this.llenarFormularioConDatos();
      }
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Completa el subject destroy$ para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario reactivo con validadores
   */
  inicializarFormulario(): void {
    this.form = this.fb.group({
      instalacionPrincipal: ['', [Validators.required]],
      tipoInstalacion: ['', [Validators.required]],
      entidadFederativa: [''],
      municipioDelegacion: [''],
      registroSESAT: [''],
      direccion: [''],
      codigoPostal: [''],
      procesoProductivo: ['', [Validators.required]],
      acreditaInmueble: ['', [Validators.required]]
    });
    
    // Asegúrese de que los controles de radio comiencen vacíos
    setTimeout(() => {
      ['instalacionPrincipal', 'procesoProductivo', 'acreditaInmueble'].forEach(field => {
        this.form.get(field)?.setValue('', { emitEvent: false });
      });
    }, 0);
  }

  /**
   * Llena el formulario con los datos del domicilio a modificar
   */
  llenarFormularioConDatos(): void {
    if (this.domicilioAModificar && this.form) {
      // Buscar el ID del tipo de instalación en el catálogo
      let tipoInstalacionId = '';
      if (this.domicilioAModificar.cveTipoInstalacion && this.contenedores.catalogos.length > 0) {
        tipoInstalacionId = this.domicilioAModificar.cveTipoInstalacion.toString();
      } else if (this.domicilioAModificar.tipoInstalacion && this.contenedores.catalogos.length > 0) {
        const TIPO_ENCONTRADO = this.contenedores.catalogos.find(
          item => item.descripcion === this.domicilioAModificar?.tipoInstalacion
        );
        tipoInstalacionId = TIPO_ENCONTRADO ? TIPO_ENCONTRADO.id.toString() : '';
      }

      this.form.patchValue({
        instalacionPrincipal: this.domicilioAModificar.instalacionPrincipal ?? '',
        tipoInstalacion: tipoInstalacionId,
        entidadFederativa: this.domicilioAModificar.entidadFederativa ?? '',
        municipioDelegacion: this.domicilioAModificar.municipioDelegacion ?? '',
        registroSESAT: this.domicilioAModificar.registroSESAT ?? '',
        direccion: this.domicilioAModificar.direccion ?? '',
        codigoPostal: this.domicilioAModificar.codigoPostal ?? '',
        procesoProductivo: this.domicilioAModificar.procesoProductivo ?? '',
        acreditaInmueble: this.domicilioAModificar.acreditaInmueble ?? ''
      });
      // Deshabilitar campos después de parchear
      ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
        this.form.get(field)?.disable({ emitEvent: false });
      });
    }
  }

  /**
   * Actualiza el campo '190' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 290.
   */
  actualizar290(valor: string | number): void {
    this.radiosSeleccionadas.instalacionPrincipal = true;
    this.solicitud32604Store.actualizar290(valor);
  }
  /**
   * Actualiza el campo 'procesoProductivo' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo procesoProductivo.
   */
  actualizarProcesoProductivo(valor: string | number): void {
    this.radiosSeleccionadas.procesoProductivo = true;
    this.solicitud32604Store.actualizarProcesoProductivo(valor);
  }

  /**
   * Actualiza el campo 'goceDelInmueble' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo goceDelInmueble.
   */
  actualizarGoceDelInmueble(valor: string | number): void {
    this.radiosSeleccionadas.acreditaInmueble = true;
    this.solicitud32604Store.actualizarGoceDelInmueble(valor);
  }
  /**
   * Método para obtener la opción de radio (sí/no) desde el servicio.
   * Se suscribe al observable y asigna el resultado a `sinoOpcion`.
   */
  conseguirOpcionDeRadio(): void {
    this.empresasComercializadorasService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
 * Cargar catálogos de datos.
 */
  cargarCatalogos(): void {
    this.empresasComercializadorasService
      .obtenerTipoInstalacion()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // Agregar la opción por defecto al inicio de la lista de catálogos
        const OPCION_POR_DEFECTO: Catalogo = {
          id: 0, 
          descripcion: this.contenedores.primerOpcion,
          clave: ''
        };
        this.contenedores.catalogos = [OPCION_POR_DEFECTO, ...data.data];
        // Llenar el formulario después de que los catálogos estén cargados
        this.llenarFormularioConDatos();
      });
  }

  /**
   * Guarda las modificaciones del domicilio
   */
  guardarModificaciones(): void {
    // Habilite los campos deshabilitados antes de enviarlos para garantizar que sus valores estén incluidos
    ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
      this.form.get(field)?.enable({ emitEvent: false });
    });

    // Marcar todos los controles como tocados y actualizar la validez antes de verificar
    this.form.markAllAsTouched();
    ['instalacionPrincipal', 'procesoProductivo', 'acreditaInmueble'].forEach(field => {
      const CONTROL = this.form.get(field);
      CONTROL?.markAsTouched();
      CONTROL?.markAsDirty();
      CONTROL?.updateValueAndValidity();
    });
    this.form.updateValueAndValidity();


    // Compruebe si el usuario ha seleccionado realmente todas las opciones de radio requeridas
    const RADIOS_NO_SELECCIONADOS = !this.radiosSeleccionadas.instalacionPrincipal || 
                                  !this.radiosSeleccionadas.procesoProductivo || 
                                  !this.radiosSeleccionadas.acreditaInmueble;


    if (this.form.invalid || RADIOS_NO_SELECCIONADOS) {
      // Establecer bandera para indicar que se intentó el envío
      this.intentoEnvio = true;
      
      // Deshabilitar campos nuevamente después de la validación
      ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
        this.form.get(field)?.disable({ emitEvent: false });
      });
      return;
    }

    // Obtener el nombre del tipo de instalación seleccionado
    const TIPO_INSTALACION_SELECCIONADO = this.contenedores.catalogos.find(
      item => item.id.toString() === this.form.value.tipoInstalacion
    );

    const DOMICILIO_MODIFICADO: Domicilios = {
      ...this.domicilioAModificar,
      ...this.form.value,
      cveTipoInstalacion: this.form.value.tipoInstalacion,
      tipoInstalacion: TIPO_INSTALACION_SELECCIONADO ? TIPO_INSTALACION_SELECCIONADO.descripcion : this.form.value.tipoInstalacion,
      procesoProductivo: this.form.value.procesoProductivo,
      acreditaInmueble: this.form.value.acreditaInmueble
    } as Domicilios;

    // Emitir el domicilio modificado al componente padre
    this.domicilioModificado.emit(DOMICILIO_MODIFICADO);

    // Deshabilitar campos nuevamente después de enviar
    ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
      this.form.get(field)?.disable({ emitEvent: false });
    });

    // Notificar al componente padre para cerrar el modal
    this.cerrarModalEvento.emit();
  }

  /**
   * Resetea los controles de radio a valores vacíos para validación correcta
   */
  resetearControlesRadio(): void {
    ['instalacionPrincipal', 'procesoProductivo', 'acreditaInmueble'].forEach(field => {
      this.form.get(field)?.setValue('', { emitEvent: false });
      this.form.get(field)?.markAsUntouched();
      this.form.get(field)?.markAsPristine();
    });
    // Restablecer el seguimiento de selección de usuarios
    this.radiosSeleccionadas = {
      instalacionPrincipal: false,
      procesoProductivo: false,
      acreditaInmueble: false
    };
    // Restablecer la bandera de intento de envío
    this.intentoEnvio = false;
  }

  /**
   * Cancela la modificación y cierra el modal
   */
  cancelarModificacion(): void {
    this.form.reset();
    this.resetearControlesRadio();
    this.cerrarModalEvento.emit();
  }
}
