import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent,SolicitanteComponent } from '@ng-mf/data-access-user';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-datos', template: '' })
class MockDatosComponent {}

@Component({ selector: 'app-anexar-requisitos', template: '' })
class MockAnexarRequisitosComponent {}

@Component({ selector: 'app-firmar-solicitud', template: '' })
class MockFirmarSolicitudComponent {}

@Component({
  selector: 'btn-continuar',
  template: ''
})
class MockBtnContinuarComponent {
  @Input() datos: any;
  @Output() continuarEvento = new EventEmitter<any>();
}

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PantallasComponent,
        MockDatosComponent,
        MockAnexarRequisitosComponent,
        MockFirmarSolicitudComponent,
        MockBtnContinuarComponent
      ],
      imports: [
        WizardComponent,SolicitanteComponent,HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar el índice y llamar a siguiente si accion es "cont"', () => {
    const spySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const evento = { valor: 2, accion: 'cont' } as any;
    component.getValorIndice(evento);
    expect(component.indice).toBe(2);
    expect(spySiguiente).toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a atras si accion no es "cont"', () => {
    const spyAtras = jest.spyOn(component.wizardComponent, 'atras');
    const evento = { valor: 3, accion: 'otro' } as any;
    component.getValorIndice(evento);
    expect(component.indice).toBe(3);
    expect(spyAtras).toHaveBeenCalled();
  });

  it('no debe cambiar el índice ni llamar métodos si valor es 0', () => {
    const spySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const spyAtras = jest.spyOn(component.wizardComponent, 'atras');
    component.indice = 1;
    component.getValorIndice({ valor: 0, accion: 'cont' } as any);
    expect(component.indice).toBe(1);
    expect(spySiguiente).not.toHaveBeenCalled();
    expect(spyAtras).not.toHaveBeenCalled();
  });

  it('no debe cambiar el índice ni llamar métodos si valor es 5', () => {
    const spySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const spyAtras = jest.spyOn(component.wizardComponent, 'atras');
    component.indice = 1;
    component.getValorIndice({ valor: 5, accion: 'cont' } as any);
    expect(component.indice).toBe(1);
    expect(spySiguiente).not.toHaveBeenCalled();
    expect(spyAtras).not.toHaveBeenCalled();
  });

  it('debe mostrar <app-datos> cuando indice es 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const datos = fixture.debugElement.query(By.css('app-datos'));
    expect(datos).toBeTruthy();
  });

  it('debe mostrar <app-anexar-requisitos> cuando indice es 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const anexar = fixture.debugElement.query(By.css('app-anexar-requisitos'));
    expect(anexar).toBeTruthy();
  });

  it('debe mostrar <app-firmar-solicitud> cuando indice es 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    const firmar = fixture.debugElement.query(By.css('app-firmar-solicitud'));
    expect(firmar).toBeTruthy();
  });

  it('debe manejar el evento continuarEvento de btn-continuar', () => {
    component.indice = 1;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.directive(MockBtnContinuarComponent));
    expect(btn).toBeTruthy();
    btn.componentInstance.continuarEvento.emit({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
  });

  it('debe tener valores iniciales correctos en datosPasos', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debe tener el valor inicial de indice igual a 1', () => {
    expect(component.indice).toBe(1);
  });
});