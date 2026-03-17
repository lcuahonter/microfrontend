import { CatalogoSelectComponent, CatalogosSelect, InputFecha, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subject,map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import {PagoDeDerechosResponseDos } from '../../modelos/acuicola.model';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TramiteState } from '../../estados/tramite220702.store';
import { TramiteStore } from '../../estados/tramite220702.store';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';


@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    InputFechaComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './pago-derechos.component.html',
 
})
export class PagoDerechosComponent implements OnInit, OnDestroy {

  /**
    * Formulario reactivo para gestionar los datos del pago de derechos.
    */
  pagosDerechosForm!: FormGroup;

  /**
   * Valor seleccionado del radio.
   */
  valorSeleccionado!: string|null;

  radioOpcions = [
    { label: 'No', value: 'no' },
    { label: 'Sí', value: 'sí' },
  
  ];


  /**
     * Catálogo de puntos de inspección.
     * @type {CatalogosSelect}
     */
    pagoJustificacion:CatalogosSelect={
      labelNombre: '',
      required: false,
      primerOpcion: '',
      catalogos: [],
    };
  

   /**
   * Cambia el valor seleccionado del radio.
   * @param value Valor seleccionado.
   */
   cambiarRadio(value: string | number):void {
    this.valorSeleccionado = value as string;
    this.tramiteStore.setExentoDePago(this.valorSeleccionado);
  }

  /**
 * @property {InputFecha} configuracionFechaFinVigencia
 * @description
 * Configuración del campo de fecha de fin de vigencia para el formulario de pago de derechos.
 * @type {InputFecha}
 */
  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de pago',
    required: false,
    habilitado: false,
  };
  /**
 * @method cambioFechaDePago
 * @description
 * Maneja los cambios en el campo de fecha de inicio.
 * @param {string} nuevo_valor - El nuevo valor de fecha seleccionado.
 * @returns {void}
 */
cambioFechaDePago(nuevo_valor: string): void {
  this.tramiteStore.setFechaDePago(nuevo_valor);
}

  tramiteState: TramiteState={} as TramiteState;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
   esFormularioSoloLectura: boolean = false; 

   /**
    * Indica si el campo debe ser deshabilitado.
    * @property {boolean} campoDeshabilitar
    */
   campoDeshabilitar:boolean= false;

   /**
    * Valor por defecto para exentoDePago en modo consulta.
    * @property {string} defaultExentoDePago
    */
   defaultExentoDePago: string = 'sí';
 
  /**
   * Subject utilizado para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param fb Servicio de FormBuilder para crear formularios reactivos.
   * @param fitosanitarioService Servicio para interactuar con la lógica de negocio relacionada con la acuicultura.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly fitosanitarioService: FitosanitarioService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private readonly consultaioQuery: ConsultaioQuery
     ) {
       this.consultaioQuery.selectConsultaioState$
         .pipe(
           takeUntil(this.destroyNotifier$),
           map((seccionState) => {
             this.esFormularioSoloLectura = seccionState.readonly;
             this.inicializarEstadoFormulario();
           })
         ).subscribe();
      }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.iniciarFormulario();
    }  

  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga los datos del pago de derechos.
   */
  ngOnInit(): void {
    this.iniciarFormulario();
     this.getpagoJustificacion();
    this.pagoDeCargarDatos();
    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.valorSeleccionado = datos.valorSeleccionado;
        this.pagosDerechosForm.patchValue({
          exentoDePago: datos.exentoDePago,
          pagoJustificacion: datos.pagoJustificacion,
          claveDeReferenciaDerechos: datos.claveDeReferenciaDerechos,
          cadenaDependenciaDerechos: datos.cadenaDependenciaDerechos,
          bancoDerechos: datos.bancoDerechos,
          llaveDePagoDerechos: datos.llaveDePagoDerechos,
          fechaDePago: datos.fechaDePago,
          importeDePagoDerechos: datos.importeDePagoDerechos
        });
      })
    )
      .subscribe();
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.iniciarFormulario();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
      this.pagosDerechosForm.disable();
      this.pagosDerechosForm.get('exentoDePago')?.disable();
    } else {
      this.campoDeshabilitar=false;
      this.pagosDerechosForm.enable();
    }

  }

  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   */
  iniciarFormulario(): void {
    // Solo establecer valor por defecto 'sí' para exentoDePago en modo consulta (readonly) 
    // y solo si el valor está vacío
    const EXENTO_DE_PAGO_VALUE = this.esFormularioSoloLectura && !this.tramiteState.exentoDePago 
      ? this.defaultExentoDePago 
      : this.tramiteState.exentoDePago;

    this.pagosDerechosForm = this.fb.group({
      claveDeReferenciaDerechos: [{ value:this.tramiteState.claveDeReferenciaDerechos, disabled: true }, Validators.required],
      cadenaDependenciaDerechos: [{ value:this.tramiteState.cadenaDependenciaDerechos, disabled: true }, Validators.required],
      bancoDerechos: [{ value:this.tramiteState.bancoDerechos, disabled: true }, Validators.required],
      llaveDePagoDerechos: [{ value:this.tramiteState.llaveDePagoDerechos, disabled: true }, Validators.required],
      fechaDePago: [{ value:this.tramiteState.fechaDePago, disabled: true }, Validators.required],
      importeDePagoDerechos: [{ value:this.tramiteState.importeDePagoDerechos, disabled: true }, Validators.required],
      exentoDePago: [{ value: EXENTO_DE_PAGO_VALUE, disabled: true }, Validators.required],
      pagoJustificacion: [{value:this.tramiteState.pagoJustificacion}, Validators.required],
      
    });

    // Si estamos en modo consulta (readonly) y no hay valor previo, establecer 'sí' como valor por defecto
    if (this.esFormularioSoloLectura && !this.tramiteState.exentoDePago) {
      this.tramiteStore.setExentoDePago(this.defaultExentoDePago);
      this.valorSeleccionado = this.defaultExentoDePago;
    }
  }


    /**
   * Obtiene los puntos de inspección desde el servicio.
   * @method getpagoJustificacion
   * @returns {void}
   */
  getpagoJustificacion(): void {
    this.fitosanitarioService.getPagoJustificacion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.pagoJustificacion = {
          labelNombre: 'Justificación',
          required: false,
          primerOpcion: 'Donaciones de productos en abandono del fisco federal',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Carga los datos del pago de derechos desde el servicio.
   */
  pagoDeCargarDatos(): void {
    this.fitosanitarioService
      .pagoDeCargarDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechosResponseDos) => {
        this.pagosDerechosForm.patchValue({
          claveDeReferenciaDerechos:data.data.claveDeReferencia,
          cadenaDependenciaDerechos:data.data.cadenaDependencia,
          bancoDerechos:data.data.banco,
          llaveDePagoDerechos:data.data.llaveDePago,
          fechaInicioDerechos:data.data.fechaInicio,
          importeDePagoDerechos:data.data.importeDePago,
          
        });
      })
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de liberar las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }
}
