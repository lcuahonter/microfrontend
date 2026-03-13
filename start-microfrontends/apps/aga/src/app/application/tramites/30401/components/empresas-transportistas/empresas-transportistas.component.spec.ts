import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresasTransportistasComponent } from './empresas-transportistas.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('EmpresasTransportistasComponent', () => {
  let component: EmpresasTransportistasComponent;
  let fixture: ComponentFixture<EmpresasTransportistasComponent>;
  let mockService: any;
  let mockQuery: any;
  let mockCdr: any;

  beforeEach(async () => {
    mockService = {
      tipoTransitoList: jest.fn().mockReturnValue(of([])),
      entidadFederativaList: jest.fn().mockReturnValue(of([])),
      delegacionMunicipioList: jest.fn().mockReturnValue(of([])),
      coloniaList: jest.fn().mockReturnValue(of([])),
      cveFolioCaat: jest.fn().mockReturnValue(of({ value: '12345' })),
    };

    mockQuery = {
      selectTramite30401$: of({
        tipoTransito: 'someValue',
        calle: 'someStreet',
        numeroExterior: '123',
        numeroInterior: '456',
        entidadFederativa: 'someState',
        delegacionMunicipio: 'someMunicipality',
        colonia: 'someColony',
        localidad: 'someLocality',
        codigoPostal: '123456',
        capitalSocial: '100000',
        numeroFolioPermiso: 'PERM123',
        fechaExpedicion: '2025-04-11',
        elCapitalSocial: true,
        miRepresentada: true,
      }),
    };

    mockCdr = {
      detectChanges: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        EmpresasTransportistasComponent,
      ],
      providers: [
        FormBuilder,
        { provide: RegistroEmpresasTransporteService, useValue: mockService },
        { provide: Tramite30401Query, useValue: mockQuery },
        { provide: ChangeDetectorRef, useValue: mockCdr },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasTransportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.empresasForm).toBeDefined();
    expect(component.empresasForm.get('numeroCaat')).toBeTruthy();
    expect(component.empresasForm.get('domicilio')).toBeTruthy();
    expect(component.empresasForm.get('empresasCapitalSocial')).toBeTruthy();
    expect(component.empresasForm.get('permiso')).toBeTruthy();
  });

  it('Debería llamar a obtenerlistadescargable en ngOnInit', () => {
    const spy = jest.spyOn(component, 'obtenerlistadescargable');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('Debe completar el formulario con los datos de la tienda en enPatchStoredFormData', () => {
    component.enPatchStoredFormData();
    expect(component.seccionState).toBeDefined();
    expect(component.seccionState.tipoTransito).toBe('someValue');
  });


  it('Debe devolver verdadero para esInvalido si el control no es válido, se tocó o está sucio', () => {
    component.ngOnInit();
    const control = component.empresasForm.get('domicilio.calle');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.esInvalido('domicilio.calle')).toBe(true);
  });

  it('Debe devolver falso para esInvalido si el control es válido', () => {
    component.ngOnInit();
    const control = component.empresasForm.get('domicilio.calle');
    control?.setValue('Valid Street');
    expect(component.esInvalido('domicilio.calle')).toBe(false);
  });

  it('Debería completar la destrucción en ngOnDestroy', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});