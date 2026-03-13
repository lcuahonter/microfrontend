import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatosTramiteService } from './datos-tramite.service';
import { RespuestaApi, RespuestaAduanas, RespuestaConsulta, RespuestaContenedor } from '@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model';
import { RespuestaCatalogos } from "@libs/shared/data-access-user/src";


describe('DatosTramiteService', () => {
  let service: DatosTramiteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatosTramiteService],
    });

    service = TestBed.inject(DatosTramiteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch contenedores data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Contenedor 1' }],
      message: ''
    };

    service.getContenedores().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/tipoLista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should simulate file upload', () => {
    const mockResponse: RespuestaApi = { success: true, message: 'File uploaded successfully' };

    service.uploadArchivo().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/contenedorLista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should simulate form submission', () => {
    const mockResponse: RespuestaAduanas =
    {
      code: 200,
      data: [{ id: 1, descripcion: 'Aduana 1' }],
      message: ''
    };
    service.submitSolicitud().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/aduanaList.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch table data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Contenedor 1' }],
      message: ''
    };;

    service.getDatosTableData().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/datosTabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch datos del solicitante', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Contenedor 1' }],
      message: ''
    };;

    service.getDatosSolicitante().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/datosSolicitante.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch consulta data', () => {
    const mockResponse: RespuestaConsulta =
    {
      success: true,
      datos: {
        "tipoBusqueda": "Contenedor",
        "aduana": "0",
        "fechaIngreso": "15/10/2025",
        "inicialesContenedor": "equipo",
        "numeroContenedor": "equipo",
        "digitoDeControl": "1",
        "contenedores": "C11223",
        "aduanaMenuDesplegable": "0",
        "fechaDeIngreso": "15/10/2025",
        "menuDesplegable": "0",
        "numeroManifiesta": "1",
        "datosDelContenedor": [
          {
            "id": 1,
            "iniciales_contenedor": "BBZM",
            "numero_contenedor": 1098765,
            "digito_verificador": 4,
            "tipo_contenedor": "AC",
            "aduana": 430,
            "fecha_inicio": "13-03-2025",
            "vigencia": "13-03-2026",
            "puede_registrar": "Sí",
            "existe_en_vucem": "Sí",
            "idConstancia": "CONST12345",
            "numeroManifiesto": "MANI67890",
            "idSolicitud": "SOLICITUD001",
            "fechaInicio": "2024-03-01"
          }
        ]
      },
      message: ''
    };
    service.getDatosConsulta().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/11201/consulta_11201.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
    it('should call agregarSolicitud and return RespuestaContenedor', () => {
      const mockResponse: RespuestaContenedor = {
        "success": true,
        "message": "Solicitud enviada exitosamente",
        "datos": {
          "id": 1,
          "iniciales_contenedor": "BBZM",
          "numero_contenedor": 1098765,
          "digito_verificador": 4,
          "tipo_contenedor": "AC",
          "aduana": 430,
          "fecha_inicio": "2024-03-13",
          "vigencia": "2025-03-13",
          "puede_registrar": "Sí",
          "existe_en_vucem": "Sí",
          "idConstancia": "CONST12345",
          "numeroManifiesto": "MANI67890",
          "idSolicitud": "SOLICITUD001",
          "fechaInicio": "2024-03-01"
        }
      };
      const payload = {
        "id": 1,
        "iniciales_contenedor": "BBZM",
        "numero_contenedor": 1098765,
        "digito_verificador": 4,
        "tipo_contenedor": "AC",
        "aduana": 430,
        "fecha_inicio": "2024-03-13",
        "vigencia": "2025-03-13",
        "puede_registrar": "Sí",
        "existe_en_vucem": "Sí",
        "idConstancia": "CONST12345",
        "numeroManifiesto": "MANI67890",
        "idSolicitud": "SOLICITUD001",
        "fechaInicio": "2024-03-01"
      };
      const apiUrl = 'https://api-v30.cloud-ultrasist.net/api/sat-t11201/solicitud/constancia-itc/validar';
      service.agregarSolicitud(payload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
  });

  it('should call getTransporteList and return RespuestaCatalogos', () => {
    const mockResponse: RespuestaCatalogos = {
      "code": 200,
      "data": [
        {
          "id": 0,
          "descripcion": "Ferroviario"
        },
        {
          "id": 2,
          "descripcion": "Marítimo"
        }
      ],
      "message": "Seleccione un valor"
    }
    service.getTransporteList('transporte').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/11201/transporte.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getAduanaList and return RespuestaAduanas', () => {
    const mockResponse: RespuestaAduanas = {
      "code": 200,
      "data": [
        {
          "id": 1,
          "descripcion": "Aduana de México"
        },
        {
          "id": 2,
          "descripcion": "Aduana de Argentina"
        },
        {
          "id": 3,
          "descripcion": "Aduana de España"
        }
      ],
      "message": "Seleccione un valor"
    };

    service.getAduanaList('aduana').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/11201/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});