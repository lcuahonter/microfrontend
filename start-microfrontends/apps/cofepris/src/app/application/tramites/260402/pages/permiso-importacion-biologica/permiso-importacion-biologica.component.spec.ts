import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermisoImportacionBiologicaComponent } from './permiso-importacion-biologica.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PermisoImportacionBiologicaComponent', () => {
  let component: PermisoImportacionBiologicaComponent;
  let fixture: ComponentFixture<PermisoImportacionBiologicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermisoImportacionBiologicaComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisoImportacionBiologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el índice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería inicializar pantallasPasos y datosPasos correctamente', () => {
    expect(Array.isArray(component.pantallasPasos)).toBe(true);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  describe('getValorIndice', () => {
    let wizardMock: any;

    beforeEach(() => {
      wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn()
      };
      component.wizardComponent = wizardMock;
    });

    it('debería actualizar el índice y llamar a wizardComponent.siguiente si la acción es "cont"', () => {
      component.indice = 1;
      component.getValorIndice({ accion: 'cont', valor: 2 });
      expect(component.indice).toBe(2);
      expect(wizardMock.siguiente).toHaveBeenCalled();
      expect(wizardMock.atras).not.toHaveBeenCalled();
    });

    it('debería actualizar el índice y llamar a wizardComponent.atras si la acción no es "cont"', () => {
      component.indice = 3;
      component.getValorIndice({ accion: 'back', valor: 2 });
      expect(component.indice).toBe(2);
      expect(wizardMock.atras).toHaveBeenCalled();
      expect(wizardMock.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar el índice ni llamar métodos del wizard si el valor está fuera de rango', () => {
      component.indice = 1;
      component.getValorIndice({ accion: 'cont', valor: 0 });
      expect(component.indice).toBe(1);
      expect(wizardMock.siguiente).not.toHaveBeenCalled();
      expect(wizardMock.atras).not.toHaveBeenCalled();

      component.getValorIndice({ accion: 'cont', valor: 5 });
      expect(component.indice).toBe(1);
      expect(wizardMock.siguiente).not.toHaveBeenCalled();
      expect(wizardMock.atras).not.toHaveBeenCalled();
    });
  });
});