import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SanitarioService } from './sanitario.service';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasTabla, RespuestaTabla } from '../components/domicillo/domicillo.component';
import { DatosDeSolicitud, RespuestaConsulta } from '../models/solicitud-datos.model';

describe('SanitarioService', () => {
  let service: SanitarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SanitarioService]
    });
    service = TestBed.inject(SanitarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Prueba para verificar la creación del servicio
  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  // Pruebas para getDatos()
  describe('getDatos', () => {
    it('debería obtener datos de derechos correctamente', () => {
      const mockData = { ejemplo: 'datos' };
      
      service.getDatos().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('assets/json/260906/derechos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('debería manejar errores en getDatos', () => {
      const errorMessage = 'Error 404';
      
      service.getDatos().subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/json/260906/derechos.json');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  // Pruebas para getProveedordata()
  describe('getProveedordata', () => {
    it('debería obtener datos de proveedores correctamente', () => {
      const mockData = { proveedores: [] };
      
      service.getProveedordata().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('assets/json/260906/proveedor.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  // Pruebas para getLocalidaddata()
  describe('getLocalidaddata', () => {
    it('debería obtener datos de localidades correctamente', () => {
      const mockData = { localidades: [] };
      
      service.getLocalidaddata().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('assets/json/260906/estadolocalidad.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  // Pruebas para getData()
  describe('getData', () => {
    it('debería obtener datos de terceros correctamente', () => {
      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Tercero 1' }
      ];
      
      service.getData().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('assets/json/260906/terceros-relacionadoes.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  // Pruebas para obtenerFormaFarmaceuticaList()
  describe('obtenerFormaFarmaceuticaList', () => {
    it('debería obtener formas farmacéuticas correctamente', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        data: [{ id: 1, descripcion: 'Tableta' }],
        message: 'OK'
      };
      
      service.obtenerFormaFarmaceuticaList().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/seleccion.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Pruebas para obtenerEstadoList()
  describe('obtenerEstadoList', () => {
    it('debería obtener estados correctamente', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        data: [{ id: 1, descripcion: 'Activo' }],
        message: 'OK'
      };
      
      service.obtenerEstadoList().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/seleccion.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Pruebas para obtenerTablaDatos()
  describe('obtenerTablaDatos', () => {
    it('debería obtener datos de tabla correctamente', () => {
      const mockResponse: RespuestaTabla = {
        codigo: 200,
        datos: [{ clave_Scian: '123', descripcion_Scian: 'Descripción' }],
        mensaje: 'Éxito'
      };
      
      service.obtenerTablaDatos().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/tablaDatos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Pruebas para obtenerMercanciasDatos()
  describe('obtenerMercanciasDatos', () => {
    it('debería obtener datos de mercancías correctamente', () => {
      const mockResponse: MercanciasTabla = {
        codigo: 200,
        datos: [{
          clasificacion: 'Farmacéutico',
          especificar: 'Especificación',
          denominacionEspecifica: 'Denominación Específica',
          denominacionDistintiva: 'Denominación Distintiva',
          denominacionComun: 'Denominación Común',
          formaFarmaceutica: 'Tableta',
          estadoFisico: 'Sólido',
          fraccionArancelaria: '1234.56',
          descripcionFraccion: 'Descripción',
          unidad: 'Kg',
          cantidadUMC: '100',
          unidadUMT: 'g',
          cantidadUMT: '100000',
          presentacion: 'Caja',
          numeroRegistro: 'REG-123',
          paisDeOrigen: 'México',
          paisDeProcedencia: 'México',
          tipoProducto: 'Medicamento',
          usoEspecifico: 'Humano',
          fechaCaducidad: '2025-12-31'
        }],
        mensaje: 'Éxito'
      };
      
      service.obtenerMercanciasDatos().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/mercanciasDatos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Pruebas para obtenerDatosDeSolicitud()
  describe('obtenerDatosDeSolicitud', () => {
    it('debería obtener datos de solicitud correctamente', () => {
      const mockResponse: DatosDeSolicitud = {
        tablaHeadData: ['Col1', 'Col2'],
        tablaFilaDatos: [],
        hacerlosRadioOptions: []
      };
      
      service.obtenerDatosDeSolicitud().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/solicitud-datos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Pruebas para getDatosConsulta()
  describe('getDatosConsulta', () => {
    it('debería obtener datos de consulta correctamente', () => {
      const mockResponse: RespuestaConsulta = {
        success: true,
        datos: {} as any,
        message: 'Éxito'
      };
      
      service.getDatosConsulta().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/260906/consulta-260906.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});