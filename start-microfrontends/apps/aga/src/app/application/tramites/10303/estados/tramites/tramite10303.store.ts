import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TableBodyData } from '@libs/shared/data-access-user/src';

/**
 * Creacion del estado inicial para la interfaz de tramite 10303
 * @returns Solicitud10303
 */
export interface RegistroDeDonacion10303State {
    seleccionadaManifiesto: boolean[];
    aduana: string;
    seleccionadaBasicoRequerimiento: boolean[];

    numeroConsecutivo: string;
    destinoDonacion: string;
    posibleFraccion: string;
    descripcionFraccion: string;
    solicitudDeInspeccion: string;
    justificacionMerca: string;
    descripcionMercanciaOtro: string;
    tipoDeMercancia: string;
    cantidadUMC: string;
    cantidadUMT: string;
    cantidadUMCVehiculo: string;
    cantidadUMTVehiculo: string;
    unidadMedida: string;
    UMT: string;
    unidadMedidaVehiculo: string;
    UMTVehiculo: string;
    paisProcedenciaOtro: string;
    condicionMercancia: string;

    fechaCaducidad: string;
    ingredienteActivo: string;
    tipoMedicamento: string;
    presentacionFarma: string;
    paisOrigenMedicamento: string;
    paisProcedenciaMedicamento: string;

    razonSocial: string;
    calleDonante: string;
    numExteriorLabel: string;
    numInteriorDonante: string;
    pais: string;
    codigoPostal: string;
    informacionExtra: string;
    coloniaDonante: string;
    correoElectronicoDonante: string;
    telefonoDonante: string;
    cveDocumentoResidencia: string;

    rfcFabricante: string;
    nombreFabricante: string;
    calleFabricante: string;
    numExteriorFabricante: string;
    numInteriorFabricante: string;
    estadoFabricante: string;
    coloniaFabricante: string;
    codigoPostalFabricante: string;
    cvePaisFabricante: string;

    rfcRepLegalAutorizado: string;
    nombreRepLegalAutorizado: string;
    calleRepLegalAutorizado: string;
    numExteriorRepLegalAutorizado: string;
    numInteriorRepLegalAutorizado: string;
    estadoRepLegalAutorizado: string;
    coloniaRepLegalAutorizado: string;
    codigoPostalRepLegalAutorizado: string;
    cvePaisRepLegalAutorizado: string;
    correoElectronicoRepLegalAutorizado: string;
    telefonoRepLegalAutorizado: string;

    rfcRepLegalDonatario: string;
    nombreRepLegalDonatario: string;
    calleRepLegalDonatario: string;
    numExteriorRepLegalDonatario: string;
    numInteriorRepLegalDonatario: string;
    estadoRepLegalDonatario: string;
    coloniaRepLegalDonatario: string;
    codigoPostalRepLegalDonatario: string;
    cvePaisRepLegalDonatario: string;
    correoElectronicoRepLegalDonatario: string;
    telefonoRepLegalDonatario: string;

    rfcPersonaAutorizada: string;
    nombrePersonaAutorizada: string;
    callePersonaAutorizada: string;
    numExteriorPersonaAutorizada: string;
    numInteriorPersonaAutorizada: string;
    estadoPersonaAutorizada: string;
    coloniaPersonaAutorizada: string;
    codigoPostalPersonaAutorizada: string;
    cvePaisPersonaAutorizada: string;
    correoElectronicoPersonaAutorizada: string;
    telefonoPersonaAutorizada: string;

    rfcDonatario: string;
    nombreDonatario: string;
    calleDonatario: string;
    numExteriorDonatario: string;
    numInteriorDonatario: string;
    estadoDonatario: string;
    coloniaDonatario: string;
    codigoPostalDonatario: string;
    cvePaisDonatario: string;
    correoElectronicoDonatario: string;
    telefonoDonatario: string;
    seleccionadaTipoDeMercancia: number;

    medicoDescripcion: string;
    paisProcedencia: string;
    paisMedicoOrigen: string;
    marca: string;
    ano: string;
    modelo: string;
    serieNumero: string;
    pasajerosNumero: string;
    cilindrada: string;
    combustibleTipo: string;
    vehiculoTipo: string;
    descripcion: string;
    mercanciaTablaDatos: TableBodyData[];
}

