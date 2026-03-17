import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock components for Solicitante and DesistimientoSolicitudPermiso
@Component({
  selector: 'solicitante',
  template: '<div>Solicitante Works</div>',
  standalone: true
})
class MockSolicitanteComponent {}

@Component({
  selector: 'app-desistimiento-solicitud-permiso',
  template: '<div>Desistimiento Works</div>',
  standalone: true
})
class MockDesistimientoSolicitudPermisoComponent {}

import { provideHttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        MockSolicitanteComponent,
        MockDesistimientoSolicitudPermisoComponent
      ],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have indice initialized to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should render nav tabs', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toContain('Solicitante');
    expect(tabs[1].textContent).toContain('Desistimiento de solicitud de permiso');
  });

  it('should set active class on correct tab', () => {
    component.indice = 1;
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li');
    expect(tabs[0].classList).toContain('active');
    expect(tabs[1].classList).not.toContain('active');
    component.indice = 2;
    fixture.detectChanges();
    expect(tabs[0].classList).not.toContain('active');
    expect(tabs[1].classList).toContain('active');
  });

  it('should render SolicitanteComponent when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const solicitante = fixture.debugElement.query(By.css('solicitante'));
    expect(solicitante).toBeTruthy();
    const desistimiento = fixture.debugElement.query(By.css('app-desistimiento-solicitud-permiso'));
    expect(desistimiento).toBeFalsy();
  });

  it('should render DesistimientoSolicitudPermisoComponent when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const solicitante = fixture.debugElement.query(By.css('solicitante'));
    expect(solicitante).toBeFalsy();
    const desistimiento = fixture.debugElement.query(By.css('app-desistimiento-solicitud-permiso'));
    expect(desistimiento).toBeTruthy();
  });

  it('should call seleccionaTab when tab is clicked', () => {
    const spy = jest.spyOn(component, 'seleccionaTab');
    const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li a');
    tabs[1].click();
    expect(spy).toHaveBeenCalledWith(2);
    tabs[0].click();
    expect(spy).toHaveBeenCalledWith(1);
  });
});