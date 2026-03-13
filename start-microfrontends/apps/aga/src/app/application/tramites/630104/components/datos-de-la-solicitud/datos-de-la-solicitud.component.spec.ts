import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;

  const mockStore = {
    setTramite630104State: jest.fn(),
  };

  const mockQuery = {
    selectSeccionState$: of({}),
    selectTramite630104State$: of({}),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockService = {
    getAduanaDeIngreso: jest.fn().mockReturnValue(of([{ id: '01', descripcion: 'Aduana 1' }])),
    getSeccionAduanera: jest.fn().mockReturnValue(of([{ id: '001', descripcion: 'Sección 1' }])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDeLaSolicitudComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite630104Store, useValue: mockStore },
        { provide: Tramite630104Query, useValue: mockQuery },
        { provide: EquipoEInstrumentosMusicalesService, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reactive form', () => {
    expect(component.datosImportacionTemporalFormulario).toBeDefined();
    expect(component.datosImportacionTemporalFormulario instanceof Object).toBe(true);
  });

  it('should disable form in readonly mode', () => {
    component.esSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.datosImportacionTemporalFormulario.disabled).toBe(true);
  });

  it('should enable form when not in readonly mode', () => {
    component.esSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.datosImportacionTemporalFormulario.enabled).toBe(true);
  });

  it('should update store with primitive value', () => {
    component.establecerCambioDeValor({ campo: 'campo1', valor: 'valor1' });
    expect(mockStore.setTramite630104State).toHaveBeenCalledWith('campo1', 'valor1');
  });

  it('should update store with object containing id', () => {
    component.establecerCambioDeValor({ campo: 'campo2', valor: { id: 123 } });
    expect(mockStore.setTramite630104State).toHaveBeenCalledWith('campo2', '123');
  });

  it('should unsubscribe on component destroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