export function createInitialState(): RegistroDeDonacion10303State {
    return {
        seleccionadaManifiesto: [false, false, false, false, false],
        aduana: '',
        seleccionadaBasicoRequerimiento: [false, false, false, false, false, false],

        numeroConsecutivo: '1',
        destinoDonacion: '',
        posibleFraccion: '',
        descripcionFraccion: '',
        solicitudDeInspeccion: '',
        justificacionMerca: '',
        descripcionMercanciaOtro: '',
        tipoDeMercancia: '4',
        cantidadUMC: '',
        cantidadUMT: '',
        cantidadUMCVehiculo: '1',
        cantidadUMTVehiculo: '1',
        unidadMedida: '',
        UMT: '',
        unidadMedidaVehiculo: '1',
        UMTVehiculo: '1',
        paisProcedenciaOtro: '',
        condicionMercancia: '',

        fechaCaducidad: '',
        ingredienteActivo: '',
        tipoMedicamento: '',
        presentacionFarma: '',
        paisOrigenMedicamento: '',
        paisProcedenciaMedicamento: '',

        razonSocial: '',
        calleDonante: '',
        numExteriorLabel: '',
        numInteriorDonante: '',
        pais: '',
        codigoPostal: '',
        informacionExtra: '',
        coloniaDonante: '',
        correoElectronicoDonante: '',
        telefonoDonante: '',
        cveDocumentoResidencia: '',

        rfcFabricante: '',
        nombreFabricante: '',
        calleFabricante: '',
        numExteriorFabricante: '',
        numInteriorFabricante: '',
        estadoFabricante: '',
        coloniaFabricante: '',
        codigoPostalFabricante: '',
        cvePaisFabricante: '',

        rfcRepLegalAutorizado: '',
        nombreRepLegalAutorizado: '',
        calleRepLegalAutorizado: '',
        numExteriorRepLegalAutorizado: '',
        numInteriorRepLegalAutorizado: '',
        estadoRepLegalAutorizado: '',
        coloniaRepLegalAutorizado: '',
        codigoPostalRepLegalAutorizado: '',
        cvePaisRepLegalAutorizado: '',
        correoElectronicoRepLegalAutorizado: '',
        telefonoRepLegalAutorizado: '',

        rfcRepLegalDonatario: '',
        nombreRepLegalDonatario: '',
        calleRepLegalDonatario: '',
        numExteriorRepLegalDonatario: '',
        numInteriorRepLegalDonatario: '',
        estadoRepLegalDonatario: '',
        coloniaRepLegalDonatario: '',
        codigoPostalRepLegalDonatario: '',
        cvePaisRepLegalDonatario: '',
        correoElectronicoRepLegalDonatario: '',
        telefonoRepLegalDonatario: '',

        rfcPersonaAutorizada: '',
        nombrePersonaAutorizada: '',
        callePersonaAutorizada: '',
        numExteriorPersonaAutorizada: '',
        numInteriorPersonaAutorizada: '',
        estadoPersonaAutorizada: '',
        coloniaPersonaAutorizada: '',
        codigoPostalPersonaAutorizada: '',
        cvePaisPersonaAutorizada: '',
        correoElectronicoPersonaAutorizada: '',
        telefonoPersonaAutorizada: '',

        rfcDonatario: '',
        nombreDonatario: '',
        calleDonatario: '',
        numExteriorDonatario: '',
        numInteriorDonatario: '',
        estadoDonatario: '',
        coloniaDonatario: '',
        codigoPostalDonatario: '',
        cvePaisDonatario: '',
        correoElectronicoDonatario: '',
        telefonoDonatario: '',
        seleccionadaTipoDeMercancia: 4,
        medicoDescripcion: '',
        paisProcedencia: '',
        paisMedicoOrigen: '',
        marca: '',
        ano: '',
        modelo: '',
        serieNumero: '',
        pasajerosNumero: '',
        cilindrada: '',
        combustibleTipo: '',
        vehiculoTipo: '',
        descripcion: '',
        mercanciaTablaDatos: []
    };
}

@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite10303', resettable: true })
export class Tramite10303Store extends Store<RegistroDeDonacion10303State> {
    constructor() {
        super(createInitialState());
    }

    public setSeleccionadaManifiesto(seleccionadaManifiesto: []): void {
        this.update((state) => ({
            ...state,
            seleccionadaManifiesto
        }));
    }

    public setAduana(aduana: string): void {
        this.update((state) => ({
            ...state,
            aduana,
        }));
    }

