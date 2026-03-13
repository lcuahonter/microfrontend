import { of, throwError } from 'rxjs';
import { CertificadoTecnicoJaponService } from '../service/certificadoTecnicoJapon.service';
import { HttpClient } from '@angular/common/http';
import { Catalogo } from '@ng-mf/data-access-user';
import { Solicitud110218State, Tramite110218Store } from '../estados/tramites/tramite110218.store';

// Mock HttpClient
const mockHttpClient = {
  get: jest.fn()
};

// Mock Tramite110218Store
const mockTramiteStore = {
  setTramite110218State: jest.fn()
};

describe('CertificadoTecnicoJaponService', () => {
  let service: CertificadoTecnicoJaponService;
  let httpClient: jest.Mocked<HttpClient>;
  let tramiteStore: jest.Mocked<Tramite110218Store>;

  // Mock data
  const mockCertificadoData = {
    numeroExpediente: '12345',
    fechaExpedicion: '2024-01-01',
    estado: 'activo',
    valorTotal: 1000,
    esValido: true
  };

  const mockTratadosData = {
    tratadoAcuerdo: 'TLC-001',
    paisBloque: 'MERCOSUR',
    paisdeOrigen: 'Argentina',
    paisDestino: 'Japón',
    fechadeExpedicion: '2024-01-01',
    fechadeVencimiento: '2024-12-31'
  };

  const mockRepresentanteData = {
    empresa: 'Empresa Test S.A.'
  };

  const mockUnidadMedidaData: Catalogo[] = [
  { id: 1, descripcion: 'Kilogramos', clave: 'K' },
  { id: 2, descripcion: 'Metros', clave: 'M' }
  ];

  const mockTipoFacturaData: Catalogo[] = [
      { id: 1, descripcion: 'Factura A', clave: 'FA' },
      { id: 2, descripcion: 'Factura B', clave: 'FB' }
    ];

  const mockSolicitudState: Solicitud110218State = {
    puertodeEmbarque: '',
    puertodeDesembarque: '',
    puertodeTransito: '',
    nombredelaEmbarcacion: '',
    numerodeVuelo: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    numeroderegistroFiscal: '',
    razonSocial: '',
    calle: '',
    numeroLetra: '',
    ciudad: '',
    correoElectronico: '',
    fax: '',
    telefono: '',
    nombredelRepresentante: '',
    cargo: '',
    telefonos: '',
    faxs: '',
    correoElectronicos: '',
    lugar: '',
    observaciones: '',
    tableDataDatos: [],
    unidaddeMedidadeComercializacion: null,
    tipodeFactura: null,
    complementoDelaDescripcion: '',
    marca: '',
    valorMercancia: '',
    numerodeFactura: '',
    numeroSolicitud: 'SOL-001',
    fechaSolicitud: '2024-01-01',
    estado: 'pendiente',
    solicitante: 'Juan Pérez'
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Cast mocks to the correct types
  httpClient = mockHttpClient as unknown as jest.Mocked<HttpClient>;
  tramiteStore = mockTramiteStore as unknown as jest.Mocked<Tramite110218Store>;
    
    // Create service instance with mocked dependencies
    service = new CertificadoTecnicoJaponService(httpClient, tramiteStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should be created with dependencies', () => {
      expect(service).toBeTruthy();
      expect(service).toBeInstanceOf(CertificadoTecnicoJaponService);
    });

    it('should inject HttpClient dependency', () => {
      expect(service['http']).toBe(httpClient);
    });

    it('should inject Tramite110218Store dependency', () => {
      expect(service['estado']).toBe(tramiteStore);
    });
  });

  describe('getDatosCertificado', () => {
    it('should return certificate data successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockCertificadoData));

      // Act
      service.getDatosCertificado().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockCertificadoData);
          expect(typeof data['numeroExpediente']).toBe('string');
          expect(typeof data['valorTotal']).toBe('number');
          expect(typeof data['esValido']).toBe('boolean');
          expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/certificado-tecnico-japon.json');
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for getDatosCertificado', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 404');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.getDatosCertificado().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/certificado-tecnico-japon.json');
          done();
        }
      });
    });

    it('should call HttpClient.get with correct URL', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockCertificadoData));

      // Act
      service.getDatosCertificado().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledTimes(1);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/certificado-tecnico-japon.json');
    });

    it('should return observable with mixed value types', (done) => {
      // Arrange
      const mixedData = {
        stringValue: 'test',
        numberValue: 123,
        booleanValue: false
      };
      httpClient.get.mockReturnValue(of(mixedData));

      // Act
      service.getDatosCertificado().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mixedData);
          Object.values(data).forEach(value => {
            expect(['string', 'number', 'boolean'].includes(typeof value)).toBeTruthy();
          });
          done();
        },
        error: done.fail
      });
    });
  });

  describe('gettratados', () => {
    it('should return treaties data successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTratadosData));

      // Act
      service.gettratados().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockTratadosData);
          expect(data.tratadoAcuerdo).toBe('TLC-001');
          expect(data.paisBloque).toBe('MERCOSUR');
          expect(data.paisdeOrigen).toBe('Argentina');
          expect(data.paisDestino).toBe('Japón');
          expect(data.fechadeExpedicion).toBe('2024-01-01');
          expect(data.fechadeVencimiento).toBe('2024-12-31');
          expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/tratados.json');
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for gettratados', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 500');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.gettratados().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });

    it('should return data with all required string properties', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTratadosData));

      // Act
      service.gettratados().subscribe({
        next: (data) => {
          // Assert - All properties should be strings
          expect(typeof data.tratadoAcuerdo).toBe('string');
          expect(typeof data.paisBloque).toBe('string');
          expect(typeof data.paisdeOrigen).toBe('string');
          expect(typeof data.paisDestino).toBe('string');
          expect(typeof data.fechadeExpedicion).toBe('string');
          expect(typeof data.fechadeVencimiento).toBe('string');
          done();
        },
        error: done.fail
      });
    });

    it('should call HttpClient.get with correct URL', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTratadosData));

      // Act
      service.gettratados().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/tratados.json');
    });
  });

  describe('getrepresentante', () => {
    it('should return legal representative data successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockRepresentanteData));

      // Act
      service.getrepresentante().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockRepresentanteData);
          expect(data.empresa).toBe('Empresa Test S.A.');
          expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/representante-legal.json');
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for getrepresentante', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 403');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.getrepresentante().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });

    it('should return data with empresa property as string', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockRepresentanteData));

      // Act
      service.getrepresentante().subscribe({
        next: (data) => {
          // Assert
          expect(typeof data.empresa).toBe('string');
          expect(data.empresa.length).toBeGreaterThan(0);
          done();
        },
        error: done.fail
      });
    });

    it('should call HttpClient.get with correct URL', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockRepresentanteData));

      // Act
      service.getrepresentante().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/representante-legal.json');
    });
  });

  describe('getUnidadMedida', () => {
    it('should return unit of measure catalog successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockUnidadMedidaData));

      // Act
      service.getUnidadMedida().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockUnidadMedidaData);
          expect(Array.isArray(data)).toBeTruthy();
          expect(data.length).toBe(2);
          expect(data[0].descripcion).toBe('Kilogramos');
          expect(data[1].clave).toBe('M');
          done();
        },
        error: done.fail
      });
    });

    it('should handle empty array response', (done) => {
      // Arrange
      const emptyData: Catalogo[] = [];
      httpClient.get.mockReturnValue(of(emptyData));
      
      // Act
      service.getUnidadMedida().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(emptyData);
          expect(Array.isArray(data)).toBeTruthy();
          expect(data.length).toBe(0);
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for getUnidadMedida', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 404');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.getUnidadMedida().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });

    it('should return array of Catalogo objects with correct structure', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockUnidadMedidaData));

      // Act
      service.getUnidadMedida().subscribe({
        next: (data) => {
          // Assert
          data.forEach(item => {
            expect(item).toEqual(expect.objectContaining({
              id: expect.any(Number),
              descripcion: expect.any(String),
              clave: expect.any(String)
            }));
          });
          done();
        },
        error: done.fail
      });
    });

    it('should call HttpClient.get with correct URL', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockUnidadMedidaData));

      // Act
      service.getUnidadMedida().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/unidad-medida.json');
    });
  });

  describe('getTipodeFctura', () => {
    it('should return invoice type catalog successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTipoFacturaData));

      // Act
      service.getTipodeFctura().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockTipoFacturaData);
          expect(Array.isArray(data)).toBeTruthy();
          expect(data.length).toBe(2);
          expect(data[0].descripcion).toBe('Factura A');
          expect(data[1].clave).toBe('FB');
          done();
        },
        error: done.fail
      });
    });

    it('should handle single item array response', (done) => {
      // Arrange
  const singleItemData: Catalogo[] = [{ id: 1, descripcion: 'Única Factura', clave: 'UF' }];
      httpClient.get.mockReturnValue(of(singleItemData));
      
      // Act
      service.getTipodeFctura().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(singleItemData);
          expect(data.length).toBe(1);
          expect(data[0].descripcion).toBe('Única Factura');
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for getTipodeFctura', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 401');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.getTipodeFctura().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });

    it('should return array of Catalogo objects with proper typing', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTipoFacturaData));

      // Act
      service.getTipodeFctura().subscribe({
        next: (data) => {
          // Assert
          expect(Array.isArray(data)).toBeTruthy();
          data.forEach(item => {
            expect(item).toEqual(expect.objectContaining({
              id: expect.any(Number),
              descripcion: expect.any(String),
              clave: expect.any(String)
            }));
          });
          done();
        },
        error: done.fail
      });
    });

    it('should call HttpClient.get with correct URL', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockTipoFacturaData));

      // Act
      service.getTipodeFctura().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/tipo-de-factura.json');
    });
  });

  describe('obtenerRegistro', () => {
    it('should return solicitud state successfully', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockSolicitudState));

      // Act
      service.obtenerRegistro().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mockSolicitudState);
          expect(data.numeroSolicitud).toBe('SOL-001');
          expect(data.fechaSolicitud).toBe('2024-01-01');
          expect(data.estado).toBe('pendiente');
          expect(data.solicitante).toBe('Juan Pérez');
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP error for obtenerRegistro', (done) => {
      // Arrange
      const errorResponse = new Error('HTTP Error 500');
      httpClient.get.mockReturnValue(throwError(() => errorResponse));

      // Act
      service.obtenerRegistro().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });

    it('should call HttpClient.get with correct path including dot prefix', () => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockSolicitudState));

      // Act
      service.obtenerRegistro().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledWith('./assets/json/110218/datos.json');
    });

    it('should return observable of Solicitud110218State type', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockSolicitudState));

      // Act
      service.obtenerRegistro().subscribe({
        next: (data) => {
          // Assert - Check that it has the expected structure
          expect(data).toEqual(expect.objectContaining({
            numeroSolicitud: expect.any(String),
            fechaSolicitud: expect.any(String),
            estado: expect.any(String),
            solicitante: expect.any(String)
          }));
          done();
        },
        error: done.fail
      });
    });

    it('should handle state with additional properties', (done) => {
      // Arrange
      const stateWithExtra = {
        ...mockSolicitudState,
        observaciones: 'Test observations',
        prioridad: 'alta'
      };
      httpClient.get.mockReturnValue(of(stateWithExtra));

      // Act
      service.obtenerRegistro().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(stateWithExtra);
          expect((data as any).observaciones).toBe('Test observations');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('actualizarRegistro', () => {
    it('should call setTramite110218State with provided registro', () => {
      // Arrange
      const testRegistro: Solicitud110218State = {
        puertodeEmbarque: '',
        puertodeDesembarque: '',
        puertodeTransito: '',
        nombredelaEmbarcacion: '',
        numerodeVuelo: '',
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        numeroderegistroFiscal: '',
        razonSocial: '',
        calle: '',
        numeroLetra: '',
        ciudad: '',
        correoElectronico: '',
        fax: '',
        telefono: '',
        nombredelRepresentante: '',
        cargo: '',
        telefonos: '',
        faxs: '',
        correoElectronicos: '',
        lugar: '',
        observaciones: '',
        tableDataDatos: [],
        unidaddeMedidadeComercializacion: null,
        tipodeFactura: null,
        complementoDelaDescripcion: '',
        marca: '',
        valorMercancia: '',
        numerodeFactura: '',
        numeroSolicitud: 'TEST-001',
        fechaSolicitud: '2024-02-01',
        estado: 'aprobado',
        solicitante: 'María García'
      };

      // Act
      service.actualizarRegistro(testRegistro);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledTimes(1);
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
        ...testRegistro
      });
    });

    it('should handle registro with additional properties', () => {
      // Arrange
      const registroWithExtra: Solicitud110218State & any = {
        numeroSolicitud: 'EXTRA-001',
        fechaSolicitud: '2024-03-01',
        estado: 'rechazado',
        solicitante: 'Carlos López',
        observaciones: 'Observaciones adicionales',
        monto: 5000
      };

      // Act
      service.actualizarRegistro(registroWithExtra);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
        ...registroWithExtra
      });
    });

    it('should handle empty registro object', () => {
      // Arrange
      const emptyRegistro = {} as Solicitud110218State;

      // Act
      service.actualizarRegistro(emptyRegistro);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
        ...emptyRegistro
      });
    });

    it('should handle registro with null properties', () => {
      // Arrange
      const registroWithNulls: Solicitud110218State = {
        puertodeEmbarque: '',
        puertodeDesembarque: '',
        puertodeTransito: '',
        nombredelaEmbarcacion: '',
        numerodeVuelo: '',
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        numeroderegistroFiscal: '',
        razonSocial: '',
        calle: '',
        numeroLetra: '',
        ciudad: '',
        correoElectronico: '',
        fax: '',
        telefono: '',
        nombredelRepresentante: '',
        cargo: '',
        telefonos: '',
        faxs: '',
        correoElectronicos: '',
        lugar: '',
        observaciones: '',
        tableDataDatos: [],
        unidaddeMedidadeComercializacion: null,
        tipodeFactura: null,
        complementoDelaDescripcion: '',
        marca: '',
        valorMercancia: '',
        numerodeFactura: '',
        numeroSolicitud: null as any,
        fechaSolicitud: '2024-04-01',
        estado: undefined as any,
        solicitante: 'Ana Martínez'
      };

      // Act
      service.actualizarRegistro(registroWithNulls);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
        ...registroWithNulls
      });
    });

    it('should not return anything (void method)', () => {
      // Arrange
      const testRegistro: Solicitud110218State = mockSolicitudState;

      // Act
      const result = service.actualizarRegistro(testRegistro);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should create a copy of the registro object', () => {
      // Arrange
      const originalRegistro: Solicitud110218State = { ...mockSolicitudState };

      // Act
      service.actualizarRegistro(originalRegistro);

      // Assert
      const calledWith = tramiteStore.setTramite110218State.mock.calls[0][0];
      expect(calledWith).toEqual(originalRegistro);
      expect(calledWith).not.toBe(originalRegistro); // Should be a different object reference
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple method calls with different responses', () => {
      // Arrange
      httpClient.get
        .mockReturnValueOnce(of(mockCertificadoData))
        .mockReturnValueOnce(of(mockTratadosData))
        .mockReturnValueOnce(of(mockRepresentanteData));

      let certificadoResult: any;
      let tratadosResult: any;
      let representanteResult: any;

      // Act
      service.getDatosCertificado().subscribe(data => certificadoResult = data);
      service.gettratados().subscribe(data => tratadosResult = data);
      service.getrepresentante().subscribe(data => representanteResult = data);

      // Assert
      expect(certificadoResult).toEqual(mockCertificadoData);
      expect(tratadosResult).toEqual(mockTratadosData);
      expect(representanteResult).toEqual(mockRepresentanteData);
      expect(httpClient.get).toHaveBeenCalledTimes(3);
    });

    it('should handle workflow: get data then update registro', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(mockSolicitudState));

      // Act
      service.obtenerRegistro().subscribe({
        next: (data) => {
          const updatedData = { ...data, estado: 'procesado' };
          service.actualizarRegistro(updatedData);
          
          // Assert
          expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
            ...mockSolicitudState,
            estado: 'procesado'
          });
          done();
        },
        error: done.fail
      });
    });

    it('should handle mixed success and error responses', (done) => {
      // Arrange
      httpClient.get
        .mockReturnValueOnce(of(mockUnidadMedidaData))
        .mockReturnValueOnce(throwError(() => new Error('Network error')));

      let successResult: any;
      let errorOccurred = false;

      // Act
      service.getUnidadMedida().subscribe({
        next: (data) => successResult = data,
        error: () => done.fail('First call should succeed')
      });

      service.getTipodeFctura().subscribe({
        next: () => done.fail('Second call should fail'),
        error: (error) => {
          errorOccurred = true;
          
          // Assert
          expect(successResult).toEqual(mockUnidadMedidaData);
          expect(errorOccurred).toBeTruthy();
          expect(error.message).toBe('Network error');
          done();
        }
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle network timeout errors', (done) => {
      // Arrange
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      httpClient.get.mockReturnValue(throwError(() => timeoutError));

      // Act
      service.getDatosCertificado().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.name).toBe('TimeoutError');
          done();
        }
      });
    });

    it('should handle unexpected response format', (done) => {
      // Arrange
      const unexpectedData = 'not an object';
      httpClient.get.mockReturnValue(of(unexpectedData));

      // Act
      service.getDatosCertificado().subscribe({
        next: (data) => {
          // Assert - Jest will handle this gracefully
          expect(data).toBe(unexpectedData);
          done();
        },
        error: done.fail
      });
    });

    it('should handle null response', (done) => {
      // Arrange
      httpClient.get.mockReturnValue(of(null));

      // Act
      service.getrepresentante().subscribe({
        next: (data) => {
          // Assert
          expect(data).toBeNull();
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Method Call Verification', () => {
    it('should verify all HTTP GET methods are called with correct URLs', () => {
      // Arrange
      httpClient.get.mockReturnValue(of({}));

      // Act
      service.getDatosCertificado().subscribe();
      service.gettratados().subscribe();
      service.getrepresentante().subscribe();
      service.getUnidadMedida().subscribe();
      service.getTipodeFctura().subscribe();
      service.obtenerRegistro().subscribe();

      // Assert
      expect(httpClient.get).toHaveBeenCalledTimes(6);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/certificado-tecnico-japon.json');
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/tratados.json');
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/representante-legal.json');
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/unidad-medida.json');
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/110218/tipo-de-factura.json');
      expect(httpClient.get).toHaveBeenCalledWith('./assets/json/110218/datos.json');
    });

    it('should verify actualizarRegistro calls store method with spread operator', () => {
      // Arrange
      const originalRegistro = { ...mockSolicitudState };

      // Act
      service.actualizarRegistro(originalRegistro);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledWith({
        ...originalRegistro
      });
      
      // Verify the spread operator creates a new object
      const calledArgument = tramiteStore.setTramite110218State.mock.calls[0][0];
      expect(calledArgument).toEqual(originalRegistro);
      expect(calledArgument).not.toBe(originalRegistro);
    });
  });

  describe('Observable Return Types', () => {
    it('should return Observable for all getter methods', () => {
      // Arrange
      httpClient.get.mockReturnValue(of({}));

      // Act & Assert
      const obs1 = service.getDatosCertificado();
      const obs2 = service.gettratados();
      const obs3 = service.getrepresentante();
      const obs4 = service.getUnidadMedida();
      const obs5 = service.getTipodeFctura();
      const obs6 = service.obtenerRegistro();

      expect(obs1.constructor.name).toBe('Observable');
      expect(obs2.constructor.name).toBe('Observable');
      expect(obs3.constructor.name).toBe('Observable');
      expect(obs4.constructor.name).toBe('Observable');
      expect(obs5.constructor.name).toBe('Observable');
      expect(obs6.constructor.name).toBe('Observable');
    });
  });

  describe('Service State Management', () => {
    it('should maintain state consistency between calls', () => {
      // Arrange
      const registro1: Solicitud110218State = { ...mockSolicitudState, estado: 'inicial' };
      const registro2: Solicitud110218State = { ...mockSolicitudState, estado: 'procesado' };

      // Act
      service.actualizarRegistro(registro1);
      service.actualizarRegistro(registro2);

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledTimes(2);
      expect(tramiteStore.setTramite110218State).toHaveBeenNthCalledWith(1, { ...registro1 });
      expect(tramiteStore.setTramite110218State).toHaveBeenNthCalledWith(2, { ...registro2 });
    });

    it('should handle rapid successive calls to actualizarRegistro', () => {
      // Arrange
      const registros = [
        { ...mockSolicitudState, estado: 'estado1' },
        { ...mockSolicitudState, estado: 'estado2' },
        { ...mockSolicitudState, estado: 'estado3' }
      ];

      // Act
      registros.forEach(registro => service.actualizarRegistro(registro));

      // Assert
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledTimes(3);
      registros.forEach((registro, index) => {
        expect(tramiteStore.setTramite110218State).toHaveBeenNthCalledWith(index + 1, { ...registro });
      });
    });
  });

  describe('Data Type Validation', () => {
    it('should handle getDatosCertificado with various data types', (done) => {
      // Arrange
      const mixedTypeData = {
        stringProp: 'test string',
        numberProp: 42,
        booleanProp: true,
        anotherNumber: 3.14,
        anotherBoolean: false
      };
      httpClient.get.mockReturnValue(of(mixedTypeData));

      // Act
      service.getDatosCertificado().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(mixedTypeData);
          expect(typeof data['stringProp']).toBe('string');
          expect(typeof data['numberProp']).toBe('number');
          expect(typeof data['booleanProp']).toBe('boolean');
          expect(typeof data['anotherNumber']).toBe('number');
          expect(typeof data['anotherBoolean']).toBe('boolean');
          done();
        },
        error: done.fail
      });
    });

    it('should handle gettratados with empty strings', (done) => {
      // Arrange
      const dataWithEmptyStrings = {
        tratadoAcuerdo: '',
        paisBloque: 'MERCOSUR',
        paisdeOrigen: '',
        paisDestino: 'Japón',
        fechadeExpedicion: '2024-01-01',
        fechadeVencimiento: ''
      };
      httpClient.get.mockReturnValue(of(dataWithEmptyStrings));

      // Act
      service.gettratados().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(dataWithEmptyStrings);
          expect(data.tratadoAcuerdo).toBe('');
          expect(data.paisdeOrigen).toBe('');
          expect(data.fechadeVencimiento).toBe('');
          done();
        },
        error: done.fail
      });
    });

    it('should handle catalog arrays with different structures', (done) => {
      // Arrange
      const catalogWithExtraProps: Catalogo[] = [
        { id: 1, descripcion: 'Test', clave: 'T1', title: 'Extra prop' } as any,
        { id: 2, descripcion: 'Test2', clave: 'T2', relacionadaUmtId: 1, relacionadaAcotacionId: 2 } as any
      ];
      httpClient.get.mockReturnValue(of(catalogWithExtraProps));

      // Act
      service.getUnidadMedida().subscribe({
        next: (data) => {
          // Assert
          expect(data).toEqual(catalogWithExtraProps);
      expect((data[0] as any).title).toBe('Extra prop');
      expect((data[1] as any).relacionadaUmtId).toBe(1);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Error Recovery', () => {
    it('should handle sequential errors and successes', (done) => {
      // Arrange
      let callCount = 0;
      httpClient.get.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return throwError(() => new Error('First call error'));
        }
        return of(mockCertificadoData);
      });

      // Act - First call should fail
      service.getDatosCertificado().subscribe({
        next: () => done.fail('First call should fail'),
        error: (error) => {
          expect(error.message).toBe('First call error');
          
          // Second call should succeed
          service.getDatosCertificado().subscribe({
            next: (data) => {
              expect(data).toEqual(mockCertificadoData);
              expect(httpClient.get).toHaveBeenCalledTimes(2);
              done();
            },
            error: done.fail
          });
        }
      });
    });
  });

  describe('Service Method Coverage', () => {
    it('should verify all public methods are tested', () => {
      // Assert - Verify all public methods exist
      expect(typeof service.getDatosCertificado).toBe('function');
      expect(typeof service.gettratados).toBe('function');
      expect(typeof service.getrepresentante).toBe('function');
      expect(typeof service.getUnidadMedida).toBe('function');
      expect(typeof service.getTipodeFctura).toBe('function');
      expect(typeof service.obtenerRegistro).toBe('function');
      expect(typeof service.actualizarRegistro).toBe('function');
    });

    it('should verify service has correct number of public methods', () => {
      // Assert
      const publicMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(service))
        .filter(name => name !== 'constructor' && typeof service[name as keyof typeof service] === 'function');
      
      expect(publicMethods.length).toBe(7); // 6 HTTP methods + 1 state update method
    });
  });

  describe('Mock Verification', () => {
    it('should verify mock setup is correct', () => {
      // Assert
      expect(mockHttpClient.get).toBeDefined();
      expect(mockTramiteStore.setTramite110218State).toBeDefined();
      expect(jest.isMockFunction(httpClient.get)).toBeTruthy();
      expect(jest.isMockFunction(tramiteStore.setTramite110218State)).toBeTruthy();
    });

    it('should reset mocks between tests', () => {
      // Act
      service.actualizarRegistro(mockSolicitudState);
      
      // Assert initial state
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledTimes(1);
      
      // Clear and verify reset
      jest.clearAllMocks();
      expect(tramiteStore.setTramite110218State).toHaveBeenCalledTimes(0);
    });
  });
});