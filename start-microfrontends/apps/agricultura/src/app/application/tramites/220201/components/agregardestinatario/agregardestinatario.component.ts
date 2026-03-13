/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite 220201 de agricultura.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module AgregardestinatarioComponent
 */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { OPCION_DE_BOTON_DE_RADIO } from '../../../../shared/constantes/tercerosrelacionados.enum';
import { RadioOpcion } from '../../models/220201/certificado-zoosanitario.model';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';

/**
 * @component
 * @description
 * Componente principal para la gestión del formulario de destinatario en el trámite 220201.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 */
@Component({
  selector: 'app-agregardestinatario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
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
   * deshabilitando la edición de los campos.
   * @type {boolean}
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Evento emitido al guardar un destinatario.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable>}
   */
  @Output() guardarDestinatario = new EventEmitter<TercerosrelacionadosdestinoTable>();

  /**
   * Opciones para el botón de radio.
   * @type {RadioOpcion[]}
   */
  opcionDeBotonDeRadio: RadioOpcion[] = OPCION_DE_BOTON_DE_RADIO;

  /**
   * Catálogo de países.
   * @type {Catalogo[]}
   */
  pairsCatalog: Catalogo[] = [];

  /**
   * Catálogo de estados.
   * @type {Catalogo[]}
   */
  estadoCatalog: Catalogo[] = [];

  /**
   * Catálogo de municipios.
   * @type {Catalogo[]}
   */
  municipioCatalog: Catalogo[] = [];

  /**
   * Catálogo de colonias.
   * @type {Catalogo[]}
   */
  coloniaCatalog: Catalogo[] = [];

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$ = new Subject<void>();
  /**
   * Evento emitido al cerrar el formulario de destinatario.
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Formulario reactivo para capturar los datos del destinatario.
   * @type {FormGroup}
   */
  destinatarioForm!: FormGroup;

  /**
   * Formulario reactivo para capturar los datos de la planta TIF.
   * @type {FormGroup}
   */
  plantaTifForm!: FormGroup;

  /**
   * Identificador del trámite actual.
   * @type {number}
   * @default 220201
   */
  tramite: number = 220201;

  /**
   * Representa el estado actualmente seleccionado.
   * Esta propiedad contiene el valor del estado seleccionado como una cadena.
   */
  estadoSeleccionado: string = '';

  /**
   * Representa el municipio seleccionado.
   * Esta propiedad contiene el nombre del municipio elegido por el usuario.
   */
  municipioSeleccionado: string = '';

  /**
   * Almacena el nombre de la colonia seleccionada por el usuario.
   * Este valor se utiliza para identificar la colonia en el contexto
   * de la funcionalidad actual.
   */
  coloniaSeleccionada: string = '';

  /**
   * Validador personalizado para el campo tipoMercancia.
   * @param tipoMercancia Valor esperado para la validación.
   * @returns ValidatorFn
   */
  static tipoMercanciaValidator(tipoMercancia: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== tipoMercancia || control.value === tipoMercancia) {
        return { tipoMercanciaInvalid: true };
      }
      return null;
    };
  }

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param tercerosrelacionadosService Servicio para obtener catálogos.
   * @param router Router de Angular para navegación.
   * @param certificadoZoosanitarioServices Servicio para actualizar destinatarios.
   * @param certificadoZoosanitarioQuery Query para obtener destinatarios seleccionados.
   * @param route ActivatedRoute para obtener parámetros de la ruta.
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private readonly certificadoZoosanitarioQuery: ZoosanitarioQuery,
    private catalogoService: CatalogosService
  ) {

  }

  /**
   * Inicializa el formulario y carga datos si existe un destinatario seleccionado.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.destinatarioForm = this.fb.group({
      tipoMercancia: ['', Validators.required],
      nombre: [''],
      razonSocial: [''],
      primerApellido: [''],
      segundoApellido: [''],
      pais: ['MEX', Validators.required],
      paisDescripcion: [],
      codigoPostal: ['', Validators.required],
      estado: ['', Validators.required],
      estadoDescripcion: [],
      municipio: [''],
      municipioDescripcion: [],
      colonia: [''],
      coloniaDescripcion: [],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
      correo: [''],
      planta: ['']
    });

    this.destinatarioForm.get('tipoMercancia')?.valueChanges.subscribe(() => {
      this.updateValidatorsBasedOnTipoMercancia();
    });
    this.certificadoZoosanitarioQuery.seleccionarTerceros$
      .pipe(takeUntil(this.destroyNotifier$))
      // eslint-disable-next-line complexity
      .subscribe((data: TercerosrelacionadosdestinoTable) => {
        const DESTINATARIO = data;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || '',
            nombre: DESTINATARIO.nombre || '',
            primerApellido: DESTINATARIO.primerApellido || '',
            segundoApellido: DESTINATARIO.segundoApellido || '',
            razonSocial: DESTINATARIO.razonSocial || '',
            pais: DESTINATARIO.pais || 'MEX',
            codigoPostal: DESTINATARIO.codigoPostal || '',
            estado: DESTINATARIO.estado || '',
            municipio: DESTINATARIO.municipio || '',
            colonia: DESTINATARIO.colonia || '',
            calle: DESTINATARIO.calle || '',
            numeroExterior: DESTINATARIO.numeroExterior || '',
            numeroInterior: DESTINATARIO.numeroInterior || '',
            lada: DESTINATARIO.lada || '',
            telefono: DESTINATARIO.telefono || '',
            correo: DESTINATARIO.correo || '',
            planta: DESTINATARIO.planta || '',
            paisDescripcion: this.pairsCatalog.find(pais => pais.clave === DESTINATARIO.pais)?.descripcion || '',
            estadoDescripcion: this.estadoCatalog.find(estado => estado.clave === DESTINATARIO.estado)?.descripcion || '',
            municipioDescripcion: this.municipioCatalog.find(municipio => municipio.clave === DESTINATARIO.municipio)?.descripcion || '',
          });
        }
      });

    this.plantaTifForm = this.fb.group({
      nombreEstablecimiento: [''],
      numeroEstablecimiento: ['']
    });

    this.pairsCatalogChange();

  }

  /**
   * Inicializa los catálogos al cargar la vista.
   * @method ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.estadoCatalogChange();

  }

  /**
   * Obtiene el catálogo de países.
   * @method pairsCatalogChange
   */
  pairsCatalogChange(): void {
    this.catalogoService.obtieneCatalogoConsultaPaises(this.tramite).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.pairsCatalog = data.datos ?? [];
    });
  }

  /**
   * Obtiene el catálogo de estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {
    this.catalogoService.obtieneCatalogoEntidadesFederativas(this.tramite, 'MEX').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.estadoCatalog = data.datos ?? [];
    });
  }

  /**
   * Obtiene el catálogo de municipios.
   * @method municipioCatalogChange
   */
  municipioCatalogChange(): void {
    this.catalogoService.obtieneCatalogoEntidadFederativaMunicipios(this.tramite, this.estadoSeleccionado).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.municipioCatalog = data.datos ?? [];
    });
  }

  /**
   * Obtiene el catálogo de colonias.
   * @method coloniaCatalogChange
   */
  coloniaCatalogChange(): void {
    this.catalogoService.obtieneCatalogoColonias(this.tramite, this.municipioSeleccionado).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.coloniaCatalog = data.datos ?? [];
    });
  }

  /**
   * Guarda el destinatario si el formulario es válido, actualiza el store y navega a la pantalla principal.
   * Si el formulario no es válido, marca todos los campos como tocados.
   * @method onGuardarDestinatario
   */
  onGuardarDestinatario(): void {
    if (this.destinatarioForm.invalid) {
      this.enCambioValorRadio();
      this.destinatarioForm.markAllAsTouched();
    }
    if (this.destinatarioForm.valid) {
      const LISTA_DINAMICA: TercerosrelacionadosdestinoTable[] = [];

      this.destinatarioForm.patchValue({
        telefono: this.destinatarioForm.value.lada + '-' + this.destinatarioForm.value.telefono,
        paisDescripcion: this.pairsCatalog.find(pais => pais.clave === this.destinatarioForm.value.pais)?.descripcion || '',
        estadoDescripcion: this.estadoCatalog.find(estado => estado.clave === this.destinatarioForm.value.estado)?.descripcion || '',
        municipioDescripcion: this.municipioCatalog.find(municipio => municipio.clave === this.destinatarioForm.value.municipio)?.descripcion || '',
        coloniaDescripcion: this.coloniaCatalog.find(colonia => colonia.clave === this.destinatarioForm.value.colonia)?.descripcion || '',
      });


      LISTA_DINAMICA.push(this.destinatarioForm.value as TercerosrelacionadosdestinoTable);
      this.certificadoZoosanitarioServices.updateTercerosRelacionado(LISTA_DINAMICA as TercerosrelacionadosdestinoTable[]);
      this.cerrar.emit();
    }
  }

  /**
   * Limpia el formulario y restablece los valores por defecto para tipoMercancia y país.
   * @method onLimpiarDestinatario
   */
  onLimpiarDestinatario(): void {
    this.destinatarioForm.reset();
    this.destinatarioForm.markAsPristine();
    this.destinatarioForm.markAsUntouched();
    this.destinatarioForm.patchValue({
      tipoMercancia: '',
      pais: 'MEX',
    });
  }

  /**
   * Cancela la operación y navega a la pantalla principal.
   * @method onCancelarDestinatario
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
  }

  /**
   * Actualiza las validaciones de los campos del formulario según el valor de tipoMercancia.
   * @method updateValidatorsBasedOnTipoMercancia
   */
  updateValidatorsBasedOnTipoMercancia(): void {
    const TIPO_MERCANCIA = this.destinatarioForm.get('tipoMercancia')?.value;
    const NOMBRE_CTRL = this.destinatarioForm.get('nombre');
    const RAZON_SOCIAL_CTRL = this.destinatarioForm.get('razonSocial');

    if (TIPO_MERCANCIA === 'yes') {
      NOMBRE_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.clearValidators();
    } else {
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      NOMBRE_CTRL?.clearValidators();
    }

    NOMBRE_CTRL?.updateValueAndValidity();
    RAZON_SOCIAL_CTRL?.updateValueAndValidity();
  }

  /**
   * Cambia la validación del campo razonSocial según el valor del radio tipoMercancia.
   * Si tipoMercancia es 'no', elimina los validadores; si es 'yes', agrega el validador requerido.
   * @method enCambioValorRadio
   */
  enCambioValorRadio(): void {
    this.destinatarioForm.get('lada')?.clearValidators();
    this.destinatarioForm.get('lada')?.updateValueAndValidity();
    this.destinatarioForm.get('telefono')?.clearValidators();
    this.destinatarioForm.get('telefono')?.updateValueAndValidity();
    this.destinatarioForm.get('correo')?.clearValidators();
    this.destinatarioForm.get('correo')?.updateValueAndValidity();
    this.destinatarioForm.get('razonSocial')?.setValidators([Validators.required]);
    this.destinatarioForm.get('razonSocial')?.updateValueAndValidity();
    this.destinatarioForm.get('numeroExterior')?.setValidators([Validators.required]);
    this.destinatarioForm.get('numeroExterior')?.updateValueAndValidity();
    this.destinatarioForm.get('nombre')?.setValidators([Validators.required]);
    this.destinatarioForm.get('nombre')?.updateValueAndValidity();
    this.destinatarioForm.get('primerApellido')?.setValidators([Validators.required]);
    this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    this.destinatarioForm.get('pais')?.setValidators([Validators.required]);
    this.destinatarioForm.get('pais')?.updateValueAndValidity();
    this.destinatarioForm.get('domicilio')?.setValidators([Validators.required]);
    this.destinatarioForm.get('domicilio')?.updateValueAndValidity();
    this.destinatarioForm.get('correo')?.setValidators([Validators.maxLength(320), Validators.email]);
    this.destinatarioForm.get('correo')?.updateValueAndValidity();
    this.destinatarioForm.get('codigoPostal')?.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
    this.destinatarioForm.get('codigoPostal')?.updateValueAndValidity();
    /**
     * Persona moral
     */
    if (this.destinatarioForm.value.tipoMercancia === 'no') {
      this.destinatarioForm.get('razonSocial')?.setValidators([Validators.required]);
      this.destinatarioForm.get('razonSocial')?.updateValueAndValidity();
      this.destinatarioForm.get('nombre')?.clearValidators();
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.clearValidators();
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
    }
    /**
     * Persona fisica
     */
    if (this.destinatarioForm.value.tipoMercancia === 'yes') {
      this.destinatarioForm.get('razonSocial')?.clearValidators();
      this.destinatarioForm.get('razonSocial')?.updateValueAndValidity();
      this.destinatarioForm.get('nombre')?.setValidators([Validators.required]);
      this.destinatarioForm.get('nombre')?.updateValueAndValidity();
      this.destinatarioForm.get('primerApellido')?.setValidators([Validators.required]);
      this.destinatarioForm.get('primerApellido')?.updateValueAndValidity();
      this.destinatarioForm.get('pais')?.setValidators([Validators.required]);
      this.destinatarioForm.get('pais')?.updateValueAndValidity();
    }
  }

  onLimpiar(): void {
    this.plantaTifForm.reset();
  }

  onBuscar(): void {
    if (this.plantaTifForm.valid) {
      // Implementar lógica de búsqueda
    }
  }

  /**
   * Método que asigna el valor del estado seleccionado al atributo `estadoSeleccionado`.
   * Obtiene el valor actual del control de formulario 'estado' desde el formulario `destinatarioForm`.
   */
  tomaEstado(): void {
    this.estadoSeleccionado = this.destinatarioForm.get('estado')?.value;
    this.municipioCatalogChange();
  }

  /**
   * Método que asigna el valor seleccionado del campo 'municipio' del formulario
   * al atributo `municipioSeleccionado`.
   *
   * Este método se utiliza para capturar y almacenar el municipio seleccionado
   * por el usuario en el formulario `destinatarioForm`.
   *
   * @returns {void} No retorna ningún valor.
   */
  tomaMunicipio(): void {
    this.municipioSeleccionado = this.destinatarioForm.get('municipio')?.value;
    this.coloniaCatalogChange();
  }
}