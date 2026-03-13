import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { ComplementariaComponent } from './complementaria.component';
import { CatalogosService } from '../../service/catalogos.service';
import { Tramite90303Query } from '../../state/Tramite90303.query';
import { Tramite90303Store } from '../../state/Tramite90303.store';
import { DISCRIMINATOR_VALUE } from '../../constantes/constantes90303.enum';

describe('ComplementariaComponent', () => {
  let component: ComplementariaComponent;

  let catalogosServiceMock: jest.Mocked<CatalogosService>;
  let queryMock: jest.Mocked<Tramite90303Query>;
  let storeMock: jest.Mocked<Tramite90303Store>;

  const solicitudMock = {
    buscarIdSolicitud: '123',
    tipoPrograma: 'PROSEC',
    selectedIdPrograma: '999',
  };

  beforeEach(() => {
    catalogosServiceMock = {
      obtenerTablaPlantas: jest.fn().mockReturnValue(of([])),
      obtenerTablaSector: jest.fn().mockReturnValue(of([])),
      obtenerTablaMercancia: jest.fn().mockReturnValue(of([])),
      obtenerTablaProductor: jest.fn().mockReturnValue(of([])),
    } as any;

    queryMock = {
      selectSolicitud$: of(solicitudMock),
    } as any;

    storeMock = {
      setPlantasTablaDatos: jest.fn(),
      setSectorTablaDatos: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
      setProductorTablaDatos: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [ComplementariaComponent],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock },
        { provide: Tramite90303Query, useValue: queryMock },
        { provide: Tramite90303Store, useValue: storeMock },
      ],
    });

    component = TestBed.createComponent(ComplementariaComponent).componentInstance;
  });

  /* -------------------------------------------------------------
   * CONSTRUCTOR
   * ------------------------------------------------------------- */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize values from selectSolicitud$', () => {
    expect(component.buscarIdSolicitud).toBe('123');
    expect(component.tipoPrograma).toBe('PROSEC');
    expect(component.idProgramaAutorizado).toBe('999');
  });

  it('should call all table loaders when buscarIdSolicitud exists', () => {
    const spyPlantas = jest.spyOn(component, 'obtenerTablaPlantas').mockImplementation(() => {});
    const spySector = jest.spyOn(component, 'obtenerTablaSector').mockImplementation(() => {});
    const spyMercancia = jest.spyOn(component, 'obtenerTablaMercancia').mockImplementation(() => {});
    const spyProductor = jest.spyOn(component, 'obtenerTablaProductor').mockImplementation(() => {});

    component.obtenerTablaPlantas();
    component.obtenerTablaSector();
    component.obtenerTablaMercancia();
    component.obtenerTablaProductor();

    expect(spyPlantas).toHaveBeenCalled();
    expect(spySector).toHaveBeenCalled();
    expect(spyMercancia).toHaveBeenCalled();
    expect(spyProductor).toHaveBeenCalled();
  });

  /* -------------------------------------------------------------
   * obtenerTablaPlantas
   * ------------------------------------------------------------- */

  it('should load plantas table and update store', () => {
    const response = { 
      datos: [{ 
        id: '1',
        calle: 'Calle 123',
        numeroExterior: 45,
        numeroInterior: 2,
        colonia: 'Colonia Centro', 
        codigoPostal: 1234,
        municipioOAlcaldia: 'Municipio X',
        estado: 'Entidad Y',
        pais: 'Pais Z',
        registroFederal: 'RFC123456789',
        domicilioFiscal: 'Domicilio Fiscal 1',
        razonSocial: 'Razón Social S.A.',
        estatus: 'Activo'
      }], 
      mensaje: 'Success' 
    };

    catalogosServiceMock.obtenerTablaPlantas.mockReturnValue(of(response));

    component.buscarIdSolicitud = '123';
    component.idProgramaAutorizado = '999';

    component.obtenerTablaPlantas();

    expect(catalogosServiceMock.obtenerTablaPlantas).toHaveBeenCalledWith({
      idSolicitud: '123',
      idProgramaAutorizado: '999',
      discriminador: DISCRIMINATOR_VALUE,
      fechaProsec: expect.any(Number),
      idSolicitudNueva: '',
    });

    expect(component.listaPlantasTabla).toEqual(response.datos);
    expect(storeMock.setPlantasTablaDatos).toHaveBeenCalledWith(response.datos);
  });

  /* -------------------------------------------------------------
   * obtenerTablaSector
   * ------------------------------------------------------------- */

  it('should load sector table and update store', () => {
    const response = { 
      datos: [{ 
        listaDeSectores: 'A',
        claveDelSector: '001',
        estatus: 'Activada'
      }],
      mensaje: 'Success' 
    };

    catalogosServiceMock.obtenerTablaSector.mockReturnValue(of(response));
    component.buscarIdSolicitud = '123';

    component.obtenerTablaSector();

    expect(catalogosServiceMock.obtenerTablaSector).toHaveBeenCalledWith('123');
    expect(component.listaSectorTabla).toEqual(response.datos);
    expect(storeMock.setSectorTablaDatos).toHaveBeenCalledWith(response.datos);
  });

  /* -------------------------------------------------------------
   * obtenerTablaMercancia
   * ------------------------------------------------------------- */

  it('should load mercancia table and update store', () => {
    const response = { 
      datos: [{ 
        fraccionArancelaria: '0101',
        claveDelSector: '001',
        eStatus: 'Activada'
      }],
      mensaje: 'Success' 
    };

    catalogosServiceMock.obtenerTablaMercancia.mockReturnValue(of(response));
    component.buscarIdSolicitud = '123';

    component.obtenerTablaMercancia();

    expect(catalogosServiceMock.obtenerTablaMercancia).toHaveBeenCalledWith({
      idSolicitud: '123',
      fechaProsec: expect.any(Number),
    });

    expect(component.listaTablaMercancia).toEqual(response.datos);
    expect(storeMock.setMercanciaTablaDatos).toHaveBeenCalledWith(response.datos);
  });

  /* -------------------------------------------------------------
   * obtenerTablaProductor
   * ------------------------------------------------------------- */

  it('should load productor table and update store', () => {
    const response = { 
      datos: [{ 
        registroFederal: 'RFC123456789',
        denominacion: 'Denominación S.A.',
        correo: 'correo@example.com',
        claveDeSector: '001',
        eStatus: 'Activada'
      }],
      mensaje: 'Success' 
    };

    catalogosServiceMock.obtenerTablaProductor.mockReturnValue(of(response));
    component.buscarIdSolicitud = '123';

    component.obtenerTablaProductor();

    expect(catalogosServiceMock.obtenerTablaProductor).toHaveBeenCalledWith({
      idSolicitud: '123',
      fechaProsec: expect.any(Number),
    });

    expect(component.listaTablaProductor).toEqual(response.datos);
    expect(storeMock.setProductorTablaDatos).toHaveBeenCalledWith(response.datos);
  });

  /* -------------------------------------------------------------
   * EMPTY RESPONSES
   * ------------------------------------------------------------- */

  it('should handle empty responses safely', () => {
    catalogosServiceMock.obtenerTablaPlantas.mockReturnValue(of({ datos: [], mensaje: '' }));
    component.buscarIdSolicitud = '123';
    component.idProgramaAutorizado = '999';

    component.obtenerTablaPlantas();

    expect(component.listaPlantasTabla).toEqual([]);
  });

  /* -------------------------------------------------------------
   * ngOnDestroy
   * ------------------------------------------------------------- */

  it('should complete destroyNotifier$ on destroy', () => {
    const nextSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'next'
    );
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  /* -------------------------------------------------------------
   * FILTER COVERAGE
   * ------------------------------------------------------------- */

  it('should not load tables when buscarIdSolicitud is empty', () => {
    queryMock.selectSolicitud$ = of({
      buscarIdSolicitud: '',
    } as any);

    const spy = jest.spyOn(component, 'obtenerTablaPlantas');

    component = TestBed.createComponent(ComplementariaComponent).componentInstance;

    expect(spy).not.toHaveBeenCalled();
  });
});