import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { PlaguicidasComponent } from './plaguicidas.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of } from 'rxjs';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Tramite260511Store } from '../../../../shared/estados/stores/260511/tramite260511.store';
import { Tramite260511Query } from '../../../../shared/estados/queries/260511/tramite260511.query';

class MockStore {
  setContinuarTriggered = jest.fn();
  setIdSolicitud = jest.fn();
}

class MockQuery {
  selectSolicitud$ = of({
    continuarTriggered: false,
    formValidity: {},
    idSolicitud: 0
  });
}

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
  listaPasos: any[] = [];
  indice = new EventEmitter<number>();
  indiceActual = 1;
  ngOnChanges = jest.fn();
  estadoInicial: any = {};
  lista: any[] = [];
  maximo: number = 0;
  wizardService: any = {};
}

class MockSharedService {
  getAllState = jest.fn().mockReturnValue(of({ a: 1 }));
  buildPayload = jest.fn().mockReturnValue({ payload: true });
  guardarDatosPost = jest.fn().mockReturnValue(
    of({
      codigo: "00",
      mensaje: "Guardado correctamente",
      datos: { id_solicitud: 999 }
    })
  );
}

class MockConsultaQuery {
  private subject = new BehaviorSubject<any>({});
  selectConsultaioState$ = this.subject.asObservable();
}

@Component({ selector: 'app-paso-uno', template: '' })
class MockPasoUnoComponent {
  validarFormularios = jest.fn().mockReturnValue(true);
}

describe('PlaguicidasComponent', () => {
  let component: PlaguicidasComponent;
  let fixture: ComponentFixture<PlaguicidasComponent>;
  let store: MockStore;
  let mockSharedSvc: MockSharedService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PlaguicidasComponent,
        MockWizardComponent,
        MockPasoUnoComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Tramite260511Store, useClass: MockStore },
        { provide: Tramite260511Query, useClass: MockQuery },
        { provide: ConsultaioQuery, useClass: MockConsultaQuery },
        { provide: Shared2605Service, useClass: MockSharedService },
        ToastrService,
        provideToastr()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaguicidasComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite260511Store) as any;
    
    mockSharedSvc = TestBed.inject(Shared2605Service) as any;
    fixture.detectChanges();
    component.wizardComponent = fixture.debugElement.query(By.directive(MockWizardComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should call wizardComponent.atras() on accion = "back"', () => {
    fixture.detectChanges();
    const wizardDebug = fixture.debugElement.query(By.directive(MockWizardComponent));
    component.wizardComponent = wizardDebug.componentInstance;
    const spy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(spy).toHaveBeenCalled();
    expect(component.indice).toBe(1);
  });

  it('should render wizard component', () => {
    const wizard = fixture.debugElement.query(By.directive(MockWizardComponent));
    expect(wizard).toBeTruthy();
  });

  it('should call validarFormularios on pasoUnoComponent when indice = 1', () => {
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;

    component.indice = 1;

    const result = (component as any).validarFormulariosPasoActual();

    expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should block navigation if step 1 is invalid', () => {
    component.pasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(false)
    } as any;
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(store.setContinuarTriggered).toHaveBeenCalledWith(true);
    expect(component.isPeligro).toBe(true);
    expect(component.indice).toBe(1);
  });

  it('should emit cargarArchivosEvento', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle seccionCargarDocumentos based on cargaRealizada()', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should set isPeligro=true when step 1 is invalid', () => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: () => false } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.isPeligro).toBe(true);
  });

  it('should save and update guardarIdSolicitud', fakeAsync(() => {
    const mockResp = { datos: { id_solicitud: 99 } } as any;

    jest.spyOn(mockSharedSvc, 'buildPayload').mockReturnValue({});
    jest.spyOn(mockSharedSvc, 'guardarDatosPost').mockReturnValue(of(mockResp));

    component.guardar({}).then((resp) => {
      expect(resp).toBe(mockResp);
      //expect(component?.id_solicitud).toBe(99);
    });

    tick();
  }));

