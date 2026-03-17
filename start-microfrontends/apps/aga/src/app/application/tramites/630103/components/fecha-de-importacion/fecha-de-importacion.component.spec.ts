import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FechaDeImportacionComponent } from './fecha-de-importacion.component';
import { Tramite630103Store } from '../../estados/tramite630103.store';
import { Tramite630103Query } from '../../estados/tramite630103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('FechaDeImportacionComponent', () => {
  let componente: FechaDeImportacionComponent;
  let fixture: ComponentFixture<FechaDeImportacionComponent>;
  let storeMock: any;
  let queryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    storeMock = {
      setTramite630103State: jest.fn(),
    };

    queryMock = {
      selectTramite630103State$: of({ campo: 'valor' }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FechaDeImportacionComponent],
      providers: [
        FormBuilder,
        { provide: Tramite630103Store, useValue: storeMock },
        { provide: Tramite630103Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FechaDeImportacionComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería obtener el estado actual del store', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual({ campo: 'valor' });
  });

  it('debería actualizar el store cuando establecerCambioDeValor es llamado', () => {
    const eventoMock = { campo: 'campoPrueba', valor: 'valorPrueba' };
    componente.establecerCambioDeValor(eventoMock);
    expect(storeMock.setTramite630103State).toHaveBeenCalledWith('campoPrueba', 'valorPrueba');
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn((componente as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((componente as any).destroyed$, 'complete');
    componente.ngOnDestroy();
    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería deshabilitar el formulario y los campos si esSoloLectura es true', () => {
    componente.esSoloLectura = true;
    componente.formularioFechaDeImportacion = [
      { id: 'campo1', habilitado: true } as any,
      { id: 'campo2', habilitado: true } as any,
    ];
    const disableSpy = jest.spyOn(componente.FechaDeImportacionTemporalFormulario, 'disable');
    componente.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
    expect(componente.formularioFechaDeImportacion.every(c => c.habilitado === false)).toBe(true);
  });

  it('debería habilitar el formulario y los campos si esSoloLectura es false', () => {
    componente.esSoloLectura = false;
    componente.formularioFechaDeImportacion = [
      { id: 'campo1', habilitado: false } as any,
      { id: 'campo2', habilitado: false } as any,
    ];
    const enableSpy = jest.spyOn(componente.FechaDeImportacionTemporalFormulario, 'enable');
    componente.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
    expect(componente.formularioFechaDeImportacion.every(c => c.habilitado === true)).toBe(true);
  });

  it('debería actualizar esSoloLectura y llamar a guardarDatosFormulario al recibir cambios en consultaioQuery', () => {
    const guardarSpy = jest.spyOn(componente, 'guardarDatosFormulario');
    componente.esSoloLectura = false;
    componente.obtenerEstadoValor();
    expect(componente.esSoloLectura).toBe(true);
    expect(guardarSpy).toHaveBeenCalled();
  });
});