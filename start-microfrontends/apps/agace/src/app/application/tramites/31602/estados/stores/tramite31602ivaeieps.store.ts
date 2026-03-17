import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de DatosComunes.
 */
export interface Solicitud31602IvaeiepsState {
  
  /**
   * El valor de indiqueCheck.
   */
  indiqueCheck: boolean;
  
  /**
   * El valor de resigtro.
   */
  resigtro: string;
  
  /**
   * El valor de telefono.
   */
  telefono: string;
  
  /**
   * El valor de correo.
   */
  correo: string;
  
  /**
   * El valor de manifieste.
   */
  manifieste: string;
  
  /**
   * El valor de indiqueIva.
   */
  indiqueIva: string;
  
  /**
   * El valor de empleados.
   */
  empleados: boolean;
  
  /**
   * El valor de infraestructura.
   */
  infraestructura: boolean;
  
  /**
   * El valor de monto.
   */
  monto: boolean;
  
  /**
   * El valor de antiguedad.
   */
  antiguedad: boolean;
  
  /**
   * El valor de tipoDe.
   */
  tipoDe: string;
  
  /**
   * El valor de valorPesos.
   */
  valorPesos: string;
  
  /**
   * El valor de descripcion.
   */
  descripcion: string;
  
  /**
   * El valor de haContado.
   */
  haContado: string;
  
  /**
   * El valor de enCasoIva.
   */
  enCasoIva: string;
  
  /**
   * El valor de numeroOperacion.
   */
  numeroOperacion: string;
  
  /**
   * El valor de banco.
   */
  banco: string;
  
  /**
   * El valor de llavePago.
   */
  llavePago: string;
  
  /**
   * El valor de importaciones.
   */
  importaciones: string;
  
  /**
   * El valor de infraestructuraIndique.
   */
  infraestructuraIndique: string;
  
  /**
   * El valor de ultimosMeses.
   */
  ultimosMeses: string;
  
  /**
   * El valor de operacionesmeses.
   */
  operacionesmeses: string;
  
  /**
   * El valor de valor.
   */
  valor: string;
  
  /**
   * El valor de transferencias.
   */
  transferencias: number;
  
  /**
   * El valor de transferenciasVir.
   */
  transferenciasVir: number;
  
  /**
   * El valor de retornos.
   */
  retornos: number;
  
  /**
   * El valor de retornosSe.
   */
  retornosSe: number;
  
  /**
   * El valor de constancias.
   */
  constancias: number;
  
  /**
   * El valor de constanciasDe.
   */
  constanciasDe: number;
  
  /**
   * El valor de empleadosPropios.
   */
  empleadosPropios: string;
  
  /**
   * El valor de numeroEmpleados.
   */
  numeroEmpleados: number;
  
  /**
   * El valor de numeroEmpleadosDos.
   */
  numeroEmpleadosDos: number;
  
  /**
   * El valor de numeroEmpleadosTres.
   */
  numeroEmpleadosTres: number;
  
  /**
   * El valor de comboBimestresUno.
   */
  comboBimestresUno: string;
  
  /**
   * El valor de comboBimestresDos.
   */
  comboBimestresDos: string;
  
  /**
   * El valor de comboBimestresTres.
   */
  comboBimestresTres: string;
  
  /**
   * El valor de proveedorCumplimiento.
   */
  proveedorCumplimiento: string;
  
  /**
   * El valor de declaracionISR.
   */
  declaracionISR: string;
  
  /**
   * El valor de cancelacion.
   */
  cancelacion: string;
  
  /**
   * El valor de cumplimientoReglas.
   */
  cumplimientoReglas: string;
  
  /**
   * El valor de recintoFiscalizado.
   */
  recintoFiscalizado: string;
  
  /**
   * El valor de recintoEstrategico.
   */
  recintoEstrategico: string;
  
  /**
   * El valor de cumplimientoLineamientos.
   */
  cumplimientoLineamientos: string;
    /**
   * El valor de total.
   */
  total: string;
  /**
   * El valor de totalDos.
   */
  totalDos: string;
    /**
     * El valor de conEmpleados.
     */
  conEmpleados: string;
    /**
     * El valor de indiqueSiLosSocios.
     */
  indiqueSiLosSocios: string;

}

