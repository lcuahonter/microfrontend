import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { createInitialState, Tramite30401Store } from '../../estados/tramites30401.store';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockRegistroEmpresasTransporteService: Partial<RegistroEmpresasTransporteService>;
  let mockTramite30401Query: Partial<Tramite30401Query>;
  let mockTramite30401Store: Partial<Tramite30401Store>;

  beforeEach(async () => {
    mockRegistroEmpresasTransporteService = {
      onBancoList: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Mock Banco' }] as Catalogo[])),
    };
    mockTramite30401Query = {
      selectTramite30401$: of({
        ...createInitialState(),
      }),
    };
    mockTramite30401Store = {
      establecerDatos: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, PagoDeDerechosComponent],
      providers: [
        { provide: RegistroEmpresasTransporteService, useValue: mockRegistroEmpresasTransporteService },
        { provide: Tramite30401Query, useValue: mockTramite30401Query },
        { provide: Tramite30401Store, useValue: mockTramite30401Store },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.pagoDeDerechosForm).toBeTruthy();
    expect(component.pagoDeDerechosForm.contains('clave')).toBe(true);
    expect(component.pagoDeDerechosForm.contains('llaveDePago')).toBe(true);
  });

  it('Debería validar fechaLimValidator correctamente', () => {
    const control = { value: '2050-01-01' } as any;
    const result = PagoDeDerechosComponent.fechaLimValidator()(control);
    expect(result).toEqual({ fechaLim: true });

    const validControl = { value: '2020-01-01' } as any;
    const validResult = PagoDeDerechosComponent.fechaLimValidator()(validControl);
    expect(validResult).toBeNull();
  });

  it('debe validar noComaValidator correctamente', () => {
    const control = { value: '12,34' } as any;
    const result = PagoDeDerechosComponent.noComaValidator()(control);
    expect(result).toEqual({ noComa: true });

    const validControl = { value: '1234' } as any;
    const validResult = PagoDeDerechosComponent.noComaValidator()(validControl);
    expect(validResult).toBeNull();
  });

  
  it('Debería obtener bancoList en la llamada obtenerBancoList', () => {
    
    const mockBancoList = [{ id: 1, descripcion: 'Banco 1' }];

    (mockRegistroEmpresasTransporteService.onBancoList as jest.Mock).mockReturnValue(of(mockBancoList));
  
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    component.bancoList = mockBancoList;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.bancoList).toEqual(mockBancoList);
  });

  it('Debería parchear los datos del formulario en la llamada enPatchStoredFormData', () => {
    component.enPatchStoredFormData();
    expect(component.pagoDeDerechosForm.get('clave')?.value).toEqual('');
    expect(component.pagoDeDerechosForm.get('fecPago')?.value).toEqual('');
  });

  it('Debe marcar el control como inválido si se llama a esInvalido en un campo inválido', () => {
    component.pagoDeDerechosForm.get('clave')?.setErrors({ required: true });
    component.pagoDeDerechosForm.get('clave')?.markAsTouched();
    expect(component.esInvalido('clave')).toBe(true);
  });

  it('Debería darse de baja de destroy$ en el componente destroy', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe llamar a establecerDatos en Tramite30401Store con el valor correcto cuando se llama a setValoresStore', () => {
    const mockForm = new FormGroup({
      clave: new FormControl('testValue'),
    });
  
    const establecerDatosSpy = jest.spyOn(mockTramite30401Store, 'establecerDatos');
  
    component.setValoresStore(mockForm, 'clave');
  
    expect(establecerDatosSpy).toHaveBeenCalledWith({ clave: 'testValue' });
  });
  
  it('No se debe llamar a establecerDatos si el formulario es nulo', () => {
    const establecerDatosSpy = jest.spyOn(mockTramite30401Store, 'establecerDatos');
  
    component.setValoresStore(null, 'clave');
  
    expect(establecerDatosSpy).not.toHaveBeenCalled();
  });
  
  it('No se debe llamar a establecerDatos si el valor del control es nulo o indefinido', () => {
    const mockForm = new FormGroup({
      clave: new FormControl(null),
    });
    const establecerDatosSpy = jest.spyOn(mockTramite30401Store, 'establecerDatos');
    component.setValoresStore(mockForm, 'clave');
    expect(establecerDatosSpy).not.toHaveBeenCalled();
  });

});