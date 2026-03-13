import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { Tramite630103Store } from '../../estados/tramite630103.store';
import { Tramite630103Query } from '../../estados/tramite630103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('DatosMercanciaComponent', () => {
  let componente: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let storeMock: jest.Mocked<Tramite630103Store>;
  let queryMock: jest.Mocked<Tramite630103Query>;
  let consultaioQueryMock: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    storeMock = {
      setTramite630103State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630103Store>;

    queryMock = {
      selectTramite630103State$: of({
        campo: 'valor',
      }),
    } as unknown as jest.Mocked<Tramite630103Query>;

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true }),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DatosMercanciaComponent],
      providers: [
        FormBuilder,
        { provide: Tramite630103Store, useValue: storeMock },
        { provide: Tramite630103Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaComponent);
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

  it('debería deshabilitar el formulario si esSoloLectura es true', () => {
    componente.esSoloLectura = true;
    const disableSpy = jest.spyOn(componente.datosMercancia, 'disable');
    componente.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('debería habilitar el formulario si esSoloLectura es false', () => {
    componente.esSoloLectura = false;
    const enableSpy = jest.spyOn(componente.datosMercancia, 'enable');
    componente.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });
});