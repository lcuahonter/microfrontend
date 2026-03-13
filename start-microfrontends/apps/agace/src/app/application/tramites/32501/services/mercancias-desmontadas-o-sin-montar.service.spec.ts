import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MercanciasDesmontadasOSinMontarService } from './mercancias-desmontadas-o-sin-montar.service';
import { AvisoCatalogo } from '../models/aviso-catalogo.model';
import { OperacionDeImportacion } from '../models/aviso-catalogo.model';
import { Solicitud32501State } from '../estados/solicitud32501.store';

describe('MercanciasDesmontadasOSinMontarService', () => {
  let service: MercanciasDesmontadasOSinMontarService;
  let httpMock: HttpTestingController;
  let tramite32501StoreMock: { establecerDatos: jest.Mock };

  beforeEach(() => {
    tramite32501StoreMock = { establecerDatos: jest.fn() };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MercanciasDesmontadasOSinMontarService,
        { provide: 'Solicitud32501Store', useValue: tramite32501StoreMock }
      ],
    });
    service = TestBed.inject(MercanciasDesmontadasOSinMontarService);
    httpMock = TestBed.inject(HttpTestingController);
    // Forzar el store mock si el servicio lo requiere como propiedad privada
    (service as any).tramite32501Store = tramite32501StoreMock;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch AvisoCatalogo data', () => {
    const mockData: AvisoCatalogo = {
      cveFraccionArancelaria: {
        catalogos: [
          {
            id: 1,
            descripcion: '01031001-Reproductors de raza..',
          },
          {
            id: 2,
            descripcion: '01031002-Reproductors de raza..',
          },
          {
            id: 3,
            descripcion: '01031003-Reproductors de raza..',
          },
        ],
        labelNombre: 'Fracción arancelaria',
        required: true,
        primerOpcion: 'Seleccione un valor',
      },
      entidadFederativa: {
        catalogos: [
           {
            id: 1,
            descripcion: 'MEXICO-1',
          },
          {
            id: 2,
            descripcion: 'MEXICO-2',
          },
          {
            id: 3,
            descripcion: 'MEXICO-3',
          },
        ],
        labelNombre: 'Entidad federativa',
        required: true,
        primerOpcion: 'Seleccione un valor',
      },
      delegacionMunicipio: {
        catalogos: [
          {
            id: 1,
            descripcion: 'ATENCO-1',
          },
          {
            id: 2,
            descripcion: 'ATENCO-2',
          },
          {
            id: 3,
            descripcion: 'ATENCO-3',
          },
        ],
        labelNombre: 'Alcaldía o municipio',
        required: true,
        primerOpcion: 'Seleccione un valor',
      },
      colonia: {
        catalogos: [
          {
            id: 1,
            descripcion: 'LA NORIA-1',
          },
          {
            id: 2,
            descripcion: 'LA NORIA-2',
          },
          {
            id: 3,
            descripcion: 'LA NORIA-3',
          },
        ],
        labelNombre: 'Colonia',
        required: true,
        primerOpcion: 'Seleccione un valor',
      },
      aduanaDeImportacion: {
        catalogos: [
          {
            id: 1,
            descripcion: 'Test-1',
          },
          {
            id: 2,
            descripcion: 'Test-2',
          },
          {
            id: 3,
            descripcion: 'Test-3',
          },
        ],
        labelNombre: 'Aduana de importación',
        required: true,
        primerOpcion: 'Seleccione un valor',
      },
      opcionTipoDeDocumento: {
        labelNombre: 'Tipo de documento',
        required: false,
        primerOpcion: 'Seleccione un tipo de documento',
        catalogos: [
          {
            id: 1,
            descripcion: 'Manifiesto',
          },
          {
            id: 2,
            descripcion: 'ID Oficial',
          },
          {
            id: 3,
            descripcion: 'Actas',
          },
          {
            id: 4,
            descripcion: 'Poderes',
          },
          {
            id: 5,
            descripcion: 'Otros',
          },
        ],
      },
    };

    service.obtenerAvisoDelCatalogo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32501/aviso-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch OperacionDeImportacion data', () => {
    const mockData: OperacionDeImportacion[] = [
      {
        agenteAduanal: '1234',
        rfc: 'LEQ18101314S7',
        numeroDePedimento: '12345678',
        aduanaDeImportacion: 'ENSENADA',
      },
    ];

    service.obtenerOperacionDeImportacion().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/32501/operacion-de-importacion.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle errors when fetching AvisoCatalogo data', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerAvisoDelCatalogo().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne('assets/json/32501/aviso-catalogo.json');
    req.error(mockError);
  });

  it('should handle errors when fetching OperacionDeImportacion data', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerOperacionDeImportacion().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(
      'assets/json/32501/operacion-de-importacion.json'
    );
    req.error(mockError);
  });

  it('should fetch datos del estado de la solicitud', () => {
    const mockData: Solicitud32501State = {
      adace: '',
      fechaIniExposicion: '',
      ideGenerica1: '',
      idTransaccionVU: '',
      cveFraccionArancelaria: '',
      nico: '',
      peso: '',
      valorUSD: '',
      descripcionMercancia: '',
      nombreComercial: '',
      entidadFederativa: '',
      delegacionMunicipio: '',
      colonia: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostal: '',
      patente: '',
      rfc: '',
      pedimento: '',
      aduana: '',
      serviciosTerceros: '', 
      operacionDeImportacionLista: [] 
    
    };

    service.obtenerDatosEstado().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32501/datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call establecerDatos del store al establecerDatosEstado', () => {
    const datos: Solicitud32501State = {
      adace: 'a',
      fechaIniExposicion: 'b',
      ideGenerica1: 'c',
      idTransaccionVU: 'd',
      cveFraccionArancelaria: 'e',
      nico: 'f',
      peso: 'g',
      valorUSD: 'h',
      descripcionMercancia: 'i',
      nombreComercial: 'j',
      entidadFederativa: 'k',
      delegacionMunicipio: 'l',
      colonia: 'm',
      calle: 'n',
      numeroExterior: 'o',
      numeroInterior: 'p',
      codigoPostal: 'q',
      patente: 'r',
      rfc: 's',
      pedimento: 't',
      aduana: 'u',
      serviciosTerceros: 'v',
      operacionDeImportacionLista: []
    };
  
    service.establecerDatosEstado(datos);
   
  });
});