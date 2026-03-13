import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { IvaeiepsDosComponent } from './ivaeieps-dos.component';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { Tramite31602Store } from '../../estados/stores/tramite31602.store';
import { Tramite31602Query } from '../../estados/queries/tramite31602.query';

describe('IvaeiepsDosComponent', () => {
  let component: IvaeiepsDosComponent;
  let fixture: ComponentFixture<IvaeiepsDosComponent>;
  let comercioExteriorSvcMock: any;
  let tramite31602StoreMock: any;
  let tramite31602QueryMock: any;

  beforeEach(async () => {
    comercioExteriorSvcMock = {
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Banco 1' }] })),
      getInversionTablaDatos: jest.fn().mockReturnValue(of([])),
      getTipoInversionDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };
    tramite31602StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };
    tramite31602QueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [IvaeiepsDosComponent],
      providers: [
        FormBuilder,
        { provide: ComercioExteriorService, useValue: comercioExteriorSvcMock },
        { provide: Tramite31602Store, useValue: tramite31602StoreMock },
        { provide: Tramite31602Query, useValue: tramite31602QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IvaeiepsDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize porcentajeMontoForm on init', () => {
    expect(component.porcentajeMontoForm).toBeDefined();
    expect(component.porcentajeMontoForm.get('porcentaje')).toBeTruthy();
    expect(component.porcentajeMontoForm.get('monto')).toBeTruthy();
  });

  it('should call getBancoCatalogDatos and populate banco options', () => {
    component.getBancoCatalogDatos();
    expect(comercioExteriorSvcMock.getBancoDatos).toHaveBeenCalled();
    const bancoField = component.pagoDeDerechosDatos.find((field) => field.id === 'banco');
    expect(bancoField).toHaveProperty('opciones', [{ id: 1, descripcion: 'Banco 1' }]);
  });

  it('should call setDynamicFieldValue with correct values when establecerCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: { id: 123 } };
    component.establecerCambioDeValor(event);
    expect(tramite31602StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 123);

    const eventWithoutId = { campo: 'testCampo', valor: 'testValue' };
    component.establecerCambioDeValor(eventWithoutId);
    expect(tramite31602StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValue');
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should retrieve checkboxFormGroup correctly', () => {
    expect(component.checkboxFormGroup).toBe(component.delGrupo.get('checkboxFormGroup'));
  });

  it('should retrieve checkboxDosFormGroup correctly', () => {
    expect(component.checkboxDosFormGroup).toBe(component.contadoGrupo.get('checkboxDosFormGroup'));
  });

  it('should retrieve deLasSiguientesGrp correctly', () => {
    expect(component.deLasSiguientesGrp).toBe(component.deLasSiguientesFormGroup.get('deLasSiguientesGrp'));
  });

  it('should retrieve pagoDeDerechos correctly', () => {
    expect(component.pagoDeDerechos).toBe(component.pagoDeDerechosFormGroup.get('pagoDeDerechos'));
  });
});
