/**
 * @fileoverview
 * Componente para agregar destinatarios en el trámite 220201 de agricultura.
 * Permite capturar, limpiar y cancelar la información de un destinatario, así como gestionar catálogos y validaciones dinámicas.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module AgregardestinatarioComponent
 */

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogo, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CapturarSolicitud } from '../../models/220201/capturar-solicitud.model';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { DestinatarioForm } from '../../../220203/models/220203/importacion-de-acuicultura.module';
import { OPCION_DE_BOTON_DE_RADIO } from '../../../../shared/constantes/tercerosrelacionados.enum';
import { RadioOpcion } from '../../models/220201/certificado-zoosanitario.model';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
@Component({
  selector: 'app-agregardestinatariofinal',
  standalone: true,
  imports: [CommonModule,
    TituloComponent,
    InputRadioComponent,
    ReactiveFormsModule,
    TooltipModule
  ],
  templateUrl: './agregardestinatariofinal.component.html',
  styleUrl: './agregardestinatariofinal.component.css',
})
export class AgregardestinatariofinalComponent implements OnInit, AfterViewInit {
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
   * @param certificadoZoosanitarioServices Servicio para actualizar destinatarios.
   * @param certificadoZoosanitarioQuery Query para obtener destinatarios seleccionados.
   * @param route ActivatedRoute para obtener parámetros de la ruta.
   */
  constructor(
    public fb: FormBuilder,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    private router: Router,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private readonly zoosanitarioStore: ZoosanitarioStore,
    private route: ActivatedRoute,
    private catalogoService: CatalogosService
  ) { }
  /**
   * Inicializa el formulario y carga datos si existe un destinatario seleccionado.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.destinatarioForm = this.fb.group({
      tipoMercancia: ['', Validators.required],
      nombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      razonSocial: [''],
      pais: [''],
      paisDescripcion: [''],
      domicilio: ['', Validators.required],
      lada: ['', [Validators.maxLength(5)]],
      telefono: ['', [Validators.maxLength(30)]],
      correo: ['', [Validators.maxLength(320), Validators.email]],
    });

    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CapturarSolicitud) => {
        const DESTINATARIO = data.seletedExdora;
        if (DESTINATARIO) {
          this.destinatarioForm.patchValue({
            tipoMercancia: DESTINATARIO.tipoMercancia || '',
            nombre: DESTINATARIO.nombre || '',
            primerApellido: DESTINATARIO.primerApellido || '',
            segundoApellido: DESTINATARIO.segundoApellido || '',
            razonSocial: DESTINATARIO.razonSocial || '',
            pais: DESTINATARIO.pais || '',
            paisDescripcion: this.pairsCatalog.find(pais => pais.clave === DESTINATARIO.pais)?.descripcion || '',
            lada: DESTINATARIO.lada || '',
            telefono: DESTINATARIO.telefono || '',
            correo: DESTINATARIO.correo || '',
            domicilio: DESTINATARIO.domicilio || 'Calle, No Ext, No Int, Ciudad,CP.',
          });
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

    this.catalogoService.obtieneCatalogoConsultaPaises(220201).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.pairsCatalog = data.datos ?? [];
    });
  }

  /**
   * Obtiene el catálogo de estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {

    this.catalogoService.obtieneCatalogoEntidadFederativaMunicipios(220201, 'MEX').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.estadoCatalog = data.datos ?? [];
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
   * @method onGuardarDestinatarioFinal
   */
  onGuardarDestinatarioFinal(): void {

    if(this.destinatarioForm.invalid){
      this.destinatarioForm.markAllAsTouched();
      this.enCambioValorRadio();
    }

    if (this.destinatarioForm.valid) {
      const LISTA_DINAMICA: DestinatarioForm[] = [];
      this.destinatarioForm.patchValue({
        paisDescripcion: this.pairsCatalog.find(pais => pais.clave === this.destinatarioForm.value.pais)?.descripcion || '',
      });
      LISTA_DINAMICA.push(this.destinatarioForm.value as DestinatarioForm);
      this.zoosanitarioStore.updatedatosForma(LISTA_DINAMICA as DestinatarioForm[]);
      this.zoosanitarioStore.actualizarSelectedExdora({} as DestinatarioForm);
      this.destinatarioForm.reset();
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
    console.warn('Limpiando formulario de destinatario final');
  }

  /**
   * Cancela la operación y navega a la pantalla principal.
   * @method onCancelarDestinatario
   */
  onCancelarDestinatario(): void {
    this.cerrar.emit();
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

  /**
   * Limpia el campo 'domicilio' (dirección) si contiene el texto de marcador de posición.
   * 
   * Este método verifica si el control de formulario 'domicilio' tiene el valor de marcador de posición predeterminado
   * 'Calle, No Ext, No Int, Ciudad,CP.' y si es así, lo establece como una cadena vacía.
   * Esto se utiliza típicamente para limpiar el texto de marcador de posición cuando un usuario comienza a interactuar
   * con el campo del formulario.
   * 
   * @returns {void}
   */
  limpiarTexto(): void {
  const CONTROL = this.destinatarioForm.get('domicilio');
  if (CONTROL?.value === 'Calle, No Ext, No Int, Ciudad,CP.') {
    CONTROL.setValue('');
  }
}
}
