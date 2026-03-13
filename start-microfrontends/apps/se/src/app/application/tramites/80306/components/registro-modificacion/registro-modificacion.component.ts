import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfiguracionColumna, ConsultaioQuery, ConsultaioState, LoginQuery, TablaDinamicaComponent,TituloComponent, doDeepCopy, esValidArray, esValidObject} from '@libs/shared/data-access-user/src';
import { DISCRIMINATOR_VALUE, ProgramaLista, TICPSE } from '../../models/datos-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80306Store } from '../../estados/tramite80306.store';

/**
 * Interfaz que define la estructura de los datos de la tabla.
 */
@Component({
  selector: 'app-registro-modificacion',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    FormsModule,
    TablaDinamicaComponent],
  templateUrl: './registro-modificacion.component.html',
  styleUrl: './registro-modificacion.component.scss',
})
/**   * Clase del componente RegistroModificacionComponent.
 * Proporciona la funcionalidad para gestionar el registro de modificaciones,
 * incluyendo la visualización de una tabla con los datos relacionados.
 */
export class RegistroModificacionComponent implements OnInit, OnDestroy {
  
  /**
   * RFC del usuario actual.
   * @type {string}
   */
  private loginRfc: string = '';
 
   /**
 * Estado actual de la consulta, obtenido desde el store.
 * Almacena la información relevante para el paso del solicitante.
 */
public consultaState!: ConsultaioState;

