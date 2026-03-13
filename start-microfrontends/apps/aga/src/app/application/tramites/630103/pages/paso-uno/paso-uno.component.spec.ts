import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

/**
 * Mock component for 'solicitante' to avoid dependency errors
 */
@Component({
  selector: 'solicitante',
  template: '<div></div>',
})
class MockSolicitanteComponent {}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  // Mock para el servicio y query
  const mockAutorizacionImportacionTemporalService = {
    getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
    actualizarEstadoFormulario: jest.fn(),
  };
  const mockConsultaQuery = {
    selectConsultaioState$: of({ update: true, readonly: false }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'AutorizacionImportacionTemporalService', useValue: mockAutorizacionImportacionTemporalService },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería seleccionar una pestaña correctamente', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería llamar a actualizarEstadoFormulario al guardar datos del formulario', () => {
    const actualizarSpy = jest.spyOn(mockAutorizacionImportacionTemporalService, 'actualizarEstadoFormulario');
    component.guardarDatosFormulario();
    expect(actualizarSpy).toHaveBeenCalled();
  });

  it('debería limpiar destroyed$ al destruir el componente', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});