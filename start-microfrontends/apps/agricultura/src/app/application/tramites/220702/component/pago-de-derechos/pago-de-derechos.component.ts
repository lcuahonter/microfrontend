/**
 * @module PagoDeDerechosComponent
 * @description
 * Componente para capturar y visualizar los datos de pago de derechos.
 */

import { CatalogoSelectComponent, CatalogosSelect, InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PagoDeDerechosResponseDos, PagoDeDerechosRevisionResponse } from '../../modelos/acuicola.model';
import { Subject, map, takeUntil } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { FECHA_DE_PAGO } from '../../constantes/acuicola.enum';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { Input } from '@angular/core';
import { TramiteState } from '../../estados/tramite220702.store';
import { TramiteStore } from '../../estados/tramite220702.store';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';

@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    ReactiveFormsModule
  ],
  templateUrl: './pago-de-derechos.component.html',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para la captura y visualización de datos de pago de derechos.
   * @type {FormGroup}
   */
  pagosDeDerechosForm!: FormGroup;

  /**
   * Catálogo de bancos para selección en el formulario.
   * @type {CatalogosSelect}
   */
  banco: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Configuración de la fecha de inicio para el campo de fecha en el formulario.
   * @type {InputFecha}
   */
  
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;
  /**
 * @property {InputFecha} configuracionFechaFinVigencia
 * @description
 * Configuración del campo de fecha de fin de vigencia para el formulario de pago de derechos.
 * @type {InputFecha}
 */
configuracionFechaFinVigencia: InputFecha = {
  labelNombre: 'Fecha de pago ',
  required: false,
  habilitado: true,
};

/**
 * @property {InputFecha} configuracionFechaRevision
 * @description
 * Configuración del campo de fecha de revisión para el formulario de pago de derechos.
 * @type {InputFecha}
 */
configuracionFechaRevision: InputFecha = {
  labelNombre: 'Fecha de pago revisión',
  required: false,
  habilitado: true,
};
 /**
 * @method cambioFechaPagoDeDerechos
 * @description
 * Maneja los cambios en el campo de fecha de inicio.
 * @param {string} nuevo_valor - El nuevo valor de fecha seleccionado.
 * @returns {void}
 */
cambioFechaPagoDeDerechos(nuevo_valor: string): void {
  this.tramiteStore.setFechaPagoDeDerechos(nuevo_valor);
}

   



  /**
   * Estado actual del trámite.
   * @type {TramiteState}
   */
  tramiteState: TramiteState = {} as TramiteState;

  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
   @Input() formularioDeshabilitado: boolean = false;

  /**
 * @method cambioFechaPagoDeDerechosRevision
 * @description
 * Maneja los cambios en el campo de fecha de inicio para la revisión de pago de derechos.
 * @param {string} nuevo_valor - El nuevo valor de fecha seleccionado.
 * @returns {void}
 */
