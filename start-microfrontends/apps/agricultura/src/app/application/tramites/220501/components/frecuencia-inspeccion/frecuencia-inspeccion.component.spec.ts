import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrecuenciaInspeccionComponent } from './frecuencia-inspeccion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { Solicitud220501State } from '../../estados/tramites220501.store';
import { CommonModule } from '@angular/common';

describe('FrecuenciaInspeccionComponent (Jest)', () => {
  let component: FrecuenciaInspeccionComponent;
  let fixture: ComponentFixture<FrecuenciaInspeccionComponent>;
  let mockQuery: jest.Mocked<Solicitud220501Query>;

  const mockState: Solicitud220501State = {
    certificadoNumero: 'CERT-JEST-001',
    calculoResultado: 'Resultado-Jest-001'
  } as Solicitud220501State;

  beforeEach(async () => {
    const queryMock: Partial<jest.Mocked<Solicitud220501Query>> = {
      selectSolicitud$: of(mockState)
    };

    await TestBed.configureTestingModule({
      imports: [
        FrecuenciaInspeccionComponent, 
        ReactiveFormsModule, 
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: Solicitud220501Query, useValue: queryMock }
      ]
    }).compileComponents();

    mockQuery = TestBed.inject(Solicitud220501Query) as jest.Mocked<Solicitud220501Query>;

    fixture = TestBed.createComponent(FrecuenciaInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitud220501State from selectSolicitud$', () => {
    expect(component.solicitud220501State).toEqual(mockState);
  });

  it('should create the form with disabled values from the store', () => {
    const form = component.frecuenciaInspeccionForm;

    expect(form).toBeDefined();
    expect(form.get('certificadoNumero')?.value).toBe('CERT-JEST-001');
    expect(form.get('certificadoNumero')?.disabled).toBe(true);

    expect(form.get('calculoResultado')?.value).toBe('Resultado-Jest-001');
    expect(form.get('calculoResultado')?.disabled).toBe(true);
  });

  it('should properly clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});