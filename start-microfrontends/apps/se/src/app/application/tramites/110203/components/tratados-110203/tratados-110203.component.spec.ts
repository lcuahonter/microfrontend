import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { Tratados110203Component } from './tratados-110203.component';

describe('Tratados110203Component', () => {
  let component: Tratados110203Component;
  let fixture: ComponentFixture<Tratados110203Component>;
  let store: Tramite110203Store;
  let query: Tramite110203Query;

  const mockSolicitudState = {
    tratado: 'Tratado de Libre Comercio México-,',
    bloque: 'ISLANDIA (REPUBLICA DE)',
    origen: 'México',
    destino: 'ISLANDIA (REPUBLICA DE)',
    expedicion: '2025-02-18',
    vencimiento: '2026-02-18',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tratados110203Component,ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: Tramite110203Store,
          useValue: {
            setTratado: jest.fn(),
            setBloque: jest.fn(),
            setOrigen: jest.fn(),
            setDestino: jest.fn(),
            setExpedicion: jest.fn(),
            setVencimiento: jest.fn(),
          },
        },
        {
          provide: Tramite110203Query,
          useValue: {
            selectSolicitud$: of(mockSolicitudState),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tratados110203Component);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite110203Store);
    query = TestBed.inject(Tramite110203Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component creation', () => {
    expect(component.tratadosForm).toBeDefined();
    expect(component.tratadosForm.get('tratado')?.value).toBe(mockSolicitudState.tratado);
    expect(component.tratadosForm.get('bloque')?.value).toBe(mockSolicitudState.bloque);
    expect(component.tratadosForm.get('origen')?.value).toBe(mockSolicitudState.origen);
    expect(component.tratadosForm.get('destino')?.value).toBe(mockSolicitudState.destino);
    expect(component.tratadosForm.get('expedicion')?.value).toBe(mockSolicitudState.expedicion);
    expect(component.tratadosForm.get('vencimiento')?.value).toBe(mockSolicitudState.vencimiento);
  });

  it('should call setValoresStore and update the store', () => {
    const spy = jest.spyOn(store, 'setTratado');
    component.setValoresStore(component.tratadosForm, 'tratado', 'setTratado');
    expect(spy).toHaveBeenCalledWith(mockSolicitudState.tratado);
  });

  it('should clean up subscriptions on component destroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});