    public setSeleccionadaBasicoRequerimiento(seleccionadaBasicoRequerimiento: []): void {
        this.update((state) => ({
            ...state,
            seleccionadaBasicoRequerimiento: seleccionadaBasicoRequerimiento,
        }));
    }

    public setNumeroConsecutivo(numeroConsecutivo: string): void {
        this.update((state) => ({
            ...state,
            numeroConsecutivo,
        }));
    }

    public setDestinoDonacion(destinoDonacion: string): void {
        this.update((state) => ({
            ...state,
            destinoDonacion,
        }));
    }

    public setPosibleFraccion(posibleFraccion: string): void {
        this.update((state) => ({
            ...state,
            posibleFraccion,
        }));
    }

    public setDescripcionFraccion(descripcionFraccion: string): void {
        this.update((state) => ({
            ...state,
            descripcionFraccion,
        }));
    }

    public setJustificacionMerca(justificacionMerca: string): void {
        this.update((state) => ({
            ...state,
            justificacionMerca,
        }));
    }

    public setDescripcionMercanciaOtro(descripcionMercanciaOtro: string): void {
        this.update((state) => ({
            ...state,
            descripcionMercanciaOtro,
        }));
    }

    public setTipoDeMercancia(tipoDeMercancia: string): void {
        this.update((state) => ({
            ...state,
            tipoDeMercancia,
        }));
    }

