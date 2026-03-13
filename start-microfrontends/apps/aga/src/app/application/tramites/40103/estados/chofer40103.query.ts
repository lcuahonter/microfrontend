import {
  Chofer40103Store,
  Choferesnacionales40103State,
} from './chofer40103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Chofer40103Query extends Query<Choferesnacionales40103State> {
  constructor(protected override store: Chofer40103Store) {
    super(store);
  }

    /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });


  // /**
  //  * Observable que selecciona la lista de choferes nacionales.
  //  */
  // getChoferes$ = this.select((state) => state.choferes);

  // /**
  //  * Observable que selecciona la lista de choferes extranjeros.
  //  */
  // getchoferesextranjero$ = this.select((state) => state.choferesExtranjero);

  // /**
  //  * Observable que selecciona la lista de vehículos.
  //  */
  // getvehiculos$ = this.select((state) => state.vehiculos);

  // /**
  //  * Observable que selecciona la lista de unidades de arrastre.
  //  */
  // getUnidadesdeArrastre$ = this.select((state) => state.unidadesDeArrastre);

  /**
   * Observable que selecciona el estado completo de la sección.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  // /**
  //  * Obtiene la lista de choferes nacionales.
  //  * @returns La lista de choferes nacionales.
  //  */
  // getChoferes(): Chofer[] {
  //   return this.getValue().choferes;
  // }

  // /**
  //  * Obtiene la lista de choferes extranjeros.
  //  * @returns La lista de choferes extranjeros.
  //  */
  // getchoferesextranjero(): Chofer[] {
  //   return this.getValue().choferesExtranjero;
  // }

  // /**
  //  * Obtiene la lista de vehículos.
  //  * @returns La lista de vehículos.
  //  */
  // getvehiculos(): string[] {
  //   return this.getValue().vehiculos;
  // }

  // /**
  //  * Obtiene la lista de unidades de arrastre.
  //  * @returns La lista de unidades de arrastre.
  //  */
  // getunidadesdearrastre(): string[] {
  //   return this.getValue().unidadesDeArrastre;
  // }

   /**
   * Observable que selecciona la lista de pago de derechos.
   */
   getdatosDelChoferNacional$ = this.select((state) => state.datosDelChoferNacionalAlta);


   /**
    * Obtiene la lista de pago de derechos.
    * @returns La lista de pago de derechos.
    */
  
}