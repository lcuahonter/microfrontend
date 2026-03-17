import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter } from '@angular/core';
import { FloraFaunaComponent } from './flora-fauna.component';
import { AlertComponent, BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { FLORA_FAUNA, FLORA_FAUNA_ALERT } from '../../constantes/flora-fauna.enum';
import { DatosComponent } from '../datos/datos.component';
import {HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-mock-wizard',
  template: '',
})
class MockWizardComponent {
  listaPasos: any[] = [];
  maximo: number = 0;
  wizardService: any = {};
  lista: any[] = []; 
  indice: EventEmitter<number> = new EventEmitter<number>();
  indiceActual: number = 0;
  estadoInicial: any = null;

  siguiente = jest.fn();
  atras = jest.fn();
  ngOnChanges = jest.fn();
}

describe('FloraFaunaComponent', () => {
  let component: FloraFaunaComponent;
  let fixture: ComponentFixture<FloraFaunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloraFaunaComponent, MockWizardComponent,DatosComponent], 
      imports: [AlertComponent,WizardComponent,BtnContinuarComponent,SolicitanteComponent,HttpClientModule], // Add any necessary imports here
      providers: [{ provide: WizardComponent, useClass: MockWizardComponent }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloraFaunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería inicializar los pasos del asistente correctamente', () => {
    expect(component.pantallasPasos).toEqual(FLORA_FAUNA);
    expect(component.datosPasos.nroPasos).toBe(FLORA_FAUNA.length);
  });

  it('Debería mostrar los textos de alerta correctos', () => {
    expect(component.TEXTO_FLORA_FAUNA_ALERT).toBe(FLORA_FAUNA_ALERT);
  });

  it('Debe actualizar el índice y navegar hacia adelante cuando la acción es "cont"', () => {
    component.wizardComponent = new MockWizardComponent(); 

    const action = { accion: 'cont', valor: 2 };
    component.getValorIndice(action);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('Debería actualizar el índice y navegar hacia atrás cuando la acción sea "atras"', () => {
    component.wizardComponent = new MockWizardComponent();

    const action = { accion: 'atras', valor: 1 };
    component.getValorIndice(action);

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('No se debe actualizar el índice si el valor está fuera del rango', () => {
    const initialIndex = component.indice;
    const action = { accion: 'cont', valor: 10 };
    component.getValorIndice(action);

    expect(component.indice).toBe(initialIndex);
  });
});
