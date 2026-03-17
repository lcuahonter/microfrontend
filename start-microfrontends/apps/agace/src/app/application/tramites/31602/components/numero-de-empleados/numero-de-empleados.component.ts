import { ANTERIORES_TABLA,Anteriores, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { CommonModule } from '@angular/common';
/**
 * Componente que representa la sección de "Número de Empleados".
 * Este componente es responsable de gestionar los datos de empleados, mostrarlos en una tabla dinámica,
 * y manejar las interacciones del formulario para agregar nuevos datos.
 */
@Component({
  selector: 'numero-de-empleados',
  standalone: true,
  providers: [BsModalService],
  imports: [CommonModule,ReactiveFormsModule,TablaDinamicaComponent,CatalogoSelectComponent],
  templateUrl: './numero-de-empleados.component.html',
  styleUrl: './numero-de-empleados.component.scss',
})
export class NumeroDeEmpleadosComponent implements OnInit,OnDestroy {

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   */
  @Input() esFormularioSoloLectura: boolean = false;
  /**
   * Un arreglo para almacenar datos del tipo `Anteriores`, que representa
   * información relacionada con el número de empleados. Esta propiedad se
   * inicializa como un arreglo vacío y puede ser utilizada para gestionar o
   * mostrar datos relacionados con empleados en el componente.
   */
  public numeroDeEmpleadosDatos: Anteriores[] = [];
  /**
   * Configuración para la tabla que muestra datos del tipo `Anteriores`.
   * Esta propiedad es un arreglo de configuraciones de columnas definidas por la interfaz `ConfiguracionColumna`.
   * La configuración se inicializa con la constante `ANTERIORES_TABLA`.
   */
  public configuracionTabla: ConfiguracionColumna<Anteriores>[] = ANTERIORES_TABLA;
  /**
   * Una referencia a la instancia del modal de Bootstrap.
   * Esto se utiliza para controlar e interactuar con el cuadro de diálogo modal.
   * Puede ser indefinido si el modal no ha sido inicializado o abierto.
   */
  modalRef?: BsModalRef;
  /**
   * Una instancia de FormGroup utilizada para gestionar los controles del formulario
   * y sus valores en el componente "Número de Empleados". Este FormGroup es responsable
   * de manejar el estado y la validación de los campos del formulario relacionados
   * con el número de empleados.
   */
  public agregarForm!: FormGroup;
  /**
   * Representa el catálogo de elementos para el primer bimestre.
   * Este arreglo contiene instancias del tipo `Catalogo`, que pueden ser utilizadas
   * para llenar menús desplegables, listas u otros componentes de la interfaz de usuario
   * relacionados con el primer bimestre.
   */
  public bimestreUnoCatalogo: Catalogo[] = [];
  /**
   * Representa el catálogo de elementos para el segundo bimestre.
   * Este arreglo contiene instancias del tipo `Catalogo`, que pueden ser utilizadas
   * para almacenar y gestionar datos específicos de este periodo.
   */
  public bimestreDosCatalogo: Catalogo[] = [];
  /**
   * Representa el catálogo de elementos para el tercer bimestre.
   * Este arreglo contiene instancias del tipo `Catalogo`, que pueden ser utilizadas
   * para llenar menús desplegables, tablas u otros componentes de la interfaz de usuario
   * relacionados con el tercer bimestre.
   */
  public bimestreTresCatalogo: Catalogo[] = [];
  /**
   * Un subject utilizado para notificar y completar todas las suscripciones cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier suscripción activa vinculada a este notifier
   * se desuscriba cuando finalice el ciclo de vida del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente NumeroDeEmpleadosComponent.
   * 
   * @param comercioExteriorSvc - Servicio para manejar las operaciones de Comercio Exterior.
   * @param modalService - Servicio para gestionar los cuadros de diálogo modales.
   * @param fb - Instancia de FormBuilder para crear y gestionar formularios reactivos.
   */
  constructor(
    private comercioExteriorSvc: ComercioExteriorService,
    @Inject(BsModalService)
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {

  }

  /**
   * Gancho del ciclo de vida que se llama después de que la vista del componente ha sido completamente inicializada.
   * 
   * Este método realiza las siguientes acciones:
   * - Recupera datos para la tabla de anteriores utilizando `getAnterioresTablaDatos`.
   * - Inicializa el formulario para agregar nuevas entradas utilizando `crearAgregarForm`.
   * - Obtiene datos del catálogo del banco utilizando `getBancoCatalogDatos`.
   */
  ngOnInit(): void {
    this.getAnterioresTablaDatos();
    this.crearAgregarForm();
    this.getBancoCatalogDatos();
  }

  /**
   * Obtiene y procesa los datos anteriores para la tabla de empleados.
   * 
   * Este método llama al servicio `getAnterioresDatos` de `comercioExteriorSvc`,
   * se suscribe a la respuesta y asigna los datos parseados a la propiedad
   * `numeroDeEmpleadosDatos`.
   */
  public getAnterioresTablaDatos(): void {
    this.comercioExteriorSvc.getAnterioresDatos().subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.numeroDeEmpleadosDatos = DATOS;
    })
  }


  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada.
   *
   * @param template - Una referencia a la plantilla que se mostrará en el modal.
   *                   Esto debe ser de tipo `TemplateRef<void>`.
   *
   * El modal se muestra con una clase CSS 'modal-lg' para propósitos de estilo.
   */
  public abrirModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg',});
  }

  /**
   * Inicializa el FormGroup `agregarForm` con controles predefinidos y sus reglas de validación.
   * 
   * El formulario incluye los siguientes controles:
   * - `rfc`: Un campo de texto requerido para el RFC (Registro Federal de Contribuyentes).
   * - `registroInput`: Un campo de texto deshabilitado para el valor de registro.
   * - `razonSocialInput`: Un campo de texto deshabilitado para el valor de la razón social.
   * - `numeroUno`: Un campo de texto requerido para el primer valor numérico.
   * - `numeroDos`: Un campo de texto requerido para el segundo valor numérico.
   * - `numeroTres`: Un campo de texto requerido para el tercer valor numérico.
   * - `agregarCatalogoUno`: Un campo de texto requerido para el primer valor del catálogo.
   * - `agregarCatalogoDos`: Un campo de texto requerido para el segundo valor del catálogo.
   * - `agregarCatalogoTres`: Un campo de texto requerido para el tercer valor del catálogo.
   * 
   * Este método utiliza el `FormBuilder` de Angular para crear el grupo de formularios
   * y configurar los controles con sus valores iniciales y requisitos de validación.
   */
  public crearAgregarForm(): void {
    this.agregarForm = this.fb.group({
      rfc: ['',Validators.required],
      registroInput: [{ value: '', disabled: true }],
      razonSocialInput: [{ value: '', disabled: true }],
      numeroUno: ['',Validators.required],
      numeroDos: ['',Validators.required],
      numeroTres: ['',Validators.required],
      agregarCatalogoUno: ['',Validators.required],
      agregarCatalogoDos: ['',Validators.required],
      agregarCatalogoTres: ['',Validators.required],
    });
  }

  /**
   * Obtiene datos del catálogo del banco desde el servicio comercioExteriorSvc y los asigna 
   * a las propiedades bimestreUnoCatalogo, bimestreDosCatalogo y bimestreTresCatalogo.
   * 
   * El método se suscribe al observable devuelto por el método `getBancoDatos` del servicio 
   * comercioExteriorSvc. Procesa la respuesta, la parsea y extrae la propiedad `data` para 
   * llenar las propiedades del catálogo.
   * 
   * La suscripción se desuscribe automáticamente cuando el observable `destroyNotifier$` 
   * emite un valor, asegurando una limpieza adecuada de los recursos.
   */
  public getBancoCatalogDatos(): void {
    this.comercioExteriorSvc.getBancoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const API_DATOS = JSON.parse(JSON.stringify(response));
      this.bimestreUnoCatalogo = API_DATOS.data;
      this.bimestreDosCatalogo = API_DATOS.data;
      this.bimestreTresCatalogo = API_DATOS.data;
    });
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Este método emite un valor al subject `destroyNotifier$` y lo completa,
   * asegurando que cualquier suscripción vinculada a este notifier se limpie
   * adecuadamente para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
