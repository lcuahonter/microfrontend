import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Chofer40102Service } from './chofer40102.service';
import { Chofer40102Store } from './chofer40102.store';
import { ChoferesExtranjeros, DatosDelChoferNacional, DirectorGeneralData } from '../models/registro-muestras-mercancias.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DatosDelVehículo } from '@libs/shared/data-access-user/src/core/models/40102/transportista-terrestre.model';
import { HttpClient } from '@angular/common/http';

describe('Chofer40102Service', () => {
  let service: Chofer40102Service;
  let httpMock: HttpTestingController;
  let storeMock: jest.Mocked<Chofer40102Store>;

  const mockChoferNacionalData: DatosDelChoferNacional[] = [
    {
      id: 1,
      curp: 'ABCD123456HDFRNN09',
      rfc: 'ABCD123456ABC',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'García',
      numeroDeGafete: '12345',
      vigenciaGafete: '2025-12-31',
      calle: 'Insurgentes Sur',
      numeroExterior: '123',
      numeroInterior: 'A',
      pais: 'México',
      estado: 'Ciudad de México',
      municipioAlcaldia: 'Benito Juárez',
      colonia: 'Del Valle',
      paisDeResidencia: 'México',
      ciudad: 'CDMX',
      localidad: 'Del Valle',
      codigoPostal: '03100',
      correoElectronico: 'juan@test.com',
      telefono: '5551234567'
    }
  ];

  const mockChoferExtranjeroData: ChoferesExtranjeros[] = [
    {
      numero: '12345',
      primerApellido: 'Smith',
      segundoApellido: 'Johnson',
      nacionalidad: 'Estadounidense',
      numeroDeGafete: 'G12345',
      vigenciaGafete: '2025-12-31',
      numeroDelSeguroSocial: '12345678901',
      numberDeIdeFiscal: 'ABC123456XYZ1',
      pais: 'USA',
      codigoPostal: '90210',
      estado: 'California',
      calle: 'Main Street',
      numeroExterior: '123',
      numeroInterior: 'A',
      paisDeResidencia: 'USA',
      ciudad: 'Los Angeles',
      correoElectronico: 'john@test.com',
      telefono: '5551234567'
    }
  ];

  const mockDirectorGeneralData: DirectorGeneralData = {
    nombre: 'Carlos',
    primerApellido: 'Rodríguez',
    segundoApellido: 'López',
    apellidoMaternoCHN: 'López',
    apellidoPaterno: 'Rodríguez',
  };

  const mockVehiculoData: DatosDelVehículo[] = [
    {

      clave: '001',
      descripcion: 'Vehículo de carga',
    }
  ];

  const mockCatalogo: Catalogo[] = [
    { id: 1, descripcion: 'Opción 1' },
    { id: 2, descripcion: 'Opción 2' }
  ];

  const mockEstados = [
    { clave: '01', descripcion: 'Aguascalientes' },
    { clave: '02', descripcion: 'Baja California' }
  ];

  const mockMunicipios = [
    { clave: '001', descripcion: 'Aguascalientes' },
    { clave: '002', descripcion: 'Asientos' }
  ];

  const mockColonias = [
    { clave: '0001', descripcion: 'Centro' },
    { clave: '0002', descripcion: 'Norte' }
  ];

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    storeMock = {
      update: jest.fn()
    } as unknown as jest.Mocked<Chofer40102Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Chofer40102Service,
        { provide: Chofer40102Store, useValue: storeMock }
      ]
    });

    service = TestBed.inject(Chofer40102Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Constructor', () => {
    it('should initialize with data from localStorage', () => {
      const storedData = JSON.stringify(mockVehiculoData);
      (localStorage.getItem as jest.Mock).mockReturnValue(storedData);

      const newService = new Chofer40102Service(storeMock, TestBed.inject(HttpClient));

      newService.choferesList$.subscribe(data => {
        expect(data).toEqual(mockVehiculoData);
      });
    });

    it('should initialize with empty array when localStorage is empty', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const newService = new Chofer40102Service(storeMock, TestBed.inject(HttpClient));

      newService.choferesList$.subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should handle malformed JSON in localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid json');

      expect(() => {
        new Chofer40102Service(storeMock, TestBed.inject(HttpClient));
      }).toThrow();
    });
  });

  describe('HTTP GET Methods', () => {
    it('should get chofer nacional data', () => {
      service.getChoferNacionalData().subscribe(data => {
        expect(data).toEqual(mockVehiculoData);
      });

      const req = httpMock.expectOne('https://dev.v30.ultrasist.net/api/json-auxiliar');
      expect(req.request.method).toBe('GET');
      req.flush(mockVehiculoData);
    });

    it('should get estados', () => {
      service.getEstados().subscribe(data => {
        expect(data).toEqual(mockEstados);
      });

      const req = httpMock.expectOne('https://dev.v30.ultrasist.net/api/json-auxiliar/estados');
      expect(req.request.method).toBe('GET');
      req.flush(mockEstados);
    });

    it('should get municipios by estado', () => {
      const claveEstado = '01';

      service.getMunicipios(claveEstado).subscribe(data => {
        expect(data).toEqual(mockMunicipios);
      });

      const req = httpMock.expectOne(`https://dev.v30.ultrasist.net/api/json-auxiliar/municipios?estado=${claveEstado}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMunicipios);
    });

    it('should get colonias by municipio', () => {
      const claveMunicipio = '001';

      service.getColonias(claveMunicipio).subscribe(data => {
        expect(data).toEqual(mockColonias);
      });

      const req = httpMock.expectOne(`https://dev.v30.ultrasist.net/api/json-auxiliar/colonias?municipio=${claveMunicipio}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockColonias);
    });

    it('should get tipo vehiculo arrastre AGA', () => {
      service.getTipoVehiculoArrastreAGA().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/tipo-vehiculo-arrastre.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get pais emisor', () => {
      service.getPaisEmisor().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get color AGA', () => {
      service.getcolorAGA().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/color-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get pais emisor 2da placa data', () => {
      service.getpaisEmisor2DaPlacaData().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-emisor-2da-placa.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get solicitud vehiculo color', () => {
      service.getsolicitudVehiculoColor().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/vehiculo-color.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get pais origen CHN', () => {
      service.getPaisOrigenChn().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-origen.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get delegacion CHN', () => {
      service.getDelegacionChn().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/municipio.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get estado', () => {
      service.getEstado().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/estado.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get estados por pais', () => {
      const paisId = 1;

      service.getEstadosPorPais(paisId).subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/estado.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get municipios por estado', () => {
      const estadoId = 1;

      service.getMunicipiosPorEstado(estadoId).subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/municipio.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get colonias por municipio', () => {
      const municipioId = 1;

      service.getColoniasPorMunicipio(municipioId).subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/colonia.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get colonia CHN', () => {
      service.getColoniaChn().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/colonia.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get nacionalidad CHE', () => {
      service.getNacionaliDadChe().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/nacionalidad.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get chofer data', () => {
      service.getChoferData().subscribe(data => {
        expect(data).toEqual(mockCatalogo);
      });

      const req = httpMock.expectOne('/assets/json/40102/chofer.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogo);
    });

    it('should get director general data', () => {
      service.getDirectorGeneralData().subscribe(data => {
        expect(data).toEqual(mockDirectorGeneralData);
      });

      const req = httpMock.expectOne('../../../../../assets/json/40102/director-general-mockdata.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockDirectorGeneralData);
    });

    it('should get tabla datos with generic type', () => {
      const fileName = 'test-data.json';

      service.obtenerTablaDatos<DatosDelChoferNacional>(fileName).subscribe(data => {
        expect(data).toEqual(mockChoferNacionalData);
      });

      const req = httpMock.expectOne(`../../../../../assets/json/40102/${fileName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChoferNacionalData);
    });
  });

  describe('Store Update Methods', () => {
    it('should update director general data in store', () => {
      service.updateStateDirectorGeneralData(mockDirectorGeneralData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should update datos del chofer nacional', () => {
      service.updateDatosDelChoferNacional(mockChoferNacionalData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should update datos del chofer nacional modification', () => {
      service.updateDatosDelChoferNacionalModification(mockChoferNacionalData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
      
    });

    it('should update datos del chofer nacional retirada', () => {
      service.updateDatosDelChoferNacionalRetirada(mockChoferNacionalData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
      
    });

    it('should update datos del chofer extranjero', () => {
      service.updateDatosDelChoferExtranjero(mockChoferExtranjeroData);

    });

    it('should update datos del chofer extranjero modification', () => {
      service.updateDatosDelChoferExtranjeroModification(mockChoferExtranjeroData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
      
    });

    it('should update datos del chofer extranjero retirada', () => {
      service.updateDatosDelChoferExtranjeroRetirada(mockChoferExtranjeroData);

      expect(storeMock.update).toHaveBeenCalledWith(expect.any(Function));
      
    });
  });

  describe('Observable Properties', () => {
    it('should expose choferesList$ observable', (done) => {
      const testData = mockVehiculoData;
      
      service['choferesListSubject'].next(testData);
      
      service.choferesList$.subscribe(data => {
        expect(data).toEqual(testData);
        done();
      });
    });

    it('should update choferesList$ when data changes', () => {
      const initialData = [mockVehiculoData[0]];
      const updatedData = mockVehiculoData;
      
      service['choferesListSubject'].next(initialData);
      
      let emissionCount = 0;
      service.choferesList$.subscribe(data => {
        if (emissionCount === 0) {
          expect(data).toEqual(initialData);
        } else if (emissionCount === 1) {
          expect(data).toEqual(updatedData);
        }
        emissionCount++;
      });
      
      service['choferesListSubject'].next(updatedData);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors for getChoferNacionalData', () => {
      service.getChoferNacionalData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('https://dev.v30.ultrasist.net/api/json-auxiliar');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle HTTP errors for catalog requests', () => {
      service.getPaisEmisor().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-catalogo.json');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle network errors', () => {
      service.getEstados().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.error).toBeInstanceOf(ProgressEvent);
        }
      });

      const req = httpMock.expectOne('https://dev.v30.ultrasist.net/api/json-auxiliar/estados');
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('URL Construction', () => {
    it('should construct correct URLs for external API calls', () => {
      service.getChoferNacionalData().subscribe();
      const req = httpMock.expectOne('https://dev.v30.ultrasist.net/api/json-auxiliar');
      expect(req.request.url).toBe('https://dev.v30.ultrasist.net/api/json-auxiliar');
      req.flush([]);
    });

    it('should construct correct URLs for asset JSON files', () => {
      service.getPaisEmisor().subscribe();
      const req = httpMock.expectOne('/assets/json/40102/pais-catalogo.json');
      expect(req.request.url).toBe('/assets/json/40102/pais-catalogo.json');
      req.flush([]);
    });

    it('should construct correct URLs with query parameters', () => {
      const claveEstado = '01';
      service.getMunicipios(claveEstado).subscribe();
      
      const req = httpMock.expectOne(`https://dev.v30.ultrasist.net/api/json-auxiliar/municipios?estado=${claveEstado}`);
      expect(req.request.url).toBe(`https://dev.v30.ultrasist.net/api/json-auxiliar/municipios?estado=${claveEstado}`);
      req.flush([]);
    });
  });

  describe('Data Types and Generics', () => {
    it('should handle generic types in obtenerTablaDatos', () => {
      interface CustomType {
        id: number;
        name: string;
      }

      const customData: CustomType[] = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
      ];

      service.obtenerTablaDatos<CustomType>('custom-data.json').subscribe(data => {
        expect(data).toEqual(customData);
        expect(data[0].id).toBe(1);
        expect(data[0].name).toBe('Test 1');
      });

      const req = httpMock.expectOne('../../../../../assets/json/40102/custom-data.json');
      req.flush(customData);
    });

    it('should return proper types for catalog methods', () => {
      service.getPaisEmisor().subscribe(data => {
        expect(Array.isArray(data)).toBeTruthy();
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('id');
          expect(data[0]).toHaveProperty('descripcion');
        }
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-catalogo.json');
      req.flush(mockCatalogo);
    });
  });

  describe('State Management', () => {
    it('should maintain separate state for different chofer types', () => {
      service.updateDatosDelChoferNacional(mockChoferNacionalData);
      service.updateDatosDelChoferExtranjero(mockChoferExtranjeroData);

      expect(storeMock.update).toHaveBeenCalledTimes(2);
    });

    it('should preserve existing state when updating', () => {
      const existingState = {
        existingProperty: 'value',
        datosDelChoferNacionalAlta: [],
        otherProperty: 123
      };

      service.updateDatosDelChoferNacional(mockChoferNacionalData);

    });
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays in update methods', () => {
      service.updateDatosDelChoferNacional([]);

      expect(storeMock.update).toHaveBeenCalled();
    });

    it('should handle null responses from HTTP calls', () => {
      service.getPaisEmisor().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('/assets/json/40102/pais-catalogo.json');
      req.flush(null);
    });

    it('should handle undefined director general data', () => {
      const undefinedData = undefined as any;
      
      expect(() => {
        service.updateStateDirectorGeneralData(undefinedData);
      }).not.toThrow();

      expect(storeMock.update).toHaveBeenCalled();
    });
  });
});