  /**
   * Constructor de la clase RegistroModificacionComponent.
   * 
   * @param router - Servicio de Angular Router para la navegación entre rutas.
   * @param immerModificacionService - Servicio para manejar la lógica de modificación utilizando Immer.
   */
  constructor(
    private router: Router,
    private immerModificacionService: ImmerModificacionService,
    private tramite80306Store: Tramite80306Store,
    private loginQuery: LoginQuery,
    private route: ActivatedRoute,
    private consultaQuery: ConsultaioQuery,
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((loginState) => {
          this.loginRfc = loginState.rfc;
          this.tramite80306Store.setLoginRfc(this.loginRfc);
        })
      )
      .subscribe();
  }

  /**
   * Configuración de las columnas para la tabla en el componente `registro-modificacion`.
   * 
   * Cada objeto en el arreglo `encabezadoDeTabla` define las propiedades de una columna,
   * incluyendo el encabezado, la clave para acceder a los datos, el orden de la columna
   * y si debe mostrarse como un hiperenlace.
   * 
   * @type {ConfiguracionColumna<DatosDeLaTabla>[]}
   * 
   * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
   * @property {(artículo: DatosDeLaTabla) => any} clave - Una función que define cómo acceder
   * a los datos de la columna desde un objeto de tipo `DatosDeLaTabla`.
   * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
   * @property {boolean} [hiperenlace] - Indica si el contenido de la columna debe mostrarse
   * como un hiperenlace. Este campo es opcional.
   */
  public encabezadoDeTabla: ConfiguracionColumna<ProgramaLista>[] = [
    {
      encabezado: 'Folio de programa',
      clave: (artículo) => artículo.folioPrograma,
      orden: 1,
      hiperenlace: true,
    },
    {
      encabezado: 'Tipo de programa',
      clave: (artículo) => artículo.tipoPrograma,
      orden: 2,
    },
  ];

  /**
   * Arreglo que almacena los datos de la tabla relacionados con los contenedores.
   *
   * @type {DatosDeLaTabla[]}
   */
  public datosDelContenedor: ProgramaLista[] = [];

    /**
   * Tipo de programa seleccionado (IMMEX o PROSEC).
   * @type {string}
   */
  tipoPrograma: string = '';

  /**
    * Observable para notificar la destrucción del componente.
    * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
    */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama al método `llenarLaTabla` para cargar los datos necesarios en la tabla.
   */
  ngOnInit(): void {

    this.consultaQuery.selectConsultaioState$.pipe(
    takeUntil(this.destroyNotifier$),
    map((seccionState) => {
      this.consultaState = seccionState;

      if(this.consultaState.update) {
        this.setStoreValues();
      } else {
        this.llenarLaTabla();
      }
    })
  ).subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Úselo para limpiar recursos, desuscribirse de observables o realizar otras tareas de limpieza.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }

  /**
   * Navega a una ruta específica basada en la URL actual.
   * 
   * Este método verifica si la URL actual contiene ciertas palabras clave 
   * ('se' o 'pago') y redirige al usuario a la ruta correspondiente.
   * 
   * - Si la URL actual incluye 'se', redirige a `/se/immex-modificacion/solicitud`.
   * - Si la URL actual incluye 'pago', redirige a `/pago/immex-modificacion/solicitud`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  valorDeAlternancia(): void {
    const CURRENT_URL = this.router.url;
    if (CURRENT_URL.includes('se')) {
      this.router.navigate(['/se/immex-modificacion/solicitud']);
    }
    if (CURRENT_URL.includes('pago')) {
      this.router.navigate(['/pago/immex-modificacion/solicitud']);
    }
  }

    /**
   * Método que se ejecuta al hacer clic en una fila de la tabla.
   * Navega a la ruta de registro de modificación relativa a la ruta actual.
   * @param event Objeto que contiene la información de la fila clickeada.
   * @return {void}
   */
  onFilaClic(event: ProgramaLista): void {
    this.actualizarSeleccionadaPrograma(event);
    this.router.navigate(['../solicitud'], {
      relativeTo: this.route
    });
  }

  
  /**
   * Método que establece los valores seleccionados en el store y navega a la página del solicitante.
   * @return {void}
   */
  setStoreValues(): void {
    const PARAMS = { idSolicitud: this.consultaState.id_solicitud || '' };
    this.immerModificacionService.obtenerMostrar(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE_GET = doDeepCopy(response);
          if(esValidObject(RESPONSE_GET.datos)) {
            this.tramite80306Store.setSelectedIdPrograma(RESPONSE_GET.datos.solicitudDatosGenerales.idProgramaAutorizadoSE || '');
            this.tramite80306Store.setSelectedFolioPrograma(RESPONSE_GET.datos.solicitudDatosGenerales.ideGenerica1 || '');
            this.tramite80306Store.setSelectedTipoPrograma(RESPONSE_GET.datos.solicitudDatosGenerales.ideGenerica3 || '');
            this.tramite80306Store.setLoginRfc(RESPONSE_GET.datos.rfc || this.loginRfc);
            this.router.navigate(['../solicitud'], {
              relativeTo: this.route
            });
          }
        }
      })
  }

  /**
   * Llena la tabla con datos obtenidos desde el servicio `immerModificacionService`.
   * Realiza una solicitud para obtener los datos de la tabla identificada como 'tablaLista',
   * y los procesa para asignarlos a la propiedad `datosDelContenedor`.
   * 
   * @remarks
   * - Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * - Los datos obtenidos se transforman en un formato específico que incluye `id`, `folioDePrograma` y `tipoDePrograma`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  llenarLaTabla(): void {
    this.tipoPrograma = DISCRIMINATOR_VALUE.startsWith('80')
      ? TICPSE.TICPSE_IMMEX
      : TICPSE.TICPSE_PROSEC;
    this.tramite80306Store.setSelectedTipoPrograma(this.tipoPrograma);
    const PARAMS = {
      rfc: this.loginRfc,
      tipoPrograma: this.tipoPrograma,
    };

    this.immerModificacionService
      .obtenerListaProgramas(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          if(esValidArray(RESPONSE.datos)) {
            this.datosDelContenedor = RESPONSE.datos;
            this.tramite80306Store.setProgramaListaDatos(
              this.datosDelContenedor
            );
          }
        }
      })
  }

    /**
   * Método que actualiza la información del programa seleccionado en el store.
   * @param event Objeto que contiene la información del programa seleccionado.
   * @return {void}
   */
  actualizarSeleccionadaPrograma(event: ProgramaLista): void {
    this.tramite80306Store.setSelectedFolioPrograma(event.folioPrograma || '');
    this.tramite80306Store.setSelectedIdPrograma(
      event.idProgramaAutorizado || ''
    );
  }
}
