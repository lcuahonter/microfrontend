// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ApiResponseDos, CertificadosResponse, DestinoInfoDatos, ExportadorInfoDatos, InspeccionApiResponse, MercanciaDatosDos, PagoDeDerechosResponseDos, PagoDeDerechosRevisionResponse } from '../modelos/acuicola.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TramiteState } from '../constantes/acuicola.enum';
import { FitosanitarioService } from './fitosanitario.service';
import { HttpClient } from '@angular/common/http';
import { TramiteStore } from '../estados/tramite220702.store';

@Injectable()
class MockHttpClient {
    post() { };
}

@Injectable()
class MockTramiteStore { }

describe('FitosanitarioService', () => {
    let service;

    beforeEach(() => {
        service = new FitosanitarioService({}, {});
    });

    it('should return expected response from #obtenerDatosCertificados()', (done) => {
        const mockResponse: CertificadosResponse = {
          certificados: [
            {
              id: 101,
              numero: 'CERT-2025-001',
              fechaEmision: '2025-06-01',
              estado: 'VIGENTE'
            }
          ]
        };
      
        service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
      
        service.obtenerDatosCertificados().subscribe((res) => {
          expect(res).toEqual(mockResponse);
          expect(service.http.get).toHaveBeenCalledWith(`${service.apiUrl}datos-certificados.json`);
          done();
        });
      });

      it('should return expected response from #getDatosMercania()', (done) => {
        const mockResponse: MercanciaDatosDos = {
          descripcion: 'Frutas tropicales',
          cantidad: 1000,
          unidadMedida: 'kg',
          tipoEmpaque: 'Caja',
          valorDeclarado: 5000,
          paisOrigen: 'México'
        };
      
        service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
      
        service.getDatosMercania().subscribe((res) => {
          expect(res).toEqual(mockResponse);
          expect(service.http.get).toHaveBeenCalledWith(`${service.apiUrl}mercania-servico.json`);
          done();
        });
      });

    it('should run #getDatosDeLaMercancia()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getDatosDeLaMercancia();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getDatosExportador()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getDatosExportador();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getDatosDestinatarioInfo()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getDatosDestinatarioInfo();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getHoraDeInspeccion()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getHoraDeInspeccion();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getAduanaDeIngreso()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getAduanaDeIngreso();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getOficinaDeInspeccion()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getOficinaDeInspeccion();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getPuntoDeInspeccion()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getPuntoDeInspeccion();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #obtenerResponsableDatos()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.obtenerResponsableDatos();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getTipoContenedor()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getTipoContenedor();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getMedioDeTransporte()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getMedioDeTransporte();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getBancoDatos()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getBancoDatos();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #pagoDeCargarDatos()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.pagoDeCargarDatos();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getPagoDerechosRevision()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getPagoDerechosRevision();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getRegimenAlQue()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getRegimenAlQue();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should run #getDatosParaMovilizacion()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn().mockReturnValue(observableOf({}));
        service.getDatosParaMovilizacion();
        expect(service.http.get).toHaveBeenCalled();
    });

    it('should return expected response from #getPuntoDeVerificacion()', (done) => {
        const mockResponse: RespuestaCatalogos = {
            code: 200,
            data: [
              { id: 1, descripcion: 'Punto A' },
              { id: 2, descripcion: 'Punto B' },
            ],
            message: 'Success',
          };
        service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));

        service.getPuntoDeVerificacion().subscribe((res) => {
          expect(res).toEqual(mockResponse);
          expect(service.http.get).toHaveBeenCalledWith(`${service.apiUrl}punto-de-verificacion.json`);
          done();
        });
      });

    it('should run #actualizarEstadoFormulario()', async () => {
        service.tramiteStore = service.tramiteStore || {};
        service.tramiteStore.setCertificadosAutorizados = jest.fn();
        service.tramiteStore.setJustificacion = jest.fn();
        service.tramiteStore.setAduanaDeIngreso = jest.fn();
        service.tramiteStore.setOficinaDeInspeccion = jest.fn();
        service.tramiteStore.setPuntoDeInspeccion = jest.fn();
        service.tramiteStore.setNombreInspector = jest.fn();
        service.tramiteStore.setHoraDeInspeccion = jest.fn();
        service.tramiteStore.setFechaDeInspeccion = jest.fn();
        service.tramiteStore.setPrimerApellido = jest.fn();
        service.tramiteStore.setSegundoApellido = jest.fn();
        service.tramiteStore.setCantidadContenedores = jest.fn();
        service.tramiteStore.setTipoContenedor = jest.fn();
        service.tramiteStore.setMedioDeTransporte = jest.fn();
        service.tramiteStore.setIdentificacionTransporte = jest.fn();
        service.tramiteStore.setEsSolicitudFerros = jest.fn();
        service.tramiteStore.setBanco = jest.fn();
        service.tramiteStore.setLlaveDePago = jest.fn();
        service.tramiteStore.setFechaPagoDeDerechos = jest.fn();
        service.tramiteStore.setImporteDePago = jest.fn();
        service.tramiteStore.setClaveDeReferencia = jest.fn();
        service.tramiteStore.setCadenaDependenciaRevision = jest.fn();
        service.tramiteStore.setBancoRevision = jest.fn();
        service.tramiteStore.setLlaveDePagoRevision = jest.fn();
        service.tramiteStore.setFechaPagoDeDerechosRevision = jest.fn();
        service.tramiteStore.setImporteDePagoRevision = jest.fn();
        service.tramiteStore.setExentoDePago = jest.fn();
        service.tramiteStore.setFechaDePago = jest.fn();
        service.tramiteStore.setSolicitudTramite = jest.fn();
        service.actualizarEstadoFormulario({
            certificadosAutorizados: {},
            justificacion: {},
            aduanaDeIngreso: {},
            oficinaDeInspeccion: {},
            puntoDeInspeccion: {},
            nombreInspector: {},
            horaDeInspeccion: {},
            primerApellido: {},
            segundoApellido: {},
            cantidadContenedores: {},
            tipoContenedor: {},
            medioDeTransporte: {},
            identificacionTransporte: {},
            esSolicitudFerros: {},
            banco: {},
            llaveDePago: {},
            fechaPagoDeDerechos: {},
            importeDePago: {},
            claveDeReferencia: {},
            cadenaDependenciaRevision: {},
            bancoRevision: {},

            llaveDePagoRevision: {},
            fechaPagoDeDerechosRevision: {},
            importeDePagoRevision: {},
            exentoDePago: {},
            fechaDePago: {},
            DatosDeLaSolicitudInt: {}
        });
        expect(service.tramiteStore.setCertificadosAutorizados).toHaveBeenCalled();
        expect(service.tramiteStore.setJustificacion).toHaveBeenCalled();
        expect(service.tramiteStore.setAduanaDeIngreso).toHaveBeenCalled();
        expect(service.tramiteStore.setOficinaDeInspeccion).toHaveBeenCalled();
        expect(service.tramiteStore.setPuntoDeInspeccion).toHaveBeenCalled();
        expect(service.tramiteStore.setNombreInspector).toHaveBeenCalled();
        expect(service.tramiteStore.setHoraDeInspeccion).toHaveBeenCalled();
        expect(service.tramiteStore.setPrimerApellido).toHaveBeenCalled();
        expect(service.tramiteStore.setSegundoApellido).toHaveBeenCalled();
        expect(service.tramiteStore.setCantidadContenedores).toHaveBeenCalled();
        expect(service.tramiteStore.setTipoContenedor).toHaveBeenCalled();
        expect(service.tramiteStore.setMedioDeTransporte).toHaveBeenCalled();
        expect(service.tramiteStore.setIdentificacionTransporte).toHaveBeenCalled();
        expect(service.tramiteStore.setEsSolicitudFerros).toHaveBeenCalled();
        expect(service.tramiteStore.setBanco).toHaveBeenCalled();
        expect(service.tramiteStore.setLlaveDePago).toHaveBeenCalled();
        expect(service.tramiteStore.setFechaPagoDeDerechos).toHaveBeenCalled();
        expect(service.tramiteStore.setImporteDePago).toHaveBeenCalled();
        expect(service.tramiteStore.setClaveDeReferencia).toHaveBeenCalled();
        expect(service.tramiteStore.setCadenaDependenciaRevision).toHaveBeenCalled();
        expect(service.tramiteStore.setBancoRevision).toHaveBeenCalled();
        expect(service.tramiteStore.setLlaveDePagoRevision).toHaveBeenCalled();
        expect(service.tramiteStore.setFechaPagoDeDerechosRevision).toHaveBeenCalled();
        expect(service.tramiteStore.setImporteDePagoRevision).toHaveBeenCalled();
        expect(service.tramiteStore.setExentoDePago).toHaveBeenCalled();
        expect(service.tramiteStore.setFechaDePago).toHaveBeenCalled();
        expect(service.tramiteStore.setSolicitudTramite).toHaveBeenCalled();
    });

    it('should run #getServiciosData()', async () => {
        service.http = service.http || {};
        service.http.get = jest.fn();
        service.getServiciosData();
        expect(service.http.get).toHaveBeenCalled();
    });

});