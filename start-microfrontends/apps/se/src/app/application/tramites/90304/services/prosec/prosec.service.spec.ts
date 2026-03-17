import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ProsecService } from './prosec.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { EmpresasListaResquesta, ModificacionResquesta } from '../../models/prosec.model';
import { MercanciasResquesta, PlantasTabla, ProductorIndirectoResquesta, SectorTabla } from '../../../../shared/models/complementaria.model';
import { BitacoraResquesta } from '../../../../shared/models/bitacora.model';

jest.mock('@angular/common/http');

describe('ProsecService', () => {
  let service: ProsecService;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        ProsecService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    service = TestBed.inject(ProsecService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should fetch documentos seleccionados', () => {
    const mockData: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Documento Test' }],
      message: 'Success'
    };
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerDocumentosSeleccionados().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/documentos-seleccionados.json');
  });

  test('should fetch plantas datos', () => {
    const mockData: PlantasTabla[] = [
      {
        "calle": "LOMBARDINI PTE",
        "numeroExterior": 1353,
        "numeroInterior": 120,
        "codigoPostal": 81124,
        "colonia": "OTRA NO ESPECIFICADA EN EL CATALOGO",
        "municipioOAlcaldia": "GUASAVE",
        "estado": "SINALOA",
        "pais": "pais",
        "registroFederal": '',
        "razonSocial": '',
        "domicilioFiscal": '',
        "estatus": ''
      }
    ];
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerPlantasDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/plantas.json');
  });

  test('should fetch sector datos', () => {
    const mockData: SectorTabla[] = [
      {
        "listaDeSectores": "De la Industria Eléctrica",
        "claveDelSector": "I",
        "estatus": "Autorizada"
      }
    ];
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerSectorDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/sector.json');
  });

  test('should fetch mercancias producir datos', () => {
    const mockData: MercanciasResquesta = {
      code: 200,
      data: [
        {
          "fraccionArancelaria": "Fracción 1",
          "claveDelSector": "I",
          "eStatus": "Autorizada "
        }
      ],
      message: "Consulta exitosa"
    };
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerMercanciasProducir().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/mercancias-producir.json');
  });

  test('should fetch producto indirecto datos', () => {
    const mockData: ProductorIndirectoResquesta = {
      "code": 200,
      "data": [
        {
          "registroFederal": "TSD931210493",
          "denominacion": "CORPORACION MEXICANA DE COMPUTO S DE RL DE CV",
          "correo": "nizyyd.okubiz@kef.fzr",
          "eStatus": "Autorizada"
        }
      ],
      "message": "Consulta exitosa"
    };
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerProductoIndirectoDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/productor-indirecto.json');
  });

  test('should fetch bitacora datos', () => {
    const mockData: BitacoraResquesta = {
      code: 200,
      data: [
        {
          "tipoModificacion": "Alta de domicilio de una planta",
          "fechaModificacion": "05/04/2025",
          "valoresAnteriores": " ",
          "valoresNuevos": "LOMBARDINI PTE 1353 81124 OTRA NO ESPECIFICADA EN EL CATALOGO VENUSTIANO CARRANZA PUEBLA"
        }
      ],
      message: 'Success'
    };
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerBitacoraDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/bitacora.json');
  });

  test('should fetch modificacion datos', () => {
    const mockData: ModificacionResquesta = {
      code: 200,
      data: [{ registroFederalContribuyentes: 'RFC123', representacionFederal: 'RepFed', tipoModificacion: 'Tipo', modificacionPrograma: 'ModProg' }],
      message: 'Success',
    };
    httpClient.get.mockReturnValue(of(mockData));

    service.obtenerModificacionDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClient.get).toHaveBeenCalledWith('assets/json/90304/modificacion.json');
  });

});