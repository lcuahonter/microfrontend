import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SolicitantePageComponent } from './solicitante-page.component';
import { Tramite40403Store } from '../../estados/tramite40403.store';
import { Tramite40403Query } from '../../estados/tramite40403.query';

@Injectable()
class MockTramite40403Store {
  establecerSeccion = jest.fn();
  establecerFormaValida = jest.fn();
}


describe('SolicitantePageComponent', () => {
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let component: SolicitantePageComponent;
  let Tramite40403QueryMock: jest.Mocked<Tramite40403Query>;
  let tramite40403StoreMock: MockTramite40403Store;

  beforeEach(async () => {
    Tramite40403QueryMock = {
      selectSeccionState$: observableOf({
        pasos: [],
        currentStep: 1,
      }),
    } as unknown as jest.Mocked<Tramite40403Query>;
    tramite40403StoreMock = new MockTramite40403Store();
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SolicitantePageComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite40403Query, useValue: Tramite40403QueryMock },
        { provide: Tramite40403Store, useValue: tramite40403StoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  /**
   * Verifica que el componente se haya creado correctamente.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que el método `ngOnInit` se inicialice correctamente.
   */
  it('should initialize properly on ngOnInit()', () => {
    jest.spyOn(component as any, 'asignarSecciones');

    component.ngOnInit();

    expect((component as any).asignarSecciones).toHaveBeenCalled();
  });

  /**
   * Verifica que el método `getValorIndice` se llame y active la navegación del asistente.
   */
  it('should call getValorIndice() and trigger wizard navigation', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'prev' });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  /**
   * Verifica que el método `asignarSecciones` asigne las secciones correctamente.
   */
  it('should assign sections correctly using asignarSecciones()', () => {
    (component as any).asignarSecciones();
    expect(tramite40403StoreMock.establecerSeccion).toHaveBeenCalled();
    expect(tramite40403StoreMock.establecerFormaValida).toHaveBeenCalled();
  });
});
