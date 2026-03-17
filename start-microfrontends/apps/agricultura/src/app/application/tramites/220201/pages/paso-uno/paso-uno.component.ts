import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SeccionLibStore, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CapturarSolicitud } from '../../models/220201/capturar-solicitud.model';
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosParaMovilizacionNacionalComponent } from '../../components/datos-para-movilizacion-nacional/datos-para-movilizacion-nacional.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { TercerospageComponent } from '../../components/tercerospage/tercerospage.component';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * @fileoverview Componente para el asistente de solicitud.
 * Este componente gestiona la navegación entre los pasos del formulario de solicitud,
 * así como la carga y almacenamiento de datos de la solicitud.
 * @module PasoUnoComponent
 */

/**
 * Componente para el asistente de solicitud.
 * Este componente gestiona la navegación entre los pasos del formulario de solicitud.
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrls ./paso-uno.component.scss
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
  standalone: true,
  imports: [SolicitanteComponent, DatosDeLaSolicitudComponent,
    DatosParaMovilizacionNacionalComponent, PagoDeDerechosComponent, TercerospageComponent, CommonModule]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  @ViewChild(DatosDeLaSolicitudComponent) solicitud!: DatosDeLaSolicitudComponent;
  /**
   * Subject utilizado para destruir suscripciones y evitar fugas de memoria.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Índice de la pestaña seleccionada.
   * @property {number} indice - Índice de la pestaña actualmente seleccionada.
   * @default 1
   */
  indice: number = 1;

  /**
   * Lista de secciones del formulario.
   * @property {Array<{ index: number; title: string; component: string; }>} seccionesDeLaSolicitud
   * - Lista de pasos dentro del formulario con sus respectivos componentes.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Datos de la solicitud', component: 'datos-de-la-solicitud' },
    { index: 3, title: 'Datos para movilización nacional', component: 'datos-para-movilizacion-nacional' },
    { index: 4, title: 'Terceros relacionados', component: 'terceror-relacionados' },
    { index: 5, title: 'Pago de derechos', component: 'pago-de-derechos' }
  ];
  /**
 * @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
 *                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
 * @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
 */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

  /**
* @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
*                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
* @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
*/
  @ViewChild('datosDeLaSolicitudRef') datosDelaSolicitu!: DatosDeLaSolicitudComponent;
  /**
* @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
*                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
* @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
*/
  @ViewChild('datosParaMovilizacionNacionalRef') datosParaMovilizacionNacional!: DatosParaMovilizacionNacionalComponent;
  /**
* @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
*                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
* @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
*/
  @ViewChild('padoDeRef') pagoDeDerechosComponent!: PagoDeDerechosComponent;
  /**
   * Referencia al componente hijo TercerospageComponent para manejar los terceros relacionados.
   * @public
   * @type {TercerospageComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('tercerospageRef') tercerospage!: TercerospageComponent;

  /**
   * ID de la solicitud actual.
   * @property {string | undefined} idsolicitud
   */
  idsolicitud?: string;

  /**
   * Evento emitido cuando la solicitud ha sido guardada exitosamente.
   * El valor emitido es el identificador de la solicitud guardada.
   * @event solicitudGuardada
   * @type {EventEmitter<string>}
   */
  @Output() solicitudGuardada = new EventEmitter<string>();

  /**
   * Estado de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si existen datos de respuesta del servidor para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;


  /**
   * Constructor del componente.
   * Inicializa los stores y servicios necesarios para el manejo de la solicitud.
   * @method constructor
   * @param seccionStore Store para el manejo de la validez y estado de las secciones.
   * @param certificadoZoosanitarioServices Servicio para la gestión de la solicitud.
   * @param consultaQuery Consulta para el estado de la sección.
   */
  constructor(
    private readonly seccionStore: SeccionLibStore,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private consultaQuery: ConsultaioQuery,
    public certificadoZoosanitarioStore: ZoosanitarioStore
  ) {

  }


  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * Suscribe al estado de la consulta y guarda los datos del formulario si es necesario.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      ).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Guarda los datos del formulario llamando al servicio correspondiente.
   * @method guardarDatosFormulario
   */
  guardarDatosFormulario(): void {
    this.seccionStore.establecerFormaValida([true]);
    this.seccionStore.establecerSeccion([true]);
  }

  /**
   * Evento emitido al cambiar de pestaña.
   * @event tabChanged
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Cambia el índice de la pestaña seleccionada y emite el evento correspondiente.
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * @description
   * Valida los formularios de los diferentes componentes hijos del paso uno del trámite.
   * 
   * Este método verifica si los formularios de los componentes `solicitante`, `datosDelaSolicitu`,
   * `datosParaMovilizacionNacional` y `pagoDeDerechosComponent` son válidos. Si alguno de ellos es inválido
   * o no está presente, el método retorna `false`. Además, marca todos los campos del formulario de solicitante
   * como tocados si es inválido para mostrar los errores de validación.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos y existen, `false` en caso contrario.
   */
  public validarFormularios(): boolean {
    let isValid = true;
        this.datosDelaSolicitu.validarFormulario();
        this.datosParaMovilizacionNacional.validarFormulario();
        this.tercerospage.validarFormulario();
        this.pagoDeDerechosComponent.validarFormulario();
    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosDelaSolicitu) {
      if (!this.datosDelaSolicitu.validarFormulario()) {
        this.seleccionaTab(2);
        isValid = false;
        return isValid;
      }
    } else {
      isValid = false;
    }

    if (this.datosParaMovilizacionNacional) {
      if (!this.datosParaMovilizacionNacional.validarFormulario()) {
        this.seleccionaTab(3);
        isValid = false;
        return isValid;
      }
    } else {
      isValid = false;
    }

    if (this.tercerospage) {
      if (!this.tercerospage.validarFormulario()) {
        this.seleccionaTab(4);
        isValid = false;
        return isValid;
      }
    }
    else {
      isValid = false;
    }
    if (this.pagoDeDerechosComponent) {
      if (!this.pagoDeDerechosComponent.validarFormulario()) {
        this.seleccionaTab(5);
        isValid = false;
        return isValid;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Guarda el estado actual de la solicitud de manera parcial.
   * Este método invoca la función `guardarParcial` en el objeto `solicitud`,
   * permitiendo al usuario guardar el progreso sin completar todo el proceso.
   */
  guardaSolicitudParcial(): void {
    this.solicitud.guardarParcial();
  }


  /**
   * Guarda la solicitud completa.
   * Llama al método `guardarTotal` de la solicitud para realizar el guardado total.
   */
  guardadoTotal(): boolean {
    this.solicitud.guardaDatosDeLaSolicitud();
    this.datosParaMovilizacionNacional.guardarDatosparaMovilizacionNacional();
    this.pagoDeDerechosComponent.guardarDatosPagoDeDerechos();
    return this.solicitud.guardarTotal();

  }

  /**
   * Ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}