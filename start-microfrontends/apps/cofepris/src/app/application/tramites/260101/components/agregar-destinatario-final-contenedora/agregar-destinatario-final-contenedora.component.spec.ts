import { TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: any;
  let mockTramiteStore: jest.Mocked<Tramite260101Store>;
  let mockTramiteQuery: any;
  let mockActivatedRoute: any;

  const mockState = {
    destinatarioFinalTablaDatos: [{ id: 1, nombre: 'Dest 1' }],
    destinatarioFinalTablaModificaDatos: [{ id: 2, nombre: 'Dest 2' }]
  } as any;

  beforeEach(async () => {
    mockTramiteStore = {
      updateDestinatarioFinalTablaDatos: jest.fn()
    } as any;
    mockTramiteQuery = {
      selectTramiteState$: of(mockState)
    };
    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, AgregarDestinatarioFinalComponent, HttpClientTestingModule,AgregarDestinatarioFinalContenedoraComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: Tramite260101Store, useValue: mockTramiteStore },
        { provide: Tramite260101Query, useValue: mockTramiteQuery },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize idProcedimiento with ID_PROCEDIMIENTO', () => {
    expect(component.idProcedimiento).toBe(ID_PROCEDIMIENTO);
  });

  it('should set tramiteState and destinatarioFinalTablaDatos from query', () => {
    expect(component.tramiteState).toEqual(mockState);
    expect(component.destinatarioFinalTablaDatos).toEqual(mockState.destinatarioFinalTablaDatos);
  });

  it('should clear destinatarioFinalTablaDatos if update param is false', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos).toEqual([]);
  });

  it('should set destinatarioFinalTablaDatos from tramiteState if update param is true', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = mockState;
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos).toEqual(mockState.destinatarioFinalTablaModificaDatos);
  });

  it('should call tramiteStore.updateDestinatarioFinalTablaDatos on updateDestinatarioFinalTablaDatos', () => {
    const destinatarios: Destinatario[] = [];
    component.updateDestinatarioFinalTablaDatos(destinatarios);
    expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(destinatarios);
  });

  it('should clear destinatarioFinalTablaDatos when update param is missing', () => {
    mockActivatedRoute.queryParams = of({});
    component.destinatarioFinalTablaDatos = [];
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos).toEqual([]);
  });

  it('should handle ngOnInit multiple queryParams emissions', () => {
    const params$ = of({ update: 'false' }, { update: 'true' });
    mockActivatedRoute.queryParams = params$;
    component.tramiteState = mockState;
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos).toEqual(mockState.destinatarioFinalTablaModificaDatos);
  });


  it('should not throw if tramiteState is undefined in ngOnInit', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = undefined as any;
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should call updateDestinatarioFinalTablaDatos with empty array', () => {
    component.updateDestinatarioFinalTablaDatos([]);
    expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith([]);
  });
});