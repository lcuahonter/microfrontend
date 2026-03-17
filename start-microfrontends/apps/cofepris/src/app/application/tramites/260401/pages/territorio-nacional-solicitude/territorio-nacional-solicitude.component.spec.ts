import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { TerritorioNacionalSolicitudeComponent } from './territorio-nacional-solicitude.component';
import { PASSOS_TERRITORIO } from '../../constantes/territorio-nacional-solicitude.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock WizardComponent
@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  @Input() listaPasos: any;
  siguiente = jest.fn();
  atras = jest.fn();
}

// Mock BtnContinuarComponent
@Component({
  selector: 'btn-continuar',
  template: ''
})
class MockBtnContinuarComponent {
  @Input() datos: any;
}

// Mock child components used in template
@Component({selector: 'app-datos-territorio', template: ''})
class MockDatosTerritorioComponent {}
@Component({selector: 'app-paso-dos', template: ''})
class MockPasoDosComponent {}
@Component({selector: 'app-paso-tres', template: ''})
class MockPasoTresComponent {}

describe('TerritorioNacionalSolicitudeComponent', () => {
  let component: TerritorioNacionalSolicitudeComponent;
  let fixture: ComponentFixture<TerritorioNacionalSolicitudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TerritorioNacionalSolicitudeComponent,
        MockWizardComponent,
        MockBtnContinuarComponent,
        MockDatosTerritorioComponent,
        MockPasoDosComponent,
        MockPasoTresComponent
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritorioNacionalSolicitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar territorioPasos y datosPasos correctamente', () => {
    expect(component.territorioPasos).toBe(PASSOS_TERRITORIO);
    expect(component.datosPasos.nroPasos).toBe(PASSOS_TERRITORIO.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debe actualizar el índice y llamar a wizardComponent.siguiente al ejecutar getValorIndice con acción "cont"', () => {
    // Assign a mock wizardComponent with jest.fn() methods
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a wizardComponent.atras al ejecutar getValorIndice con acción distinta de "cont"', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.getValorIndice({ accion: 'back', valor: 3 });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar a wizardComponent si el valor está fuera de rango', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'back', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});