import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';
import { DatosComunesService } from '../../../../shared/services/datos-comunes.service';
import { EsquemaDeCertificacionService } from '../../services/esquema-de-certificacion.service';
import { TercerosRelacionadosService } from '../../../../shared/services/terceros-relacionados.service';

/**
 * Componente PasoUnoComponent encargado de gestionar el primer paso del trámite 32612.
 *
 * Este componente maneja la lógica de inicialización, destrucción y actualización de los datos del formulario,
 * incluyendo la consulta y almacenamiento de datos comunes, terceros relacionados, agente aduanal, agente,
 * perfiles y perfiles Accodiane. Además, controla el estado de solo lectura del formulario y la selección de pestañas.
 *
 * Las suscripciones a los servicios se gestionan utilizando un Subject (`destroyNotifier$`) para evitar fugas de memoria.
 *
 * @remarks
 * - Utiliza varios servicios para obtener y actualizar datos del formulario.
 * - Implementa los métodos del ciclo de vida `OnInit` y `OnDestroy`.
 * - Controla el estado de solo lectura del formulario según el estado de la consulta.
 *
 * @example
 * ```typescript
 * <app-paso-uno></app-paso-uno>
 * ```
 *
 * @see ConsultaioQuery
 * @see DatosComunesService
 * @see TercerosRelacionadosService
 * @see EsquemaDeCertificacionService
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {


  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Almacena el identificador único para el trámite actual.
   * En este contexto, '32612' representa el número específico de trámite que se está procesando.
   */
  procedureNumero: string = '32612';
  /**
   * Indica si el trámite está actualmente activo.
   * 
   * @default true
   */
  procedureActivo: boolean = true;
  /**
   * Mantiene el estado actual del proceso de consulta.
   *
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
   * Ayuda a prevenir fugas de memoria al emitir un valor y completar todos los observables
   * que están suscritos con `takeUntil(destroyNotifier$)`.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Crea una instancia de PasoUnoComponent.
   * 
   * @param consultaQuery Servicio para consultar datos de consulta.
   * @param datosComunesSvc Servicio para acceder a datos comunes/compartidos.
   * @param tercerosRelacionadosSvc Servicio para gestionar terceros relacionados.
   * @param esquemaCertificacionSvc Servicio para manejar esquemas de certificación.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private datosComunesSvc: DatosComunesService,
    private tercerosRelacionadosSvc: TercerosRelacionadosService,
    private esquemaCertificacionSvc: EsquemaDeCertificacionService
  ) {

  }

  /**
   * Método del ciclo de vida que se llama después de que las propiedades enlazadas de un componente se inicializan.
   * 
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza las variables de estado local
   * (`consultaState`, `esFormularioSoloLectura`) según el valor emitido. Si el estado indica una actualización,
   * se disparan varios métodos para guardar y obtener datos relacionados con el formulario.
   *
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite, para evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
        this.esFormularioSoloLectura = seccionState.readonly;
        if(this.consultaState.update) {
          this.guardarDatosComunesFormulario();
          this.guardarTercerosFormulario();
          this.getAgenteAduanalFormulario();
          this.getAgenteFormulario();
          this.getPerfilesFormulario();
          this.getPerfilesAccodianeFormulario();
        }
    })).subscribe();
   }
  /**
   * Selecciona una pestaña por su índice y actualiza el índice de la pestaña actual.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Recupera los datos actuales del servicio tercerosRelacionadosSvc y actualiza el estado del formulario
   * para cada entrada en la respuesta. La actualización se realiza llamando a `actualizarEstadoFormulario`
   * para cada par clave-valor en el objeto de respuesta.
   *
   * La suscripción al observable se cancela automáticamente cuando se emite `destroyNotifier$`,
   * evitando fugas de memoria.
   */
  public guardarTercerosFormulario(): void {
    this.tercerosRelacionadosSvc.getConsultaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      Object.entries(response).forEach(([key, value]) => {
          this.tercerosRelacionadosSvc.actualizarEstadoFormulario(key, value);
      });
    })
  }

  /**
   * Recupera los datos comunes del formulario desde el servicio y actualiza el estado del formulario.
   * 
   * Se suscribe al observable `getConsultaDatosComunes` de `datosComunesSvc` y, al recibir una respuesta,
   * llama a `actualizarEstadoFormulario` para actualizar el estado del formulario con los datos obtenidos.
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite.
   */
  public guardarDatosComunesFormulario(): void {
    this.datosComunesSvc.getConsultaDatosComunes().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      this.datosComunesSvc.actualizarEstadoFormulario(response);
    })
  }

  /**
   * Recupera los datos del formulario del agente aduanal llamando al método `getConsultaDatosAgenteAduanal` del servicio.
   * Se suscribe al observable y recorre las entradas del objeto de respuesta,
   * actualizando el estado del formulario para cada par clave-valor usando `actualizarEstadoFormulario`.
   * La suscripción se cancela automáticamente cuando se emite `destroyNotifier$`.
   */
  public getAgenteAduanalFormulario(): void {
    this.esquemaCertificacionSvc.getConsultaDatosAgenteAduanal().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      Object.entries(response).forEach(([key, value]) => {
          this.esquemaCertificacionSvc.actualizarEstadoFormulario(key, value);
      });
    })
  }

  /**
   * Recupera la información del agente llamando al método `getConsultaAgente` del servicio,
   * se suscribe al observable y procesa la respuesta.
   * La respuesta se clona profundamente y se pasa al método `estadoFormulario` del servicio
   * para actualizar el estado del formulario.
   *
   * La suscripción se cancela automáticamente cuando se emite `destroyNotifier$`.
   */
  public getAgenteFormulario(): void {
    this.esquemaCertificacionSvc.getConsultaAgente().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.esquemaCertificacionSvc.estadoFormulario(DATOS);
    })
  }

  /**
   * Recupera los datos de perfiles para el formulario llamando al servicio de esquema de certificación.
   * Se suscribe al observable retornado por `getConsultaPerfiles`, procesa la respuesta
   * y actualiza el estado del formulario usando `estadoFormularioPerfiles`.
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite.
   */
  public getPerfilesFormulario(): void {
    this.esquemaCertificacionSvc.getConsultaPerfiles().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.esquemaCertificacionSvc.estadoFormularioPerfiles(DATOS);
    })
  }

  /**
   * Recupera los datos de perfiles para el formulario Accodiane y actualiza el estado del formulario.
   * 
   * Este método llama a `getPrefilesConsultaAccodiane` del servicio de esquema de certificación,
   * se suscribe al observable y recorre las entradas de la respuesta. Por cada entrada,
   * actualiza el estado del formulario usando `actualizarEstadoFormulario`.
   * 
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite.
   */
  public getPerfilesAccodianeFormulario(): void {
    this.esquemaCertificacionSvc.getPrefilesConsultaAccodiane().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      Object.entries(response).forEach(([key, value]) => {
          this.esquemaCertificacionSvc.actualizarEstadoFormulario(key, value);
      });
    })
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a los suscriptores y limpiar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
