import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de DatosComunes.
 */
export interface DatosComunesState {
  
  /**
     * El valor de autorizacionIVAIEPS.
     */
  autorizacionIVAIEPS: string;
    
  /**
   * El valor de regimenUno.
   */
  regimenUno: boolean;
  
  /**
   * El valor de regimenDos.
   */
  regimenDos: boolean;
  
  /**
   * El valor de regimenTres.
   */
  regimenTres: boolean;

  /**
   * El valor de regimenCuatro.
   */
  regimenCuatro: boolean;
  
  /**
   * El valor de sectorProductivo.
   */
  sectorProductivo: string;
  
  /**
   * El valor de servicio.
   */
  servicio: string;
  
  /**
   * El valor de preOperativo.
   */
  preOperativo: boolean;
  
  /**
   * El valor de indiqueSi.
   */
  indiqueSi: boolean;
  
  /**
   * El valor de senale.
   */
  senale: boolean;
  
  /**
   * El valor de empPropios.
   */
  empPropios: string;
  
  /**
   * El valor de bimestre.
   */
  bimestre: string;
  
  /**
   * El valor de senaleSi.
   */
  senaleSi: boolean;
  
  /**
   * El valor de seMomento.
   */
  seMomento: boolean;
  
  /**
   * El valor de cumplir.
   */
  cumplir: boolean;
  
  /**
   * El valor de indique.
   */
  indique: boolean;
  
  /**
   * El valor de encuentra.
   */
  encuentra: boolean;
  
  /**
   * El valor de delMismo.
   */
  delMismo: boolean;
  
  /**
   * El valor de senaleMomento.
   */
  senaleMomento: boolean;
  
  /**
   * El valor de enCaso.
   */
  enCaso: boolean;
  
  /**
   * El valor de comboBimestresIDCSeleccione.
   */
  comboBimestresIDCSeleccione: string;
  
  /**
   * El valor de ingresar.
   */
  ingresar: boolean;
  
  /**
   * El valor de encuentraSus.
   */
  encuentraSus: boolean;
  
  /**
   * El valor de registrosQue.
   */
  registrosQue: string;
  
  /**
   * El valor de registrosQue2.
   */
  registrosQue2: string;
   /**
   * El valor de registrosQue3.
   */
  registrosQue3: string;
  
  /**
   * El valor de momentoIngresar.
   */
  momentoIngresar: boolean;
  
  /**
   * El valor de indiqueCuenta.
   */
  indiqueCuenta: boolean;
  
  /**
   * El valor de nombreDel.
   */
  nombreDel: string;
  
  /**
   * El valor de lugarDeRadicacion.
   */
  lugarDeRadicacion: string;
  
  /**
   * El valor de contabilidad.
   */
  contabilidad: boolean;
  
  /**
   * El valor de rmfRadio.
   */
  rmfRadio: boolean;
  
  /**
   * El valor de vinculacionRegistroCancelado.
   */
  vinculacionRegistroCancelado: boolean;
  
  /**
   * El valor de proveedoresListadoSAT.
   */
  proveedoresListadoSAT: boolean;
  /**
   * El valor de indiqueCheck.
   */
  indiqueCheck: string;
    /**
     * El valor de manifestado.
     */
  manifestado: boolean;
    /**
     * El valor de protesta.
     */
    protesta: boolean;
   /**
    * El valor de cumpleCon.
    */
   cumpleCon: string;
    /**
     * El valor de acreditaRealizar.
     */
  acreditaRealizar: string;
    /**
     * El valor de ensucaso.
     */
  ensucaso: string;
    /**
     * El valor de alMomento.
     */
  alMomento: string;
    /**
     * El valor de delMismomodo.
     */
  delMismomodo: string;
    /**
     * El valor de susCertificados.
     */
  susCertificados: string;
    /**
     * El valor de afirmativo.
     */
  afirmativo: string;
    /**
     * El valor de actualizado.
     */
  actualizado: string;
    /**
     * El valor de cumpleConDos.
     */
  cumpleConDos: string;

}

