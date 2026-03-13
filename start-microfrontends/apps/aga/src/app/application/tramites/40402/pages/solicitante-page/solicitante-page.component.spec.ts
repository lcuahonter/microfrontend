import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { Tramite40402Query } from '../../estados/tramite40402.query';
import { Tramite40402Store } from '../../estados/tramite40402.store';

@Injectable()
class MockTramite40402Store {
  establecerSeccion = jest.fn();
  establecerFormaValida = jest.fn();
}


describe('SolicitantePageComponent', () => {
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let component: SolicitantePageComponent;
  let Tramite40402QueryMock: jest.Mocked<Tramite40402Query>;
  let tramite40402StoreMock: MockTramite40402Store;

  beforeEach(async () => {
    Tramite40402QueryMock = {
      selectSeccionState$: observableOf({
        pasos: [],
        currentStep: 1,
      }),
    } as unknown as jest.Mocked<Tramite40402Query>;
    tramite40402StoreMock = new MockTramite40402Store();
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SolicitantePageComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite40402Query, useValue: Tramite40402QueryMock },
        { provide: Tramite40402Store, useValue: tramite40402StoreMock },
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
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que el método `ngOnInit` se inicialice correctamente.
   */
    it('debe establecer la sección y actualizar datosPasos en ngOnInit', () => {
      const mockSeccion = {
        pasos: ['step1', 'step2'],
        currentStep: 2,
        seccion: [true, false],
        formaValida: [true, false]
      };
      Tramite40402QueryMock.selectSeccionState$ = observableOf(mockSeccion);
      component.ngOnInit();
      expect(component.seccion).toEqual(mockSeccion);
      expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
      expect(component.datosPasos.indice).toBe(component.indice);
    });

  /**
   * Verifica que el método `getValorIndice` se llame y active la navegación del asistente.
   */
  it('debe llamar a getValorIndice() y activar la navegación del asistente', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'prev' });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

});
