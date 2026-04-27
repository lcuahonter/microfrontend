import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CambioPasswordComponent } from './cambio-password.component';

describe('CambioPasswordComponent', () => {
  let component: CambioPasswordComponent;
  let fixture: ComponentFixture<CambioPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambioPasswordComponent, ReactiveFormsModule],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CambioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería tener los controles actual, nueva y confirmacion', () => {
    expect(component.form.contains('actual')).toBe(true);
    expect(component.form.contains('nueva')).toBe(true);
    expect(component.form.contains('confirmacion')).toBe(true);
  });

  it('el signal exito debería iniciar en false', () => {
    expect(component.exito()).toBe(false);
  });

  it('el signal cargando debería iniciar en false', () => {
    expect(component.cargando()).toBe(false);
  });

  it('toggleMostrar(0) debería cambiar el primer elemento de mostrar()', () => {
    const valorInicial = component.mostrar()[0];
    component.toggleMostrar(0);
    expect(component.mostrar()[0]).toBe(!valorInicial);
  });

  it('toggleMostrar(0) dos veces debería devolver el valor original', () => {
    const valorInicial = component.mostrar()[0];
    component.toggleMostrar(0);
    component.toggleMostrar(0);
    expect(component.mostrar()[0]).toBe(valorInicial);
  });

  it('calcularFuerza() con contraseña corta debería poner fuerza en debil', () => {
    component.form.get('nueva')!.setValue('abc');
    component.calcularFuerza();
    expect(component.fuerza()).toBe('debil');
  });

  it('calcularFuerza() con contraseña vacía debería poner fuerza en debil', () => {
    component.form.get('nueva')!.setValue('');
    component.calcularFuerza();
    expect(component.fuerza()).toBe('debil');
  });

  it('calcularFuerza() con "MiPass123!" debería poner fuerza en fuerte', () => {
    component.form.get('nueva')!.setValue('MiPass123!');
    component.calcularFuerza();
    expect(component.fuerza()).toBe('fuerte');
  });

  it('el validador noCoinciden debería fallar si nueva y confirmacion son distintos', () => {
    component.form.get('actual')!.setValue('OldPass1!');
    component.form.get('nueva')!.setValue('NuevoPass1!');
    component.form.get('confirmacion')!.setValue('OtroPass9!');
    expect(component.form.hasError('noCoinciden')).toBe(true);
  });

  it('el validador noCoinciden NO debería fallar si nueva y confirmacion son iguales', () => {
    component.form.get('actual')!.setValue('OldPass1!');
    component.form.get('nueva')!.setValue('NuevoPass1!');
    component.form.get('confirmacion')!.setValue('NuevoPass1!');
    expect(component.form.hasError('noCoinciden')).toBe(false);
  });

  it('el formulario debería ser inválido si actual está vacío', () => {
    component.form.get('actual')!.setValue('');
    component.form.get('nueva')!.setValue('NuevoPass1!');
    component.form.get('confirmacion')!.setValue('NuevoPass1!');
    expect(component.form.invalid).toBe(true);
  });

  it('guardar() con formulario inválido NO debería activar cargando', () => {
    // Formulario vacío es inválido
    component.form.get('actual')!.setValue('');
    component.guardar();
    expect(component.cargando()).toBe(false);
  });

  it('guardar() con formulario inválido NO debería poner exito en true', () => {
    component.form.get('actual')!.setValue('');
    component.guardar();
    expect(component.exito()).toBe(false);
  });
});
