import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteContenedoraComponent } from '../../../../tramites/240407/components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { Tramite240407Query } from '../../../../tramites/240407/estados/tramite240407Query.query';
import { Tramite240407Store } from '../../../../tramites/240407/estados/tramite240407Store.store';
import { of, Subject } from 'rxjs';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { DatosDelTramiteFormState, JustificacionTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ActivatedRoute } from '@angular/router';


describe('DatosDelTramiteContenedoraComponent', () => {
  let component: DatosDelTramiteContenedoraComponent;
  let fixture: ComponentFixture<DatosDelTramiteContenedoraComponent>;
  let tramiteQuery: jest.Mocked<Tramite240407Query>;
  let tramiteStore: jest.Mocked<Tramite240407Store>;

  beforeEach(async () => {
    tramiteQuery = {
      getMercanciaTablaDatos$: of([{
        id: 1,
        fraccionArancelaria: '',
        descripcionFraccion: '',
        unidadMedidaTarifa: '',
        cantidadUMT: 0,
        unidadMedidaComercial: '',
        cantidadUMC: 0,
        valorComercial: 0,
        tipoMoneda: '',
        descripcion: ''
      } as MercanciaDetalle]),
      getDatosDelTramite$: of({
        permisoGeneral: '',
        usoFinal: '',
        aduanasSeleccionadas: [],
        paisDestino: '',
        campo: 'valor'
      } as DatosDelTramiteFormState),
      getJustificacionTramite$: of({ justificacion: 'test' } as JustificacionTramiteFormState)
    } as any;

    tramiteStore = {
      updateDatosDelTramiteFormState: jest.fn(),
      updateJustificacionFormulario: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteContenedoraComponent],
      providers: [
        { provide: Tramite240407Query, useValue: tramiteQuery },
        { provide: Tramite240407Store, useValue: tramiteStore },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should initialize aduanasBotones on ngOnInit', () => {
    component.ngOnInit();
    expect(component.aduanasBotones.length).toBeGreaterThan(0);
    expect(component.aduanasBotones[0]).toHaveProperty('btnNombre');
  });

  it('should subscribe and set datosMercanciaTabla from tramiteQuery', () => {
    component.ngOnInit();
    expect(component.datosMercanciaTabla).toEqual([{
      id: 1,
      fraccionArancelaria: '',
      descripcionFraccion: '',
      unidadMedidaTarifa: '',
      cantidadUMT: 0,
      unidadMedidaComercial: '',
      cantidadUMC: 0,
      valorComercial: 0,
      tipoMoneda: '',
      descripcion: ''
    }]);
  });

  it('should subscribe and set datosDelTramiteFormState from tramiteQuery', () => {
    component.ngOnInit();
    const event = {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: ''
    } as DatosDelTramiteFormState;
    component.updateDatosDelTramiteFormulario(event);
    expect(tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(event);
  });

  it('should subscribe and set justificacionTramiteFormState from tramiteQuery', () => {
    component.ngOnInit();
    expect(component.justificacionTramiteFormState).toEqual({ justificacion: 'test' });
  });

  it('should call tramiteStore.updateDatosDelTramiteFormState on updateDatosDelTramiteFormulario', () => {
    const event: DatosDelTramiteFormState = {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: ''
    };
    component.updateDatosDelTramiteFormulario(event);
    expect(tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(event);
  });

  it('should call tramiteStore.updateJustificacionFormulario on updateJustificacionFormulario', () => {
    const event = { justificacion: 'nueva' } as JustificacionTramiteFormState;
    component.updateJustificacionFormulario(event);
    expect(tramiteStore.updateJustificacionFormulario).toHaveBeenCalledWith(event);
  });

  it('should complete unsubscribe$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).unsubscribe$, 'next');
    const completeSpy = jest.spyOn((component as any).unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have idProcedimiento set to NUMERO_TRAMITE.TRAMITE_240407', () => {
    expect(component.idProcedimiento).toBe(NUMERO_TRAMITE.TRAMITE_240407);
  });
});