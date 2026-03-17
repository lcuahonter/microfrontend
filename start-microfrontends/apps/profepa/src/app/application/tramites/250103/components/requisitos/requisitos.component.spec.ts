import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequisitosComponent } from './requisitos.component';
import { Tramite250103Query } from '../../estados/tramite250103.query';
import { Tramite250103Store } from '../../estados/tramite250103.store';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RequisitosComponent', () => {
  let component: RequisitosComponent;
  let fixture: ComponentFixture<RequisitosComponent>;
  let storeMock: any; 

  const MOCK_STATE = {
    medio: 2,
    identificacion: 'ABC123',
    economico: 'ECO456',
    placa: 'XYZ789',
    numero: '001',
    fechas: '2025-04-01',
    requisito: 3,
  };

  beforeEach(async () => {
    storeMock = {
      setMedio: jest.fn(),
      setIdentificacion: jest.fn(),
      setEconomico: jest.fn(),
      setPlaca: jest.fn(),
      setNumero: jest.fn(),
      setFechas: jest.fn(),
      setRequisito: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RequisitosComponent],
      providers: [
        FormBuilder,
        { provide: Tramite250103Query, useValue: { selectSolicitud$: of(MOCK_STATE) } },
        { provide: Tramite250103Store, useValue: storeMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Avoid errors for unknown elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit with store values', () => {
    component.ngOnInit();
    expect(component.transporteForm.value.identificacion).toBe('ABC123');
    expect(component.transporteForm.value.medio).toBe(2);
    expect(component.transporteForm.value.requisito).toBe(3);
  });

  it('should toggle transporte modal visibility', () => {
    expect(component.showtransporteModal).toBe(false);
    component.transporte();
    expect(component.showtransporteModal).toBe(true);
    component.transporte();
    expect(component.showtransporteModal).toBe(false);
  });

  it('should toggle requisitos modal visibility', () => {
    expect(component.showrequisitosModal).toBe(false);
    component.requisitos();
    expect(component.showrequisitosModal).toBe(true);
    component.requisitos();
    expect(component.showrequisitosModal).toBe(false);
  });

  it('should push requisito data and close modal', () => {
    component.transporteForm.setValue({
      medio: 2,
      identificacion: 'ID123',
      economico: 'ECO789',
      placa: 'PLA001',
      numero: '123',
      fechas: '2025-04-17',
      requisito: 2,
    });

    component.showrequisitosModal = true;
    // component.RequisitosDatos();
    expect(component.RequisitosTabla.length).toBe(1);
    expect(component.showrequisitosModal).toBe(false);
  });

  it('should push transporte data and close modal', () => {
    component.transporteForm.setValue({
      medio: 2,
      identificacion: 'ID456',
      economico: 'ECO123',
      placa: 'PLA002',
      numero: '456',
      fechas: '2025-04-18',
      requisito: 3,
    });

    component.showtransporteModal = true;
    // component.TransporteDatos();
    expect(component.TransporteTabla.length).toBe(1);
    expect(component.showtransporteModal).toBe(false);
  });

  it('should call correct store method with setValoresStore()', () => {
    component.transporteForm.controls['medio'].setValue(5);
    component.setValoresStore(component.transporteForm, 'medio',);
    expect(storeMock.setMedio).toHaveBeenCalledWith(5);
  });

  it('should clean up resources on destroy', () => {
    const NEXT_SPY = jest.spyOn(component['destroyNotifier$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
  it('should initialize solicitudState with the state from tramite250103Query', () => {
    const mockState = { medio: 'test', identificacion: '12345' };
    component.guardarDatosFormulario();
    expect(component.solicitudState).toEqual(mockState);
  });

  it('should unsubscribe properly when destroyNotifier$ emits', () => {
    const destroyNotifier$ = new Subject<void>();
    component['destroyNotifier$'] = destroyNotifier$;
    component.guardarDatosFormulario();
    destroyNotifier$.next();
    destroyNotifier$.complete();
  });
});