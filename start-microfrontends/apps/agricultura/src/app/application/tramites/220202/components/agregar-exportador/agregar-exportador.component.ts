/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite 220201 de agricultura.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module AgregardestinatarioComponent
 */

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, InputRadioComponent, REGEX_CORREO_ELECTRONICO_EXPORTADOR, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioOpcion, TercerosrelacionadosExportadorTable } from '../../models/220202/fitosanitario.model';
import { Subject, takeUntil } from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
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
  selector: 'app-agregar-exportador',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TooltipModule
  ],
  templateUrl: './agregar-exportador.component.html',
})
export class AgregarExportadorComponent implements OnInit, OnDestroy, AfterViewInit {
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
   * @type {EventEmitter<TercerosrelacionadosExportadorTable>}
   */
  @Output() guardarDestinatario = new EventEmitter<TercerosrelacionadosExportadorTable>();

  /**
   * Evento emitido al cerrar el formulario de destinatario.
   * @type {EventEmitter<void>}
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
    private readonly fitosanitarioStore: FitosanitarioStore,
    private validacionesService: ValidacionesFormularioService,
    private route: ActivatedRoute
  ) {}

  /**
   * Inicializa el formulario y carga datos si existe un destinatario seleccionado.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.destinatarioForm = this.fb.group({
      tipoMercancia: ['yes', Validators.required],
      nombre: [''], // Sin validación inicial - se agregará condicionalmente
      primerApellido: [''], // Sin validación inicial - se agregará condicionalmente
      segundoApellido: [''],
      razonSocial: [''], // Sin validación inicial - se agregará condicionalmente
      domicilio: ['', Validators.required],
      pais: ['', Validators.required],
      codigoPostal: [''],
      municipio: [''],
      colonia: [''],
      numeroInterior: [''],
      lada: [''],
      telefono: [''], 
      correo: ['', [Validators.pattern(REGEX_CORREO_ELECTRONICO_EXPORTADOR), Validators.maxLength(320)]]
    });

    // Configurar validaciones iniciales basadas en el valor por defecto
    this.enCambioValorRadio();

    this.fitosanitarioQuery.seleccionarExportador$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: TercerosrelacionadosExportadorTable) => {
        const DESTINATARIO = data;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || 'yes',
            nombre: DESTINATARIO.nombre || '',
            razonSocial: DESTINATARIO.razonSocial || '',
            domicilio: DESTINATARIO.domicilio || '',
            pais: DESTINATARIO.pais || '',
            primerApellido: DESTINATARIO.primerApellido || '',
            segundoApellido: DESTINATARIO.segundoApellido || '',
            lada: DESTINATARIO.lada || '',
            telefono: DESTINATARIO.telefono || '',
            correo: DESTINATARIO.correo || ''
          });
          // Reconfigurar validaciones después del patch
          this.enCambioValorRadio();
        }
      });
  }

  /**
   * Inicializa los catálogos al cargar la vista.
   * @method ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.pairsCatalogChange();
    this.estadoCatalogChange();
    this.municipioCatalogChange();
    this.coloniaCatalogChange();
  }

  /**
   * Obtiene el catálogo de países.
   * @method pairsCatalogChange
   */
  pairsCatalogChange(): void {
    this.tercerosrelacionadosService.obtieneCatalogoConsultaPaises(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.pairsCatalog = data.datos ?? [];
      });

  }

  /**
   * Obtiene el catálogo de estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('estados.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.estadoCatalog = data;
      });
  }

  /**
   * Obtiene el catálogo de municipios.
   * @method municipioCatalogChange
   */
  municipioCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('municipios.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.municipioCatalog = data;
      });
  }

  /**
   * Obtiene el catálogo de colonias.
   * @method coloniaCatalogChange
   */
  coloniaCatalogChange(): void {
    this.tercerosrelacionadosService.obtenerSelectorList('colonias.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.coloniaCatalog = data;
      });
  }

  /**
   * Guarda el destinatario si el formulario es válido, actualiza el store y navega a la pantalla principal.
   * Si el formulario no es válido, marca todos los campos como tocados.
   * @method onGuardarDestinatario
   */
  onGuardarDestinatario(): void {
    // Forzar actualización de validaciones antes de verificar
    this.enCambioValorRadio();
    
    if (this.destinatarioForm.valid) {
      const FORM_VALUES = this.destinatarioForm.value;
      
      // Mapear solo los campos que existen en TercerosrelacionadosExportadorTable
      const EXPORTADOR_DATA: TercerosrelacionadosExportadorTable = {
        tipoMercancia: FORM_VALUES.tipoMercancia || '',
        nombre: FORM_VALUES.nombre || '',
        razonSocial: FORM_VALUES.razonSocial || '',
        pais: FORM_VALUES.pais || '',
        telefono: FORM_VALUES.telefono || '',
        domicilio: FORM_VALUES.domicilio || '',
        correo: FORM_VALUES.correo || '',
        primerApellido: FORM_VALUES.primerApellido || '',
        segundoApellido: FORM_VALUES.segundoApellido || '',
        lada: FORM_VALUES.lada || ''
      };
      
      const LISTA_DINAMICA: TercerosrelacionadosExportadorTable[] = [];
      LISTA_DINAMICA.push(EXPORTADOR_DATA);
      this.agriculturaApiService.updateTercerosExportador(LISTA_DINAMICA);
      this.cerrar.emit();
    } else {
      this.destinatarioForm.markAllAsTouched();
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
      tipoMercancia: 'yes',
      pais: '',
    });
    // Reconfigurar validaciones después del reset
    this.enCambioValorRadio();
  }

  /**
   * Cancela la operación y navega a la pantalla principal.
   * @method onCancelarDestinatario
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
  }

  /**
   * Ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y resetea los datos seleccionados en el store.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
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
   * Cambia la validación de los campos según el valor del radio tipoMercancia.
   * Si tipoMercancia es 'yes' (persona física), valida nombre y primerApellido.
   * Si tipoMercancia es 'no' (persona moral), valida razonSocial.
   * @method enCambioValorRadio
   */
  enCambioValorRadio(): void {
    const RAZON_SOCIAL_CTRL = this.destinatarioForm.get('razonSocial');
    const NOMBRE_CTRL = this.destinatarioForm.get('nombre');
    const PRIMER_APELLIDO_CTRL = this.destinatarioForm.get('primerApellido');
    const TIPO_MERCANCIA_VALUE = this.destinatarioForm.get('tipoMercancia')?.value;

    if (TIPO_MERCANCIA_VALUE === 'yes') {
      // Persona física - validar nombre y primer apellido
      NOMBRE_CTRL?.setValidators([Validators.required]);
      NOMBRE_CTRL?.updateValueAndValidity();
      PRIMER_APELLIDO_CTRL?.setValidators([Validators.required]);
      PRIMER_APELLIDO_CTRL?.updateValueAndValidity();
      
      // Quitar validación y limpiar valor de razón social
      RAZON_SOCIAL_CTRL?.clearValidators();
      RAZON_SOCIAL_CTRL?.setValue('');
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
    } else if (TIPO_MERCANCIA_VALUE === 'no') {
      // Persona moral - validar razón social
      RAZON_SOCIAL_CTRL?.setValidators([Validators.required]);
      RAZON_SOCIAL_CTRL?.updateValueAndValidity();
      
      // Quitar validación y limpiar valores de nombre y primer apellido
      NOMBRE_CTRL?.clearValidators();
      NOMBRE_CTRL?.setValue('');
      NOMBRE_CTRL?.updateValueAndValidity();
      PRIMER_APELLIDO_CTRL?.clearValidators();
      PRIMER_APELLIDO_CTRL?.setValue('');
      PRIMER_APELLIDO_CTRL?.updateValueAndValidity();
    }
  }
}