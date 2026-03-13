import { BodyTablaEnvioDigital, HeaderTablaEnvioDigital } from '../../../../core/models/shared/consulta-generica.model';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CONSULTA_ENVIODIGITAL } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { EnviosDigitalesService } from '../../../../core/services/consultagenerica/envio-digital-service';
import { FolioQuery } from '../../../../core/queries/folio.query';

import { EnvioDigitalResponse } from '../../../../core/models/shared/envio-digital-response.model';

@Component({
  selector: 'lib-envio-digital',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './envio-digital.component.html',
  styleUrl: './envio-digital.component.scss',
})
export class EnvioDigitalComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Variable para almacenar el folio recuperado desde el store.
   * @type {string}
   */
  public folio!: string;

  /**
   * Formulario reactivo para el envío digital.
   * @type {FormGroup}
   */
  public envioDigitalForm!: FormGroup;

  /**
   * Respuesta del envío digital que se recibe como input.
   * @type {EnvioDigitalResponse}
   */
  @Input() envioDigital!: EnvioDigitalResponse;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * Encabezado de la tabla de envíos digitales.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaEnvioDigital[]}
   */
  readonly encabezadoTablaDigital: HeaderTablaEnvioDigital[] = CONSULTA_ENVIODIGITAL.encabezadoTablaEnvioDigital;

  /**
   * Datos de la tabla de envíos digitales en estado de envío.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaEnvioDigital[]}
   */
  public datosTablaDigital: BodyTablaEnvioDigital[] = [];

  /**
   * Datos de la tabla de envíos digitales en estado de revisión.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaEnvioDigital[]}
   */
  public datosTablaDigitalRevision: BodyTablaEnvioDigital[] = [];

  /**
   * Constructor de la clase EnvioDigitalComponent.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param folioQuery Consulta del folio desde el store.
   * @param envioDigitalService Servicio para obtener los datos de envíos digitales.
   */
  constructor(
    private fb: FormBuilder,
    private folioQuery: FolioQuery,
    private envioDigitalService: EnviosDigitalesService
  ) {
    /** 
    * Crear el formulario reactivo para el envío digital.
    */
    this.crearEnvioDigitalFormForm();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo, recupera el folio y obtiene los datos de envíos digitales.
   */
  ngOnInit(): void {
    /** 
     * Recuperar el folio desde el store.
     */
    this.folioQuery.getFolio().subscribe((folio) => {
      this.folio = folio || '';
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada.
   * Si se recibe un objeto de envío digital, llena las tablas con los datos correspondientes.
   * Si no, obtiene los datos de envíos digitales y revisiones desde el servicio.
   * @param changes Cambios en las propiedades de entrada del componente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['envioDigital'] && changes['envioDigital'].currentValue) {
      this.llenarTablasDesdeInput();
    } else {
      this.getListaEnviosDigitales();
      this.getListaRevisionDigitales();
    }
  }

  /**
   * Llena las tablas de envíos digitales y revisiones con los datos del objeto de envío digital.
   * También llena los valores del formulario reactivo con los datos del envío digital.
   */
  llenarTablasDesdeInput(): void {
    this.datosTablaDigital = this.envioDigital.estado_envio_certificado.map((item, index) => ({
      id: index + 1,
      fecha: item.fecha_transaccion,
      transaccion: item.num_transaccion,
      estado: item.estatus_transaccion,
      observaciones: item.observaciones
    }));

    this.datosTablaDigitalRevision = this.envioDigital.estado_revision_certificado.map((item, index) => ({
      id: index + 1,
      fecha: item.fecha_transaccion,
      transaccion: item.num_transaccion,
      estado: item.estatus_transaccion,
      observaciones: item.observaciones
    }));

    // Llenar el formulario reactivo con los datos del envío digital
    this.envioDigitalForm.patchValue({
      tipoDocumento: this.envioDigital.tipo_documento,
      pais: this.envioDigital.pais_destino,
      numero: this.envioDigital.num_certificado
    });
  }

  /**
   * Crea el formulario para el envío digital.
   * @returns {void}
   */
  crearEnvioDigitalFormForm(): void {
    this.envioDigitalForm = this.fb.group({
      tipoDocumento: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
      pais: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
      numero: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
    });
  }

  /**
   * Método para obtener los envíos digitales en estado de envío desde el servicio.
   * Se suscribe al observable del servicio para obtener los datos.
   * @returns {void}
   */
  getListaEnviosDigitales(): void {
    this.envioDigitalService
      .getEnvioDigital()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosTablaDigital = data;
      });
  }

  /**
   * Método para obtener los envíos digitales en estado de revisión desde el servicio.
   * Se suscribe al observable del servicio para obtener los datos.
   * @returns {void}
   */
  getListaRevisionDigitales(): void {
    this.envioDigitalService
      .getRevisionDigital()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosTablaDigitalRevision = data;
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}