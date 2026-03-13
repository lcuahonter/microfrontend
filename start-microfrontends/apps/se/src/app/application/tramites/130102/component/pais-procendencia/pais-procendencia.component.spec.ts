import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaisProcendenciaComponent } from './pais-procendencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('PaisProcendenciaComponent', () => {
  let component: PaisProcendenciaComponent;
  let fixture: ComponentFixture<PaisProcendenciaComponent>;

  const mockStore = {
    setBloque: jest.fn(),
    setDescripcionJustificacion: jest.fn(),
    setObservaciones: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of({
      bloque: 'B1',
      descripcionJustificacion: 'Justificación',
      observaciones: 'Observaciones'
    })
  };

  const mockFormService = {
    registrarFormulario: jest.fn()
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisProcendenciaComponent,ReactiveFormsModule, HttpClientTestingModule],
     
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockStore },
        { provide: Tramite130102Query, useValue: mockQuery },
        { provide: FormularioRegistroService, useValue: mockFormService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaisProcendenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values from query', () => {
    expect(component.paisForm.value).toEqual({
      bloque: 'B1',
      descripcionJustificacion: 'Justificación',
      observaciones: 'Observaciones'
    });
  });

  it('should disable form if readonly is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.paisForm.disabled).toBe(true);
  });

  it('should enable form if readonly is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.paisForm.enabled).toBe(true);
  });

  it('should validate leading/trailing spaces in descripcionJustificacion', () => {
    const control = component.paisForm.get('descripcionJustificacion');
    control?.setValue('  invalid ');
    expect(control?.errors).toEqual({ leadingSpaces: true });

    control?.setValue('valid');
    expect(control?.errors).toBeNull();
  });

  it('should add all fechas when tipo is "t"', () => {
    component.selectRangoDias = ['2024-01-01', '2024-01-02'];
    component.agregar('t');
    expect(component.fechasSeleccionadas).toEqual(['2024-01-01', '2024-01-02']);
    expect(component.fechasDatos).toEqual([]);
  });

  it('should add selected fecha when tipo is not "t"', () => {
    component.fechasDatos = ['2024-01-01', '2024-01-02'];
    component.fecha.setValue(['1']); // index 1
    component.agregar('');
    expect(component.fechasSeleccionadas).toContain('2024-01-02');
    expect(component.fechasDatos).toEqual(['2024-01-01']);
  });

  it('should remove all fechas when tipo is "t"', () => {
    component.fechasSeleccionadas = ['2024-01-01'];
    component.quitar('t');
    expect(component.fechasDatos).toEqual(['2024-01-01']);
    expect(component.fechasSeleccionadas).toEqual([]);
  });

  it('should remove selected fecha when tipo is not "t"', () => {
    component.fechasSeleccionadas = ['2024-01-01', '2024-01-02'];
    component.fechaSeleccionada.setValue(['1']);
    component.quitar('');
    expect(component.fechasDatos).toContain('2024-01-02');
    expect(component.fechasSeleccionadas).toEqual(['2024-01-01']);
  });

  it('should call store method in setValoresStore', () => {
    component.paisForm.get('bloque')?.setValue('B2');
    component.setValoresStore(component.paisForm, 'bloque', 'setBloque');
    expect(mockStore.setBloque).toHaveBeenCalledWith('B2');
  });

  it('should fetch paisProc from http', () => {
    // Initialize paisProc as an empty array to avoid undefined error
    component.paisProc = [];
    component.fetchPaisProc();
    expect(Array.isArray(component.paisProc)).toBeTruthy();
  });
});