    public setCantidadUMC(cantidadUMC: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMC,
        }));
    }

    public setCantidadUMT(cantidadUMT: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMT,
        }));
    }

    /**
     * Actualiza el estado del store con la vehículo cantidad UMC.
     * @param cantidadUMCVehiculo - Vehículo cantidad UMC.
     * @return {void}
     */
    public setCantidadUMCVehiculo(cantidadUMCVehiculo: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMCVehiculo,
        }));
    }

    /**
     * Actualiza el estado del store con la vehículo cantidad UMT.
     * @param cantidadUMCVehiculo - Vehículo cantidad UMT.
     * @return {void}
     */
    public setCantidadUMTVehiculo(cantidadUMTVehiculo: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMTVehiculo,
        }));
    }

    public setUnidadMedida(unidadMedida: string): void {
        this.update((state) => ({
            ...state,
            unidadMedida,
        }));
    }

    public setUMT(UMT: string): void {
        this.update((state) => ({
            ...state,
            UMT,
        }));
    }

    /**
     * Actualiza el estado del store con la vehículo unidad UMT.
     * @param unidadMedidaVehiculo - Vehículo unidad UMT.
     * @return {void}
     */
    public setUnidadMedidaVehiculo(unidadMedidaVehiculo: string): void {
        this.update((state) => ({
            ...state,
            unidadMedidaVehiculo,
        }));
    }

    /**
     * Actualiza el estado del store con la vehículo unidad UMT.
     * @param UMTVehiculo - Vehículo unidad UMT.
     * @return {void}
     */
    public setUMTVehiculo(UMTVehiculo: string): void {
        this.update((state) => ({
            ...state,
            UMTVehiculo,
        }));
    }

    public setPaisProcedenciaOtro(paisProcedenciaOtro: string): void {
        this.update((state) => ({
            ...state,
            paisProcedenciaOtro,
        }));
    }

    public setCondicionMercancia(condicionMercancia: string): void {
        this.update((state) => ({
            ...state,
            condicionMercancia,
        }));
    }

    public setIngredienteActivo(ingredienteActivo: string): void {
        this.update((state) => ({
            ...state,
            ingredienteActivo,
        }));
    }

    public setTipoMedicamento(tipoMedicamento: string): void {
        this.update((state) => ({
            ...state,
            tipoMedicamento,
        }));
    }

    public setPresentacionFarma(presentacionFarma: string): void {
        this.update((state) => ({
            ...state,
            presentacionFarma,
        }));
    }

    public setPaisOrigenMedicamento(paisOrigenMedicamento: string): void {
        this.update((state) => ({
            ...state,
            paisOrigenMedicamento,
        }));
    }

    public setPaisProcedenciaMedicamento(paisProcedenciaMedicamento: string): void {
        this.update((state) => ({
            ...state,
            paisProcedenciaMedicamento,
        }));
    }

    public setFechaCaducidad(fechaCaducidad: string): void {
        this.update((state) => ({
            ...state,
            fechaCaducidad,
        }));
    }

    public setSolicitudDeInspeccion(solicitudDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            solicitudDeInspeccion,
        }));
    }

    public setRazonSocial(razonSocial: string): void {
        this.update((state) => ({
            ...state,
            razonSocial,
        }));
    }

    public setCalleDonante(calleDonante: string): void {
        this.update((state) => ({
            ...state,
            calleDonante,
        }));
    }

    public setNumExteriorLabel(numExteriorLabel: string): void {
        this.update((state) => ({
            ...state,
            numExteriorLabel,
        }));
    }

    public setNumInteriorDonante(numInteriorDonante: string): void {
        this.update((state) => ({
            ...state,
            numInteriorDonante,
        }));
    }

    public setPais(pais: string): void {
        this.update((state) => ({
            ...state,
            pais,
        }));
    }

    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }

    public setInformacionExtra(informacionExtra: string): void {
        this.update((state) => ({
            ...state,
            informacionExtra,
        }));
    }

    public setColoniaDonante(coloniaDonante: string): void {
        this.update((state) => ({
            ...state,
            coloniaDonante,
        }));
    }

    public setCorreoElectronicoDonante(correoElectronicoDonante: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoDonante,
        }));
    }

    public setTelefonoDonante(telefonoDonante: string): void {
        this.update((state) => ({
            ...state,
            telefonoDonante,
        }));
    }

    public setDocumentoResidencia(cveDocumentoResidencia: string): void {
        this.update((state) => ({
            ...state,
            cveDocumentoResidencia,
        }));
    }

    public setRfcFabricante(rfcFabricante: string): void {
        this.update((state) => ({
            ...state,
            rfcFabricante,
        }));
    }

    public setNombreFabricante(nombreFabricante: string): void {
        this.update((state) => ({
            ...state,
            nombreFabricante,
        }));
    }

    public setCalleFabricante(calleFabricante: string): void {
        this.update((state) => ({
            ...state,
            calleFabricante,
        }));
    }

    public setNumExteriorFabricante(numExteriorFabricante: string): void {
        this.update((state) => ({
            ...state,
            numExteriorFabricante,
        }));
    }

    public setNumInteriorFabricante(numInteriorFabricante: string): void {
        this.update((state) => ({
            ...state,
            numInteriorFabricante,
        }));
    }

    public setEstadoFabricante(estadoFabricante: string): void {
        this.update((state) => ({
            ...state,
            estadoFabricante,
        }));
    }

    public setColoniaFabricante(coloniaFabricante: string): void {
        this.update((state) => ({
            ...state,
            coloniaFabricante,
        }));
    }

    public setCodigoPostalFabricante(codigoPostalFabricante: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalFabricante,
        }));
    }

    public setCvePaisFabricante(cvePaisFabricante: string): void {
        this.update((state) => ({
            ...state,
            cvePaisFabricante,
        }));
    }

    public setRfcRepLegalAutorizado(rfcRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            rfcRepLegalAutorizado,
        }));
    }

    public setNombreRepLegalAutorizado(nombreRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            nombreRepLegalAutorizado,
        }));
    }

    public setCalleRepLegalAutorizado(calleRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            calleRepLegalAutorizado,
        }));
    }

    public setNumExteriorRepLegalAutorizado(numExteriorRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            numExteriorRepLegalAutorizado,
        }));
    }

    public setNumInteriorRepLegalAutorizado(numInteriorRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            numInteriorRepLegalAutorizado,
        }));
    }

    public setEstadoRepLegalAutorizado(estadoRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            estadoRepLegalAutorizado,
        }));
    }

    public setColoniaRepLegalAutorizado(coloniaRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            coloniaRepLegalAutorizado,
        }));
    }

    public setCodigoPostalRepLegalAutorizado(codigoPostalRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalRepLegalAutorizado,
        }));
    }

    public setCvePaisRepLegalAutorizado(cvePaisRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            cvePaisRepLegalAutorizado,
        }));
    }

    public setCorreoElectronicoRepLegalAutorizado(correoElectronicoRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoRepLegalAutorizado,
        }));
    }

    public setTelefonoRepLegalAutorizado(telefonoRepLegalAutorizado: string): void {
        this.update((state) => ({
            ...state,
            telefonoRepLegalAutorizado,
        }));
    }

    public setRfcRepLegalDonatario(rfcRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            rfcRepLegalDonatario,
        }));
    }

    public setNombreRepLegalDonatario(nombreRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            nombreRepLegalDonatario,
        }));
    }

    public setCalleRepLegalDonatario(calleRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            calleRepLegalDonatario,
        }));
    }

    public setNumExteriorRepLegalDonatario(numExteriorRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            numExteriorRepLegalDonatario,
        }));
    }

    public setNumInteriorRepLegalDonatario(numInteriorRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            numInteriorRepLegalDonatario,
        }));
    }

    public setEstadoRepLegalDonatario(estadoRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            estadoRepLegalDonatario,
        }));
    }

    public setColoniaRepLegalDonatario(coloniaRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            coloniaRepLegalDonatario,
        }));
    }

    public setCodigoPostalRepLegalDonatario(codigoPostalRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalRepLegalDonatario,
        }));
    }

    public setCvePaisRepLegalDonatario(cvePaisRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            cvePaisRepLegalDonatario,
        }));
    }

    public setCorreoElectronicoRepLegalDonatario(correoElectronicoRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoRepLegalDonatario,
        }));
    }

    public setTelefonoRepLegalDonatario(telefonoRepLegalDonatario: string): void {
        this.update((state) => ({
            ...state,
            telefonoRepLegalDonatario,
        }));
    }

    public setRfcPersonaAutorizada(rfcPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            rfcPersonaAutorizada,
        }));
    }

    public setNombrePersonaAutorizada(nombrePersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            nombrePersonaAutorizada,
        }));
    }

    public setCallePersonaAutorizada(callePersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            callePersonaAutorizada,
        }));
    }

    public setNumExteriorPersonaAutorizada(numExteriorPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            numExteriorPersonaAutorizada,
        }));
    }

    public setNumInteriorPersonaAutorizada(numInteriorPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            numInteriorPersonaAutorizada,
        }));
    }

    public setEstadoPersonaAutorizada(estadoPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            estadoPersonaAutorizada,
        }));
    }

    public setColoniaPersonaAutorizada(coloniaPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            coloniaPersonaAutorizada,
        }));
    }

    public setCodigoPostalPersonaAutorizada(codigoPostalPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalPersonaAutorizada,
        }));
    }

    public setCvePaisPersonaAutorizada(cvePaisPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            cvePaisPersonaAutorizada,
        }));
    }

    public setCorreoElectronicoPersonaAutorizada(correoElectronicoPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoPersonaAutorizada,
        }));
    }

    public setTelefonoPersonaAutorizada(telefonoPersonaAutorizada: string): void {
        this.update((state) => ({
            ...state,
            telefonoPersonaAutorizada,
        }));
    }

    public setRfcDonatario(rfcDonatario: string): void {
        this.update((state) => ({
            ...state,
            rfcDonatario,
        }));
    }

    public setNombreDonatario(nombreDonatario: string): void {
        this.update((state) => ({
            ...state,
            nombreDonatario,
        }));
    }

    public setCalleDonatario(calleDonatario: string): void {
        this.update((state) => ({
            ...state,
            calleDonatario,
        }));
    }

    public setNumExteriorDonatario(numExteriorDonatario: string): void {
        this.update((state) => ({
            ...state,
            numExteriorDonatario,
        }));
    }

    public setNumInteriorDonatario(numInteriorDonatario: string): void {
        this.update((state) => ({
            ...state,
            numInteriorDonatario,
        }));
    }

    public setEstadoDonatario(estadoDonatario: string): void {
        this.update((state) => ({
            ...state,
            estadoDonatario,
        }));
    }

    public setColoniaDonatario(coloniaDonatario: string): void {
        this.update((state) => ({
            ...state,
            coloniaDonatario,
        }));
    }

    public setCodigoPostalDonatario(codigoPostalDonatario: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalDonatario,
        }));
    }

    public setCvePaisDonatario(cvePaisDonatario: string): void {
        this.update((state) => ({
            ...state,
            cvePaisDonatario,
        }));
    }

    public setCorreoElectronicoDonatario(correoElectronicoDonatario: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoDonatario,
        }));
    }

    public setTelefonoDonatario(telefonoDonatario: string): void {
        this.update((state) => ({
            ...state,
            telefonoDonatario,
        }));
    }

    /**
       * Limpia los datos de la solicitud
       */
    public limpiarSolicitud(): void {
        this.reset();
    }

    /**
     * Actualiza el estado del store con los nuevos datos de donaciones extranjeras.
     * @param nuevoDatos - Nuevo estado de donaciones extranjeras a establecer.
     * @return {void}
     */
    public setDonacionesExtranjerasState(nuevoDatos: RegistroDeDonacion10303State): void {
        this.update(nuevoDatos);
    }

    /**
     * Actualiza el estado del store con el tipo de mercancía seleccionada.
     * @param seleccionadaTipoDeMercancia - El índice del tipo de mercancía seleccionado
     * @return {void}
     */
    public setSeleccionadaTipoDeMercancia(seleccionadaTipoDeMercancia: number): void {
        this.update((state) => ({
            ...state,
            seleccionadaTipoDeMercancia,
        }));
    }

    /**
     * Actualiza el estado del store con la descripción médica.
     * @param medicoDescripcion - Descripción médica a establecer.
     * @return {void}
     */
    public setMedicoDescripcion(medicoDescripcion: string): void {
        this.update((state) => ({
            ...state,
            medicoDescripcion,
        }));
    }

    /**
     * Actualiza el estado del store con el país de procedencia.
     * @param paisProcedencia - País de procedencia a establecer.
     * @return {void}
     */
    public setPaisProcedencia(paisProcedencia: string): void {
        this.update((state) => ({
            ...state,
            paisProcedencia,
        }));
    }

    /**
     * Actualiza el estado del store con el país de origen médico.
     * @param paisMedicoOrigen - País de origen médico a establecer.
     * @return {void}
     */
    public setPaisMedicoOrigen(paisMedicoOrigen: string): void {
        this.update((state) => ({
            ...state,
            paisMedicoOrigen,
        }));
    }

    /**
     * Actualiza el estado del store con la marca.
     * @param marca - Marca a establecer.
     * @return {void}
     */
    public setMarca(marca: string): void {
        this.update((state) => ({
            ...state,
            marca,
        }));
    }

    /**
     * Actualiza el estado del store con el modelo.
     * @param modelo - Modelo a establecer.
     * @return {void}
     */
    public setModelo(modelo: string): void {
        this.update((state) => ({
            ...state,
            modelo,
        }));
    }

    /**
     * Actualiza el estado del store con el año.
     * @param ano - Año a establecer.
     * @return {void}
     */
    public setAno(ano: string): void {
        this.update((state) => ({
            ...state,
            ano,
        }));
    }

    /**
     * Actualiza el estado del store con el número de serie.
     * @param serieNumero - Número de serie a establecer.
     * @return {void}
     */
    public setSerieNumero(serieNumero: string): void {
        this.update((state) => ({
            ...state,
            serieNumero,
        }));
    }

    /**
     * Actualiza el estado del store con el número de pasajeros.
     * @param pasajerosNumero - Número de pasajeros a establecer.
     * @return {void}
     */
    public setPasajerosNumero(pasajerosNumero: string): void {
        this.update((state) => ({
            ...state,
            pasajerosNumero,
        }));
    }

    /**
     * Actualiza el estado del store con la cilindrada.
     * @param cilindrada - Cilindrada a establecer.
     * @return {void}
     */
    public setCilindrada(cilindrada: string): void {
        this.update((state) => ({
            ...state,
            cilindrada,
        }));
    }

    /**
     * Actualiza el estado del store con el tipo de combustible.
     * @param combustibleTipo - Tipo de combustible a establecer.
     * @return {void}
     */
    public setCombustibleTipo(combustibleTipo: string): void {
        this.update((state) => ({
            ...state,
            combustibleTipo,
        }));
    }

    /**
     * Actualiza el estado del store con el tipo de vehículo.
     * @param vehiculoTipo - Tipo de vehículo a establecer.
     * @return {void}
     */
    public setVehiculoTipo(vehiculoTipo: string): void {
        this.update((state) => ({
            ...state,
            vehiculoTipo,
        }));
    }

    /**
     * Actualiza el estado del store con la descripción del vehículo.
     * @param descripcion - Descripción del vehículo a establecer.
     * @return {void}
     */
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }

    /**
     * Actualiza el estado del store con los datos de la mercancía en la tabla.
     * @param mercanciaTablaDatos - Datos de la mercancía a establecer.
     * @return {void}
     */
    public setMercanciaTablaDatos(mercanciaTablaDatos: TableBodyData[]): void {
        this.update((state) => ({
            ...state,
            mercanciaTablaDatos,
        }));
    }
}