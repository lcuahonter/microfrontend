import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SanidadAcuicolaImportacionService } from './sanidad-acuicola-importacion.service';
import { Catalogo } from "@libs/shared/data-access-user/src";
import { DatosDelTerceroDestinatario, Instalacion, Mercancia } from "../../220103/modelos/sanidad-acuicola-importacion.model";
import { Tramite220103State, Tramite220103Store } from "../estados/tramites/tramites220103.store";

describe('SanidadAcuicolaImportacionService', () => {
  let service: SanidadAcuicolaImportacionService;
  let httpMock: HttpTestingController;
  let storeMock: jest.Mocked<Tramite220103Store>;

  beforeEach(() => {
    storeMock = {
      update: jest.fn(),
      setTramite220103State: jest.fn(),
    } as unknown as jest.Mocked<Tramite220103Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SanidadAcuicolaImportacionService,
        { provide: Tramite220103Store, useValue: storeMock },
      ],
    });
    service = TestBed.inject(SanidadAcuicolaImportacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener el catálogo de mercancías', () => {
    const MOCK_DATA: Mercancia[] = [{
      id: '1', descripcion: 'Mercancía 1',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUMT: '',
      umt: '',
      cantidadUMC: '',
      umc: '',
      nombreComun: '',
      nombreCientifico: '',
      faseDesarrollo: '',
      uso: '',
      otroUso: '',
      origen: '',
      paisOrigen: '',
      paisProcedencia: ''
    }];
    service.getMercancias().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/mercancia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de aduanas de ingreso', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'Aduana 1' }];
    service.getAdunaDeIngreso().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/aduna-de-ingreso.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de medios de transporte', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'Transporte 1' }];
    service.getMedioDeTransporte().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/medio-de-transporte.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de países', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'México' }];
    service.getPais().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/pais.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de orígenes', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'Origen 1' }];
    service.getOrigen().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/origen.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de UMC', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'UMC 1' }];
    service.getUmc().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/umc.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de usos', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'Uso 1' }];
    service.getUso().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/uso.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener el catálogo de colonias', () => {
    const MOCK_DATA: Catalogo[] = [{ id: 1, descripcion: 'Colonia 1' }];
    service.getColonia().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/colonia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener la lista de destinatarios', () => {
    const MOCK_DATA: DatosDelTerceroDestinatario[] = [{
      id: '1', nombre: 'Destinatario 1',
      primerApellido: '',
      segundoApellido: '',
      razonSocial: '',
      telefono: '',
      correoElectronico: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      pais: '',
      estado: '',
      municipioAlcaldia: '',
      colonia: '',
      lada: '',
      codigoPostal: ''
    }];
    service.getDestinatario().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/destinatario.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener la lista de instalaciones', () => {
    const MOCK_DATA: Instalacion[] = [{
      id: '1', nombre: 'Instalación 1',
      primerApellido: '',
      segundoApellido: '',
      telefono: '',
      correoElectronico: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      pais: '',
      estado: '',
      municipio: '',
      colonia: '',
      lada: '',
      codigoPostal: ''
    }];
    service.getInstalacion().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/instalacion.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe obtener los datos generales del trámite', () => {
    const MOCK_DATA: Tramite220103State = { tablaDestinatario: [], tablaMercancia: [], tablaInstalacion: [] };
    service.obtenerDatos().subscribe(data => {
      expect(data).toEqual(MOCK_DATA);
    });
    const REQ = httpMock.expectOne('/assets/json/220103/datos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_DATA);
  });

  it('debe actualizar el estado del store', () => {
    const MOCK_STATE: Tramite220103State = {
      tablaDestinatario: [],
      tablaMercancia: [],
      tablaInstalacion: [],
    };
    service.actualizarEstado(MOCK_STATE);
    expect(storeMock.update).toHaveBeenCalledWith(MOCK_STATE);
    expect(storeMock.setTramite220103State).toHaveBeenCalledWith('tablaDestinatario', [MOCK_STATE.tablaDestinatario]);
    expect(storeMock.setTramite220103State).toHaveBeenCalledWith('tablaMercancia', [MOCK_STATE.tablaMercancia]);
    expect(storeMock.setTramite220103State).toHaveBeenCalledWith('tablaInstalacion', [MOCK_STATE.tablaInstalacion]);
  });
});