export function createInitialState(): Solicitud31602IvaeiepsState {
  return {
     
     /**
      * El valor de indiqueCheck.
      */
     indiqueCheck: false,
     
     /**
      * El valor de resigtro.
      */
     resigtro: '',
     
     /**
      * El valor de telefono.
      */
     telefono: '',
     
     /**
      * El valor de correo.
      */
     correo: '',
     
     /**
      * El valor de manifieste.
      */
     manifieste: '',
     
     /**
      * El valor de indiqueIva.
      */
     indiqueIva: '',
     
     /**
      * El valor de empleados.
      */
     empleados: false,
     
     /**
      * El valor de infraestructura.
      */
     infraestructura: false,
     
     /**
      * El valor de monto.
      */
     monto: false,
     
     /**
      * El valor de antiguedad.
      */
     antiguedad: false,
     
     /**
      * El valor de tipoDe.
      */
     tipoDe: '',
     
     /**
      * El valor de valorPesos.
      */
     valorPesos: '',
     
     /**
      * El valor de descripcion.
      */
     descripcion: '',
     
     /**
      * El valor de haContado.
      */
     haContado: '',
     
     /**
      * El valor de enCasoIva.
      */
     enCasoIva: '',
     
     /**
      * El valor de numeroOperacion.
      */
     numeroOperacion: '',
     
     /**
      * El valor de banco.
      */
     banco: '',
     
     /**
      * El valor de llavePago.
      */
     llavePago: '',
     
     /**
      * El valor de importaciones.
      */
     importaciones: '',
     
     /**
      * El valor de infraestructuraIndique.
      */
     infraestructuraIndique: '',
     
     /**
      * El valor de ultimosMeses.
      */
     ultimosMeses: '',
     
     /**
      * El valor de operacionesmeses.
      */
     operacionesmeses: '',
     
     /**
      * El valor de valor.
      */
     valor: '',
     
     /**
      * El valor de transferencias.
      */
     transferencias: 0,
     
     /**
      * El valor de transferenciasVir.
      */
     transferenciasVir: 0,
     
     /**
      * El valor de retornos.
      */
     retornos: 0,
     
     /**
      * El valor de retornosSe.
      */
     retornosSe: 0,
     
     /**
      * El valor de constancias.
      */
     constancias: 0,
     
     /**
      * El valor de constanciasDe.
      */
     constanciasDe: 0,
     
     /**
      * El valor de empleadosPropios.
      */
     empleadosPropios: '',
     
     /**
      * El valor de numeroEmpleados.
      */
     numeroEmpleados: 1,
     
     /**
      * El valor de numeroEmpleadosDos.
      */
     numeroEmpleadosDos: 1,
     
     /**
      * El valor de numeroEmpleadosTres.
      */
     numeroEmpleadosTres: 1,
     
     /**
      * El valor de comboBimestresUno.
      */
     comboBimestresUno: '',
     
     /**
      * El valor de comboBimestresDos.
      */
     comboBimestresDos: '',
     
     /**
      * El valor de comboBimestresTres.
      */
     comboBimestresTres: '',
     
     /**
      * El valor de proveedorCumplimiento.
      */
     proveedorCumplimiento: '',
     
     /**
      * El valor de declaracionISR.
      */
     declaracionISR: '',
     
     /**
      * El valor de cancelacion.
      */
     cancelacion: '',
     
     /**
      * El valor de cumplimientoReglas.
      */
     cumplimientoReglas: '',
     
     /**
      * El valor de recintoFiscalizado.
      */
     recintoFiscalizado: '',
     
     /**
      * El valor de recintoEstrategico.
      */
     recintoEstrategico: '',
     
     /**
      * El valor de cumplimientoLineamientos.
      */
     cumplimientoLineamientos: '',
        /**
        * El valor de total.
        */
        total: '',
        /**
        * El valor de totalDos.
        */
        totalDos: '',
        /**
         * El valor de conEmpleados.
         */
        conEmpleados: '',
        /**
         * El valor de indiqueSiLosSocios.
         */
        indiqueSiLosSocios: ''

  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud31602IvaeiepsState', resettable: true })
export class Tramite31602IvaeiepsStore extends Store<Solicitud31602IvaeiepsState> {
    /**
     * Crea una instancia de DatosComunesStore.
     * Inicializa la tienda con el estado inicial.
     */
  constructor() {
    super(createInitialState());
  }

/**
 * Establece el estado de indiqueCheck.
 * @param indiqueCheck - El valor de indiqueCheck.
 */
public setIndiqueCheck(indiqueCheck: boolean):void{
    this.update((state) => ({
        ...state,
        indiqueCheck,
    }));
}

/**
 * Establece el estado de resigtro.
 * @param resigtro - El valor de resigtro.
 */
public setResigtro(resigtro: string):void {
    this.update((state) => ({
        ...state,
        resigtro,
    }));
}

/**
 * Establece el estado de telefono.
 * @param telefono - El valor de telefono.
 */
public setTelefono(telefono: string):void {
    this.update((state) => ({
        ...state,
        telefono,
    }));
}

/**
 * Establece el estado de correo.
 * @param correo - El valor de correo.
 */
public setCorreo(correo: string):void {
    this.update((state) => ({
        ...state,
        correo,
    }));
}

/**
 * Establece el estado de manifieste.
 * @param manifieste - El valor de manifieste.
 */
public setManifieste(manifieste: string):void {
    this.update((state) => ({
        ...state,
        manifieste,
    }));
}

/**
 * Establece el estado de indiqueIva.
 * @param indiqueIva - El valor de indiqueIva.
 */
public setIndiqueIva(indiqueIva: string):void {
    this.update((state) => ({
        ...state,
        indiqueIva,
    }));
}

/**
 * Establece el estado de empleados.
 * @param empleados - El valor de empleados.
 */
public setEmpleados(empleados: boolean):void {
    this.update((state) => ({
        ...state,
        empleados,
    }));
}

/**
 * Establece el estado de infraestructura.
 * @param infraestructura - El valor de infraestructura.
 */
public setInfraestructura(infraestructura: boolean):void{
    this.update((state) => ({
        ...state,
        infraestructura,
    }));
}

/**
 * Establece el estado de monto.
 * @param monto - El valor de monto.
 */
public setMonto(monto: boolean):void {
    this.update((state) => ({
        ...state,
        monto,
    }));
}

/**
 * Establece el estado de antiguedad.
 * @param antiguedad - El valor de antiguedad.
 */
public setAntiguedad(antiguedad: boolean):void{
    this.update((state) => ({
        ...state,
        antiguedad,
    }));
}

/**
 * Establece el estado de tipoDe.
 * @param tipoDe - El valor de tipoDe.
 */
public setTipoDe(tipoDe: string):void {
    this.update((state) => ({
        ...state,
        tipoDe,
    }));
}

/**
 * Establece el estado de valorPesos.
 * @param valorPesos - El valor de valorPesos.
 */
public setValorPesos(valorPesos: string):void {
    this.update((state) => ({
        ...state,
        valorPesos,
    }));
}

/**
 * Establece el estado de descripcion.
 * @param descripcion - El valor de descripcion.
 */
public setDescripcion(descripcion: string):void {
    this.update((state) => ({
        ...state,
        descripcion,
    }));
}

/**
 * Establece el estado de haContado.
 * @param haContado - El valor de haContado.
 */
public setHaContado(haContado: string):void{
    this.update((state) => ({
        ...state,
        haContado,
    }));
}

/**
 * Establece el estado de enCasoIva.
 * @param enCasoIva - El valor de enCasoIva.
 */
public setEnCasoIva(enCasoIva: string):void {
    this.update((state) => ({
        ...state,
        enCasoIva,
    }));
}

/**
 * Establece el estado de numeroOperacion.
 * @param numeroOperacion - El valor de numeroOperacion.
 */
public setNumeroOperacion(numeroOperacion: string):void {
    this.update((state) => ({
        ...state,
        numeroOperacion,
    }));
}

/**
 * Establece el estado de banco.
 * @param banco - El valor de banco.
 */
public setBanco(banco: string):void {
    this.update((state) => ({
        ...state,
        banco,
    }));
}

/**
 * Establece el estado de llavePago.
 * @param llavePago - El valor de llavePago.
 */
public setLlavePago(llavePago: string):void {
    this.update((state) => ({
        ...state,
        llavePago,
    }));
}

/**
 * Establece el estado de importaciones.
 * @param importaciones - El valor de importaciones.
 */
public setImportaciones(importaciones: string):void{
    this.update((state) => ({
        ...state,
        importaciones,
    }));
}

/**
 * Establece el estado de infraestructuraIndique.
 * @param infraestructuraIndique - El valor de infraestructuraIndique.
 */
public setInfraestructuraIndique(infraestructuraIndique: string):void {
    this.update((state) => ({
        ...state,
        infraestructuraIndique,
    }));
}

/**
 * Establece el estado de ultimosMeses.
 * @param ultimosMeses - El valor de ultimosMeses.
 */
public setUltimosMeses(ultimosMeses: string):void {
    this.update((state) => ({
        ...state,
        ultimosMeses,
    }));
}

/**
 * Establece el estado de operacionesmeses.
 * @param operacionesmeses - El valor de operacionesmeses.
 */
public setOperacionesmeses(operacionesmeses: string):void {
    this.update((state) => ({
        ...state,
        operacionesmeses,
    }));
}

/**
 * Establece el estado de valor.
 * @param valor - El valor de valor.
 */
public setValor(valor: string):void {
    this.update((state) => ({
        ...state,
        valor,
    }));
}

/**
 * Establece el estado de transferencias.
 * @param transferencias - El valor de transferencias.
 */
public setTransferencias(transferencias: number):void {
    this.update((state) => ({
        ...state,
        transferencias,
    }));
}

/**
 * Establece el estado de transferenciasVir.
 * @param transferenciasVir - El valor de transferenciasVir.
 */
public setTransferenciasVir(transferenciasVir: number):void {
    this.update((state) => ({
        ...state,
        transferenciasVir,
    }));
}

/**
 * Establece el estado de retornos.
 * @param retornos - El valor de retornos.
 */
public setRetornos(retornos: number):void {
    this.update((state) => ({
        ...state,
        retornos,
    }));
}

/**
 * Establece el estado de retornosSe.
 * @param retornosSe - El valor de retornosSe.
 */
public setRetornosSe(retornosSe: number):void {
    this.update((state) => ({
        ...state,
        retornosSe,
    }));
}

/**
 * Establece el estado de constancias.
 * @param constancias - El valor de constancias.
 */
public setConstancias(constancias: number):void {
    this.update((state) => ({
        ...state,
        constancias,
    }));
}

/**
 * Establece el estado de constanciasDe.
 * @param constanciasDe - El valor de constanciasDe.
 */
public setConstanciasDe(constanciasDe: number):void {
    this.update((state) => ({
        ...state,
        constanciasDe,
    }));
}

/**
 * Establece el estado de empleadosPropios.
 * @param empleadosPropios - El valor de empleadosPropios.
 */
public setEmpleadosPropios(empleadosPropios: string):void {
    this.update((state) => ({
        ...state,
        empleadosPropios,
    }));
}

/**
* Establece el estado de numeroEmpleados.
* @param numeroEmpleados - El valor de numeroEmpleados.
*/
public setNumeroEmpleados(numeroEmpleados: number):void {
this.update((state) => ({
    ...state,
    numeroEmpleados,
}));
}

/**
* Establece el estado de numeroEmpleadosDos.
* @param numeroEmpleadosDos - El valor de numeroEmpleadosDos.
*/
public setNumeroEmpleadosDos(numeroEmpleadosDos: number):void{
this.update((state) => ({
    ...state,
    numeroEmpleadosDos,
}));
}

/**
* Establece el estado de numeroEmpleadosTres.
* @param numeroEmpleadosTres - El valor de numeroEmpleadosTres.
*/
public setNumeroEmpleadosTres(numeroEmpleadosTres: number):void {
this.update((state) => ({
    ...state,
    numeroEmpleadosTres,
}));
}

/**
* Establece el estado de comboBimestresUno.
* @param comboBimestresUno - El valor de comboBimestresUno.
*/
public setComboBimestresUno(comboBimestresUno: string):void {
this.update((state) => ({
    ...state,
    comboBimestresUno,
}));
}

/**
* Establece el estado de comboBimestresDos.
* @param comboBimestresDos - El valor de comboBimestresDos.
*/
public setComboBimestresDos(comboBimestresDos: string):void{
this.update((state) => ({
    ...state,
    comboBimestresDos,
}));
}

/**
* Establece el estado de comboBimestresTres.
* @param comboBimestresTres - El valor de comboBimestresTres.
*/
public setComboBimestresTres(comboBimestresTres: string):void {
this.update((state) => ({
    ...state,
    comboBimestresTres,
}));
}

/**
* Establece el estado de proveedorCumplimiento.
* @param proveedorCumplimiento - El valor de proveedorCumplimiento.
*/
public setProveedorCumplimiento(proveedorCumplimiento: string):void{
this.update((state) => ({
    ...state,
    proveedorCumplimiento,
}));
}

/**
* Establece el estado de declaracionISR.
* @param declaracionISR - El valor de declaracionISR.
*/
public setDeclaracionISR(declaracionISR: string):void{
this.update((state) => ({
    ...state,
    declaracionISR,
}));
}

/**
* Establece el estado de cancelacion.
* @param cancelacion - El valor de cancelacion.
*/
public setCancelacion(cancelacion: string):void {
this.update((state) => ({
    ...state,
    cancelacion,
}));
}

/**
* Establece el estado de cumplimientoReglas.
* @param cumplimientoReglas - El valor de cumplimientoReglas.
*/
public setCumplimientoReglas(cumplimientoReglas: string):void {
this.update((state) => ({
    ...state,
    cumplimientoReglas,
}));
}

/**
* Establece el estado de recintoFiscalizado.
* @param recintoFiscalizado - El valor de recintoFiscalizado.
*/
public setRecintoFiscalizado(recintoFiscalizado: string):void{
this.update((state) => ({
    ...state,
    recintoFiscalizado,
}));
}

/**
* Establece el estado de recintoEstrategico.
* @param recintoEstrategico - El valor de recintoEstrategico.
*/
public setRecintoEstrategico(recintoEstrategico: string):void {
this.update((state) => ({
    ...state,
    recintoEstrategico,
}));
}

/**
* Establece el estado de cumplimientoLineamientos.
* @param cumplimientoLineamientos - El valor de cumplimientoLineamientos.
*/
public setCumplimientoLineamientos(cumplimientoLineamientos: string):void{
this.update((state) => ({
    ...state,
    cumplimientoLineamientos,
}));
}

/**
* Establece el estado de total.
* @param total - El valor de total.
*/
    public setTotal(total: string):void{
        this.update((state) => ({
        ...state,
        total,
        }));
    }
    /**
     * Establece el estado de totalDos.
     * @param totalDos - El valor de totalDos.
     */
    public setTotalDos(totalDos: string):void {
        this.update((state) => ({
        ...state,
        totalDos,
        }));
    }
    /**
     * Establece el estado de conEmpleados.
     * @param conEmpleados - El valor de conEmpleados.
     */
    public setConEmpleados(conEmpleados: string):void{
        this.update((state) => ({
        ...state,
        conEmpleados,
        }));
    }
    /**
     * Establece el estado de indiqueSiLosSocios.
     * @param indiqueSiLosSocios - El valor de indiqueSiLosSocios.
     */
    public setIndiqueSiLosSocios(indiqueSiLosSocios: string):void {
        this.update((state) => ({
        ...state,
        indiqueSiLosSocios,
        }));
    }
  
}
