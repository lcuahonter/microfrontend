import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DatosMercanciaComponent } from './datos-mercancia.component';
import { Tramite630303Store } from '../../estados/tramite630303.store';
import { Tramite630303Query } from '../../estados/tramite630303.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosMercanciaComponent', () => {
  let componente: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let mockTramite630303Store: jest.Mocked<Tramite630303Store>;
  let mockTramite630303Query: jest.Mocked<Tramite630303Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  let subjectEstadoTramite: BehaviorSubject<any>;
  let subjectEstadoConsulta: BehaviorSubject<any>;

  const datosTramiteSimulados = {
    descripcionMercancia: 'Productos electrónicos'
  };

  const datosConsultaSimulados = {
    readonly: false
  } as any;

  beforeEach(async () => {
    subjectEstadoTramite = new BehaviorSubject(datosTramiteSimulados);
    subjectEstadoConsulta = new BehaviorSubject(datosConsultaSimulados);

    mockTramite630303Store = {
      setTramite630303State: jest.fn()
    } as any;

    mockTramite630303Query = {
      selectTramite630303State$: subjectEstadoTramite.asObservable()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: subjectEstadoConsulta.asObservable()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DatosMercanciaComponent],
      providers: [
        FormBuilder,
        { provide: Tramite630303Store, useValue: mockTramite630303Store },
        { provide: Tramite630303Query, useValue: mockTramite630303Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaComponent);
    componente = fixture.componentInstance;
  });

  afterEach(() => {
    subjectEstadoTramite.complete();
    subjectEstadoConsulta.complete();
  });

  describe('estado reactivo de consulta', () => {

    it('debería llamar a guardarDatosFormulario cuando cambia el estado de consulta', fakeAsync(() => {
      const spyGuardar = jest.spyOn(componente, 'guardarDatosFormulario');
      componente.ngOnInit();
      fixture.detectChanges();
      tick();

      subjectEstadoConsulta.next({ readonly: true });
      tick();

      expect(spyGuardar).toHaveBeenCalled();
    }));

  });

  describe('establecerCambioDeValor', () => {
    it('debería manejar nombres de campo vacíos correctamente', () => {
      const evento = { campo: '', valor: 'valor' };

      expect(() => componente.establecerCambioDeValor(evento)).not.toThrow();
      expect(mockTramite630303Store.setTramite630303State).not.toHaveBeenCalled();
    });
  });
});