export function createInitialState(): DatosComunesState {
  return {
     /**
   * El valor de autorizacionIVAIEPS.
   */
     autorizacionIVAIEPS: '',
  
     /**
      * El valor de regimenUno.
      */
     regimenUno: false,
     
     /**
      * El valor de regimenDos.
      */
     regimenDos: false,
     
     /**
      * El valor de regimenTres.
      */
     regimenTres: false,

      /**
      * El valor de regimenCuatro.
      */
     regimenCuatro: false,
     
     /**
      * El valor de sectorProductivo.
      */
     sectorProductivo: '',
     
     /**
      * El valor de servicio.
      */
     servicio: '',
     
     /**
      * El valor de preOperativo.
      */
     preOperativo: false,
     
     /**
      * El valor de indiqueSi.
      */
     indiqueSi: false,
     
     /**
      * El valor de senale.
      */
     senale: false,
     
     /**
      * El valor de empPropios.
      */
     empPropios: '',
     
     /**
      * El valor de bimestre.
      */
     bimestre: '',
     
     /**
      * El valor de senaleSi.
      */
     senaleSi: false,
     
     /**
      * El valor de seMomento.
      */
     seMomento: false,
     
     /**
      * El valor de cumplir.
      */
     cumplir: false,
     
     /**
      * El valor de indique.
      */
     indique: false,
     
     /**
      * El valor de encuentra.
      */
     encuentra: false,
     
     /**
      * El valor de delMismo.
      */
     delMismo: false,
     
     /**
      * El valor de senaleMomento.
      */
     senaleMomento: false,
     
     /**
      * El valor de enCaso.
      */
     enCaso: false,
     
     /**
      * El valor de comboBimestresIDCSeleccione.
      */
     comboBimestresIDCSeleccione: '',
     
     /**
      * El valor de ingresar.
      */
     ingresar: false,
     
     /**
      * El valor de encuentraSus.
      */
     encuentraSus: false,
     
     /**
      * El valor de registrosQue.
      */
     registrosQue: '',
     
     /**
      * El valor de registrosQue2.
      */
     registrosQue2: '',

      /**
      * El valor de registrosQue3.
      */
     registrosQue3: '',
     
     /**
      * El valor de momentoIngresar.
      */
     momentoIngresar: false,
     
     /**
      * El valor de indiqueCuenta.
      */
     indiqueCuenta: false,
     
     /**
      * El valor de nombreDel.
      */
     nombreDel: '',
     
     /**
      * El valor de lugarDeRadicacion.
      */
     lugarDeRadicacion: '',
     
     /**
      * El valor de contabilidad.
      */
     contabilidad: false,
     
     /**
      * El valor de rmfRadio.
      */
     rmfRadio: false,
     
     /**
      * El valor de vinculacionRegistroCancelado.
      */
     vinculacionRegistroCancelado: false,
     
     /**
      * El valor de proveedoresListadoSAT.
      */
         proveedoresListadoSAT: false,
         /**
      * El valor de indiqueCheck.
      */
        indiqueCheck: '',
        /**
         * El valor de manifestado.
         */
        manifestado: false,
        /**
         * El valor de protesta.
         */
        protesta: false,
        /**
         * El valor de cumpleCon.
         */
        cumpleCon: '',
        /**
         * El valor de acreditaRealizar.
         */
        acreditaRealizar: '',
        /**
         * El valor de ensucaso.
         */
        ensucaso: '',
        /**
         * El valor de alMomento.
         */
        alMomento: '',
        /**
         * El valor de delMismomodo.
         */
        delMismomodo: '',
        /**
         * El valor de susCertificados.
         */
        susCertificados: '',
        /**
         * El valor de afirmativo.
         */
        afirmativo: '',
        /**
         * El valor de actualizado.
         */
        actualizado: '',
    /**
     * El valor de cumpleConDos.
     */
    cumpleConDos: '',
      };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'datosComunesState', resettable: true })
