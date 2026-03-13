import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizacionImportacionSanitariaComponent } from './actualizacion-importacion-sanitaria.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';

describe('ActualizacionImportacionSanitariaComponent', () => {
  let component: ActualizacionImportacionSanitariaComponent;
  let fixture: ComponentFixture<ActualizacionImportacionSanitariaComponent>;

  class MockWizardComponent {
    siguiente = jest.fn();
    atras = jest.fn();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizacionImportacionSanitariaComponent],
      providers: [
        ToastrService,
        { provide: TOAST_CONFIG, useValue: {} },
        provideHttpClient()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizacionImportacionSanitariaComponent);
    component = fixture.componentInstance;
    component['wizardComponent'] = new MockWizardComponent() as any;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener la propiedad pantallasPasos definida y ser un array', () => {
    expect(component.pantallasPasos).toBeDefined();
    expect(Array.isArray(component.pantallasPasos)).toBe(true);
  });

  it('debería tener la propiedad indice inicializada en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería tener la propiedad datosPasos correctamente inicializada', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

 it('debería actualizar el índice y llamar a siguiente() cuando la acción es "cont" y el valor es válido', () => {
  component['wizardComponent'] = new MockWizardComponent() as any;
  component.getValorIndice({ accion: 'cont', valor: 2 });
  expect(component.indice).toBe(2);
  expect(component['wizardComponent'].siguiente).toHaveBeenCalled();
  expect(component['wizardComponent'].atras).not.toHaveBeenCalled();
});

  it('debería actualizar el índice y llamar a atras() cuando la acción NO es "cont" y el valor es válido', () => {
    component['wizardComponent'] = new MockWizardComponent() as any
    component.getValorIndice({ accion: 'volver', valor: 3 });
    expect(component.indice).toBe(3);
    expect(component['wizardComponent'].atras).toHaveBeenCalled();
    expect(component['wizardComponent'].siguiente).not.toHaveBeenCalled();
  });

  it('no debería actualizar el índice ni llamar métodos del wizard si el valor es menor o igual a 0', () => {
    component['wizardComponent'] = new MockWizardComponent() as any
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component['wizardComponent'].siguiente).not.toHaveBeenCalled();
    expect(component['wizardComponent'].atras).not.toHaveBeenCalled();
  });

});