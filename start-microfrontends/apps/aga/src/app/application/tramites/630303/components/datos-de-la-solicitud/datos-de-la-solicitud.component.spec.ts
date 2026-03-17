import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630303Store } from '../../estados/tramite630303.store';
import { Tramite630303Query } from '../../estados/tramite630303.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;

  let mockRetornoImportacionTemporalService: jest.Mocked<RetornoImportacionTemporalService>;
  let mockTramite630303Store: jest.Mocked<Tramite630303Store>;
  let mockTramite630303Query: jest.Mocked<Tramite630303Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const mockConsultaioState$ = new Subject<any>();
  const mockTramiteState$ = new Subject<any>();

  beforeEach(async () => {
    mockRetornoImportacionTemporalService = {
      getAduanaDeIngreso: jest.fn().mockReturnValue(of([{ id: '01', nombre: 'Aduana 1' }])),
      getSeccionAduanera: jest.fn().mockReturnValue(of([{ id: '02', nombre: 'Sección 1' }])),
      getProrroga: jest.fn().mockReturnValue(of([{ id: '1', nombre: 'Sí' }])),
    } as any;

    mockTramite630303Store = {
      setTramite630303State: jest.fn(),
    } as any;

    mockTramite630303Query = {
      selectTramite630303State$: mockTramiteState$.asObservable(),
    } as any;

   mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: true }), 
} as any;


    await TestBed.configureTestingModule({
      imports: [DatosDeLaSolicitudComponent, ReactiveFormsModule],
      providers: [
        { provide: RetornoImportacionTemporalService, useValue: mockRetornoImportacionTemporalService },
        { provide: Tramite630303Store, useValue: mockTramite630303Store },
        { provide: Tramite630303Query, useValue: mockTramite630303Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer cambios en el store cuando se llama establecerCambioDeValor', () => {
    const evento = { campo: 'cveAduana', valor: '01' };
    component.establecerCambioDeValor(evento);
    expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('cveAduana', '01');
  });

  it('debería establecer cuenta prórroga como visible si el valor es 1', () => {
    component.estadoSeleccionado = { cuentaProrroga: '1' } as any;
    component.cambiarCuentaProrroga();
    expect(component.showDatosRetornoProrroga).toBe(true);
  });

  it('debería ocultar cuenta prórroga si el valor no es 1', () => {
    component.estadoSeleccionado = { cuentaProrroga: '0' } as any;
    component.cambiarCuentaProrroga();
    expect(component.showDatosRetornoProrroga).toBe(false);
  });

 it('debería manejar valores de tipo objeto en establecerCambioDeValor', () => {
  const evento = { campo: 'cuentaProrroga', valor: { id: '1' } };

  component.estadoSeleccionado = { cuentaProrroga: '0' } as any;

  component.establecerCambioDeValor(evento);

  component.estadoSeleccionado = { cuentaProrroga: '1' } as any;
  component.cambiarCuentaProrroga();

  expect(mockTramite630303Store.setTramite630303State)
    .toHaveBeenCalledWith('cuentaProrroga', '1');

  expect(component.showDatosRetornoProrroga).toBe(true);
});


  it('debería completar destroyed$ al destruir el componente', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
