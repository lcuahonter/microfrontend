import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud32615.
 */
export interface Solicitud32615State {
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
    preOperativo: string;
    /**
     * El valor de solicitudDeInspeccion.
     */
    solicitudDeInspeccion: string;
    /**
     * El valor de indiqueAutorizo.
     */
    indiqueAutorizo: string;
    /**
     * El valor de senaleCuentaEmpleados.
     */
    senaleCuentaEmpleados: string;
    /**
     * El valor de bimestre.
     */
    bimestre: string;
    /**
     * El valor de numeroDeEmpleados.
     */
    numeroDeEmpleados: string;
    /**
     * El valor de cumpleConLaObligacion.
     */
    cumpleConLaObligacion: string;
    /**
     * El valor de acreditaRealizar.
     */
    acreditaRealizar: string;
    /**
     * El valor de senaleSiAlMomento.
     */
    senaleSiAlMomento: string;
    /**
     * El valor de rfc.
     */
    rfc: string;
    /**
     * El valor de numeroDeEmpleadosForma.
     */
    numeroDeEmpleadosForma: string;
    /**
     * El valor de bimestreForma.
     */
    bimestreForma: string;
    /**
     * El valor de acreditaCumplir.
     */
    acreditaCumplir: string;
    /**
     * El valor de fraccionVI.
     */
    fraccionVI: string;
    /**
     * El valor de cuartoParrafoDelCff.
     */
    cuartoParrafoDelCff: string;
    /**
     * El valor de novenoParrafoDelCff.
     */
    novenoParrafoDelCff: string;
    /**
     * El valor de digitalesEstanVigentes.
     */
    digitalesEstanVigentes: string;
    /**
     * El valor de ultimosDoceMeses.
     */
    ultimosDoceMeses: string;
    /**
     * El valor de prestacionDeServicios.
     */
    prestacionDeServicios: string;
    /**
     * El valor de instalacionesPrincipales.
     */
    instalacionesPrincipales: string;
    /**
     * El valor de municipioAlcaldia.
     */
    municipioAlcaldia: string;
    /**
     * El valor de tipoDeInstalcion.
     */
    tipoDeInstalcion: string;
    /**
     * El valor de procesoProductivo.
     */
    procesoProductivo: string;
    /**
     * El valor de acreditacionDelUso.
     */
    acreditacionDelUso: string;
    /**
     * El valor de prefilMensajeria.
     */
    prefilMensajeria: string;
    /**
     * El valor de articuloDelCff.
     */
    articuloDelCff: string;
    /**
     * El valor de exportadoresSectorial.
     */
    exportadoresSectorial: string;
    /**
     * El valor de archivoNacionales.
     */
    archivoNacionales: string;
    /**
     * El valor de proveedores.
     */
    proveedores: string;
    /**
     * El valor de solicitudDeCertificacion.
     */
    solicitudDeCertificacion: string;
    /**
     * El valor de controlInventarios.
     */
    controlInventarios: string;
    /**
     * El valor de nombreDelSistema.
     */
    nombreDelSistema: string;
    /**
     * El valor de lugarDeRadicacion.
     */
    lugarDeRadicacion: string;
    /**
     * El valor de previstas.
     */
    previstas: string;
    /**
     * El valor de delCffLasReglas.
     */
    delCffLasReglas: string;
    /**
     * El valor de enSeCaracter.
     */
    enSeCaracter: string;
    /**
     * El valor de obligadoTributar.
     */
    obligadoTributar: string;
    /**
     * El valor de nacionalidad.
     */
    nacionalidad: string;
    /**
     * El valor de conformidad.
     */
    conformidad: string;
    /**
     * El valor de esquemaIntegralCertificacion.
     */
    esquemaIntegralCertificacion: string;
    /**
     * El valor de modificadasRevocadas.
     */
    modificadasRevocadas: string;
   
}
/**
 * Función para crear el estado inicial de Solicitud32615.
 * @returns {Solicitud32615State} El estado inicial de Solicitud32615.
 */
