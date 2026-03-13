/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite de importación de acuicultura 220203.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura de documentación completa: cada clase, método, propiedad y evento está documentado en español.
 * @module AgregardestinatarioComponent
 */

import { ActivatedRoute, Router } from "@angular/router";
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Catalogo, CatalogoSelectComponent, InputRadioComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { Acuicultura } from '../../models/220203/importacion-de-acuicultura.module';
import { AcuiculturaQuery } from "../../estados/sanidad-certificado.query";
import { CommonModule } from "@angular/common";
import { ImportacionDeAcuiculturaService } from "../../services/220203/importacion-de-acuicultura.service";
import { OPCION_DE_BOTON_DE_RADIO } from "../../../../shared/constantes/tercerosrelacionados.enum";
import { RadioOpcion } from "../../../220201/models/220201/certificado-zoosanitario.model";
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
  paisCatalog: Catalogo[] = [];

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
   * @param {ImportacionDeAcuiculturaService} importacionAcuiculturaService - Servicio para operaciones de importación de acuicultura
   * @param {AcuiculturaQuery} certificadoZoosanitarioQuery - Query para consultas del estado de acuicultura
   * @param {ActivatedRoute} route - Ruta activa para obtener parámetros de navegación
   * @memberof AgregardestinatarioComponent
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private router: Router,
    private readonly importacionAcuiculturaService: ImportacionDeAcuiculturaService,
    private readonly certificadoZoosanitarioQuery: AcuiculturaQuery,
    private route: ActivatedRoute
  ) {
    this.paisCatalogChange();
  }

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
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', Validators.maxLength(200)],
      razonSocial: ['', [Validators.required, Validators.maxLength(250)]],
      pais: ['MEX', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      estado: ['', Validators.required],
      municipio: [''],
      colonia: [''],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExterior: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInterior: ['', Validators.maxLength(55)],
      lada: ['', Validators.maxLength(5)],
      telefono: ['', Validators.maxLength(30)],
      correo: ['', [Validators.maxLength(320), Validators.email]]
    });
    this.importacionAcuiculturaService
      .getAllDatosForma()
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data: Acuicultura) => {
        const DESTINATARIO = data.selectedTerceros;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || 'yes',
              nombre: DESTINATARIO.nombre || '',
              primerApellido: DESTINATARIO.primerApellido || '',
              segundoApellido: DESTINATARIO.segundoApellido || '',
              razonSocial: DESTINATARIO.razonSocial || '',
              pais: 'MEX',
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
          })
        }
      })

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
    this.paisCatalogChange();
    this.estadoCatalogChange();

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
    if (this.isFormularioValido()) {
      const FORM_VALUE = this.destinatarioForm.value;
      // Obtener las descripciones de los catalogos para complementar los datos
      const MUNICIPIO_DESCRIPCION = this.obtenerDescripcionMunicipio(FORM_VALUE.municipio);
      const ESTADO_DESCRIPCION = this.obtenerDescripcionEstado(FORM_VALUE.estado);
      const PAIS_DESCRIPCION = this.obtenerDescripcionPais(FORM_VALUE.pais);
      const COLONIA_DESCRIPCION = this.obtenerDescripcionColonia(FORM_VALUE.colonia);

      // Cear el objeto con los valores del formulario y las descripciones
      const DESTINATARIO_DATA: TercerosrelacionadosdestinoTable = {
        ...FORM_VALUE,
        // Agregamos las descripciones como propiedades adicionales
        // para que puedan ser utilizadas por el componente padre
        municipioDescripcion: MUNICIPIO_DESCRIPCION,
        estadoDescripcion: ESTADO_DESCRIPCION,
        paisDescripcion: PAIS_DESCRIPCION,
        coloniaDescripcion: COLONIA_DESCRIPCION,
      };

      const LISTA_DINAMICA: TercerosrelacionadosdestinoTable[] = [];
      LISTA_DINAMICA.push(DESTINATARIO_DATA);
      this.importacionAcuiculturaService.updateTercerosRelacionado(LISTA_DINAMICA as TercerosrelacionadosdestinoTable[]);
      this.cerrar.emit();
    } else {
      this.destinatarioForm.markAllAsTouched();
    }
  }

  /**
   * Verifica si el formulario es válido según el tipo de persona seleccionado.
   * @method isFormularioValido
   * @returns {boolean} True si el formulario es válido, false en caso contrario.
   */
  isFormularioValido(): boolean {
    const TIPO_PERSONA = this.destinatarioForm.get('tipoMercancia')?.value;

    // Campos comunes siempre requeridos
    const CAMPOS_COMUNES = ['pais', 'estado', 'calle', 'numeroExterior'];
    const CAMPOS_COMUNES_VALIDOS = CAMPOS_COMUNES.every((campo) => {
      const CONTROL = this.destinatarioForm.get(campo);
      return CONTROL?.valid;
    });

    if (!CAMPOS_COMUNES_VALIDOS) {
      return false;
    }

    // Validación específica según tipo de persona
    if (TIPO_PERSONA === 'no') {
      // Moral: Solo razón social es requerida
      const RAZON_SOCIAL = this.destinatarioForm.get('razonSocial');
      return RAZON_SOCIAL?.valid === true;
    }

    // Física: Nombre y primer apellido son requeridos
    const NOMBRE = this.destinatarioForm.get('nombre');
    const PRIMER_APELLIDO = this.destinatarioForm.get('primerApellido');
    return NOMBRE?.valid === true && PRIMER_APELLIDO?.valid === true;
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
      this.destinatarioForm.get('nombre')?.setValidators([Validators.required]);
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.setValidators([Validators.required]);
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    } else {
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.setValidators([Validators.maxLength(250)]);
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
      this.destinatarioForm.get('nombre')?.clearValidators();
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.clearValidators();
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    }
  }

  /**
   * Obtiene el catálogo de países.
   * @method paisCatalogChange
   */
  paisCatalogChange(): void {
    this.tercerosrelacionadosService
      .obtieneCatalogoConsultaPaises(220203)
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        this.paisCatalog = data.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {
    this.destinatarioForm.get('municipio')?.patchValue('');
    this.destinatarioForm.get('colonia')?.patchValue('');
    this.tercerosrelacionadosService
      .obtieneCatalogoEntidadesFederativasGeneral(220203, 'MEX')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        this.estadoCatalog = data.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de municipios.
   * @method obtenerMunicipios
   */
  obtenerMunicipios(cveEntidad: Catalogo): void {
    let VALOR:string = "";
    if(cveEntidad && cveEntidad.clave !== undefined){
      VALOR = cveEntidad?.clave
      this.municipioCatalogChange(VALOR);
    }

  }
  /**
   * Obtiene el catálogo de municipios.
   * @method municipioCatalogChange
   */
  async municipioCatalogChange(cveEntidad: string): Promise<void> {
    this.destinatarioForm.get('colonia')?.patchValue('');
    this.destinatarioForm.get('municipio')?.patchValue('');
    await this.tercerosrelacionadosService
      .obtieneCatalogoEntidadFederativaMunicipios(
        220203,
        cveEntidad ?? ''
      )
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        this.municipioCatalog = data.datos ?? [];
      });
  }

  /**
   * Obtiene la descripción del municipio a partir de su ID.
   * @param municipioId ID del municipio a buscar
   * @returns Descripción del municipio o el ID si no se encuentra
   * @method obtenerDescripcionMunicipio
   */
  obtenerDescripcionMunicipio(municipioId: string | undefined): string {
    return (
      this.municipioCatalog?.find(
        (m) => m.id?.toString() === municipioId?.toString()
      )?.descripcion ||
      municipioId ||
      ''
    );
  }

  /**
   * Obtiene la descripción del estado a partir de su ID.
   * @param estadoId ID del estado a buscar
   * @returns Descripción del estado o el ID si no se encuentra
   * @method obtenerDescripcionEstado
   */
  obtenerDescripcionEstado(estadoId: string): string {
    return (
      this.estadoCatalog?.find((e) => e.id?.toString() === estadoId?.toString())
        ?.descripcion ||
      estadoId ||
      ''
    );
  }

  /**
   * Obtiene la descripción del país a partir de su ID.
   * @param paisId ID del país a buscar
   * @returns Descripción del país o el ID si no se encuentra
   * @method obtenerDescripcionPais
   */
  obtenerDescripcionPais(paisId: string): string {
    return (
      this.paisCatalog?.find((p) => p.id?.toString() === paisId?.toString())
        ?.descripcion ||
      paisId ||
      ''
    );
  }

  /**
   * Obtiene la descripción de la colonia a partir de su ID.
   * @param coloniaId ID de la colonia a buscar
   * @returns Descripción de la colonia o el ID si no se encuentra
   * @method obtenerDescripcionColonia
   */
  obtenerDescripcionColonia(coloniaId: string | undefined): string {
    return (
      this.coloniaCatalog?.find(
        (c) => c.id?.toString() === coloniaId?.toString()
      )?.descripcion ||
      coloniaId ||
      ''
    );
  }

  /**
   * Obtiene el catálogo de colonias.
   * @method obtenerColonia
   */
  obtenerColonia(cveDelegNum: Catalogo): void {
    let VALOR:string = "";
    if(cveDelegNum && cveDelegNum.clave !== undefined){
      VALOR = cveDelegNum?.clave
      this.coloniaCatalogChange(VALOR);
    }
  }

  /**
   * Obtiene el catálogo de colonias.
   * @method coloniaCatalogChange
   */
  async coloniaCatalogChange(cveDelegNum: string): Promise<void> {
    this.destinatarioForm.get('colonia')?.patchValue('');
    await this.tercerosrelacionadosService
      .obtieneCatalogoColonias(220203, cveDelegNum ?? '')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        this.coloniaCatalog = data.datos ?? [];
      });
  }
}