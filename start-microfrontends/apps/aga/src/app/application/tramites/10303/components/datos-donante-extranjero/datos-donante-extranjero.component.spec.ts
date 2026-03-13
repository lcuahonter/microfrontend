import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AlertComponent, CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { DatosDonanteExtranjeroComponent } from './datos-donante-extranjero.component';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DatosDonanteExtranjeroComponent', () => {
  let component: DatosDonanteExtranjeroComponent;
  let fixture: ComponentFixture<DatosDonanteExtranjeroComponent>;
  let donacionesExtranjerasService: jest.Mocked<DonacionesExtranjerasService>;

  // Mock del servicio DonacionesExtranjerasService
  const DONACIONES_EXTRANJERAS_SERVICE_MOCK = {
    getPaises: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'México' }] })),
    getDocumentoResidencia: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Tarjeta de Residencia' }] }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosDonanteExtranjeroComponent],
      imports: [ 
        CatalogoSelectComponent, 
        AlertComponent, 
        FormsModule, 
        ReactiveFormsModule 
      ],
      providers: [
        { provide: DonacionesExtranjerasService, useValue: DONACIONES_EXTRANJERAS_SERVICE_MOCK }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(DatosDonanteExtranjeroComponent);
    component = fixture.componentInstance;
    donacionesExtranjerasService = TestBed.inject(DonacionesExtranjerasService) as jest.Mocked<DonacionesExtranjerasService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call getPaises or getDocumentoResidencia in the constructor', () => {
    expect(donacionesExtranjerasService.getPaises).not.toHaveBeenCalled();
    expect(donacionesExtranjerasService.getDocumentoResidencia).not.toHaveBeenCalled();
  });

  it('should call inicializaCatalogos once on ngOnInit', () => {
    jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
      component.pais = [{ id: 1, descripcion: 'México' }];
      component.cveDocumentoResidencia = [{ id: 1, descripcion: 'Tarjeta de Residencia' }];
    });

    component.ngOnInit();

    expect(component.inicializaCatalogos).toHaveBeenCalledTimes(1);
  });

  it('should initialize the pais catalog correctly after ngOnInit', () => {
    component.ngOnInit();
    expect(component.pais).toEqual([{ id: 1, descripcion: 'México' }]);
  });

  it('should initialize the documento de residencia catalog correctly after ngOnInit', () => {
    component.ngOnInit();
    expect(component.cveDocumentoResidencia).toEqual([{ id: 1, descripcion: 'Tarjeta de Residencia' }]);
  });

  it('should call getPaises and getDocumentoResidencia methods on ngOnInit', () => {
    component.ngOnInit();

    expect(donacionesExtranjerasService.getPaises).toHaveBeenCalledWith();
    expect(donacionesExtranjerasService.getDocumentoResidencia).toHaveBeenCalledWith();
  });

  it('should map the correct data for pais and documento residencia after ngOnInit', () => {
    component.ngOnInit();

    expect(component.pais).toEqual([{ id: 1, descripcion: 'México' }]);
    expect(component.cveDocumentoResidencia).toEqual([{ id: 1, descripcion: 'Tarjeta de Residencia' }]);
  });
});