import { AVISO_PRIVACIDAD, DESTINATARIO_CONFIGURACION_TABLA, FABRICANTE_CONFIGURACION_TABLA } from "../../constantes/consulta.enum";
import { 
  AlertComponent, 
  CatalogoSelectComponent, 
  InputRadioComponent, 
  TablaDinamicaComponent, 
  TituloComponent 
} from "@ng-mf/data-access-user";
import { 
  CatalogosSelect, 
  TablaSeleccion, 
  ValidacionesFormularioService 
} from "@libs/shared/data-access-user/src";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Destinatario, Fabricante } from "../../models/consulta.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, map, takeUntil } from "rxjs";
import { Solicitud260704State, Tramite260704Store } from "../../estados/Tramite260704.store";
import { CommonModule } from "@angular/common";
import { ConsultaService } from "../../service/consulta.service";
import { Modal } from 'bootstrap';
import { Tramite260704Query } from "../../estados/Tramite260704.query";

/**
 * Componente para la gestión de terceros relacionados.
 *
 * Este componente permite administrar el formulario y las tablas asociadas a terceros y fabricantes,
 * gestionar la selección de destinatarios y ejecutar acciones como eliminación o modificación.
 */
@Component({
  selector: "app-terceros-relacinados",
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./terceros-relacinados.component.html",
  styleUrls: ["./terceros-relacinados.component.css"],
})
export class TercerosRelacinadosComponent implements OnInit, OnDestroy {
/**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
  /**
   * Constante que almacena el aviso de privacidad.
   */
  AVISO_PRIVACIDAD = AVISO_PRIVACIDAD;

  /**
   * Formulario reactivo para terceros.
   */
  tercerosForm!: FormGroup;

  /**
   * Constante para la selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Arreglo de fabricantes seleccionados (destinatarios).
   */
  selectedDestinatario: Fabricante[] = [];

  /**
   * Datos de destinatarios que se muestran en la tabla.
   */
  public destinatarioDatos: Destinatario[] = [];

  /**
   * Datos de fabricantes.
   */
  fabricanteDatos: Fabricante[] = [];

  /**
   * Referencia al elemento modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Subject para controlar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Variable para almacenar el tipo de público.
   */
  tipoDePublicos: string = '';

  /**
   * Variable para almacenar el tipo de persona seleccionada (por ejemplo, 'fisica' o 'moral').
   */
  tipoPersonaSeleccionada: string = '';

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud260704State;

  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOptions = [
    { label: 'Física', value: 'fisica' },
    { label: 'Moral', value: 'moral' },
  ];

  /**
   * Catálogo para el estado, utilizado en formularios.
   */
  public estadoCatalogo: CatalogosSelect = {
    labelNombre: 'Estado',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

 /**
   * Configuración de columnas para la tabla de destinatarios.
   */
 public destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA;


 /**
   * Configuración de columnas para la tabla de fabricantes.
   */
 public fabricanteConfiguracionTabla = FABRICANTE_CONFIGURACION_TABLA;

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param consulta Servicio para realizar consultas.
   * @param store Almacén de estado para Tramite260704.
   * @param query Consulta para Tramite260704.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param validacionesService Servicio para validaciones de formularios.
   */
  constructor(
    private consulta: ConsultaService,
    public store: Tramite260704Store,
    private query: Tramite260704Query,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Método del ciclo de vida que se ejecuta al iniciar el componente.
   *
   * Se suscribe al estado de la solicitud, inicializa el formulario y carga la tabla de terceros.
   */
  ngOnInit(): void {
    this.donanteDomicilio();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    
    this.obtenerTablaTerceros();
    this.inicializarEstadoFormulario();
  }
/**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.tercerosForm.disable();
    } else {
      this.tercerosForm.enable();
    }
  }
  /**
   * Obtiene la tabla de terceros mediante el servicio de consulta.
   *
   * Asigna los datos recibidos a la propiedad 'destinatarioDatos'.
   */
  public obtenerTablaTerceros(): void {
    this.consulta
      .obtenerTablaTerceros()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.destinatarioDatos = data;
      });
  }

  /**
   * Establece el tipo de persona seleccionado.
   * @param value Valor seleccionado (cadena o número).
   */
  setTipoPersona(value: string | number): void {
    this.tipoPersonaSeleccionada = value.toString();
  }

  /**
   * Asigna los datos recibidos al arreglo de destinatarios.
   * @param evento Arreglo de fabricantes recibidos.
   */
  obtenerDatosDestinatario(evento: Fabricante[]): void {
    this.selectedDestinatario = evento;
  }

  /**
   * Elimina el dato del destinatario seleccionado del store.
   *
   * Si existe al menos un destinatario seleccionado, se elimina el primero.
   */
  eliminarMercancias(): void {
    if (this.selectedDestinatario.length > 0) {
      this.store.removeDestinatarioDato(this.selectedDestinatario[0]);
    }
  }

  /**
   * Abre el modal para modificar productos.
   *
   * Se utiliza la instancia del modal para mostrar la ventana.
   */
  abrirModificarProductos(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Valida un campo del formulario utilizando el servicio de validaciones.
   * @param form Formulario a validar.
   * @param field Nombre del campo.
   * @returns True si el campo es válido, de lo contrario, false.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece un valor en el store llamando al método correspondiente.
   * @param form Formulario del cual se extrae el valor.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método del store a ejecutar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260704Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa el formulario 'tercerosForm' con sus controles y validaciones.
   *
   * Utiliza el estado actual de la solicitud para asignar los valores iniciales.
   */
  donanteDomicilio(): void {
  this.tercerosForm = this.fb.group({
    destinatario: [{ value: this.solicitudState?.destinatario, disabled: this.soloLectura }, [Validators.required]],
    fabricante: [{ value: this.solicitudState?.fabricante, disabled: this.soloLectura }, [Validators.required]],
    tipoPersona: [{ value: this.solicitudState?.tipoPersona, disabled: this.soloLectura }, [Validators.required]],
    nombre: [{ value: this.solicitudState?.nombre, disabled: this.soloLectura }, [Validators.required]],
    primerApellido: [{ value: this.solicitudState?.primerApellido, disabled: this.soloLectura }, [Validators.required]],
    segundoApellido: [{ value: this.solicitudState?.segundoApellido, disabled: this.soloLectura }, [Validators.required]],
    denominacion: [{ value: this.solicitudState?.denominacion, disabled: this.soloLectura }, [Validators.required]],
    pais: [{ value: this.solicitudState?.pais, disabled: this.soloLectura }, [Validators.required]],
    estados: [{ value: this.solicitudState?.estados, disabled: this.soloLectura }, [Validators.required]],
    codigoDeZip: [{ value: this.solicitudState?.codigoDeZip, disabled: this.soloLectura }, [Validators.required]],
    camino: [{ value: this.solicitudState?.camino, disabled: this.soloLectura }, [Validators.required]],
    numeroExterior: [{ value: this.solicitudState?.numeroExterior, disabled: this.soloLectura }, [Validators.required]],
    numeroInterior: [{ value: this.solicitudState?.numeroInterior, disabled: this.soloLectura }, [Validators.required]],
    ladaDeTerceros: [{ value: this.solicitudState?.ladaDeTerceros, disabled: this.soloLectura }, [Validators.required]],
    fon: [{ value: this.solicitudState?.fon, disabled: this.soloLectura }, [Validators.required]],
    email: [{ value: this.solicitudState?.email, disabled: this.soloLectura }, [Validators.required]],
  });
}

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Emite la señal para completar las suscripciones y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
