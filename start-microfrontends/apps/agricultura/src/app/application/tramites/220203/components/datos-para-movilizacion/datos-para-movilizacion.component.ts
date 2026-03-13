import {
  Catalogo,
  CatalogoSelectComponent,
  ConsultaioState,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import {CatalogosService} from '../../services/220203/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudService } from '../../services/220203/consulta-solicitud/consulta-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultarMovilizacionResponse } from '../../models/220203/response/consultar-movilizacion-response.model';
import { FormularioMovilizacion } from '../../models/220203/importacion-de-acuicultura.module';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * @fileoverview
 * Componente para la gestión de los datos de movilización en el trámite de importación de acuicultura.
 * Permite capturar, validar y actualizar la información relacionada con el transporte y puntos de verificación.
 * Cobertura de documentación completa: cada propiedad, método y constructor está documentado en español.
 * @module DatosParaMovilizacionComponent
 */

/**
 * Componente para la gestión de los datos de movilización en el trámite de importación de acuicultura.
 * Permite capturar, validar y actualizar la información relacionada con el transporte y puntos de verificación.
 * Gestiona formularios reactivos con validaciones y mantiene sincronización con el estado global.
 * 
 * @export
 * @class DatosParaMovilizacionComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-datos-para-movilizacion',
  templateUrl: './datos-para-movilizacion.component.html',
  styleUrls: ['./datos-para-movilizacion.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule
  ]
})
export class DatosParaMovilizacionComponent implements OnInit, OnDestroy{

  /**
   * Lista de opciones de transporte obtenidas del catálogo correspondiente.
   * Contiene los medios de transporte disponibles para la movilización de mercancías.
   * @type {Catalogo[]}
   * @memberof DatosParaMovilizacionComponent
   */
  transportes: Catalogo[] = [];

  /**
   * Lista de puntos de verificación obtenidos del catálogo correspondiente.
   * Contiene los puntos de control disponibles para la verificación de mercancías.
   * @type {Catalogo[]}
   * @memberof DatosParaMovilizacionComponent
   */
  puntos: Catalogo[] = [];

  /**
   * Formulario reactivo para capturar los datos de movilización de acuicultura.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   * @memberof DatosParaMovilizacionComponent
   */
  formularioMovilizacion!: FormGroup;

  /**
   * Estado actual del formulario de movilización almacenado en el store.
   * Mantiene la persistencia de los datos ingresados por el usuario.
   * @type {FormularioMovilizacion}
   * @memberof DatosParaMovilizacionComponent
   */
  formularioMovilizacionStore: FormularioMovilizacion = {} as FormularioMovilizacion;

  /**
   * Subject para controlar la destrucción de suscripciones y evitar memory leaks.
   * Se utiliza para limpiar todas las suscripciones activas al destruir el componente.
   * @type {Subject<void>}
   * @private
   * @memberof DatosParaMovilizacionComponent
   */
  private readonly DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Controla la habilitación/deshabilitación de los campos del formulario.
   * @type {boolean}
   * @memberof DatosParaMovilizacionComponent
   */
  esFormularioSoloLectura: boolean = false;

  /**
* bandera para indicar que el formulario fue tocado
*/
  markTouched: boolean = false;
  /**
   * @property {ConsultaioState[]} consultaState
   * @description Consulta solicitud.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * booleano para ocultar el formulario
   * @property {boolean} ocultarForm
   */
  @Input() ocultarForm: boolean = false;

  /**
   * Constructor del componente DatosParaMovilizacionComponent.
   * Inicializa los servicios necesarios y establece la suscripción al estado del formulario.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaServices - Servicio para obtener datos de catálogos y actualizar el store
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de solo lectura del formulario
   * @param catalogosService
   * @param consultaSolicitudService
   * @memberof DatosParaMovilizacionComponent
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly importacionDeAcuiculturaServices: ImportacionDeAcuiculturaService,
    private consultaQuery: ConsultaioQuery,
    public catalogosService: CatalogosService,
    public consultaSolicitudService: ConsultaSolicitudService
  ) {
    this.formularioMovilizacion = this.fb.group({
      medioDeTransporte: [ '', Validators.required],
      identificacionTransporte: [ ''],
      puntoVerificacion: [ ''],
      nombreEmpresaTransportista: [ '', Validators.required]
    });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            this.formularioMovilizacion.disable({ emitEvent: false});
          }
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa el formulario reactivo con validaciones y obtiene los catálogos necesarios.
   * 
   * @public
   * @method ngOnInit
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  ngOnInit(): void {
     this.importacionDeAcuiculturaServices.obtenerDatos().pipe(takeUntil(this.DESTROY_NOTIFIER$)).subscribe((datos) => {
       this.formularioMovilizacionStore = datos.formularioMovilizacion
      if(this.formularioMovilizacionStore){
         this.formularioMovilizacion.patchValue(this.formularioMovilizacionStore);
      }
    })
   
    const CARGACATALOGOS = async() => {
      await this.obtenerCatalogosTransporte();
      await this.obtenerCatalogosPuntos();
    }
    CARGACATALOGOS().then(() => {
      if (this.ocultarForm) {
        this.obtenerDataMovilizacion();
      }
    })
  }


  /**
   * Obtiene los datos de una solicitud mediante un folio especifico y procesa la respuesta
   * para llenar un formulario y realiza diversas acciones basadas en los datos recibidos.
   * @method obtenerDataMovilizacion
   * @returns {void}
   */
  obtenerDataMovilizacion(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetalleMovilizacion(Number(this.consultaState.procedureId), FOLIO)
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe(async (response) => {
        if (response?.codigo === '00' && response?.datos) {
          await this.obtenerCatalogosTransporte();
          await this.obtenerCatalogosPuntos();
          this.llenarFormularioDesdeRespuesta(response.datos);
        }
      })
  }

  llenarFormularioDesdeRespuesta(datos: ConsultarMovilizacionResponse): void {
    this.formularioMovilizacion.patchValue({
      medioDeTransporte: datos.ide_medio_transporte,
      identificacionTransporte: datos.identificacion_transporte,
      puntoVerificacion: datos.id_punto_verificacion,
      nombreEmpresaTransportista: datos.razon_social
    }, { emitEvent: false });
    const GUARDAR_VALORES: FormularioMovilizacion = {
      medioDeTransporte: datos.ide_medio_transporte,
      puntoVerificacion: datos.id_punto_verificacion.toString(),
      nombreEmpresaTransportista: datos.razon_social,
      identificacionTransporte: datos.identificacion_transporte,
    };
    (
      this.importacionDeAcuiculturaServices.actualizarFormularioMovilizacion as (
        value: FormularioMovilizacion
      ) => void
    )(GUARDAR_VALORES);
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Habilita o deshabilita los controles del formulario basado en el estado actual.
   * 
   * @public
   * @method inicializarEstadoFormulario
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formularioMovilizacion.disable();
    } else {
      this.formularioMovilizacion.enable();
    }
  }

  /**
   * Obtiene los datos del catálogo de medios de transporte.
   * Realiza una petición al servicio para cargar las opciones disponibles de transporte.
   * 
   * @public
   * @method obtenerCatalogosTransporte
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  obtenerCatalogosTransporte(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoMedioTransporte(220203)
        .pipe(
          takeUntil(this.DESTROY_NOTIFIER$)
        ).subscribe(
        (data): void => {
          this.transportes = data.datos ?? [];
          resolve();
        }
      );
    })
  }

  /**
   * Obtiene los datos del catálogo de puntos de verificación.
   * Realiza una petición al servicio para cargar las opciones disponibles de puntos de control.
   * 
   * @public
   * @method obtenerCatalogosPuntos
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  obtenerCatalogosPuntos(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoPuntoVerificacion(220203)
        .pipe(
          takeUntil(this.DESTROY_NOTIFIER$)
        ).subscribe(
        (data): void => {
          this.puntos = data.datos ?? [];
          resolve();
        }
      );    
    })
  }

  /**
   * Establece los valores del formulario en el servicio de almacenamiento correspondiente.
   * Actualiza el estado global con los datos actuales del formulario de movilización.
   * 
   * @public
   * @method setValoresStore
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  setValoresStore(): void {
    const VALOR = this.formularioMovilizacion.value;
    (this.importacionDeAcuiculturaServices.actualizarFormularioMovilizacion as (value: FormularioMovilizacion) => void)(
      VALOR
    );
  }
  /**
   * Valida el estado actual del formulario de movilización.
   * Verifica si todos los campos obligatorios están completos y marca los campos como tocados si hay errores.
   * 
   * @public
   * @method validarFormulario
   * @memberof DatosParaMovilizacionComponent
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  public validarFormulario(): boolean {
    this.markTouched = true;
    if (this.formularioMovilizacion.invalid) {
      this.formularioMovilizacion.markAllAsTouched();
      return false;
    }
    return true;
  }


  /**
   * Método del ciclo de vida OnDestroy de Angular.
   * Ejecuta la limpieza de recursos, detiene las suscripciones activas y libera memoria.
   * Previene memory leaks al destruir el componente.
   * 
   * @public
   * @method ngOnDestroy
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }
}