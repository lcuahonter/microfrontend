import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenunciaDeDerechosDePermisosComponent } from './renuncia-de-derechos-de-permisos.component';
import { BtnContinuarComponent, DatosPasos, ListaPasosWizard, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { PERMISOS } from '../../enums/renuncia-de-derechos-de-permisos.enum';
import { Component } from '@angular/core';
import { DatosComponent } from '../datos/datos.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-wizard-mock',
  template: '',
})
class WizardComponentMock {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('RenunciaDeDerechosDePermisosComponent', () => {
  let component: RenunciaDeDerechosDePermisosComponent;
  let fixture: ComponentFixture<RenunciaDeDerechosDePermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenunciaDeDerechosDePermisosComponent,DatosComponent],
      imports:[WizardComponent,BtnContinuarComponent,SolicitanteComponent,HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RenunciaDeDerechosDePermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el índice con el valor predeterminado 1', () => {
    expect(component.indice).toBe(1);
  });

  it('Debería inicializar datosPasos correctamente', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PERMISOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('Debería actualizar el índice y llamar a wizardComponent.siguiente cuando la acción sea "cont"', () => {
    component.wizardComponent = new WizardComponentMock() as unknown as WizardComponent;
 component.getValorIndice({ valor: 2, accion: 'cont' });

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('Debería actualizar el índice y llamar a wizardComponent.atras cuando la acción sea "atras"', () => {
    component.wizardComponent = new WizardComponentMock() as unknown as WizardComponent;
component.getValorIndice({ valor: 2, accion: 'atras' });

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('No debe actualizar el índice ni llamar a los métodos del componente del asistente cuando el valor esté fuera del rango', () => {
    component.wizardComponent = new WizardComponentMock() as unknown as WizardComponent;
 component.getValorIndice({ valor: 6, accion: 'cont' });

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
