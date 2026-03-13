import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosDeLaEmpresaComponent } from './miembros-de-la-empresa.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';

describe('MiembrosDeLaEmpresaComponent', () => {
  let component: MiembrosDeLaEmpresaComponent;
  let fixture: ComponentFixture<MiembrosDeLaEmpresaComponent>;
  let serviceMock: jest.Mocked<CancelacionGarantiaService>;
  
  const mockRadioData = [
    { value: 1, label: 'Opción A' },
    { value: 2, label: 'Opción B' },
  ];

  beforeEach(async () => {
    serviceMock = {
      getRequisitosRadioData: jest.fn().mockReturnValue(of([]))
    } as unknown as jest.Mocked<CancelacionGarantiaService>;
    
    await TestBed.configureTestingModule({
      imports: [MiembrosDeLaEmpresaComponent, HttpClientTestingModule],
      providers: [
        { provide: CancelacionGarantiaService, useValue: serviceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MiembrosDeLaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerRadioDatos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'obtenerRadioDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should populate radioDatos with response from service', () => {
    serviceMock.getRequisitosRadioData.mockReturnValue(of(mockRadioData));
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual(mockRadioData);
  });

  it('should set radioDatos to empty array if service returns empty', () => {
    serviceMock.getRequisitosRadioData.mockReturnValue(of([]));
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual([]);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
