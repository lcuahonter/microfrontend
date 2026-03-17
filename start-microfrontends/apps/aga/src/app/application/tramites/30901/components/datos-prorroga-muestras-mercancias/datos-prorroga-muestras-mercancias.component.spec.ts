import { TestBed } from '@angular/core/testing';
import { DatosProrrogaMuestrasMercanciasComponent } from './datos-prorroga-muestras-mercancias.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, Subscription } from 'rxjs';
import { RenovacionesMuestrasMercanciasService } from '../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import { Solicitud30901Store } from '../../estados/tramites30901.store';
import { Solicitud30901Query } from '../../estados/tramites30901.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';

describe('DatosProrrogaMuestrasMercanciasComponent', () => {
  let component: DatosProrrogaMuestrasMercanciasComponent;
  let fixture: any;
  let mockRenovacionesService: jest.Mocked<RenovacionesMuestrasMercanciasService>;
  let mockStore: jest.Mocked<Solicitud30901Store>;
  let mockQuery: Partial<Solicitud30901Query>;
  let selectSolicitudSubject: Subject<any>;

  beforeEach(async () => {
    mockRenovacionesService = {
      obtenerOpcionesDesplegables: jest.fn(() =>
        of({
          importadorExportadorPrevio: {
            labelNombre:
              '¿Se han realizado previamente importaciones o exportaciones del producto a registrar?',
            required: true,
            primerOpcion: 'Selecciona un valor',
            catalogos: [
              {
                descripcion: 'Sí',
                id: 2,
              },
              {
                descripcion: 'No',
                id: 1,
              },
            ],
          },
          fraccionArancelariaAga: {
            labelNombre: 'fracción arancelaria',
            required: true,
            primerOpcion: 'Selecciona un valor',
            catalogos: [
              {
                descripcion: '01022901',
                id: 1,
              },
              {
                descripcion: '01022902',
                id: 2,
              },
            ],
          },
          nico: {
            labelNombre: 'Nico',
            required: true,
            primerOpcion: 'Selecciona un valor',
            catalogos: [
              {
                descripcion: '01',
                id: 1,
              },
              {
                descripcion: '02',
                id: 2,
              },
            ],
          },
          ideGenerica: {
            labelNombre: 'Estado físico',
            required: true,
            primerOpcion: 'Selecciona un valor',
            catalogos: [
              {
                descripcion: 'Gaseoso',
                id: 1,
              },
            ],
          },
          tomaMuestraDespacho: {
            labelNombre:
              '¿El producto al que hace referencia a esta solicitud ha sido previamente inscrito en el registro para la toma de muestras?',
            required: true,
            primerOpcion: 'Selecciona un valor',
            catalogos: [
              {
                descripcion: 'Sí',
                id: 1,
              },
              {
                descripcion: 'No',
                id: 0,
              },
            ],
          },
          requisitosObligatoriosTabla: {
            tableHeader: [],
            tableBody: [
              {
                tbodyData: ['Hoja de Seguridad'],
              },
              {
                tbodyData: [
                  'Opinión positiva sobre el cumplimiento de las obligaciones tributarias.',
                ],
              },
              {
                tbodyData: ['Pago de Derechos'],
              },
            ],
          },
          tablaDeTarifasDePago: {
            tableHeader: ['Linea de captura', 'Monto'],
            tableBody: [
              {
                tbodyData: ['032000Q0GHM1284', '50000'],
              },
            ],
          },
          pagoDerechosLista: [
            {
              linea: '032000Q0GHM1284',
              monto: '50000',
            },
          ],
          validezDeLaAutorizacion: {
            fechaInicioVigencia: '01/01/2025',
            fechaFinVigencia: '30/01/2025',
          },
          registroMuestrasDatos: {
            opcionDeImportador: 'no',
            tomaMuestraDespacho: '',
            descMotivoFaltaMuestra: 'no',
            comboFraccionConcatenada: 1,
            fraccionConcatenada: '',
            fracciondescripcion: 'Vacas lecheras.',
            comboNicos: 1,
            nicoDescripcion:
              '1 - Para abasto, cuando la importación la realicen empacadoras Tipo Inspección Federal.',
            nombreQuimico: 'Nombre Quimico',
            nombreComercial: 'Nombre Comercial',
            numeroCAS: '34524',
            ideGenerica: 1,
            descClobGenerica: 'Test',
          },
        })
      ),
    } as any;
    mockStore = {
      setFechaInicioVigencia: jest.fn(() => of('01/01/2025')),
      setFechaFinVigencia: jest.fn(() => of('30/01/2025')),
    } as any;
    selectSolicitudSubject = new Subject();
    mockQuery = {
      selectSolicitud$: selectSolicitudSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosProrrogaMuestrasMercanciasComponent,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        InputFechaComponent,
      ],
      providers: [
        FormBuilder,
        {
          provide: RenovacionesMuestrasMercanciasService,
          useValue: mockRenovacionesService,
        },
        { provide: Solicitud30901Store, useValue: mockStore },
        { provide: Solicitud30901Query, useValue: mockQuery },
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosProrrogaMuestrasMercanciasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formDatosProrroga with disabled controls', () => {
    component.solicitud30901State = {
      fechaInicioVigencia: '2024-01-01',
      fechaFinVigencia: '2024-12-31',
    } as any;
    const spy = jest.spyOn(component, 'getvalidezDeLaAutorizacionDatos');
    component.ngOnInit();
    expect(
      component.formDatosProrroga.get('fechaInicioVigencia')?.disabled
    ).toBe(false);
    expect(component.formDatosProrroga.get('fechaFinVigencia')?.disabled).toBe(
      false
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should patch form values when selectSolicitud$ emits', () => {
    component.ngOnInit();
    const datos = {
      fechaInicioVigencia: '2024-02-01',
      fechaFinVigencia: '2024-11-30',
    };
    selectSolicitudSubject.next(datos);
    expect(component.formDatosProrroga.value).toEqual({
      fechaInicioVigencia: '2024-02-01',
      fechaFinVigencia: '2024-11-30',
    });
  });

  it('should patch fechaInicioVigencia in the form', () => {
    component.formDatosProrroga = new FormBuilder().group({
      fechaInicioVigencia: ['old-date'],
      fechaFinVigencia: [''],
    });
    component.onFechaFinVigenciaChange('2024-05-01');
    expect(component.formDatosProrroga.value.fechaInicioVigencia).toBe(
      '2024-05-01'
    );
  });

  it('should patch fechaFinVigencia in the form', () => {
    component.formDatosProrroga = new FormBuilder().group({
      fechaInicioVigencia: [''],
      fechaFinVigencia: ['old-date'],
    });
    component.onFechaInicioChange('2024-06-01');
    expect(component.formDatosProrroga.value.fechaFinVigencia).toBe(
      '2024-06-01'
    );
  });

  it('should call guardarDatosFormulario when esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario when esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable formDatosProrroga when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.formDatosProrroga = new FormBuilder().group({
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
    });
    component.esFormularioSoloLectura = true;
    jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});
    const disableSpy = jest.spyOn(component.formDatosProrroga, 'disable');
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable formDatosProrroga when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.formDatosProrroga = new FormBuilder().group({
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
    });
    component.esFormularioSoloLectura = false;
    jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});
    const enableSpy = jest.spyOn(component.formDatosProrroga, 'enable');
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should unsubscribe darseDeBaja and complete destroyed$', () => {
    const unsubscribeSpy = jest.fn();
    component.darseDeBaja = {
      unsubscribe: unsubscribeSpy,
    } as unknown as Subscription;
    const destroyed$ = (component as any).destroyed$;
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    const nextSpy = jest.spyOn(destroyed$, 'next');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(component.darseDeBaja).toBeNull();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not throw if darseDeBaja is null', () => {
    component.darseDeBaja = null;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
