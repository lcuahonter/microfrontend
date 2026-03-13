/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite 220201 de agricultura.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module AgregardestinatarioComponent
 */

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit, Output } from '@angular/core';
import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ListaDeDatosFinal,
  RadioOpcion,
  TercerosrelacionadosdestinoTable,
} from '../../models/220202/fitosanitario.model';
import { Subject, takeUntil } from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { OPCION_DE_BOTON_DE_RADIO } from '../../../../shared/constantes/tercerosrelacionados.enum';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './agregardestinatario.component.html',
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
   * @type {EventEmitter[]}
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Opciones para el botón de radio.
   * @type {RadioOpcion[]}
   */
  opcionDeBotonDeRadio: RadioOpcion[] = OPCION_DE_BOTON_DE_RADIO;

  /**
   * Catálogo de países.
   * @type {Catalogo[]}
   */
  paisCatalog: Catalogo[] = [];

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
   * Formulario reactivo para capturar los datos del destinatario.
   * @type {FormGroup}
   */
  destinatarioForm!: FormGroup;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param tercerosrelacionadosService Servicio para obtener catálogos.
   * @param router Router de Angular para navegación.
   * @param agriculturaApiService Servicio para actualizar destinatarios.
   * @param fitosanitarioQuery Query para obtener destinatarios seleccionados.
   * @param route ActivatedRoute para obtener parámetros de la ruta.
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private router: Router,
    private readonly agriculturaApiService: AgriculturaApiService,
    private readonly fitosanitarioQuery: FitosanitarioQuery,
    private validacionesService: ValidacionesFormularioService,
    private route: ActivatedRoute
  ) {
    this.paisCatalogChange();
  }

  /**
   * Inicializa el formulario y carga datos si existe un destinatario seleccionado.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.destinatarioForm = this.fb.group({
      tipoMercancia: ['yes', Validators.required],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      razonSocial: ['', Validators.required],
      pais: ['MEX', Validators.required],
      codigoPostal: ['', [Validators.minLength(5), Validators.maxLength(5)]],
      estado: ['', Validators.required],
      municipio: [''],
      colonia: [''],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
      correo: [''],
    });

    this.agriculturaApiService
      .getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: ListaDeDatosFinal) => {
        const DESTINATARIO = data.seletedTerceros;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || 'yes',
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
          });
        }
      });
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
   * @method paisCatalogChange
   */
  paisCatalogChange(): void {
    this.tercerosrelacionadosService
      .obtieneCatalogoConsultaPaises(220202)
      .pipe(takeUntil(this.destroyNotifier$))
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
      .obtieneCatalogoEntidadesFederativasGeneral(220202, 'MEX')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.estadoCatalog = data.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de municipios.
   * @method municipioCatalogChange
   */
  municipioCatalogChange(cveEntidad: Catalogo): void {
    this.destinatarioForm.get('colonia')?.patchValue('');
    this.destinatarioForm.get('municipio')?.patchValue('');
    this.tercerosrelacionadosService
      .obtieneCatalogoEntidadFederativaMunicipios(
        220202,
        cveEntidad.clave ?? ''
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.municipioCatalog = data.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de colonias.
   * @method coloniaCatalogChange
   */
  coloniaCatalogChange(cveDelegNum: Catalogo): void {
    this.destinatarioForm.get('colonia')?.patchValue('');
    this.tercerosrelacionadosService
      .obtieneCatalogoColonias(220202, cveDelegNum.clave ?? '')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.coloniaCatalog = data.datos ?? [];
      });
  }

  /**
   * Guarda el destinatario si el formulario es válido, actualiza el store y navega a la pantalla principal.
   * Si el formulario no es válido, marca todos los campos como tocados.
   * @method onGuardarDestinatario
   */
  onGuardarDestinatario(): void {
    if (this.isFormularioValido()) {
      const FORM_VALUE = this.destinatarioForm.value;

      // Obtener las descripciones de los catálogos para complementar los datos
      const MUNICIPIO_DESCRIPCION = this.obtenerDescripcionMunicipio(
        FORM_VALUE.municipio
      );
      const ESTADO_DESCRIPCION = this.obtenerDescripcionEstado(
        FORM_VALUE.estado
      );
      const PAIS_DESCRIPCION = this.obtenerDescripcionPais(FORM_VALUE.pais);
      const COLONIA_DESCRIPCION = this.obtenerDescripcionColonia(
        FORM_VALUE.colonia
      );

      // Crear el objeto con los valores del formulario y las descripciones
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
      this.agriculturaApiService.updateTercerosRelacionado(LISTA_DINAMICA);
      this.cerrar.emit();
    } else {
      this.destinatarioForm.markAllAsTouched();
    }
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
   * Limpia el formulario y restablece los valores por defecto para tipoMercancia y país.
   * @method onLimpiarDestinatario
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
   * Cancela la operación y navega a la pantalla principal.
   * @method onCancelarDestinatario
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
  }

  /**
   * Verifica si un campo específico de un formulario es válido.
   *
   * Este método utiliza el servicio de validaciones para determinar si un campo es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
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
   * Cambia la validación del campo razonSocial según el valor del radio tipoMercancia.
   * Si tipoMercancia es 'no', elimina los validadores; si es 'yes', agrega el validador requerido.
   * @method enCambioValorRadio
   */
  enCambioValorRadio(): void {
    const RAZON_SOCIAL_CTRL = this.destinatarioForm.get('razonSocial');
    const NOMBRE_CTRL = this.destinatarioForm.get('nombre');
    const PRIMER_APELLIDO_CTRL = this.destinatarioForm.get('primerApellido');

    if (this.destinatarioForm.get('tipoMercancia')?.value === 'no') {
      // Moral: Razón social es requerida, nombre y apellidos no
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();

      NOMBRE_CTRL?.clearValidators();
      NOMBRE_CTRL?.setValue('');
      NOMBRE_CTRL?.updateValueAndValidity();
      NOMBRE_CTRL?.markAsUntouched();

      PRIMER_APELLIDO_CTRL?.clearValidators();
      PRIMER_APELLIDO_CTRL?.setValue('');
      PRIMER_APELLIDO_CTRL?.updateValueAndValidity();
      PRIMER_APELLIDO_CTRL?.markAsUntouched();
    } else {
      // Física: Nombre y apellidos son requeridos, razón social no
      NOMBRE_CTRL?.setValidators([Validators.required]);
      NOMBRE_CTRL?.updateValueAndValidity();

      PRIMER_APELLIDO_CTRL?.setValidators([Validators.required]);
      PRIMER_APELLIDO_CTRL?.updateValueAndValidity();

      RAZON_SOCIAL_CTRL?.clearValidators();
      RAZON_SOCIAL_CTRL?.setValue('');
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
      RAZON_SOCIAL_CTRL?.markAsUntouched();
    }
  }
}
