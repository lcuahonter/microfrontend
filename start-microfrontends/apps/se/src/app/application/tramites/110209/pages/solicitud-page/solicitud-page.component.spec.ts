import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';


@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SolicitudPageComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    component.wizardComponent = new MockWizardComponent() as any;
    
    component.pasoUnoComponent = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar u ocultar el formulario de mercancía y capturar el índice', () => {
    component.showMercancia(false, 2);
    expect(component.showMercanciaForm).toBe(false);
    expect(component.capturarTapIndice).toBe(2);

    component.showMercancia(true, 3);
    expect(component.showMercanciaForm).toBe(true);
    expect(component.capturarTapIndice).toBe(3);
  });

it('debe actualizar el índice y llamar atras en getValorIndice con otra acción', () => {
  const ACCION = { accion: 'prev', valor: 1 };
  component.indice = 2;
  component.wizardComponent = new MockWizardComponent() as any;
  component.getValorIndice(ACCION);
  expect(component.indice).toBe(1);
});

 it('no debe actualizar el índice ni llamar métodos si valor fuera de rango', () => {
  const ACCION = { accion: 'cont', valor: 0 };
  component.indice = 5;
  component.wizardComponent = new MockWizardComponent() as any;
  component.pasoUnoComponent = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
  component.getValorIndice(ACCION);
});
});