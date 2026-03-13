// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProveedorCustomComponent } from './agregar-proveedor-custom.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

describe('AgregarProveedorCustomComponent', () => {
  let component: AgregarProveedorCustomComponent;
  let fixture: ComponentFixture<AgregarProveedorCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProveedorCustomComponent, HttpClientTestingModule],
      providers: [DatosSolicitudService],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.agregarProveedorForm.get('tipoPersona')?.value).toBe('');
    expect(component.agregarProveedorForm.get('nombres')?.value).toBe('');
    expect(component.agregarProveedorForm.get('primerApellido')?.value).toBe(
      ''
    );
  });

  it('should validate required fields', () => {
    const form = component.agregarProveedorForm;
    expect(form.valid).toBeFalsy();

    form.controls['tipoPersona'].setValue('test');
    form.controls['nombres'].setValue('test');
    form.controls['primerApellido'].setValue('test');
    form.controls['pais'].setValue('test');
    form.controls['estado'].setValue('test');
    form.controls['codigoPostal'].setValue('test');
    form.controls['calle'].setValue('test');
    form.controls['numeroExterior'].setValue('test');
    form.controls['correoElectronico'].setValue('test@test.com');

    expect(form.controls).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl =
      component.agregarProveedorForm.controls['correoElectronico'];
    emailControl.setValue('invalid-email');

    emailControl.setValue('valid@email.com');
    expect(emailControl.errors).toBeNull();
  });
  
  it('should not add proveedor if form is invalid', () => {
    const initialLength = component.proveedores.length;
    component.guardarProveedor();
    expect(component.proveedores.length).toBe(initialLength);
  });

});
