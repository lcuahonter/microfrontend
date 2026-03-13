import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaguicidasComponent } from './plaguicidas.component';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Tramite260504Store } from '../../../../estados/tramites/260504/tramite260504.store';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { Tramite260504Query } from '../../../../estados/queries/260504/tramite260504.query';
class MockStore {
  setContinuarTriggered = jest.fn();
  setIdSolicitud = jest.fn();
}

class MockQuery {
  selectSolicitud$ = of({ continuarTriggered: false });
}

class MockSharedService {
  getAllState = jest.fn().mockReturnValue(of({ a: 1 }));
  buildPayload = jest.fn().mockReturnValue({ payload: true });
  guardarDatosPost = jest.fn();
}

describe('PlaguicidasComponent', () => {
  let component: PlaguicidasComponent;
  let fixture: ComponentFixture<PlaguicidasComponent>;
  let store: MockStore;
  let sharedService: MockSharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaguicidasComponent],
      imports: [WizardComponent, HttpClientTestingModule], // Import the standalone component here
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this to suppress unknown element errors
      providers: [
        { provide: Tramite260504Store, useClass: MockStore },
        { provide: Shared2605Service, useClass: MockSharedService },
        { provide: Tramite260504Query, useClass: MockQuery },
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaguicidasComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite260504Store) as any;
    sharedService = TestBed.inject(Shared2605Service) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.atras() when getValorIndice is called with accion "back"', () => {
    const wizardComponentSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(wizardComponentSpy).toHaveBeenCalled();
  });

  it('should render the wizard component', () => {
    const wizardElement = fixture.debugElement.query(
      By.directive(WizardComponent)
    );
    expect(wizardElement).toBeTruthy();
  });

  it('should emit continuarEvento when btn-continuar is clicked', () => {
    const continuarButton = fixture.debugElement.query(By.css('btn-continuar'));
    const continuarSpy = jest.spyOn(component, 'getValorIndice');
    continuarButton.triggerEventHandler('continuarEvento', {
      accion: 'cont',
      valor: 2,
    });
    expect(continuarSpy).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
  });

  it('should initialize and subscribe to selectSolicitud', () => {
    expect(component.solicitudState).toEqual({ continuarTriggered: false });
    expect(component.isContinuarTriggered).toBe(false);
  });

  it('should call validarFormularios on pasoUnoComponent when indice = 1', () => {
    component.pasoUnoComponent = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    component.indice = 1;
    const result = component.validarFormulariosPasoActual();
    expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should block navigation and show peligro if step 1 form is invalid', () => {
    component.pasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(false)
    } as any;
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(store.setContinuarTriggered).toHaveBeenCalledWith(true);
    expect(component.isPeligro).toBe(true);
    expect(component.indice).toBe(1);   // should remain same
  });
  
  it('should navigate to next step when step 1 is valid and shouldNavigate$ returns OK', () => {
    jest.spyOn(component, 'validarFormulariosPasoActual').mockReturnValue(true);
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    sharedService.guardarDatosPost.mockReturnValue(
      of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 55 } })
    );
    const payload = { accion: 'cont', valor: 1 };
    component.getValorIndice(payload);
    expect(store.setContinuarTriggered).toHaveBeenCalledWith(true);
  });
});
