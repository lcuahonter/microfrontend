import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroDeLaEmpresaComponent } from './miembro-de-la-empresa.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

describe('MiembroDeLaEmpresaComponent', () => {
  let component: MiembroDeLaEmpresaComponent;
  let fixture: ComponentFixture<MiembroDeLaEmpresaComponent>;
  let serviceMock: jest.Mocked<CancelacionGarantiaService>;

  const mockMiembroData = [
    { nombre: 'Juan', rol: 'Administrador' },
    { nombre: '', rol: null },
  ];

  const mockInversionData = [
    { tipo: 'Capital', valor: 1000 },
    { tipo: '', valor: null },
  ];

  const mockRadioData = [
    { value: 1, label: 'Opción 1' },
    { value: 2, label: 'Opción 2' },
  ];

  beforeEach(async () => {
    const serviceSpy = {
      obtenerDatosTablaMiembro: jest.fn().mockReturnValue(of(mockMiembroData)),
      obtenerTipoInversionData: jest.fn().mockReturnValue(of(mockInversionData)),
      getRequisitosRadioData: jest.fn().mockReturnValue(of(mockRadioData)),
    };

    await TestBed.configureTestingModule({
      imports: [MiembroDeLaEmpresaComponent, HttpClientTestingModule],
      providers: [{ provide: CancelacionGarantiaService, useValue: serviceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MiembroDeLaEmpresaComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    // component.forma = new FormGroup({
    // ninoFormGroup: new FormGroup({}),
    // senalePreviamente: new FormControl({value: null, disabled: true}),
    // enCasoAffirmativo: new FormControl({value: null, disabled: true}),
    // });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  it('should initialize with default form controls', () => {
  //   component.ngOnInit();
  //   expect(component.forma.contains('ninoFormGroup')).toBe(true);
  //   expect(component.forma.contains('senalePreviamente')).toBe(true);
  //   expect(component.forma.contains('enCasoAffirmativo')).toBe(true);
  //   expect(component.forma.get('senalePreviamente')?.disabled).toBe(true);
  // });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const destroy$Spy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroy$Spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should expose ninoFormGroup via getter', () => {
    expect(component.ninoFormGroup).toBe(component.forma.get('ninoFormGroup'));
  });

  it('should initialize miembroFormData from constant', () => {
    expect(component.miembroFormData).toBeDefined();
    expect(Array.isArray(component.miembroFormData)).toBe(true);
  });
});
