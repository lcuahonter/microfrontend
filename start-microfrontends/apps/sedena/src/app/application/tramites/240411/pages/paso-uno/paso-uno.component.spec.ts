import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería cambiar el índice al seleccionar una pestaña', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debería establecer esDatosRespuesta en true si no hay actualización', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spyNext = spyOn(component['destroyNotifier$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['destroyNotifier$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});