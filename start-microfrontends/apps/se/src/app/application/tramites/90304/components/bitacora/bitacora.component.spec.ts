import { TestBed } from '@angular/core/testing';
import { BitacoraComponent } from './bitacora.component';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { of } from 'rxjs';
import { BitacoraResquesta } from '../../../../shared/models/bitacora.model';
import { ProsecService } from '../../services/prosec/prosec.service';
import { HttpClient } from '@angular/common/http';

jest.mock('../../services/prosec/prosec.service');

describe('BitacoraComponent', () => {
  let component: BitacoraComponent;
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
    mockProsecService.obtenerBitacoraDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));

    TestBed.configureTestingModule({
      imports: [
        BitacoraTablaComponent,
        BitacoraComponent
      ],
      providers: [{ provide: ProsecService, useValue: mockProsecService }]
    });

    component = TestBed.createComponent(BitacoraComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize bitacoraDatos as an empty array', () => {
    expect(component.bitacoraDatos).toEqual([]);
  });

  test('should call obtenerBitacoraDatos on initialization', () => {
    const obtenerBitacoraDatosSpy = jest.spyOn(component, 'obtenerBitacoraDatos');
    component.ngOnInit();
    expect(obtenerBitacoraDatosSpy).toHaveBeenCalled();
  });

  test('should fetch bitacora data and set bitacoraDatos correctly', () => {
    const mockBitacoraResponse: BitacoraResquesta = {
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
    mockProsecService.obtenerBitacoraDatos.mockReturnValue(of(mockBitacoraResponse));

    component.obtenerBitacoraDatos();

    expect(component.bitacoraDatos).toEqual(mockBitacoraResponse.data);
  });

  test('should set bitacoraDatos to an empty array when no data is returned', () => {
    const mockBitacoraResponse: BitacoraResquesta = { code: 200, data: [], message: 'No data' };
    mockProsecService.obtenerBitacoraDatos.mockReturnValue(of(mockBitacoraResponse));

    component.obtenerBitacoraDatos();

    expect(component.bitacoraDatos).toEqual([]);
  });

  test('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});