export function createInitialState(): Solicitud32615State {
    return {
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
        preOperativo: '',
        /**
         * El valor de solicitudDeInspeccion.
         */
        solicitudDeInspeccion: '',
        /**
         * El valor de indiqueAutorizo.
         */
        indiqueAutorizo: '',
        /**
         * El valor de senaleCuentaEmpleados.
         */
        senaleCuentaEmpleados: '',
        /**
         * El valor de bimestre.
         */
        bimestre: '',
        /**
         * El valor de numeroDeEmpleados.
         */
        numeroDeEmpleados: '',
        /**
         * El valor de cumpleConLaObligacion.
         */
        cumpleConLaObligacion: '',
        /**
         * El valor de acreditaRealizar.
         */
        acreditaRealizar: '',
        /**
         * El valor de senaleSiAlMomento.
         */
        senaleSiAlMomento: '',
        /**
         * El valor de rfc.
         */
        rfc: '',
        /**
         * El valor de numeroDeEmpleadosForma.
         */
        numeroDeEmpleadosForma: '',
        /**
         * El valor de bimestreForma.
         */
        bimestreForma: '',
        /**
         * El valor de acreditaCumplir.
         */
        acreditaCumplir: '',
        /**
         * El valor de fraccionVI.
         */
        fraccionVI: '',
        /**
         * El valor de cuartoParrafoDelCff.
         */
        cuartoParrafoDelCff: '',
        /**
         * El valor de novenoParrafoDelCff.
         */
        novenoParrafoDelCff: '',
        /**
         * El valor de digitalesEstanVigentes.
         */
        digitalesEstanVigentes: '',
        /**
         * El valor de ultimosDoceMeses.
         */
        ultimosDoceMeses: '',
        /**
         * El valor de prestacionDeServicios.
         */
        prestacionDeServicios: '',
        /**
         * El valor de instalacionesPrincipales.
         */
        instalacionesPrincipales: '',
        /**
         * El valor de municipioAlcaldia.
         */
        municipioAlcaldia: '',
        /**
         * El valor de tipoDeInstalcion.
         */
        tipoDeInstalcion: '',
        /**
         * El valor de procesoProductivo.
         */
        procesoProductivo: '',
        /**
         * El valor de acreditacionDelUso.
         */
        acreditacionDelUso: '',
        /**
         * El valor de prefilMensajeria.
         */
        prefilMensajeria: '',
        /**
         * El valor de articuloDelCff.
         */
        articuloDelCff: '',
        /**
         * El valor de exportadoresSectorial.
         */
        exportadoresSectorial: '',
        /**
         * El valor de archivoNacionales.
         */
        archivoNacionales: '',
        /**
         * El valor de proveedores.
         */
        proveedores: '',
        /**
         * El valor de solicitudDeCertificacion.
         */
        solicitudDeCertificacion: '',
        /**
         * El valor de controlInventarios.
         */
        controlInventarios: '',
        /**
         * El valor de nombreDelSistema.
         */
        nombreDelSistema: '',
        /**
         * El valor de lugarDeRadicacion.
         */
        lugarDeRadicacion: '',
        /**
         * El valor de previstas.
         */
        previstas: '',
        /**
         * El valor de delCffLasReglas.
         */
        delCffLasReglas: '',
        /**
         * El valor de enSeCaracter.
         */
        enSeCaracter: '',
        /**
         * El valor de obligadoTributar.
         */
        obligadoTributar: '',
        /**
         * El valor de nacionalidad.
         */
        nacionalidad: '',
        /**
         * El valor de conformidad.
         */
        conformidad: '',
        /**
         * El valor de esquemaIntegralCertificacion.
         */
        esquemaIntegralCertificacion: '',
        /**
         * El valor de modificadasRevocadas.
         */
        modificadasRevocadas: '',
    };
}

 /**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite32615', resettable: true })

export class Tramite32615Store extends Store<Solicitud32615State>{
    /**
     * Crea una instancia de Tramite32615Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
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
    public setPreOperativo(preOperativo: string): void {
        this.update((state) => ({
            ...state,
            preOperativo,
        }));
    }

    /**
     * Establece el estado de solicitudDeInspeccion.
     * @param solicitudDeInspeccion - El valor de solicitudDeInspeccion.
     */
    public setSolicitudDeInspeccion(solicitudDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            solicitudDeInspeccion,
        }));
    }

    /**
     * Establece el estado de indiqueAutorizo.
     * @param indiqueAutorizo - El valor de indiqueAutorizo.
     */
    public setIndiqueAutorizo(indiqueAutorizo: string): void {
        this.update((state) => ({
            ...state,
            indiqueAutorizo,
        }));
    }
    /**
     * Establece el estado de senaleCuentaEmpleados.
     * @param senaleCuentaEmpleados - El valor de senaleCuentaEmpleados.
     */
    public setSenaleCuentaEmpleados(senaleCuentaEmpleados: string): void {
        this.update((state) => ({
            ...state,
            senaleCuentaEmpleados,
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
     * Establece el estado de numeroDeEmpleados.
     * @param numeroDeEmpleados - El valor de numeroDeEmpleados.
     */
    public setNumeroDeEmpleados(numeroDeEmpleados: string): void {
        this.update((state) => ({
            ...state,
            numeroDeEmpleados,
        }));
    }
    /**
     * Establece el estado de cumpleConLaObligacion.
     * @param cumpleConLaObligacion - El valor de cumpleConLaObligacion.
     */
    public setCumpleConLaObligacion(cumpleConLaObligacion: string): void {
        this.update((state) => ({
            ...state,
            cumpleConLaObligacion,
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
     * Establece el estado de senaleSiAlMomento.
     * @param senaleSiAlMomento - El valor de senaleSiAlMomento.
     */
    public setSenaleSiAlMomento(senaleSiAlMomento: string): void {
        this.update((state) => ({
            ...state,
            senaleSiAlMomento,
        }));
    }
    /**
     * Establece el estado de rfc.
     * @param rfc - El valor de rfc.
     */
    public setRfc(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }
    /**
     * Establece el estado de numeroDeEmpleadosForma.
     * @param numeroDeEmpleadosForma - El valor de numeroDeEmpleadosForma.
     */
    public setNumeroDeEmpleadosForma(numeroDeEmpleadosForma: string): void {
        this.update((state) => ({
            ...state,
            numeroDeEmpleadosForma,
        }));
    }
    /**
     * Establece el estado de bimestreForma.
     * @param bimestreForma - El valor de bimestreForma.
     */
    public setBimestreForma(bimestreForma: string): void {
        this.update((state) => ({
            ...state,
            bimestreForma,
        }));
    }
    /**
     * Establece el estado de acreditaCumplir.
     * @param acreditaCumplir - El valor de acreditaCumplir.
     */
    public setAcreditaCumplir(acreditaCumplir: string): void {
        this.update((state) => ({
            ...state,
            acreditaCumplir,
        }));
    }
    /**
     * Establece el estado de fraccionVI.
     * @param fraccionVI - El valor de fraccionVI.
     */
    public setFraccionVI(fraccionVI: string): void {
        this.update((state) => ({
            ...state,
            fraccionVI,
        }));
    }
    /**
     * Establece el estado de cuartoParrafoDelCff.
     * @param cuartoParrafoDelCff - El valor de cuartoParrafoDelCff.
     */
    public setCuartoParrafoDelCff(cuartoParrafoDelCff: string): void {
        this.update((state) => ({
            ...state,
            cuartoParrafoDelCff,
        }));
    }
    /**
     * Establece el estado de novenoParrafoDelCff.
     * @param novenoParrafoDelCff - El valor de novenoParrafoDelCff.
     */
    public setNovenoParrafoDelCff(novenoParrafoDelCff: string): void {
        this.update((state) => ({
            ...state,
            novenoParrafoDelCff,
        }));
    }
    /**
     * Establece el estado de digitalesEstanVigentes.
     * @param digitalesEstanVigentes - El valor de digitalesEstanVigentes.
     */
    public setDigitalesEstanVigentes(digitalesEstanVigentes: string): void {
        this.update((state) => ({
            ...state,
            digitalesEstanVigentes,
        }));
    }
    /**
     * Establece el estado de ultimosDoceMeses.
     * @param ultimosDoceMeses - El valor de ultimosDoceMeses.
     */
    public setUltimosDoceMeses(ultimosDoceMeses: string): void {
        this.update((state) => ({
            ...state,
            ultimosDoceMeses,
        }));
    }
    /**
     * Establece el estado de prestacionDeServicios.
     * @param prestacionDeServicios - El valor de prestacionDeServicios.
     */
    public setPrestacionDeServicios(prestacionDeServicios: string): void {
        this.update((state) => ({
            ...state,
            prestacionDeServicios,
        }));
    }
    /**
     * Establece el estado de instalacionesPrincipales.
     * @param instalacionesPrincipales - El valor de instalacionesPrincipales.
     */
    public setInstalacionesPrincipales(instalacionesPrincipales: string): void {
        this.update((state) => ({
            ...state,
            instalacionesPrincipales,
        }));
    }
    /**
     * Establece el estado de municipioAlcaldia.
     * @param municipioAlcaldia - El valor de municipioAlcaldia.
     */
    public setMunicipioAlcaldia(municipioAlcaldia: string): void {
        this.update((state) => ({
            ...state,
            municipioAlcaldia,
        }));
    }
    /**
     * Establece el estado de tipoDeInstalcion.
     * @param tipoDeInstalcion - El valor de tipoDeInstalcion.
     */
    public setTipoDeInstalcion(tipoDeInstalcion: string): void {
        this.update((state) => ({
            ...state,
            tipoDeInstalcion,
        }));
    }
    /**
     * Establece el estado de procesoProductivo.
     * @param procesoProductivo - El valor de procesoProductivo.
     */
    public setProcesoProductivo(procesoProductivo: string): void {
        this.update((state) => ({
            ...state,
            procesoProductivo,
        }));
    }
    /**
     * Establece el estado de acreditacionDelUso.
     * @param acreditacionDelUso - El valor de acreditacionDelUso.
     */
    public setAcreditacionDelUso(acreditacionDelUso: string): void {
        this.update((state) => ({
            ...state,
            acreditacionDelUso,
        }));
    }
    /**
     * Establece el estado de prefilMensajeria.
     * @param prefilMensajeria - El valor de prefilMensajeria.
     */
    public setPrefilMensajeria(prefilMensajeria: string): void {
        this.update((state) => ({
            ...state,
            prefilMensajeria,
        }));
    }
    /**
     * Establece el estado de articuloDelCff.
     * @param articuloDelCff - El valor de articuloDelCff.
     */
    public setArticuloDelCff(articuloDelCff: string): void {
        this.update((state) => ({
            ...state,
            articuloDelCff,
        }));
    }
    /**
     * Establece el estado de exportadoresSectorial.
     * @param exportadoresSectorial - El valor de exportadoresSectorial.
     */
    public setExportadoresSectorial(exportadoresSectorial: string): void {
        this.update((state) => ({
            ...state,
            exportadoresSectorial,
        }));
    }
    /**
     * Establece el estado de archivoNacionales.
     * @param archivoNacionales - El valor de archivoNacionales.
     */
    public setArchivoNacionales(archivoNacionales: string): void {
        this.update((state) => ({
            ...state,
            archivoNacionales,
        }));
    }
    /**
     * Establece el estado de proveedores.
     * @param proveedores - El valor de proveedores.
     */
    public setProveedores(proveedores: string): void {
        this.update((state) => ({
            ...state,
            proveedores,
        }));
    }
    /**
     * Establece el estado de solicitudDeCertificacion.
     * @param solicitudDeCertificacion - El valor de solicitudDeCertificacion.
     */
    public setSolicitudDeCertificacion(solicitudDeCertificacion: string): void {
        this.update((state) => ({
            ...state,
            solicitudDeCertificacion,
        }));
    }
    /**
     * Establece el estado de controlInventarios.
     * @param controlInventarios - El valor de controlInventarios.
     */
    public setControlInventarios(controlInventarios: string): void {
        this.update((state) => ({
            ...state,
            controlInventarios,
        }));
    }
    /**
     * Establece el estado de nombreDelSistema.
     * @param nombreDelSistema - El valor de nombreDelSistema.
     */
    public setNombreDelSistema(nombreDelSistema: string): void {
        this.update((state) => ({
            ...state,
            nombreDelSistema,
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
     * Establece el estado de previstas.
     * @param previstas - El valor de previstas.
     */
    public setPrevistas(previstas: string): void {
        this.update((state) => ({
            ...state,
            previstas,
        }));
    }
    /**
     * Establece el estado de delCffLasReglas.
     * @param delCffLasReglas - El valor de delCffLasReglas.
     */
    public setDelCffLasReglas(delCffLasReglas: string): void {
        this.update((state) => ({
            ...state,
            delCffLasReglas,
        }));
    }
    /**
     * Establece el estado de enSeCaracter.
     * @param enSeCaracter - El valor de enSeCaracter.
     */
    public setEnSeCaracter(enSeCaracter: string): void {
        this.update((state) => ({
            ...state,
            enSeCaracter,
        }));
    }
    /**
     * Establece el estado de obligadoTributar.
     * @param obligadoTributar - El valor de obligadoTributar.
     */
    public setObligadoTributar(obligadoTributar: string): void {
        this.update((state) => ({
            ...state,
            obligadoTributar,
        }));
    }
    /**
     * Establece el estado de nacionalidad.
     * @param nacionalidad - El valor de nacionalidad.
     */
    public setNacionalidad(nacionalidad: string): void {
        this.update((state) => ({
            ...state,
            nacionalidad,
        }));
    }
    /**
     * Establece el estado de conformidad.
     * @param conformidad - El valor de conformidad.
     */
    public setConformidad(conformidad: string): void {
        this.update((state) => ({
            ...state,
            conformidad,
        }));
    }
    /**
     * Establece el estado de esquemaIntegralCertificacion.
     * @param esquemaIntegralCertificacion - El valor de esquemaIntegralCertificacion.
     */
    public setEsquemaIntegralCertificacion(esquemaIntegralCertificacion: string): void {
        this.update((state) => ({
            ...state,
            esquemaIntegralCertificacion,
        }));
    }
    /**
     * Establece el estado de modificadasRevocadas.
     * @param modificadasRevocadas - El valor de modificadasRevocadas.
     */
    public setModificadasRevocadas(modificadasRevocadas: string): void {
        this.update((state) => ({
            ...state,
            modificadasRevocadas,
        }));
    }

} 
  