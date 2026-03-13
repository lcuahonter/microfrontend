/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Shared2603MostrarService {
  constructor() {
    //
  }

  mapToState(data: Record<string, unknown>): Record<string, unknown> {
    return {
      solicitud: this.mapSolicitud(data['solicitud']),
      establecimiento: this.mapEstablecimiento(data['establecimiento']),
      datosSCIAN: this.mapDatosScian(data['datosSCIAN'] as any[]),
      mercancias: this.mapMercancias(data['mercancias'] as any[]),
      representanteLegal: this.mapRepresentanteLegal(data['representanteLegal']),
      gridTerceros_TIPERS_FAB: this.mapTerceros(data['gridTerceros_TIPERS_FAB'] as any[]),
      gridTerceros_TIPERS_CEAN: this.mapTerceros(data['gridTerceros_TIPERS_CEAN'] as any[]),
      gridTerceros_TIPERS_PVD: this.mapTerceros(data['gridTerceros_TIPERS_PVD'] as any[]),
      gridTerceros_TIPERS_FAC: this.mapTerceros(data['gridTerceros_TIPERS_FAC'] as any[]),
      gridTerceros_TIPERS_OTR: this.mapTerceros(data['gridTerceros_TIPERS_OTR'] as any[]),
      pagoDeDerechos: this.mapPagoDeDerechos(data['pagoDeDerechos'])
    };
  }

  // eslint-disable-next-line class-methods-use-this
  mapSolicitud(solicitud: any): Record<string, unknown> {
    if (!solicitud) {return {}}
    return {
      discriminatorValue: solicitud.discriminatorValue,
      declaracionesSeleccionadas: solicitud.declaracionesSeleccionadas,
      regimen: solicitud.regimen,
      aduanaAIFA: solicitud.aduanaAIFA,
      informacionConfidencial: solicitud.informacionConfidencial
    };
  }

  // eslint-disable-next-line class-methods-use-this
  mapEstablecimiento(establecimiento: any): Record<string, unknown> {
    if (!establecimiento) {return {}}
    return {
      rfcResponsableSanitario: establecimiento.rfcResponsableSanitario,
      razonSocial: establecimiento.razonSocial,
      correoElectronico: establecimiento.correoElectronico,
      domicilio: establecimiento.domicilio ? { ...establecimiento.domicilio } : {},
      original: establecimiento.original,
      avisoFuncionamiento: establecimiento.avisoFuncionamiento,
      numeroLicencia: establecimiento.numeroLicencia,
      aduanas: establecimiento.aduanas
    };
  }

  // eslint-disable-next-line class-methods-use-this
  mapDatosScian(datosSCIAN: any[]): Record<string, unknown>[] {
    if (!Array.isArray(datosSCIAN)) {return []}
    return datosSCIAN.map(item => ({
      cveScian: item.cveScian,
      descripcion: item.descripcion,
      selected: item.selected
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  mapMercancias(mercancias: any[]): Record<string, unknown>[] {
    if (!Array.isArray(mercancias)) {return []}
    return mercancias.map(item => ({
      idMercancia: item.idMercancia,
      clasificacionProducto: item.clasificacionProducto,
      subClasificacionProducto: item.subClasificacionProducto,
      denominacionProducto2603: item.denominacionProducto2603,
      denominacionDistintiva: item.denominacionDistintiva,
      numeroCAS: item.numeroCAS,
      fracionArancelaria: item.fracionArancelaria,
      descripcionMercancia: item.descripcionMercancia,
      cantidadUMC: item.cantidadUMC,
      unidadMedidaUMC: item.unidadMedidaUMC,
      kgPorLote: item.kgPorLote,
      piezasAFabricarConComas: item.piezasAFabricarConComas,
      nombreComunConComas: item.nombreComunConComas,
      presentacion: item.presentacion,
      numeroRegistroSanitario: item.numeroRegistroSanitario,
      usoEspecifico: item.usoEspecifico,
      especificaUsoEspecifico: item.especificaUsoEspecifico,
      nombrePaisDestino: item.nombrePaisDestino,
      nombrePaisOrigen: item.nombrePaisOrigen,
      nombrePaisProcedencia: item.nombrePaisProcedencia,
      formaFarmaceuticaCorto: item.formaFarmaceuticaCorto,
      cantidadUMCConComas: item.cantidadUMCConComas,
      cantidadUMTConComas: item.cantidadUMTConComas,
      unidadMedidaTarifa: item.unidadMedidaTarifa
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  mapRepresentanteLegal(rep: any): Record<string, unknown> {
    if (!rep) {return {}}
    return {
      rfc: rep.rfc,
      resultadoIDC: rep.resultadoIDC,
      nombre: rep.nombre,
      apellidoPaterno: rep.apellidoPaterno,
      apellidoMaterno: rep.apellidoMaterno
    };
  }

  // eslint-disable-next-line class-methods-use-this
  mapTerceros(terceros: any[]): Record<string, unknown>[] {
    if (!Array.isArray(terceros)) {return []}
    return terceros.map(item => ({
      idPersonaSolicitud: item.idPersonaSolicitud,
      ideTipoTercero: item.ideTipoTercero,
      personaMoral: item.personaMoral,
      booleanExtranjero: item.booleanExtranjero,
      booleanFisicaNoContribuyente: item.booleanFisicaNoContribuyente,
      denominacion: item.denominacion,
      razonSocial: item.razonSocial,
      rfc: item.rfc,
      curp: item.curp,
      nombre: item.nombre,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      telefono: item.telefono,
      correoElectronico: item.correoElectronico,
      actividadProductiva: item.actividadProductiva,
      actividadProductivaDesc: item.actividadProductivaDesc,
      descripcionGiro: item.descripcionGiro,
      numeroRegistro: item.numeroRegistro,
      domicilio: item.domicilio ? { ...item.domicilio } : {},
      idSolicitud: item.idSolicitud,
      terceroNombreDescripcion: item.terceroNombreDescripcion // only for OTR
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  mapPagoDeDerechos(pago: any): Record<string, unknown> {
    if (!pago) {return {}}
    return {
      claveDeReferencia: pago.claveDeReferencia,
      cadenaPagoDependencia: pago.cadenaPagoDependencia,
      banco: pago.banco ? { ...pago.banco } : {},
      llaveDePago: pago.llaveDePago,
      fecPago: pago.fecPago,
      impPago: pago.impPago
    };
  }
}