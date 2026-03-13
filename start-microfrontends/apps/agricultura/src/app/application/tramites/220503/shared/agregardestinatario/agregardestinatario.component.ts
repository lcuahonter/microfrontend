/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite de importación de acuicultura 220203.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura de documentación completa: cada clase, método, propiedad y evento está documentado en español.
 * @module AgregardestinatarioComponent
 */

import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Catalogo, CatalogoSelectComponent, InputRadioComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { OPCION_DE_BOTON_DE_RADIO } from "../../../../shared/constantes/tercerosrelacionados.enum";
import { RadioOpcion } from "../../../220201/models/220201/certificado-zoosanitario.model";
import { Solicitud220503Query } from "../../estados/tramites220503.query";
import { Solocitud220503Service } from "../../services/service220503.service";
import { TercerosrelacionadosService } from "../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service";
import { TercerosrelacionadosdestinoTable } from "../../../../shared/models/tercerosrelacionados.model";

/**
 * Componente principal para la gestión del formulario de destinatario en el trámite de importación de acuicultura 220203.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Maneja formularios reactivos con validaciones específicas según el tipo de persona (física o moral).
 * 
 * @class AgregardestinatarioComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @memberof AgregardestinatarioComponent
 */
@Component({
  selector: 'app-agregardestinatario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './agregardestinatario.component.html',
  styleUrl: './agregardestinatario.component.scss',
})
export class AgregardestinatarioComponent implements OnInit, AfterViewInit {
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos para consulta de datos existentes.
   * 
   * @public
   * @type {boolean}
   * @default false
   * @memberof AgregardestinatarioComponent
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Evento emitido al guardar exitosamente un destinatario.
   * Contiene los datos completos del destinatario agregado al sistema.
   * 
   * @public
   * @type {EventEmitter<TercerosrelacionadosdestinoTable>}
   * @memberof AgregardestinatarioComponent
   */
  @Output() guardarDestinatario = new EventEmitter<TercerosrelacionadosdestinoTable>();

  /**
   * Opciones disponibles para el botón de radio de tipo de persona.
   * Define las opciones entre persona física y persona moral para el destinatario.
   * 
   * @public
   * @type {RadioOpcion[]}
   * @memberof AgregardestinatarioComponent
   */
  opcionDeBotonDeRadio: RadioOpcion[] = OPCION_DE_BOTON_DE_RADIO;

  /**
   * Catálogo de países disponibles para selección.
   * Contiene la lista de países donde puede ubicarse el destinatario.
   * 
   * @public
   * @type {Catalogo[]}
   * @memberof AgregardestinatarioComponent
   */
  pairsCatalog: Catalogo[] = [];

  /**
   * Catálogo de estados o entidades federativas disponibles.
   * Lista de estados correspondientes al país seleccionado.
   * 
   * @public
   * @type {Catalogo[]}
   * @memberof AgregardestinatarioComponent
   */
  estadoCatalog: Catalogo[] = [];

  /**
   * Catálogo de municipios disponibles para selección.
   * Lista de municipios correspondientes al estado seleccionado.
   * 
   * @public
   * @type {Catalogo[]}
   * @memberof AgregardestinatarioComponent
   */
  municipioCatalog: Catalogo[] = [];

  /**
   * Catálogo de colonias disponibles para selección.
   * Lista de colonias correspondientes al municipio seleccionado.
   * 
   * @public
   * @type {Catalogo[]}
   * @memberof AgregardestinatarioComponent
   */
  coloniaCatalog: Catalogo[] = [];

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * Se utiliza con el operador takeUntil para completar suscripciones al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof AgregardestinatarioComponent
   */
  private DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Evento emitido al cerrar el formulario de destinatario.
   * Se dispara cuando el usuario cancela la operación o completa el guardado.
   * 
   * @public
   * @type {EventEmitter<void>}
   * @memberof AgregardestinatarioComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Formulario reactivo para capturar los datos del destinatario.
   * Contiene todos los campos necesarios con sus respectivas validaciones.
   * 
   * @public
   * @type {FormGroup}
   * @memberof AgregardestinatarioComponent
   */
  destinatarioForm!: FormGroup;

