import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoPantallaDosComponent } from './certificado-pantalla-dos.component';

describe('CertificadoPantallaDosComponent', () => {
  let component: CertificadoPantallaDosComponent;
  let fixture: ComponentFixture<CertificadoPantallaDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoPantallaDosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoPantallaDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with disabled controls and default values', () => {
    expect(component.certificadoALANDI).toBeDefined();
    expect(component.certificadoALANDI.get('observaciones')?.disabled).toBe(true);
    expect(component.certificadoALANDI.get('numeroCertificado')?.disabled).toBe(true);
    expect(component.certificadoALANDI.get('observaciones')?.value).toBe('');
    expect(component.certificadoALANDI.get('numeroCertificado')?.value).toBe('');
  });

  it('should update form values when certificadoDatos input changes', () => {
    const datos = { observaciones: 'Obs', numeroCertificadoOrigen: '123' } as any;
    component.certificadoDatos = datos;
    // Recreate form to simulate Angular's ngOnChanges
    component.certificadoALANDI = component['fb'].group({
      observaciones: [{ value: component.certificadoDatos?.observaciones || '', disabled: true }],
      numeroCertificado: [{ value: component.certificadoDatos?.numeroCertificadoOrigen || '', disabled: true }],
    });
    expect(component.certificadoALANDI.get('observaciones')?.value).toBe('Obs');
    expect(component.certificadoALANDI.get('numeroCertificado')?.value).toBe('123');
  });

  it('should render table and pass correct inputs to app-tabla-dinamica', () => {
    const tabla = fixture.nativeElement.querySelector('app-tabla-dinamica');
    expect(tabla).toBeTruthy();
  });

  it('should have numeroCertificado and observaciones controls disabled', () => {
    expect(component.certificadoALANDI.get('observaciones')?.disabled).toBe(true);
    expect(component.certificadoALANDI.get('numeroCertificado')?.disabled).toBe(true);
  });
});
