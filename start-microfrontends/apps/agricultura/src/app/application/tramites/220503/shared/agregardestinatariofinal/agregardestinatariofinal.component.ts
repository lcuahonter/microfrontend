/**
 * @fileoverview
 * Componente para agregar destinatarios finales en el trámite de importación de acuicultura 220203.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura de documentación completa: cada clase, método, propiedad y evento está documentado en español.
 * @module AgregardestinatariofinalComponent
 */

import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Catalogo, CatalogoSelectComponent, InputRadioComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Solicitud220503State, Solicitud220503Store } from "../../estados/tramites220503.store";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { DestinatarioForm } from "../../../220203/models/220203/importacion-de-acuicultura.module";
import { OPCION_DE_BOTON_DE_RADIO } from "../../../../shared/constantes/tercerosrelacionados.enum";
import { RadioOpcion } from "../../../220201/models/220201/certificado-zoosanitario.model";
import { Solocitud220503Service } from "../../services/service220503.service";
import { TercerosrelacionadosService } from "../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service";
import { TercerosrelacionadosdestinoTable } from "../../../../shared/models/tercerosrelacionados.model";

/**
 * Componente para agregar destinatarios finales en el trámite de importación de acuicultura.
 * Gestiona la captura de información de destinatarios con validaciones dinámicas según el tipo de persona (física o moral).
 * Incluye funcionalidades para guardar, limpiar y cancelar operaciones, así como gestión de catálogos.
 * 
 * @export
 * @class AgregardestinatariofinalComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-agregardestinatariofinal',
  standalone: true,
  imports: [CommonModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule],
  templateUrl: './agregardestinatariofinal.component.html',
  styleUrl: './agregardestinatariofinal.component.css',
})
export class AgregardestinatariofinalComponent implements OnInit, AfterViewInit {
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de todos los campos.
   * @type {boolean}
   * @default false
   * @memberof AgregardestinatariofinalComponent
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Evento emitido al guardar exitosamente un destinatario.
   * Permite comunicar al componente padre los datos del destinatario guardado.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable>}
   * @memberof AgregardestinatariofinalComponent
   */
  @Output() guardarDestinatario = new EventEmitter<TercerosrelacionadosdestinoTable>();

  /**
   * Evento emitido al cerrar el formulario o cancelar la operación.
   * Permite notificar al componente padre que se debe cerrar el modal o vista.
   * @type {EventEmitter<void>}
   * @memberof AgregardestinatariofinalComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Opciones disponibles para el componente de botón de radio del tipo de persona.
   * Define si el destinatario es persona física o moral.
   * @type {RadioOpcion[]}
   * @memberof AgregardestinatariofinalComponent
   */
  opcionDeBotonDeRadio: RadioOpcion[] = OPCION_DE_BOTON_DE_RADIO;

  /**
   * Catálogo de países disponibles para selección en el formulario.
   * Contiene la lista de países obtenida del servicio de terceros relacionados.
   * @type {Catalogo[]}
   * @memberof AgregardestinatariofinalComponent
   */
  pairsCatalog: Catalogo[] = [];

  /**
   * Catálogo de estados disponibles para selección en el formulario.
   * Contiene la lista de estados obtenida según el país seleccionado.
   * @type {Catalogo[]}
   * @memberof AgregardestinatariofinalComponent
   */
  estadoCatalog: Catalogo[] = [];

  /**
   * Catálogo de municipios disponibles para selección en el formulario.
   * Contiene la lista de municipios obtenida según el estado seleccionado.
   * @type {Catalogo[]}
   * @memberof AgregardestinatariofinalComponent
   */
  municipioCatalog: Catalogo[] = [];

  /**
   * Catálogo de colonias disponibles para selección en el formulario.
   * Contiene la lista de colonias obtenida según el municipio seleccionado.
   * @type {Catalogo[]}
   * @memberof AgregardestinatariofinalComponent
   */
  coloniaCatalog: Catalogo[] = [];

  /**
   * Subject para controlar la destrucción de suscripciones y evitar memory leaks.
   * Se utiliza para limpiar todas las suscripciones activas al destruir el componente.
   * @type {Subject<void>}
   * @private
   * @memberof AgregardestinatariofinalComponent
   */
  private readonly DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Formulario reactivo para capturar los datos del destinatario final.
   * Incluye validaciones dinámicas según el tipo de persona seleccionada.
   * @type {FormGroup}
   * @memberof AgregardestinatariofinalComponent
   */
  destinatarioForm!: FormGroup;

  /**
   * Constructor del componente AgregardestinatariofinalComponent.
   * Inicializa los servicios necesarios para la gestión de formularios, catálogos y navegación.
   * 
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos de Angular
   * @param {TercerosrelacionadosService} tercerosrelacionadosService - Servicio para obtener catálogos de terceros relacionados
   * @param {Router} router - Servicio de enrutamiento de Angular para navegación
   * @param {ImportacionDeAcuiculturaService} certificadoZoosanitarioServices - Servicio para gestionar datos de acuicultura
   * @param {AcuiculturaStore} zoosanitarioStore - Store para gestionar el estado de la aplicación de acuicultura
   * @param {ActivatedRoute} route - Servicio para obtener parámetros de la ruta activa
   * @memberof AgregardestinatariofinalComponent
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private readonly certificadoZoosanitarioServices: Solocitud220503Service,
    private readonly zoosanitarioStore: Solicitud220503Store,
  ) { }

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa el formulario reactivo con validaciones y carga datos de destinatario seleccionado si existe.
   * Configura validaciones dinámicas según el tipo de persona (física o moral).
   * 
   * @public
   * @method ngOnInit
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  ngOnInit(): void {
     this.destinatarioForm = this.fb.group({
      tipoMercancia: ['yes', Validators.required], 
      nombre: ['', []],
      primerApellido: ['', []], 
      segundoApellido: [''],
      razonSocial: ['', []], 
      pais: ['', Validators.required],
      domicilio: ['', Validators.required],
      lada: ['', [Validators.maxLength(5)]],
      telefono: ['', [Validators.maxLength(30)]],
      correo: ['', [Validators.maxLength(320), Validators.email]],
    });

    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data: Solicitud220503State) => {
        const DESTINATARIO = data.seletedExdora;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || 'yes',
            nombre: DESTINATARIO.nombre || '',
            primerApellido: DESTINATARIO.primerApellido || '',
            segundoApellido: DESTINATARIO.segundoApellido || '',
            razonSocial: DESTINATARIO.razonSocial || '',
            pais: DESTINATARIO.pais || '',
            lada: DESTINATARIO.lada || '',
            telefono: DESTINATARIO.telefono || '',
            correo: DESTINATARIO.correo || '',
            domicilio: DESTINATARIO.domicilio || '',
          });
        }
      });
  }

  /**
   * Método del ciclo de vida AfterViewInit de Angular.
   * Se ejecuta después de que la vista del componente se ha inicializado completamente.
   * Marca el formulario como pendiente y carga los catálogos de terceros países.
   * 
   * @public
   * @method ngAfterViewInit
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  ngAfterViewInit(): void {
    this.pairsCatalogChange();
  }

  /**
   * Método para cargar catálogos de países.
   * Obtiene los datos del catálogo de países de procedencia desde el servicio de terceros relacionados.
   * Maneja la subscripción con patrón takeUntil para evitar memory leaks.
   * 
   * @public
   * @method pairsCatalogChange
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  pairsCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('paisprocedencia.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.pairsCatalog = data;
      });
  }



 

  /**
   * Método para guardar y validar el formulario de destinatario final.
   * Valida el formulario completo y si es válido, agrega el destinatario a la lista dinámica.
   * Actualiza el store de zoosanitario con los nuevos datos y resetea el formulario.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar errores.
   * 
   * @public
   * @method onGuardarDestinatarioFinal
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  onGuardarDestinatarioFinal(): void {
    if (this.destinatarioForm.valid) {
      const LISTA_DINAMICA: DestinatarioForm[] = [];
      LISTA_DINAMICA.push(this.destinatarioForm.value as DestinatarioForm);
      this.zoosanitarioStore.updatedatosForma(LISTA_DINAMICA as DestinatarioForm[]);
      this.zoosanitarioStore.actualizarSelectedExdora({} as DestinatarioForm);
      this.destinatarioForm.reset();
      this.cerrar.emit();
    } else {
      this.destinatarioForm.markAllAsTouched();
    }
  }

  /**
   * Método para limpiar y restablecer el formulario de destinatario.
   * Resetea todos los campos del formulario a su estado inicial y limpia validaciones.
   * Establece valores por defecto para tipoMercancia después del reseteo.
   * 
   * @public
   * @method onLimpiarDestinatario
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  onLimpiarDestinatario(): void {
    this.destinatarioForm.reset();
    this.destinatarioForm.markAsPristine();
    this.destinatarioForm.markAsUntouched();
    this.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
    });
  }

  /**
   * Método para cancelar la operación de agregar destinatario.
   * Emite el evento de cierre para cerrar el modal o componente actual.
   * No guarda ningún cambio realizado en el formulario.
   * 
   * @public
   * @method onCancelarDestinatario
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
  }

  /**
   * Método para manejar el cambio en el tipo de persona (física o moral).
   * Cambia las validaciones dinámicamente según el valor seleccionado en el radio button tipoMercancia.
   * Para persona física (no): Elimina validación de razón social y agrega validación a nombre y primer apellido.
   * Para persona moral (yes): Agrega validación requerida a razón social y elimina de nombre y primer apellido.
   * 
   * @public
   * @method enCambioValorRadio
   * @memberof AgregardestinatariofinalComponent
   * @returns {void}
   */
  enCambioValorRadio(): void {
    const RAZON_SOCIAL_CTRL = this.destinatarioForm.get('razonSocial');
    if (this.destinatarioForm.value.tipoMercancia === 'no') {
      RAZON_SOCIAL_CTRL?.clearValidators();
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
      this.destinatarioForm.get('nombre')?.setValidators([Validators.required]);
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.setValidators([Validators.required]);
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    } else {
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
      this.destinatarioForm.get('nombre')?.clearValidators();
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.clearValidators();
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    }
  }
}