export class DatosComunesStore extends Store<DatosComunesState> {
    /**
     * Crea una instancia de DatosComunesStore.
     * Inicializa la tienda con el estado inicial.
     */
  constructor() {
    super(createInitialState());
  }

   /**
     * Establece el estado de autorizacionIVAIEPS.
     * @param autorizacionIVAIEPS - El valor de autorizacionIVAIEPS.
     */
   public setAutorizacionIVAIEPS(autorizacionIVAIEPS: string): void {
    this.update((state) => ({
        ...state,
        autorizacionIVAIEPS,
    }));
}

/**
 * Establece el estado de regimenUno.
 * @param regimenUno - El valor de regimenUno.
 */
public setRegimenUno(regimenUno: boolean): void {
    this.update((state) => ({
        ...state,
        regimenUno,
    }));
}

/**
 * Establece el estado de regimenDos.
 * @param regimenDos - El valor de regimenDos.
 */
public setRegimenDos(regimenDos: boolean): void {
    this.update((state) => ({
        ...state,
        regimenDos,
    }));
}

/**
 * Establece el estado de regimenTres.
 * @param regimenTres - El valor de regimenTres.
 */
public setRegimenTres(regimenTres: boolean): void {
    this.update((state) => ({
        ...state,
        regimenTres,
    }));
}

/**
 * Establece el estado de regimenCuatro.
 * @param regimenCuatro - El valor de regimenCuatro.
 */
public setRegimenCuatro(regimenCuatro: boolean): void {
    this.update((state) => ({
        ...state,
        regimenCuatro,
    }));
}

/**
 * Establece el estado de regimenTres.
 * @param regimenTres - El valor de regimenTres.
 */
public setregimenCuatro(regimenTres: boolean): void {
    this.update((state) => ({
        ...state,
        regimenTres,
    }));
}

/**
 * Establece el estado de sectorProductivo.
 * @param sectorProductivo - El valor de sectorProductivo.
 */
public setSectorProductivo(sectorProductivo: string): void {
    this.update((state) => ({
        ...state,
        sectorProductivo,
    }));
}

/**
 * Establece el estado de servicio.
 * @param servicio - El valor de servicio.
 */
public setServicio(servicio: string): void {
    this.update((state) => ({
        ...state,
        servicio,
    }));
}

/**
 * Establece el estado de preOperativo.
 * @param preOperativo - El valor de preOperativo.
 */
public setPreOperativo(preOperativo: boolean): void {
    this.update((state) => ({
        ...state,
        preOperativo,
    }));
}

/**
 * Establece el estado de indiqueSi.
 * @param indiqueSi - El valor de indiqueSi.
 */
public setIndiqueSi(indiqueSi: boolean): void {
    this.update((state) => ({
        ...state,
        indiqueSi,
    }));
}

/**
 * Establece el estado de senale.
 * @param senale - El valor de senale.
 */
public setSenale(senale: boolean): void {
    this.update((state) => ({
        ...state,
        senale,
    }));
}

/**
 * Establece el estado de empPropios.
 * @param empPropios - El valor de empPropios.
 */
public setEmpPropios(empPropios: string): void {
    this.update((state) => ({
        ...state,
        empPropios,
    }));
}

/**
 * Establece el estado de bimestre.
 * @param bimestre - El valor de bimestre.
 */
public setBimestre(bimestre: string): void {
    this.update((state) => ({
        ...state,
        bimestre,
    }));
}

/**
 * Establece el estado de senaleSi.
 * @param senaleSi - El valor de senaleSi.
 */
public setSenaleSi(senaleSi: boolean): void {
    this.update((state) => ({
        ...state,
        senaleSi,
    }));
}

/**
 * Establece el estado de seMomento.
 * @param seMomento - El valor de seMomento.
 */
public setSeMomento(seMomento: boolean): void {
    this.update((state) => ({
        ...state,
        seMomento,
    }));
}

/**
 * Establece el estado de cumplir.
 * @param cumplir - El valor de cumplir.
 */
public setCumplir(cumplir: boolean): void {
    this.update((state) => ({
        ...state,
        cumplir,
    }));
}

/**
 * Establece el estado de indique.
 * @param indique - El valor de indique.
 */
public setIndique(indique: boolean): void {
    this.update((state) => ({
        ...state,
        indique,
    }));
}

/**
 * Establece el estado de encuentra.
 * @param encuentra - El valor de encuentra.
 */
public setEncuentra(encuentra: boolean): void {
    this.update((state) => ({
        ...state,
        encuentra,
    }));
}

/**
 * Establece el estado de delMismo.
 * @param delMismo - El valor de delMismo.
 */
public setDelMismo(delMismo: boolean): void {
    this.update((state) => ({
        ...state,
        delMismo,
    }));
}

/**
 * Establece el estado de senaleMomento.
 * @param senaleMomento - El valor de senaleMomento.
 */
public setSenaleMomento(senaleMomento: boolean): void {
    this.update((state) => ({
        ...state,
        senaleMomento,
    }));
}

/**
 * Establece el estado de enCaso.
 * @param enCaso - El valor de enCaso.
 */
public setEnCaso(enCaso: boolean): void {
    this.update((state) => ({
        ...state,
        enCaso,
    }));
}

/**
 * Establece el estado de comboBimestresIDCSeleccione.
 * @param comboBimestresIDCSeleccione - El valor de comboBimestresIDCSeleccione.
 */
public setComboBimestresIDCSeleccione(comboBimestresIDCSeleccione: string): void {
    this.update((state) => ({
        ...state,
        comboBimestresIDCSeleccione,
    }));
}

/**
 * Establece el estado de ingresar.
 * @param ingresar - El valor de ingresar.
 */
public setIngresar(ingresar: boolean): void {
    this.update((state) => ({
        ...state,
        ingresar,
    }));
}

/**
 * Establece el estado de encuentraSus.
 * @param encuentraSus - El valor de encuentraSus.
 */
public setEncuentraSus(encuentraSus: boolean): void {
    this.update((state) => ({
        ...state,
        encuentraSus,
    }));
}

/**
 * Establece el estado de registrosQue.
 * @param registrosQue - El valor de registrosQue.
 */
public setRegistrosQue(registrosQue: string): void {
    this.update((state) => ({
        ...state,
        registrosQue,
    }));
}

/**
 * Establece el estado de registrosQue2.
 * @param registrosQue2 - El valor de registrosQue2.
 */
public setRegistrosQue2(registrosQue2: string): void {
    this.update((state) => ({
        ...state,
        registrosQue2,
    }));
}

/**
 * Establece el estado de registrosQue2.
 * @param registrosQue3 - El valor de registrosQue2.
 */
public setRegistrosQue3(registrosQue3: string): void {
    this.update((state) => ({
        ...state,
        registrosQue3,
    }));
}

/**
 * Establece el estado de momentoIngresar.
 * @param momentoIngresar - El valor de momentoIngresar.
 */
public setMomentoIngresar(momentoIngresar: boolean): void {
    this.update((state) => ({
        ...state,
        momentoIngresar,
    }));
}

/**
 * Establece el estado de indiqueCuenta.
 * @param indiqueCuenta - El valor de indiqueCuenta.
 */
public setIndiqueCuenta(indiqueCuenta: boolean): void {
    this.update((state) => ({
        ...state,
        indiqueCuenta,
    }));
}

/**
 * Establece el estado de nombreDel.
 * @param nombreDel - El valor de nombreDel.
 */
public setNombreDel(nombreDel: string): void {
    this.update((state) => ({
        ...state,
        nombreDel,
    }));
}

/**
 * Establece el estado de lugarDeRadicacion.
 * @param lugarDeRadicacion - El valor de lugarDeRadicacion.
 */
public setLugarDeRadicacion(lugarDeRadicacion: string): void {
    this.update((state) => ({
        ...state,
        lugarDeRadicacion,
    }));
}

/**
 * Establece el estado de contabilidad.
 * @param contabilidad - El valor de contabilidad.
 */
public setContabilidad(contabilidad: boolean): void {
    this.update((state) => ({
        ...state,
        contabilidad,
    }));
}

/**
 * Establece el estado de rmfRadio.
 * @param rmfRadio - El valor de rmfRadio.
 */
public setRmfRadio(rmfRadio: boolean): void {
    this.update((state) => ({
        ...state,
        rmfRadio,
    }));
}

/**
 * Establece el estado de vinculacionRegistroCancelado.
 * @param vinculacionRegistroCancelado - El valor de vinculacionRegistroCancelado.
 */
public setVinculacionRegistroCancelado(vinculacionRegistroCancelado: boolean): void {
    this.update((state) => ({
        ...state,
        vinculacionRegistroCancelado,
    }));
}