  /**
   * Constructor del componente AgregardestinatarioComponent.
   * Inicializa las dependencias necesarias para el funcionamiento del formulario de destinatarios.
   * Configura los servicios para manejo de formularios, catálogos y navegación.
   * 
   * @constructor
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {TercerosrelacionadosService} tercerosrelacionadosService - Servicio para obtener catálogos de terceros relacionados
   * @param {Router} router - Servicio de navegación de Angular para redirecciones
   * @param {ImportacionDeAcuiculturaService} certificadoZoosanitarioServices - Servicio para operaciones de importación de acuicultura
   * @param {AcuiculturaQuery} certificadoZoosanitarioQuery - Query para consultas del estado de acuicultura
   * @param {ActivatedRoute} route - Ruta activa para obtener parámetros de navegación
   * @memberof AgregardestinatarioComponent
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private readonly certificadoZoosanitarioServices: Solocitud220503Service,
    private readonly certificadoZoosanitarioQuery: Solicitud220503Query,
  ) { }

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa el formulario reactivo con validaciones y carga datos de destinatario seleccionado si existe.
   * Configura validaciones específicas para cada campo del formulario según las reglas de negocio.
   * 
   * @public
   * @method ngOnInit
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.destinatarioForm = this.fb.group({
      tipoMercancia: ['yes', Validators.required],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      razonSocial: ['', Validators.required],
      pais: ['1', Validators.required],
      codigoPostal: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: [''],
      colonia: [''],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
      correo: ['']
    });
    this.certificadoZoosanitarioQuery.seletedTerceros$
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data: TercerosrelacionadosdestinoTable) => {
        const DESTINATARIO = data;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || 'yes',
            nombre: DESTINATARIO.nombre || '',
            primerApellido: DESTINATARIO.primerApellido || '',
            segundoApellido: DESTINATARIO.segundoApellido || '',
            razonSocial: DESTINATARIO.razonSocial || '',
            pais: DESTINATARIO.pais || '1',
            codigoPostal: DESTINATARIO.codigoPostal || '',
            estado: DESTINATARIO.estado || '',
            municipio: DESTINATARIO.municipio || '',
            colonia: DESTINATARIO.colonia || '',
            calle: DESTINATARIO.calle || '',
            numeroExterior: DESTINATARIO.numeroExterior || '',
            numeroInterior: DESTINATARIO.numeroInterior || '',
            lada: DESTINATARIO.lada || '',
            telefono: DESTINATARIO.telefono || '',
            correo: DESTINATARIO.correo || ''
          });
        }
      });

  }

  /**
   * Método del ciclo de vida AfterViewInit de Angular.
   * Se ejecuta después de que la vista del componente se ha inicializado completamente.
   * Carga todos los catálogos necesarios para los campos de selección del formulario.
   * 
   * @public
   * @method ngAfterViewInit
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  ngAfterViewInit(): void {
    this.pairsCatalogChange();
    this.estadoCatalogChange();
    this.municipioCatalogChange();
    this.coloniaCatalogChange();
  }

  /**
   * Método para cargar el catálogo de países de procedencia.
   * Obtiene la lista de países disponibles desde el servicio de terceros relacionados.
   * Maneja la subscripción con patrón takeUntil para evitar memory leaks.
   * 
   * @public
   * @method pairsCatalogChange
   * @memberof AgregardestinatarioComponent
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
   * Método para cargar el catálogo de estados o entidades federativas.
   * Obtiene la lista de estados disponibles desde el servicio de terceros relacionados.
   * Utilizado para poblar el selector de estados en el formulario de dirección.
   * 
   * @public
   * @method estadoCatalogChange
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  estadoCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('estados.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.estadoCatalog = data;
      });
  }

  /**
   * Método para cargar el catálogo de municipios.
   * Obtiene la lista de municipios disponibles desde el servicio de terceros relacionados.
   * Utilizado para poblar el selector de municipios basado en el estado seleccionado.
   * 
   * @public
   * @method municipioCatalogChange
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  municipioCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('municipios.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.municipioCatalog = data;
      });
  }

  /**
   * Método para cargar el catálogo de colonias.
   * Obtiene la lista de colonias disponibles desde el servicio de terceros relacionados.
   * Utilizado para poblar el selector de colonias basado en el municipio seleccionado.
   * 
   * @public
   * @method coloniaCatalogChange
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  coloniaCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('colonias.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(data => {
        this.coloniaCatalog = data;
      });
  }

  /**
   * Método para guardar y validar el formulario de destinatario.
   * Valida el formulario completo y si es válido, agrega el destinatario a la lista dinámica.
   * Actualiza el servicio con los nuevos datos y emite evento de cierre del formulario.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar errores.
   * 
   * @public
   * @method onGuardarDestinatario
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  onGuardarDestinatario(): void {
    if (this.destinatarioForm.valid) {
      const LISTA_DINAMICA: TercerosrelacionadosdestinoTable[] = [];
      LISTA_DINAMICA.push(this.destinatarioForm.value as TercerosrelacionadosdestinoTable);
      this.certificadoZoosanitarioServices.updateTercerosRelacionado(LISTA_DINAMICA as TercerosrelacionadosdestinoTable[]);
      this.cerrar.emit();
    } else {
      this.destinatarioForm.markAllAsTouched();
    }
  }

  /**
   * Método para limpiar y restablecer el formulario de destinatario.
   * Resetea todos los campos del formulario a su estado inicial y limpia validaciones.
   * Establece valores por defecto para tipoMercancia y país después del reseteo.
   * 
   * @public
   * @method onLimpiarDestinatario
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  onLimpiarDestinatario(): void {
    this.destinatarioForm.reset();
    this.destinatarioForm.markAsPristine();
    this.destinatarioForm.markAsUntouched();
    this.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
      pais: '1',
    });
  }

  /**
   * Método para cancelar la operación de agregar destinatario.
   * Emite el evento de cierre para cerrar el modal o componente actual.
   * No guarda ningún cambio realizado en el formulario.
   * 
   * @public
   * @method onCancelarDestinatario
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
  }

  /**
   * Método para manejar el cambio del tipo de persona en el formulario.
   * Cambia dinámicamente las validaciones del campo razónSocial según el valor del radio tipoMercancia.
   * Si tipoMercancia es 'no' (persona física), elimina validadores de razónSocial.
   * Si tipoMercancia es 'yes' (persona moral), agrega el validador requerido a razónSocial.
   * 
   * @public
   * @method enCambioValorRadio
   * @memberof AgregardestinatarioComponent
   * @returns {void}
   */
  enCambioValorRadio(): void {
    const RAZON_SOCIAL_CTRL = this.destinatarioForm.get('razonSocial');
    if (this.destinatarioForm.value.tipoMercancia === 'no') {
      RAZON_SOCIAL_CTRL?.clearValidators();
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
    } else {
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
    }
  }
}