it('should call wizardComponent.siguiente() when navigating forward (indice > 1)', () => {
    const spy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.indice = 2;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(spy).toHaveBeenCalled();
    expect(component.indice).toBe(3);
  });

  it('should call wizardService.cambio_indice() when navigating steps', () => {
    const cambioSpy = jest.spyOn(component.wizardService, 'cambio_indice' as any);
    component.indice = 2;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(cambioSpy).toHaveBeenCalledWith(3);
  });

  it('should validate multiple forms inside verificarLaValidezDelFormulario()', () => {
    const mockFormSvc: any = {
      isFormValid: jest.fn().mockReturnValue(true)
    };
    (component as any).servicioDeFormularioService = mockFormSvc;
    expect(mockFormSvc.isFormValid).toHaveBeenCalledTimes(5);
  });

   it('should NOT navigate when shouldNavigate$ returns error', fakeAsync(() => {
    jest.spyOn(mockSharedSvc, 'guardarDatosPost').mockReturnValue(
      of({
        codigo: '99',
        mensaje: 'Error',
        datos: {}
      })
    );

    const spyNext = jest.spyOn(component.wizardComponent, 'siguiente');

    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 1 });

    tick(100);   // process internal timers
    flush();     // clear remaining timers to avoid test leakage

    expect(spyNext).not.toHaveBeenCalled();
    expect(component.indice).toBe(1);
  }));


  it('should update activarBotonCargaArchivos via manejaEventoCargaDocumentos()', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });


  it('should call onCargaEnProgreso and set cargaEnProgreso', () => {
    component.cargaEnProgreso = false;
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('should return true in validarFormulariosPasoActual if pasoUnoComponent is undefined', () => {
    component.pasoUnoComponent = undefined as any;
    component.indice = 1;
    expect(component.validarFormulariosPasoActual()).toBe(true);
  });

  it('should handle proceedNavigation for all branches', fakeAsync(() => {
    // accionSeleccionada = cont, indice = 1, shouldNavigate$ returns true
    (component as any).accionSeleccionada = 'cont';
    component.indice = 1;
    (component as any).nextIndex = 2;
    (component as any).currentIndex = 1;
    component.datosPasos = { nroPasos: 3, indice: 1, txtBtnAnt: '', txtBtnSig: '' };
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
    const wizardNextSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const cambioSpy = jest.spyOn(component.wizardService, 'cambio_indice' as any);
    (component as any).proceedNavigation();
    tick();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(wizardNextSpy).toHaveBeenCalled();
    expect(cambioSpy).toHaveBeenCalledWith(2);
    // accionSeleccionada = cont, indice != 1
    (component as any).accionSeleccionada = 'cont';
    component.indice = 2;
    (component as any).nextIndex = 3;
    (component as any).proceedNavigation();
    expect(component.indice).toBe(3);
    // accionSeleccionada != cont
    (component as any).accionSeleccionada = 'back';
    component.indice = 3;
    (component as any).nextIndex = 2;
    const wizardBackSpy = jest.spyOn(component.wizardComponent, 'atras');
    (component as any).proceedNavigation();
    expect(component.indice).toBe(2);
    expect(wizardBackSpy).toHaveBeenCalled();
  }));

  it('should handle proceedNavigation when shouldNavigate$ returns false', fakeAsync(() => {
    (component as any).accionSeleccionada = 'cont';
    component.indice = 1;
    (component as any).nextIndex = 2;
    (component as any).currentIndex = 1;
    component.datosPasos = { nroPasos: 3, indice: 1, txtBtnAnt: '', txtBtnSig: '' };
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    (component as any).proceedNavigation();
    tick();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  }));

  it('should handle guardar error', async () => {
    const svc = TestBed.inject(Shared2605Service) as any;
    svc.guardarDatosPost.mockReturnValueOnce({ subscribe: ({ error }: any) => error('fail') });
    await expect(component.guardar({})).rejects.toBe('fail');
  });

  it('should handle guardar with missing datos', async () => {
    const svc = TestBed.inject(Shared2605Service) as any;
    svc.guardarDatosPost.mockReturnValueOnce({ subscribe: ({ next }: any) => next({ codigo: '00', mensaje: 'ok' }) });
    await expect(component.guardar({})).resolves.toEqual({ codigo: '00', mensaje: 'ok' });
  });

});
