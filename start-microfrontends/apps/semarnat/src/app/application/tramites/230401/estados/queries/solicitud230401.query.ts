import { Query, StoreConfig } from "@datorama/akita";
import { Solicitud230401State, Tramite230401Store } from "../tramite230401.store";
import { Injectable } from "@angular/core";

/**
 * Clase que representa las consultas relacionadas con el estado de la solicitud 230401.
 * 
 * Utiliza la librería Akita para acceder de manera reactiva y estructurada a diferentes partes del estado.
 * Se define como inyectable a nivel raíz para asegurar una única instancia en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'solicitud230401', resettable: true })
export class Solicitud230401Query extends Query<Solicitud230401State> {

  /**
   * Constructor de la clase Solicitud230401Query.
   * 
   * Inicializa la consulta a partir del store correspondiente al trámite 230401,
   * permitiendo realizar selecciones reactivas del estado.
   *
   * @param store - Instancia del almacén `Tramite230401Store` que contiene el estado de la solicitud.
   */
  constructor(
    protected override store: Tramite230401Store
  ) {
    super(store);
  }

  /**
   * Observable que emite el estado completo de la solicitud.
   * 
   * Permite a los componentes suscribirse para recibir actualizaciones
   * cuando cualquier parte del estado de la solicitud cambie.
   *
   * @type {Observable<Solicitud230401State>}
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable que emite únicamente el estado relacionado con el pago de derechos.
   * 
   * Se utiliza para observar y reaccionar a cambios específicos en los datos
   * correspondientes a la sección de pagos dentro de la solicitud.
   *
   * @type {Observable<any>} // Reemplazar 'any' con el tipo específico si está disponible.
   */
  seletPagoDerechosState$ = this.select((state) => {
    return state.pagoDerechosState;
  });
}
