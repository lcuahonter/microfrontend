import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosPasosComponent } from './todos-pasos.component';
import { WizardComponent, BtnContinuarComponent,SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { PANTA_PASOS, TITULO_PASO_DOS, TITULO_PASO_TRES, TITULO_PASO_UNO } from '../../services/esquema-de-certificacion.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodosPasosComponent', () => {
  let component: TodosPasosComponent;
  let fixture: ComponentFixture<TodosPasosComponent>;
  let wizardComponentMock: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent,BtnContinuarComponent,HttpClientTestingModule,SolicitanteComponent],
      declarations: [TodosPasosComponent,PasoUnoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosPasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

       wizardComponentMock = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      listaPasos: [],
      indice: 0,
      indiceActual: 0,
      estadoInicial: false,
      estadoFinal: false,
      estadoActual: false,
      pasoActual: null,
      ngOnInit: jest.fn(),
      ngOnChanges: jest.fn(),
      ngOnDestroy: jest.fn(),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.pantallasPasos).toEqual(PANTA_PASOS);
    expect(component.indice).toBe(1);
    expect(component.titulo).toBe(TITULO_PASO_UNO);
    expect(component.datosPasos.nroPasos).toBe(PANTA_PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update title and call wizardComponent methods on getValorIndice', () => {
  component.wizardComponent = {
  siguiente: jest.fn(),
  atras: jest.fn()
} as any;

component.getValorIndice({ valor: 2, accion: 'cont' });
expect(component.wizardComponent.siguiente).toHaveBeenCalled();

component.getValorIndice({ valor: 1, accion: 'back' });
expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods for invalid values', () => {
  component.wizardComponent = {
  siguiente: jest.fn(),
  atras: jest.fn()
} as any;

component.getValorIndice({ valor: 0, accion: 'cont' });
expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();

component.getValorIndice({ valor: 5, accion: 'back' });
expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