    /**
     * Establece el estado de proveedoresListadoSAT.
     * @param proveedoresListadoSAT - El valor de proveedoresListadoSAT.
     */
    public setProveedoresListadoSAT(proveedoresListadoSAT: boolean): void {
    this.update((state) => ({
        ...state,
        proveedoresListadoSAT,
    }));
    }
    /**
     * Establece el estado de indiqueCheck.
     * @param indiqueCheck - El valor de indiqueCheck.
     */
    public setIndiqueCheck(indiqueCheck: string): void {
        this.update((state) => ({
            ...state,
            indiqueCheck,
        }));
    }

    /**
     * Establece el estado de manifestado.
     * @param manifestado - El valor de manifestado.
     */
    public setManifestado(manifestado: boolean): void {
        this.update((state) => ({
            ...state,
            manifestado,
        }));
    }
    /**
     * Establece el estado de protesta.
     * @param protesta - El valor de protesta.
     */
    public setProtesta(protesta: boolean): void {
        this.update((state) => ({
            ...state,
            protesta,
        }));
    }
    /**
     * Establece el estado de cumpleCon.
     * @param cumpleCon - El valor de cumpleCon.
     */
    public setCumpleCon(cumpleCon: string): void {
        this.update((state) => ({
            ...state,
            cumpleCon,
        }));
    }
    /**
     * Establece el estado de acreditaRealizar.
     * @param acreditaRealizar - El valor de acreditaRealizar.
     */
    public setAcreditaRealizar(acreditaRealizar: string): void {
        this.update((state) => ({
            ...state,
            acreditaRealizar,
        }));
    }
    /**
     * Establece el estado de ensucaso.
     * @param ensucaso - El valor de ensucaso.
     */
    public setEnsucaso(ensucaso: string): void {
        this.update((state) => ({
            ...state,
            ensucaso,
        }));
    }
    /**
     * Establece el estado de alMomento.
     * @param alMomento - El valor de alMomento.
     */
    public setAlMomento(alMomento: string): void {
        this.update((state) => ({
            ...state,
            alMomento,
        }));
    }
    /**
     * Establece el estado de delMismomodo.
     * @param delMismomodo - El valor de delMismomodo.
     */
    public setDelMismomodo(delMismomodo: string): void {
        this.update((state) => ({
            ...state,
            delMismomodo,
        }));
    }
    /**
     * Establece el estado de susCertificados.
     * @param susCertificados - El valor de susCertificados.
     */
    public setSusCertificados(susCertificados: string): void {
        this.update((state) => ({
            ...state,
            susCertificados,
        }));
    }
    /**
     * Establece el estado de afirmativo.
     * @param afirmativo - El valor de afirmativo.
     */
    public setAfirmativo(afirmativo: string): void {
        this.update((state) => ({
            ...state,
            afirmativo,
        }));
    }
    /**
     * Establece el estado de actualizado.
     * @param actualizado - El valor de actualizado.
     */
    public setActualizado(actualizado: string): void {
        this.update((state) => ({
            ...state,
            actualizado,
        }));
    }

    /**
     * Establece el estado de cumpleConDos.
     * @param cumpleConDos - El valor de cumpleConDos.
     */
    public setCumpleConDos(cumpleConDos: string): void {
        this.update((state) => ({
            ...state,
            cumpleConDos,
        }));
    }

}
