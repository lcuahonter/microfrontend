import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegimenAduaneroComponent } from './regimen-aduanero.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, throwError } from 'rxjs';
import { REGIMEN_ADUANERO } from '../../constantes/cancelacion-garantia.enum';

describe('RegimenAduaneroComponent', () => {
  let component: RegimenAduaneroComponent;
  let fixture: ComponentFixture<RegimenAduaneroComponent>;
  let mockService: jest.Mocked<CancelacionGarantiaService>;

  beforeEach(async () => {
    mockService = {
      getRequisitosRadioData: jest.fn().mockReturnValue(of([])),
      getRegimenAduaneraData: jest.fn().mockReturnValue(of([]))
    } as unknown as jest.Mocked<CancelacionGarantiaService>;

    await TestBed.configureTestingModule({
      imports: [RegimenAduaneroComponent, HttpClientTestingModule],
      providers: [{ provide: CancelacionGarantiaService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegimenAduaneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerRadioDatos and set radioDatos on success', () => {
    const mockData = [{ value: 1, label: 'Tipo A' }];
    mockService.getRequisitosRadioData.mockReturnValue(of(mockData));
    component.obtenerRadioDatos();
    expect(mockService.getRequisitosRadioData).toHaveBeenCalled();
    expect(component.radioDatos).toEqual(mockData);
  });

  it('should set radioDatos to empty array on empty response', () => {
    mockService.getRequisitosRadioData.mockReturnValue(of([]));
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual([]);
  });

  it('should set radioDatos to empty array on error', () => {
    mockService.getRequisitosRadioData.mockReturnValue(throwError(() => new Error('Error')));
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual([]);
  });

   it('should return correct configuration from obtenerInformacionDeFecha getter', () => {
    const config = component.obtenerInformacionDeFecha;
    expect(config.labelNombre).toBe('Fecha de fin de vigencia');
    expect(config.required).toBe(true);
    expect(config.habilitado).toBe(false);
  });

  it('should complete destroy$ on component destroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
