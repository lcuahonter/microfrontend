import {
  Catalogo,
  CatalogoSelectComponent,
  ConsultaioState,
  Notificacion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import {CatalogosService} from '../../services/220202/catalogos/catalogos.service';
import { ConsultaSolicitudService } from '../../services/220202/consulta-solicitud/consulta-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultarMovilizacionResponse } from '../../models/220202/response/consultar-movilizacion-response.model';

import { Movilizacion } from '../../models/220202/fitosanitario.model';


/**
 * Componente para mostrar el subtítulo del asistente.
 * @component DatosParaMovilizacionNacionalComponent
 * @selector app-datos-para-movilizacion-nacional
 * @templateUrl ./datos-para-movilizacion-nacional.component.html
 * @styleUrls ./datos-para-movilizacion-nacional.component.scss --220202
 */
@Component({
  selector: 'app-datos-para-movilizacion-nacional',
  templateUrl: './datos-para-movilizacion-nacional.component.html',
  styleUrls: ['./datos-para-movilizacion-nacional.component.scss'],
  standalone: true,
  imports: [TituloComponent, CatalogoSelectComponent, ReactiveFormsModule],
})
export class DatosParaMovilizacionNacionalComponent implements OnInit, OnDestroy {
  
  /**
   * @description FormGroup que contiene los controles del formulario.
   * Este objeto `FormGroup` contiene los controles de formulario necesarios para capturar los datos de movilización nacional.
   * @type {FormGroup}
   */
  forma!: FormGroup;

  /**
   * @description Lista de opciones para el selector de medio de transporte.
   * Este array contiene los objetos de tipo `Catalogo` que se utilizan para poblar el selector de medio de transporte en el formulario.
   * @type {Catalogo[]}
   */
  transporteList: Catalogo[] = [];

  /**
   * @description Lista de puntos de verificación federal.
   * Este array contiene los objetos de tipo `Catalogo` que se utilizan para poblar el selector de puntos de verificación federal en el formulario.
   * @type {Catalogo[]}
   */
  puntoList: Catalogo[] = [];
  
  /**
   * @description Subject para manejar la destrucción de las suscripciones.
   * Se utiliza para emitir cuando el componente es destruido, limpiando todas las suscripciones.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @description Almacena los datos del formulario de movilización nacional.
   * @type {Movilizacion}
   */
  formulariodataStore: Movilizacion = {} as Movilizacion;

  /**
   * @description Indica si el formulario se encuentra en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = true;

  /**
 * Representa una nueva notificación que será utilizada en el componente.
 * @type {Notificacion}
 */
  public nuevaNotificacion!: Notificacion;
  /**
 * @property moduloEmergente
 * @description Indica si el módulo emergente está activo.
 * @type {boolean}
 * @default false
 */
  public moduloEmergente: boolean = false;

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
   * @constructor
   * @param {AgriculturaApiService} agriculturaApiService - Servicio HttpClient para realizar peticiones.
   * Este servicio se utiliza para obtener las listas de opciones para los selectores del formulario y para actualizar el estado de la forma.
   */
  constructor(
    private readonly agriculturaApiService: AgriculturaApiService,
    private consultaioQuery: ConsultaioQuery,
    public catalogosService: CatalogosService,
    private readonly fb: FormBuilder,
    public consultaSolicitudService: ConsultaSolicitudService
  ) {
    this.forma = this.fb.group({
      transporte: ['', Validators.required],
      identificacion: [''],
      puntoVerificacion: [''],
      empresaTransportista: ['', Validators.required],
    })
    this.agriculturaApiService
      .getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.formulariodataStore = datos.movilizacion;
        if (this.formulariodataStore) {
          this.forma.patchValue(this.formulariodataStore, { emitEvent: false });
          this.forma.patchValue({
            transporte: this.formulariodataStore.transporte,
            identificacion: this.formulariodataStore.identificacion,
            puntoVerificacion: this.formulariodataStore.puntoVerificacion,
            empresaTransportista: this.formulariodataStore.empresaTransportista,
          })
        }
      });

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @description Inicializa el componente.
   * Este método se llama automáticamente después de que se crea el componente.
   * Crea el `FormGroup` y obtiene los datos para los selectores (medio de transporte y puntos de verificación).
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.forma = new FormGroup({
      transporte: new FormControl(
        {
          value: this.formulariodataStore.transporte || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required
      ),
      identificacion: new FormControl({
        value: this.formulariodataStore.identificacion || '',
        disabled: this.esFormularioSoloLectura,
      }),
      puntoVerificacion: new FormControl({
        value: this.formulariodataStore.puntoVerificacion || '',
        disabled: this.esFormularioSoloLectura,
      }),
      empresaTransportista: new FormControl(
        {
          value: this.formulariodataStore.empresaTransportista || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required
      ),
    });
    // Obtiene las listas de opciones (medio de transporte y puntos de verificación)
    const CARGACATALOGOS = async () => {
      await this.obtenerTodosLosDatosDeOpciones();
    }
    CARGACATALOGOS().then(() => {
      if (this.ocultarForm) {
        this.obtenerDataMovilizacion();
      }
    })
  }

  /**
   * @description Obtiene los datos para los selectores (medio de transporte y punto de verificación).
   * Este método llama a otros métodos para obtener las listas de opciones desde el servicio.
   * @method obtenerTodosLosDatosDeOpciones
   * @returns {void}
   */
  async obtenerTodosLosDatosDeOpciones(): Promise<void> {
    await this.obtenerListaDeJustificaciones();
    await this.obtenerListaDePunto();
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
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(async (response) => {
        if (response?.codigo === '00' && response?.datos) {
          await this.obtenerListaDeJustificaciones();
          await this.obtenerListaDePunto();
          this.llenarFormularioDesdeRespuesta(response.datos);
        }
      })
  }

  llenarFormularioDesdeRespuesta(datos: ConsultarMovilizacionResponse): void {
    this.forma.patchValue({
      transporte: datos.ide_medio_transporte,
      identificacion: datos.identificacion_transporte,
      puntoVerificacion: datos.id_punto_verificacion,
      empresaTransportista: datos.razon_social,
    })
    const GUARDAR_VALORES: Movilizacion = {
      transporte: datos.ide_medio_transporte,
      puntoVerificacion: datos.id_punto_verificacion !== null ? datos.id_punto_verificacion.toString() : '',
      empresaTransportista: datos.razon_social,
      identificacion: datos.identificacion_transporte,
    }
    this.agriculturaApiService.updateMovilizacion(GUARDAR_VALORES);
  }

  /**
   * @description Obtiene los datos para el selector de medio de transporte.
   * Llama al servicio para obtener la lista de transportes y la asigna a `transporteList`.
   * @method obtenerListaDeJustificaciones
   * @returns {void}
   */
  obtenerListaDeJustificaciones(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoMedioTransporte(220202)
        .pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe(
        (data): void => {
          this.transporteList = data.datos ?? [];
          resolve();
        }
      );
    })
  }

  /**
   * @description Obtiene los datos para el selector de punto de verificación federal.
   * Llama al servicio para obtener la lista de puntos y la asigna a `puntoList`.
   * @method obtenerListaDePunto
   * @returns {void}
   */
  obtenerListaDePunto(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoPuntoVerificacion(220202)
        .pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe(
        (data): void => {
          this.puntoList = data.datos ?? [];
          resolve();
        }
      );
    })
  }

  /**
 * @description Valida todos los campos del formulario y marca los campos como touched
 * para mostrar los errores de validación en los componentes app-catalogo-select
 * @method validarFormulario
 * @returns { valido: boolean; mensaje?: string } true si el formulario es válido, false en caso contrario
 */
  public validarFormulario(): { valido: boolean; mensaje?: string } {
    this.markTouched = true;
    this.forma.markAllAsTouched();
    this.forma.updateValueAndValidity();
    // Retornar si el formulario es válido
    if (!this.forma.valid) {
      return { valido: false };
    }
    return { valido: true };
  }

  /**
   * @description Actualiza los valores en el store del servicio.
   * Este método obtiene el valor de un campo específico del formulario y lo actualiza en el servicio.
   * @method setValoresStore
   * @param {FormGroup} form - El formulario que contiene los datos a actualizar.
   * @param {string} campo - El nombre del campo cuyo valor se actualizará en el servicio.
   * @returns {void}
   */
  setValoresStore( _forma?: FormGroup, _campo?: string): void {
    const VALOR = this.forma.value;
    this.agriculturaApiService.updateMovilizacion(VALOR);
  }

  /**
   * @description Limpia las suscripciones activas cuando el componente es destruido.
   * Este método se llama automáticamente cuando el componente es destruido para evitar fugas de memoria.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
