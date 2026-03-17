import { Tramite260205State, Tramite260205Store } from '../stores/tramite260205.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @Injectable
 * Proporciona la configuración de inyección de dependencias para la clase `Tramite260205Query`.
 * Esta clase extiende la funcionalidad de `Query` para gestionar el estado de la solicitud 
 * en el contexto de la aplicación.
 * 
 * @providedIn 'root' - Indica que este servicio está disponible en el nivel raíz de la aplicación,
 * lo que significa que se compartirá una única instancia en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260205Query extends Query<Tramite260205State> {

  /**
   * Constructor de la clase que inicializa el store específico para Tramite260205.
   * 
   * @param store - Instancia del `Tramite260205Store` que se utiliza para gestionar el estado de la aplicación.
   * 
   * Este constructor utiliza la palabra clave `super` para llamar al constructor de la clase base,
   * asegurando que el store proporcionado se pase correctamente y se inicialice en la clase base.
   */
  constructor(protected override store: Tramite260205Store) {
    super(store);
  }

  /**
   * Obtiene un observable que selecciona el estado del trámite desde el store.
   * 
   * Este observable emite el estado actual del trámite, permitiendo a los componentes
   * suscribirse a los cambios en el estado del trámite.
   * 
   * @returns Un observable que emite el estado del trámite.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * Obtiene un observable que selecciona los datos de la tabla de fabricantes desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `fabricanteTablaDatos` del estado,
   * permitiendo suscribirse a los cambios en los datos de la tabla de fabricantes.
   * 
   * @returns Un observable que emite los datos de la tabla de fabricantes.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * Obtiene un observable que selecciona los datos de la tabla de destinatarios finales desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `destinatarioFinalTablaDatos` del estado,
   * permitiendo suscribirse a los cambios en los datos de la tabla de destinatarios finales.
   * 
   * @returns Un observable que emite los datos de la tabla de destinatarios finales.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Obtiene un observable que selecciona los datos de la tabla de proveedores desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `proveedorTablaDatos` del estado,
   * permitiendo suscribirse a los cambios en los datos de la tabla de proveedores.
   * 
   * @returns Un observable que emite los datos de la tabla de proveedores.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );
  
  /**
   * Obtiene un observable que selecciona los datos de la tabla de facturadores desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `facturadorTablaDatos` del estado,
   * permitiendo suscribirse a los cambios en los datos de la tabla de facturadores.
   * 
   * @returns Un observable que emite los datos de la tabla de facturadores.
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );

  /**
   * Obtiene un observable que selecciona el índice previo de la ruta desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `indice` del estado,
   * permitiendo suscribirse a los cambios en el índice previo de la ruta.
   * 
   * @returns Un observable que emite el índice previo de la ruta.
   */
  public indicePrevioRuta$ = this.select((state) => state.indice);
}
