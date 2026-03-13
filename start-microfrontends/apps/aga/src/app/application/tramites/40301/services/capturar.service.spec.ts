import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CapturarService } from './capturar.service';
import { Tramite40301Store, Tramite40301State } from '../estados/tramite40301.store';
import { Tramite40301Query } from '../estados/tramite40301.query';
import { CaatNaviroMetaInfo } from '../modelos/caat-naviero.modalidad.model';
import { Catalogo, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CapturarService', () => {
  let service: CapturarService;
  let httpMock: HttpTestingController;
  let mockStore: jest.Mocked<Tramite40301Store>;
  let mockQuery: jest.Mocked<Tramite40301Query>;

  beforeEach(() => {
    mockStore = {
      update: jest.fn(),
      setInitialValues: jest.fn(),
      setDirectorGeneralNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setRol: jest.fn(),
      setTipoAgente: jest.fn(),
    } as unknown as jest.Mocked<Tramite40301Store>;

    mockQuery = {
      select: jest.fn(),
    } as unknown as jest.Mocked<Tramite40301Query>;

    TestBed.configureTestingModule({
      imports: [WizardComponent, TituloComponent, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        CapturarService,
        { provide: Tramite40301Store, useValue: mockStore },
        { provide: Tramite40301Query, useValue: mockQuery },
      ],
    });

    service = TestBed.inject(CapturarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set initial values in the store', () => {
    // Act: Call the `setInitialValues` method of the service
    service.setInitialValues();
  
    // Assert: Verify that the store's `setInitialValues` method was called
    expect(mockStore.setInitialValues).toHaveBeenCalled();
  });

  it('should get solicitud state', () => {
    service.getTramiteState();
    expect(mockQuery.select).toHaveBeenCalled();
  });

  it('should fetch meta info', () => {
    const mockMetaInfo: CaatNaviroMetaInfo = { tutilo: 'Test Title', tipoAgenteLabel: 'Test Label' };

    service.obtenerMetaInfo().subscribe((data) => {
      expect(data).toEqual(mockMetaInfo);
    });

    const req = httpMock.expectOne('assets/json/40301/metaData.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockMetaInfo);
  });

  it('should fetch user roles', () => {
    const mockRoles: string[] = ['Admin', 'User'];

    service.obtenerRolesUsuario().subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne('assets/json/40301/userRoles.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should fetch agent catalog', () => {
    const mockCatalog: Catalogo[] = [
      { id: 1, clave: 'Agent 1', descripcion: 'Agent1' },
      { id: 2, clave: 'Agent 2', descripcion: 'Agent2' },
    ];

    service.getCatalogo().subscribe((catalog) => {
      expect(catalog).toEqual(mockCatalog);
    });

    const req = httpMock.expectOne('assets/json/40301/tipoAgentoData.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalog);
  });

  it('should fetch tramite ID', () => {
    const mockTramiteId = '12345';

    service.obtenerIdTramite().subscribe((id) => {
      expect(id).toBe(mockTramiteId);
    });

    const req = httpMock.expectOne('assets/json/40301/obtenerIdTramite');
    expect(req.request.method).toBe('GET');
    req.flush(mockTramiteId);
  });

  /**
   * Test for actualizarEstadoFormulario method
   */
  describe('#actualizarEstadoFormulario', () => {
    it('should update all form state properties in the store', () => {
      // Arrange
      const mockFormData: Tramite40301State = {
        cveFolioCaat: 'TEST-FOLIO-001',
        rol: 'Administrator',
        tipoAgente: 'Agente naviero',
        directorGeneralNombre: 'Juan Carlos',
        primerApellido: 'Pérez',
        segundoApellido: 'García'
      };

      // Act
      service.actualizarEstadoFormulario(mockFormData);

      // Assert
      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledWith(mockFormData.directorGeneralNombre);
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith(mockFormData.primerApellido);
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith(mockFormData.segundoApellido);
      expect(mockStore.setRol).toHaveBeenCalledWith(mockFormData.rol);
      expect(mockStore.setTipoAgente).toHaveBeenCalledWith(mockFormData.tipoAgente);
    });

    it('should handle undefined values gracefully', () => {
      // Arrange
      const mockFormDataWithUndefined: Tramite40301State = {
        cveFolioCaat: 'TEST-FOLIO-002',
        rol: undefined as any,
        tipoAgente: undefined as any,
        directorGeneralNombre: undefined as any,
        primerApellido: undefined as any,
        segundoApellido: undefined as any
      };

      // Act
      service.actualizarEstadoFormulario(mockFormDataWithUndefined);

      // Assert
      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledWith(undefined);
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith(undefined);
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith(undefined);
      expect(mockStore.setRol).toHaveBeenCalledWith(undefined);
      expect(mockStore.setTipoAgente).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty string values', () => {
      // Arrange
      const mockFormDataWithEmptyStrings: Tramite40301State = {
        cveFolioCaat: '',
        rol: '',
        tipoAgente: '',
        directorGeneralNombre: '',
        primerApellido: '',
        segundoApellido: ''
      };

      // Act
      service.actualizarEstadoFormulario(mockFormDataWithEmptyStrings);

      // Assert
      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledWith('');
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith('');
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith('');
      expect(mockStore.setRol).toHaveBeenCalledWith('');
      expect(mockStore.setTipoAgente).toHaveBeenCalledWith('');
    });

    it('should call store methods exactly once for each property', () => {
      // Arrange
      const mockFormData: Tramite40301State = {
        cveFolioCaat: 'TEST-FOLIO-003',
        rol: 'User',
        tipoAgente: 'Agente internacional de carga',
        directorGeneralNombre: 'María Elena',
        primerApellido: 'González',
        segundoApellido: 'López'
      };

      // Act
      service.actualizarEstadoFormulario(mockFormData);

      // Assert
      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledTimes(1);
      expect(mockStore.setPrimerApellido).toHaveBeenCalledTimes(1);
      expect(mockStore.setSegundoApellido).toHaveBeenCalledTimes(1);
      expect(mockStore.setRol).toHaveBeenCalledTimes(1);
      expect(mockStore.setTipoAgente).toHaveBeenCalledTimes(1);
    });

    it('should handle partial form data updates', () => {
      // Arrange
      const partialFormData: Partial<Tramite40301State> = {
        directorGeneralNombre: 'Carlos Alberto',
        primerApellido: 'Mendoza'
        // Note: Some properties are missing
      };

      // Act
      service.actualizarEstadoFormulario(partialFormData as Tramite40301State);

      // Assert
      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledWith('Carlos Alberto');
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith('Mendoza');
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith(undefined);
      expect(mockStore.setRol).toHaveBeenCalledWith(undefined);
      expect(mockStore.setTipoAgente).toHaveBeenCalledWith(undefined);
    });
  });
});