import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarUbicacionAutorizacionesComponent } from './inicio.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ConsultarUbicacionAutorizacionesComponent', () => {
  let component: ConsultarUbicacionAutorizacionesComponent;
  let fixture: ComponentFixture<ConsultarUbicacionAutorizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConsultarUbicacionAutorizacionesComponent,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarUbicacionAutorizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reactive form', () => {
    expect(component.FormConsulta).toBeDefined();
  });

  it('should contain required form controls', () => {
    const form = component.FormConsulta;

    expect(form.get('rfc_solicitante')).toBeDefined();
    expect(form.get('aduana')).toBeDefined();
    expect(form.get('fecha_inicio_vigencia')).toBeDefined();
    expect(form.get('fecha_fin_vigencia')).toBeDefined();
    expect(form.get('calle')).toBeDefined();
    expect(form.get('telefono')).toBeDefined();
    expect(form.get('lda')).toBeDefined();
    expect(form.get('ubicacion')).toBeDefined();
  });

  it('should validate rfc_solicitante pattern', () => {
    const control = component.FormConsulta.get('rfc_solicitante');
    expect(control).toBeDefined();

    control?.setValue('INVALIDO');
    expect(control?.valid).toBe(false);

    control?.setValue('ABC010203AAA');
    expect(control?.valid).toBe(true);
  });
});
