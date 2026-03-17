import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaAutorizacionesPorAutoridadComponent } from './consultar-autorizaciones.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ConsultaAutorizacionesPorAutoridadComponent', () => {
  let component: ConsultaAutorizacionesPorAutoridadComponent;
  let fixture: ComponentFixture<ConsultaAutorizacionesPorAutoridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConsultaAutorizacionesPorAutoridadComponent, // standalone
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaAutorizacionesPorAutoridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.FormConsulta).toBeDefined();
  });

  it('should contain required form controls', () => {
    const form = component.FormConsulta;

    expect(form.get('folio_vucem')).toBeDefined();
    expect(form.get('folio_interno')).toBeDefined();
    expect(form.get('rfc_solicitante')).toBeDefined();
    expect(form.get('rfc_tercero')).toBeDefined();
    expect(form.get('patente')).toBeDefined();
    expect(form.get('tipo_ubicacion')).toBeDefined();
  });

  it('should validate folio_vucem as numeric only', () => {
    const control = component.FormConsulta.get('folio_vucem');
    expect(control).toBeDefined();

    control?.setValue('ABC123');
    expect(control?.valid).toBe(false);

    control?.setValue('1234567890123456789012345');
    expect(control?.valid).toBe(true);
  });
});
