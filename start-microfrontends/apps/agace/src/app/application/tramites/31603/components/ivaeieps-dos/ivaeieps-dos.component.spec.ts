import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { IvaeiepsDosComponent } from './ivaeieps-dos.component';
import { RegistrosDeComercioExteriorService } from '../../services/registros-de-comercio-exterior.service';
import { Tramite31603Store } from '../../estados/stores/tramite31603.store';
import { Tramite31603Query } from '../../estados/queries/tramite31603.query';

describe('IvaeiepsDosComponent', () => {
  let component: IvaeiepsDosComponent;
  let fixture: ComponentFixture<IvaeiepsDosComponent>;
  let comercioExteriorSvcMock: any;
  let tramite31603StoreMock: any;
  let tramite31603QueryMock: any;

  beforeEach(async () => {
    comercioExteriorSvcMock = {
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Banco 1' }] })),
      getInversionTablaDatos: jest.fn().mockReturnValue(of([])),
      getTipoInversionDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };

    tramite31603StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };

    tramite31603QueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [IvaeiepsDosComponent],
      providers: [
        FormBuilder,
        { provide: RegistrosDeComercioExteriorService, useValue: comercioExteriorSvcMock },
        { provide: Tramite31603Store, useValue: tramite31603StoreMock },
        { provide: Tramite31603Query, useValue: tramite31603QueryMock },
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

  it('should call setDynamicFieldValue with correct values when establecerCambioDeValor is called', () => {
    const event = { campo: 'testField', valor: { id: 123 } };
    component.establecerCambioDeValor(event);
    expect(tramite31603StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testField', 123);

    const eventWithoutId = { campo: 'testField', valor: 'testValue' };
    component.establecerCambioDeValor(eventWithoutId);
    expect(tramite31603StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testField', 'testValue');
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should update solicitudState when selectSolicitud$ emits a value', () => {
    const mockState = { test: 'value' };
    tramite31603QueryMock.selectSolicitud$ = of(mockState);
    component.ngOnInit();
    expect(component.solicitudState).toEqual(mockState);
  });
});
