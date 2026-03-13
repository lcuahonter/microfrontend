import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ComplementariaComponent } from './complementaria.component';
import { PlantasComponent } from '../../../../shared/components/plantas/plantas.component';
import { SectorComponent } from '../../../../shared/components/sector/sector.component';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProductorIndirectoComponent } from '../../../../shared/components/productor-indirecto/productor-indirecto.component';
import { ProsecService } from '../../services/prosec/prosec.service';
import { MercanciasResquesta, PlantasTabla, ProductorIndirectoResquesta, SectorTabla } from '../../../../shared/models/complementaria.model';

jest.mock('../../services/prosec/prosec.service');

describe('ComplementariaComponent', () => {
  let component: ComplementariaComponent;
  let mockProsecService: jest.Mocked<ProsecService>;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    mockProsecService = new ProsecService(mockHttpClient) as jest.Mocked<ProsecService>;
    mockProsecService.obtenerPlantasDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));;
    mockProsecService.obtenerSectorDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));;
    mockProsecService.obtenerMercanciasProducir = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));;
    mockProsecService.obtenerProductoIndirectoDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));;

    TestBed.configureTestingModule({
      imports: [
        PlantasComponent, 
        SectorComponent, 
        ProducirMercanciasComponent, 
        ProductorIndirectoComponent,
        ComplementariaComponent
      ],
      providers: [
        { provide: ProsecService, useValue: mockProsecService },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });

    component = TestBed.createComponent(ComplementariaComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize lists as empty arrays', () => {
    expect(component.plantasTablaDatos).toEqual([]);
    expect(component.sectorTablaDatos).toEqual([]);
    expect(component.productoIndirectoDatos).toEqual([]);
  });

  test('should call data-fetching methods on initialization', () => {
    const plantasSpy = jest.spyOn(component, 'obtenerPlantasDatos');
    const sectoresSpy = jest.spyOn(component, 'obtenerSectorDatos');
    const mercanciasSpy = jest.spyOn(component, 'obtenerMercanciasProducir');
    const productoresSpy = jest.spyOn(component, 'obtenerProductoIndirectoDatos');

    component.ngOnInit();

    expect(plantasSpy).toHaveBeenCalled();
    expect(sectoresSpy).toHaveBeenCalled();
    expect(mercanciasSpy).toHaveBeenCalled();
    expect(productoresSpy).toHaveBeenCalled();
  });

  test('should fetch and set plantas data correctly', () => {
    const mockPlantas: PlantasTabla[] = [
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
    mockProsecService.obtenerPlantasDatos.mockReturnValue(of(mockPlantas));

    component.obtenerPlantasDatos();

    expect(component.plantasTablaDatos).toEqual(mockPlantas);
  });

  test('should fetch and set sector data correctly', () => {
    const mockSectores: SectorTabla[] = [
      {
        "listaDeSectores": "De la Industria Eléctrica",
        "claveDelSector": "I",
        "estatus": "Autorizada"
      }
    ];
    mockProsecService.obtenerSectorDatos.mockReturnValue(of(mockSectores));

    component.obtenerSectorDatos();

    expect(component.sectorTablaDatos).toEqual(mockSectores);
  });

  test('should fetch and set mercancias data correctly', () => {
    const mockMercanciasRes: MercanciasResquesta = {
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
    mockProsecService.obtenerMercanciasProducir.mockReturnValue(of(mockMercanciasRes));

    component.obtenerMercanciasProducir();

  });

  test('should fetch and set productor indirecto data correctly', () => {
    const mockProductorRes: ProductorIndirectoResquesta = {
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
    }
    mockProsecService.obtenerProductoIndirectoDatos.mockReturnValue(of(mockProductorRes));

    component.obtenerProductoIndirectoDatos();

    expect(component.productoIndirectoDatos).toEqual(mockProductorRes.data);
  });

  test('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});