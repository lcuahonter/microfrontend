import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PagoLineaDeCapturaComponent } from './pago-linea-de-captura.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, Subscription } from 'rxjs';
import { RenovacionesMuestrasMercanciasService } from '../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import { Solicitud30901Store } from '../../estados/tramites30901.store';
import { Solicitud30901Query } from '../../estados/tramites30901.query';
import {
  NotificacionesComponent,
  InputFechaComponent,
  TablaDinamicaComponent,
  TituloComponent,
  TablaSeleccion,
  Notificacion,
} from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('PagoLineaDeCapturaComponent', () => {
  let component: PagoLineaDeCapturaComponent;
  let fixture: ComponentFixture<PagoLineaDeCapturaComponent>;
  let renovacionesServiceSpy: jest.Mocked<RenovacionesMuestrasMercanciasService>;
  let solicitudStoreSpy: jest.Mocked<Solicitud30901Store>;
  let solicitudQuerySpy: jest.Mocked<Solicitud30901Query>;

  beforeEach(async () => {
    renovacionesServiceSpy = {
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

    solicitudStoreSpy = {
      setLineaCaptura: jest.fn(() => of('NEWLINEA')),
      setValorPago: jest.fn(() => of('2000')),
      setPagoDerechosLista: jest.fn(() =>
        of([{"linea": "FIRSTLINEA", "monto": "1234"}])
      ),
    } as any;

    solicitudQuerySpy = {
      selectSolicitud$: of({
        lineaCaptura: 'ABC123',
        valorPago: '1000',
        pagoDerechosLista: [{ linea: 'ABC123', monto: '1000' }],
      }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NotificacionesComponent,
        InputFechaComponent,
        TablaDinamicaComponent,
        TituloComponent,
        HttpClientTestingModule,
        PagoLineaDeCapturaComponent,
        CommonModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        {
          provide: RenovacionesMuestrasMercanciasService,
          useValue: renovacionesServiceSpy,
        },
        { provide: Solicitud30901Store, useValue: solicitudStoreSpy },
        { provide: Solicitud30901Query, useValue: solicitudQuerySpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoLineaDeCapturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formPagoLC on ngOnInit', () => {
    expect(component.formPagoLC).toBeDefined();
    expect(component.formPagoLC.get('lineaCaptura')).toBeTruthy();
    expect(component.formPagoLC.get('valorPago')).toBeTruthy();
  });

  it('should clean and uppercase input, patch form, and call setLineaCaptura', () => {
    const patchValueSpy = jest.spyOn(component.formPagoLC, 'patchValue');
    const setLineaCapturaSpy = jest.spyOn(solicitudStoreSpy, 'setLineaCaptura');
    (global as any).REGEX_REEMPLAZAR = /[^A-Z0-9]/gi;
    const input = document.createElement('input');
    input.value = 'abc-123*';
    const event = { target: input } as unknown as Event;

    component.setLineaCaptura(event);

    expect(patchValueSpy).toHaveBeenCalledWith({ lineaCaptura: 'ABC123' });
    expect(setLineaCapturaSpy).toHaveBeenCalledWith('ABC123');
  });

  it('should handle empty input in setLineaCaptura', () => {
    const patchValueSpy = jest.spyOn(component.formPagoLC, 'patchValue');
    const setLineaCapturaSpy = jest.spyOn(solicitudStoreSpy, 'setLineaCaptura');
    (global as any).REGEX_REEMPLAZAR = /[^A-Z0-9]/gi;
    const input = document.createElement('input');
    input.value = '';
    const event = { target: input } as unknown as Event;

    component.setLineaCaptura(event);

    expect(patchValueSpy).toHaveBeenCalledWith({ lineaCaptura: '' });
    expect(setLineaCapturaSpy).toHaveBeenCalledWith('');
  });

  it('should reset lineaCaptura on limpiarCampos', () => {
    component.formPagoLC.get('lineaCaptura')?.setValue('SOMELINEA');
    component.limpiarCampos();
    expect(component.formPagoLC.get('lineaCaptura')?.value).toBeNull();
  });

  it('should not add tarifa if form is invalid in anadirTarifasDePago', () => {
    component.formPagoLC.get('lineaCaptura')?.setValue('');
    component.anadirTarifasDePago();
    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should add tarifa if form is valid and no duplicate exists in pagoDerechosLista', () => {
    component.pagoDerechosLista = [
      { linea: 'EXISTING', monto: '1000' }
    ];
    component.formPagoLC.get('lineaCaptura')?.setValue('NEWLINEA');
    component.formPagoLC.get('valorPago')?.setValue('5000');
    component.formPagoLC.get('lineaCaptura')?.setErrors(null);
    component.formPagoLC.get('valorPago')?.setErrors(null);

    component.anadirTarifasDePago();

    expect(solicitudStoreSpy.setPagoDerechosLista).toHaveBeenCalledWith([
      { linea: 'NEWLINEA', monto: '5000' }
    ]);
  });

  it('should mark all as touched and not add tarifa if formPagoLC is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.formPagoLC, 'markAllAsTouched');
    component.formPagoLC.get('lineaCaptura')?.setValue('');
    component.formPagoLC.get('valorPago')?.setValue('');
    component.formPagoLC.get('lineaCaptura')?.setErrors({ required: true });
    component.formPagoLC.get('valorPago')?.setErrors({ required: true });

    component.anadirTarifasDePago();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should not add tarifa if lineaCaptura already exists in pagoDerechosLista', () => {
    component.pagoDerechosLista = [
      { linea: 'DUPLICATE', monto: '1000' }
    ];
    component.formPagoLC.get('lineaCaptura')?.setValue('DUPLICATE');
    component.formPagoLC.get('valorPago')?.setValue('1000');
    component.formPagoLC.get('lineaCaptura')?.setErrors(null);
    component.formPagoLC.get('valorPago')?.setErrors(null);

    component.anadirTarifasDePago();

    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should handle pagoDerechosLista being empty and add tarifa', () => {
    component.pagoDerechosLista = [];
    component.formPagoLC.get('lineaCaptura')?.setValue('UNIQUE');
    component.formPagoLC.get('valorPago')?.setValue('1234');
    component.formPagoLC.get('lineaCaptura')?.setErrors(null);
    component.formPagoLC.get('valorPago')?.setErrors(null);

    component.anadirTarifasDePago();

    expect(solicitudStoreSpy.setPagoDerechosLista).toHaveBeenCalledWith([
      { linea: 'UNIQUE', monto: '1234' }
    ]);
  });

  it('should not add tarifa if formPagoLC is invalid (missing valorPago)', () => {
    component.pagoDerechosLista = [];
    component.formPagoLC.get('lineaCaptura')?.setValue('SOMELINEA');
    component.formPagoLC.get('valorPago')?.setValue('');
    component.formPagoLC.get('valorPago')?.setErrors({ required: true });
    component.anadirTarifasDePago();
    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should not add tarifa if formPagoLC is invalid (missing lineaCaptura)', () => {
    component.pagoDerechosLista = [];
    component.formPagoLC.get('lineaCaptura')?.setValue('');
    component.formPagoLC.get('valorPago')?.setValue('1000');
    component.formPagoLC.get('lineaCaptura')?.setErrors({ required: true });
    component.anadirTarifasDePago();
    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should iterate over pagoDerechosLista using for-in and skip adding if duplicate found', () => {
    component.pagoDerechosLista = [
      { linea: 'DUPLICATE', monto: '1000' },
      { linea: 'OTHER', monto: '2000' }
    ];
    component.formPagoLC.get('lineaCaptura')?.setValue('DUPLICATE');
    component.formPagoLC.get('valorPago')?.setValue('1000');
    component.anadirTarifasDePago();
    expect(solicitudStoreSpy.setPagoDerechosLista).not.toHaveBeenCalled();
  });

  it('should set seleccionadaLineaCapturaLista on onFilaSeleccionada', () => {
    const evento = [{ linea: 'L1', monto: '100' }];
    component.onFilaSeleccionada(evento);
    expect(component.seleccionadaLineaCapturaLista).toEqual(evento);
  });

  it('should set nuevaNotificacion if eliminarSeleccion called with no selection', () => {
    component.seleccionadaLineaCapturaLista = [];
    component.eliminarSeleccion();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toContain(
      'Selecciona por lo menos un registro'
    );
  });

  it('should remove selected lines and update store on eliminarSeleccion', () => {
    component.pagoDerechosLista = [
      { linea: 'L1', monto: '100' },
      { linea: 'L2', monto: '200' },
    ];
    component.seleccionadaLineaCapturaLista = [{ linea: 'L1', monto: '100' }];
    component.eliminarSeleccion();
    expect(solicitudStoreSpy.setPagoDerechosLista).toHaveBeenCalledWith([
      { linea: 'L2', monto: '200' },
    ]);
    expect(component.seleccionadaLineaCapturaLista.length).toBe(0);
  });

  it('should validate form correctly in validarFormulario', () => {
    component.formPagoLC.get('lineaCaptura')?.setValue('032000Q0GHM128445291');
    expect(component.validarFormulario()).toBe(true);
    component.formPagoLC.get('valorPago')?.setValue('50000');
    expect(component.validarFormulario()).toBe(true);
  });
  it('should call guardarDatosFormulario when esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario when esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable formPagoLC if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.formPagoLC.enable();
    component.guardarDatosFormulario();
    expect(component.formPagoLC.disabled).toBe(true);
  });

  it('should enable formPagoLC if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.formPagoLC.disable();
    component.guardarDatosFormulario();
    expect(component.formPagoLC.enabled).toBe(true);
  });

  it('should not throw or change formPagoLC if esFormularioSoloLectura is neither true nor false in guardarDatosFormulario', () => {
    (component as any).esFormularioSoloLectura = undefined;
    const enableSpy = jest.spyOn(component.formPagoLC, 'enable');
    const disableSpy = jest.spyOn(component.formPagoLC, 'disable');
    expect(() => component.guardarDatosFormulario()).not.toThrow();
    expect(enableSpy).not.toHaveBeenCalled();
    expect(disableSpy).not.toHaveBeenCalled();
  });


  it('should unsubscribe darseDeBaja and complete destroyed$ on ngOnDestroy', () => {
    const unsubscribeSpy = jest.fn();
    component.darseDeBaja = {
      unsubscribe: unsubscribeSpy,
    } as unknown as Subscription;
    const destroyed$ = (component as any).destroyed$ as Subject<void>;
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(component.darseDeBaja).toBeNull();
    expect(completeSpy).toHaveBeenCalled();
  });
});
