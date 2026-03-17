import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DatosPorRegimenComponent } from './datos-por-regimen.component';
import { Tramite31603Store } from '../../estados/stores/tramite31603.store';
import { Tramite31603Query } from '../../estados/queries/tramite31603.query';
import { of } from 'rxjs';

describe('DatosPorRegimenComponent', () => {
  let component: DatosPorRegimenComponent;
  let fixture: ComponentFixture<DatosPorRegimenComponent>;
  let Tramite31603StoreMock: Partial<Tramite31603Store>;
  let Tramite31603QueryMock: Partial<Tramite31603Query>;

  beforeEach(async () => {
    Tramite31603StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };

    Tramite31603QueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [DatosPorRegimenComponent],
      providers: [
        FormBuilder,
        { provide: Tramite31603Store, useValue: Tramite31603StoreMock },
        { provide: Tramite31603Query, useValue: Tramite31603QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPorRegimenComponent);
    component = fixture.componentInstance;
      component.consultaState = {
          procedureId: '',
          parameter: '',
          department: '',
          folioTramite: '',
          tipoDeTramite: '',
          estadoDeTramite: '',
          readonly: false,
          create: false,
          update: true,
          consultaioSolicitante: null,
        };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize importacionesForm on init', () => {
    expect(component.importacionesForm).toBeDefined();
    expect(component.importacionesForm.get('importaciones')).toBeTruthy();
  });

  it('should update valorSeleccionado on onImportacionesCambio', () => {
    const value = 'testValue';
    component.onImportacionesCambio(value);
    expect(component.valorSeleccionado).toBe(value);
  });

  it('should call setDynamicFieldValue with correct parameters when establecerCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: { id: 'testId' } };
    component.establecerCambioDeValor(event);
    expect(Tramite31603StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testId');
  });

  it('should call setDynamicFieldValue with raw value if event.valor is not an object', () => {
    const event = { campo: 'testCampo', valor: 'testValue' };
    component.establecerCambioDeValor(event);
    expect(Tramite31603StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValue');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from selectSolicitud$ on destroy', () => {
    const subscriptionSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