cambioFechaPagoDeDerechosRevision(nuevo_valor: string): void {
  this.tramiteStore.setFechaPagoDeDerechosRevision(nuevo_valor);
}

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {FitosanitarioService} fitosanitarioService - Servicio para interactuar con la lógica de negocio relacionada con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly fitosanitarioService: FitosanitarioService,
    public tramiteStoreQuery: TramiteStoreQuery,
    public tramiteStore: TramiteStore,
  ) { 
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario, carga los datos del banco y los datos de pago de derechos.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    // Configure date fields availability based on form state
    this.configuracionFechaFinVigencia.habilitado = !this.formularioDeshabilitado;
    this.configuracionFechaRevision.habilitado = !this.formularioDeshabilitado;
    
    this.iniciarFormulario();
    if (this.formularioDeshabilitado) {
      this.pagosDeDerechosForm.disable();
    }
    this.getBancoDatos();
    this.pagoDeCargarDatos();
    this.pagoDerechosRevision();
  }

  /**
   * Inicializa el formulario reactivo con los controles y validaciones necesarias.
   * @method iniciarFormulario
   * @returns {void}
   */
  iniciarFormulario(): void {
    this.pagosDeDerechosForm = this.fb.group({
      claveDeReferencia: [{ value: this.tramiteState.claveDeReferencia, disabled: true }, Validators.required],
      cadenaDependencia: [{ value: this.tramiteState.cadenaDependencia, disabled: true }, Validators.required],
      banco: [{ value: this.tramiteState.banco }, Validators.required],
      llaveDePago: [{ value: this.tramiteState.llaveDePago }, Validators.required],
      fechaPagoDeDerechos: [{ value: this.tramiteState.fechaPagoDeDerechos, disabled: true }, Validators.required],
      importeDePago: [{ value: this.tramiteState.importeDePago, disabled: true }, Validators.required],
      claveDeReferenciaRevision: [{ value: this.tramiteState.claveDeReferenciaRevision, disabled: true }, Validators.required],
      cadenaDependenciaRevision: [{ value: this.tramiteState.cadenaDependenciaRevision, disabled: true }, Validators.required],
      bancoRevision: [{ value: this.tramiteState.bancoRevision, disabled: true }, Validators.required],
      llaveDePagoRevision: [{ value: this.tramiteState.llaveDePagoRevision, disabled: true }, Validators.required],
      fechaPagoDeDerechosRevision: [{ value: this.tramiteState.fechaPagoDeDerechosRevision, disabled: true }, Validators.required],
      importeDePagoRevision: [{ value: this.tramiteState.importeDePagoRevision, disabled: true }, Validators.required],
      fechaDeInspeccion: [{ value: this.tramiteState.fechaDeInspeccion, disabled: true }, Validators.required],
      fechaPagoDerechos: [{ value: this.tramiteState.fechaPagoDerechos, disabled: true }, Validators.required]
    });

    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.pagosDeDerechosForm.patchValue({
          claveDeReferencia: datos.claveDeReferencia,
          cadenaDependencia: datos.cadenaDependencia,
          banco: datos.banco,
          llaveDePago: datos.llaveDePago,
          fechaInicio: datos.fechaInicio,
          importeDePago: datos.importeDePago,
          claveDeReferenciaRevision: datos.claveDeReferenciaRevision,
          cadenaDependenciaRevision: datos.cadenaDependenciaRevision,
          bancoRevision: datos.bancoRevision,
          llaveDePagoRevision: datos.llaveDePagoRevision,
          fechaPagoDeDerechosRevision: datos.fechaPagoDeDerechosRevision,
          importeDePagoRevision: datos.importeDePagoRevision,
          fechaDeInspeccion: datos.fechaDeInspeccion,
          fechaPagoDerechos: datos.fechaPagoDerechos
        });
        
      })
    ).subscribe();
  }

  /**
   * Carga los datos de pago de derechos desde el servicio y los asigna al formulario.
   * @method pagoDeCargarDatos
   * @returns {void}
   */
  pagoDeCargarDatos(): void {
    this.fitosanitarioService
      .pagoDeCargarDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechosResponseDos) => {
        this.tramiteStore.setClaveDeReferencia(data.data.claveDeReferencia);
        this.tramiteStore.setCadenaDependencia(data.data.cadenaDependencia);
        this.tramiteStore.setImporteDePago(data.data.importeDePago);
      });
  }

  /**
   * Obtiene los datos del banco desde el servicio y los asigna al catálogo de bancos.
   * @method getBancoDatos
   * @returns {void}
   */
  getBancoDatos(): void {
    this.fitosanitarioService.getBancoDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.banco = {
            labelNombre: 'Banco*',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Carga los datos de revisión de pago de derechos desde el servicio y los asigna al formulario.
   * @method pagoDerechosRevision
   * @returns {void}
   */
  pagoDerechosRevision(): void {
    this.fitosanitarioService
      .getPagoDerechosRevision()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechosRevisionResponse) => {
        this.tramiteStore.setClaveDeReferenciaRevision(data.data.claveDeReferenciaRevision);
        this.tramiteStore.setCadenaDependenciaRevision(data.data.cadenaDependenciaRevision);
        this.tramiteStore.setBancoRevision(data.data.bancoRevision);
        this.tramiteStore.setLlaveDePagoRevision(data.data.llaveDePagoRevision);
        this.tramiteStore.setImporteDePagoRevision(data.data.importeDePagoRevision);
      });
  }

  /**
   * Maneja el cambio en la clave de referencia.
   * @method cambioClaveDeReferencia
   * @param {Event} event - Evento de cambio.
   * @returns {void}
   */
  cambioClaveDeReferencia(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.tramiteStore.setClaveDeReferencia(VALUE);
  }

  /**
   * Maneja el cambio en la llave de pago.
   * @method setllaveDePago
   * @param {Event} event - Evento de cambio.
   * @returns {void}
   */
  setllaveDePago(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value; 
    this.tramiteStore.setLlaveDePago(VALUE);
  }

  /**
   * Maneja la selección de un banco del catálogo.
   * @method selectBancoCatalogo
   * @param {Catalogo} event - Evento de selección.
   * @returns {void}
   */
  selectBancoCatalogo(event: Catalogo): void {
    this.tramiteStore.setBanco(event.id);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de desuscribir los observables para evitar fugas de memoria.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

}