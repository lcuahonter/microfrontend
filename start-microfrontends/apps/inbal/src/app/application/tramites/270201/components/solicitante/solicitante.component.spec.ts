import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from './solicitante.component';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SolicitanteComponent,
        ReactiveFormsModule,
        CommonModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;

    component.establecerSolicitudForm();

    fixture.detectChanges();
  });

  it('should call establecerValoresDeFormulario on ngOnInit', () => {
    const spy = jest.spyOn(
      component,
      'establecerValoresDeFormulario'
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudForm with correct controls and disabled state', () => {
  const fixture = TestBed.createComponent(SolicitanteComponent);
  const component = fixture.componentInstance;
  component.establecerSolicitudForm(); // <-- Add this line
  fixture.detectChanges();
    
    const form = component.solicitudForm;

    expect(form.contains('rfc')).toBe(false);
    expect(form.contains('denominacion')).toBe(false);
    expect(form.contains('actividadEconomica')).toBe(false);
    expect(form.contains('correoElectronico')).toBe(false);

    expect(form.get('rfc')?.disabled).toBe(true);
    expect(form.get('denominacion')?.disabled).toBe(true);
    expect(form.get('actividadEconomica')?.disabled).toBe(true);
    expect(form.get('correoElectronico')?.disabled).toBe(true);
  });

  it('should set default values for form controls correctly', () => {
    component.establecerValoresDeFormulario();

    expect(component.solicitudForm.get('rfc')?.value).toBe('AAL0409235E6');
    expect(component.solicitudForm.get('denominacion')?.value).toBe(
      'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV'
    );
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe(
      'Siembra, cultivo y cosecha de otros cultivos'
    );
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe(
      'luz.arellano@sat.gob.mx'
    );
    expect(component.solicitudForm.get('pais')?.value).toBe(
      'ESTADOS UNIDOS MEXICANOS'
    );
  });

  it('should call establecerValoresDeFormulario on initialization', () => {
    const spy = jest.spyOn(
      component,
      'establecerValoresDeFormulario'
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  
  it('should call establecerValoresDeFormulario on initialization', () => {
    const fixture = TestBed.createComponent(SolicitanteComponent);
    const component = fixture.componentInstance;
    const spy = jest.spyOn(
      component,
      'establecerValoresDeFormulario'
    );
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});