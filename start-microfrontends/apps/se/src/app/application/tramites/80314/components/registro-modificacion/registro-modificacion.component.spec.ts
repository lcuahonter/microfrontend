import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroModificacionComponent } from './registro-modificacion.component';
import { Router } from '@angular/router';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';

@Injectable()
class MockRouter {
  navigate() {}
}

@Injectable()
class MockImmerModificacionService {}

describe('RegistroModificacionComponent', () => {
  let fixture: ComponentFixture<RegistroModificacionComponent>;
  let component: {
    valorDeAlternancia(): unknown;
    immerModificacionService: any;
    datosDelContenedor: any;
    router: any;
    ngOnDestroy: () => void;
    llenarLaTabla: jest.Mock<any, any, any>;
    ngOnInit: () => void;
    destroyNotifier$: { next?: any; complete?: any };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RegistroModificacionComponent,
      ],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ImmerModificacionService,
          useClass: MockImmerModificacionService,
        },
      ],
    })
      .overrideComponent(RegistroModificacionComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(RegistroModificacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.llenarLaTabla = jest.fn();
    component.ngOnInit();
    expect(component.llenarLaTabla).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run llenarLaTabla without errors', () => {
    const mockData = {
      data: [{ id: 1, folioDePrograma: 'F1', tipoDePrograma: 'T1' }],
    };
    component.immerModificacionService = {
      getTablaData: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb(mockData),
        }),
      }),
    } as any;

    expect(() => component.llenarLaTabla()).not.toThrow();
    expect(component.datosDelContenedor.length).toBe(1);
  });

  it('should run valorDeAlternancia and navigate for "se"', () => {
    component.router = {
      url: '/se/immex-modificacion',
      navigate: jest.fn(),
    } as any;
    component.valorDeAlternancia();
    expect(
      component.router.navigate
    ).toHaveBeenCalledWith([
      '/se/immex-modificacion-cambio-de-sector/solicitud',
    ]);
  });

  it('should run valorDeAlternancia and navigate for "pago"', () => {
    component.router = {
      url: '/pago/immex-modificacion',
      navigate: jest.fn(),
    } as any;
    component.valorDeAlternancia();
    expect(
      component.router.navigate
    ).toHaveBeenCalledWith([
      '/pago/immex-modificacion-cambio-de-sector/solicitud',
    ]);
  });
});
