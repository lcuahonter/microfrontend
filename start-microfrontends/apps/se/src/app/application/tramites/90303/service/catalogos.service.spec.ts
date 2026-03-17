import { CatalogosService } from './catalogos.service';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite90303Store } from '../state/Tramite90303.store';
import { Tramite90303Query } from '../state/Tramite90303.query';
import { of } from 'rxjs';
import { PROC_90303 } from '../servers/api-route';
import {
  ListaSectoresRespuesta,
  ListaSectoresTabla,
  PlantasRespuesta
} from '../models/registro.model';
import {
  Mercancias,
  PlantasTabla,
  ProductorIndirecto,
  SectorTabla
} from '../../../shared/models/complementaria.model';
import { Bitacora } from '../../../shared/models/bitacora.model';
import { ProgramaLista } from '../../../shared/models/lista-programa.model';
import { Solicitud90303State } from '../state/Tramite90303.store';

describe('CatalogosService', () => {
  let service: CatalogosService;

  let http: jest.Mocked<HttpClient>;
  let httpCore: jest.Mocked<HttpCoreService>;
  let store: jest.Mocked<Tramite90303Store>;
  let query: jest.Mocked<Tramite90303Query>;

  beforeEach(() => {
    http = {
      get: jest.fn()
    } as any;

    httpCore = {
      get: jest.fn(),
      post: jest.fn()
    } as any;

    store = {
      setRegistroFederalContribuyentes: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setTipoModificacion: jest.fn(),
      setModificacionPrograma: jest.fn()
    } as any;

    query = {
      selectSolicitud$: of({} as Solicitud90303State)
    } as any;

    service = new CatalogosService(http, httpCore, store, query);
  });

  it('should update store with form state data', () => {
    const stateMock = {
      registroFederalContribuyentes: 'RFC123',
      representacionFederal: 'REP',
      tipoModificacion: 'MOD',
      modificacionPrograma: 'true',
      estatus: ''
    } as Solicitud90303State;

    service.actualizarEstadoFormulario(stateMock);

    expect(store.setRegistroFederalContribuyentes).toHaveBeenCalledWith('RFC123');
    expect(store.setRepresentacionFederal).toHaveBeenCalledWith('REP');
    expect(store.setTipoModificacion).toHaveBeenCalledWith('MOD');
    expect(store.setModificacionPrograma).toHaveBeenCalledWith('true');
  });

  it('should fetch registro toma muestras JSON data', () => {
    http.get.mockReturnValue(of({} as Solicitud90303State));

    service.getRegistroTomaMuestrasMercanciasData().subscribe();

    expect(http.get).toHaveBeenCalledWith(
      'assets/json/90303/registro_toma_muestras_mercancias.json'
    );
  });

  it('should post to obtenerListaSectores API', () => {
    const payload = {} as ListaSectoresRespuesta;

    httpCore.post.mockReturnValue(of({} as any));

    service.obtenerListaSectores(payload).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.LISTA_SECTORES,
      { body: payload }
    );
  });

  it('should post to buscarIdSolicitud API', () => {
    const payload = {
      idPrograma: '123',
      tipoPrograma: 'PROSEC'
    };

    httpCore.post.mockReturnValue(of({} as any));

    service.buscarIdSolicitud(payload).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.BUSCAR_ID_SOLICITUD,
      { body: payload }
    );
  });
  
  it('should post to obtenerTablaPlantas API', () => {
    const payload = {} as PlantasRespuesta;

    httpCore.post.mockReturnValue(of({} as any));

    service.obtenerTablaPlantas(payload).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.PLANTAS,
      { body: payload }
    );
  });

  it('should get sector table data', () => {
    httpCore.get.mockReturnValue(of({} as any));

    service.obtenerTablaSector('ID123').subscribe();

    expect(httpCore.get).toHaveBeenCalledWith(
      `${PROC_90303.SECTOR}ID123`
    );
  });

  it('should post to obtenerTablaMercancia API', () => {
    const payload = {
      idSolicitud: '1',
      fechaProsec: 123456
    };

    httpCore.post.mockReturnValue(of({} as any));

    service.obtenerTablaMercancia(payload).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.MERCANCIA_PRODUCIR,
      { body: payload }
    );
  });

  it('should post to obtenerTablaProductor API', () => {
    const payload = {
      idSolicitud: '1',
      fechaProsec: 123456
    };

    httpCore.post.mockReturnValue(of({} as any));

    service.obtenerTablaProductor(payload).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.PRODUCTOR_INDIRECTO,
      { body: payload }
    );
  });

  it('should get bitacora table data', () => {
    httpCore.get.mockReturnValue(of({} as any));

    service.obtenerTablaBitacora('PROG123').subscribe();

    expect(httpCore.get).toHaveBeenCalledWith(
      PROC_90303.BITACORA + 'PROG123'
    );
  });

  it('should get lista programas with rfc and tipoPrograma', () => {
    httpCore.get.mockReturnValue(of({} as any));

    service.obtenerListaProgramas('RFC123', 'PROSEC').subscribe();

    expect(httpCore.get).toHaveBeenCalledWith(
      PROC_90303.LISTA_PROGRAMAS + 'RFC123&tipoPrograma=PROSEC'
    );
  });

  it('should return selectSolicitud$ from query', (done) => {
    service.getAllState().subscribe((state) => {
      expect(state).toEqual({});
      done();
    });
  });

  it('should post guardar datos', () => {
    const body = { test: true };

    httpCore.post.mockReturnValue(of({} as JSONResponse));

    service.postGuardarDatos(body).subscribe();

    expect(httpCore.post).toHaveBeenCalledWith(
      PROC_90303.GUARDAR,
      { body }
    );
  });
});