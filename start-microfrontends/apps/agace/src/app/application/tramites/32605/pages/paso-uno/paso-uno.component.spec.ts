import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoComponent } from './paso-uno.component';
import {
  BtnContinuarComponent,
  SolicitanteComponent,
} from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormControl, FormGroup } from '@angular/forms';
import { DatosComunesComponent } from '../../components/datos-comunes/datos-comunes.component';
import { TercerosRelacionadosComponent } from '../../components/terceros-relacionados/terceros-relacionados.component';
import { ImportadorExportadorComponent } from '../../components/importador-exportador/importador-exportador.component';
import { CTPATComponent } from '../../components/c-tpat/c-tpat.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockSolicitudService: Partial<SolicitudService>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;

  let mockSolicitanteComponent: Partial<SolicitanteComponent>;
  let mockDatosComunesComponent: Partial<DatosComunesComponent>;
  let mockTercerosRelacionadosComponent: Partial<TercerosRelacionadosComponent>;
  let mockImportadorExportadorComponent: Partial<ImportadorExportadorComponent>;
  let mockCTPATComponent: Partial<CTPATComponent>;

  beforeEach(async () => {
    mockSolicitudService = {
      obtenerDatos: jest.fn().mockReturnValue(of(null)),
      actualizarEstado: jest.fn(),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({
        procedureId: '1',
        parameter: 'param',
        department: 'AGACE',
        folioTramite: 'FOLIO123',
        tipoDeTramite: 'TIPO',
        estadoDeTramite: 'ESTADO',
        readonly: false,
        create: false,
        update: false,
        consultaioSolicitante: null,
      }),
    } as unknown as Partial<ConsultaioQuery>;

    mockSolicitanteComponent = {
      form: new FormGroup({
        test: new FormControl('test'),
      }),
    };

    mockDatosComunesComponent = {
      validarFormulario: jest.fn().mockReturnValue(true),
    };

    mockTercerosRelacionadosComponent = {
      validarFormulario: jest.fn().mockReturnValue(true),
    };

    mockImportadorExportadorComponent = {
      validarFormulario: jest.fn().mockReturnValue(true),
    };

    mockCTPATComponent = {
      validarFormulario: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

    component.solicitante = mockSolicitanteComponent as SolicitanteComponent;
    component.datosComunesComponent =
      mockDatosComunesComponent as DatosComunesComponent;
    component.tercerosRelacionadosComponent =
      mockTercerosRelacionadosComponent as TercerosRelacionadosComponent;
    component.importadorExportadorComponent =
      mockImportadorExportadorComponent as ImportadorExportadorComponent;
    component.ctpatComponent = mockCTPATComponent as CTPATComponent;

    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('debe llamar obtenerDatos y actualizarEstado cuando la respuesta es válida', () => {
    const mockResponse = { id: 1, name: 'test' };
    (mockSolicitudService.obtenerDatos as jest.Mock).mockReturnValue(
      of(mockResponse)
    );
    (mockSolicitudService.actualizarEstado as jest.Mock).mockReturnValue(
      undefined
    );

    component.esDatosRespuesta = false;

    component.guardarDatosFormulario();

    expect(mockSolicitudService.obtenerDatos).toHaveBeenCalled();
    expect(mockSolicitudService.actualizarEstado).toHaveBeenCalledWith(
      mockResponse
    );
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('no debe actualizar estado cuando la respuesta es null', () => {
    (mockSolicitudService.obtenerDatos as jest.Mock).mockReturnValue(of(null));
    (mockSolicitudService.actualizarEstado as jest.Mock).mockReturnValue(
      undefined
    );

    component.esDatosRespuesta = false;

    component.guardarDatosFormulario();

    expect(mockSolicitudService.obtenerDatos).toHaveBeenCalled();
    expect(mockSolicitudService.actualizarEstado).not.toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('no debe actualizar estado cuando la respuesta es undefined', () => {
    (mockSolicitudService.obtenerDatos as jest.Mock).mockReturnValue(
      of(undefined)
    );
    (mockSolicitudService.actualizarEstado as jest.Mock).mockReturnValue(
      undefined
    );

    component.esDatosRespuesta = false;

    component.guardarDatosFormulario();

    expect(mockSolicitudService.obtenerDatos).toHaveBeenCalled();
    expect(mockSolicitudService.actualizarEstado).not.toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('debe manejar errores del servicio obtenerDatos', () => {
    (mockSolicitudService.obtenerDatos as jest.Mock).mockReturnValue(
      throwError(() => new Error('Service error'))
    );
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.guardarDatosFormulario();

    expect(mockSolicitudService.obtenerDatos).toHaveBeenCalled();
    expect(mockSolicitudService.actualizarEstado).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('debe completar la suscripción al destruir el componente', () => {
    const mockResponse = { id: 1, name: 'test' };
    (mockSolicitudService.obtenerDatos as jest.Mock).mockReturnValue(
      of(mockResponse)
    );

    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );

    component.guardarDatosFormulario();
    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  beforeEach(() => {
    (mockDatosComunesComponent.validarFormulario as jest.Mock).mockReturnValue(
      true
    );
    (
      mockTercerosRelacionadosComponent.validarFormulario as jest.Mock
    ).mockReturnValue(true);
    (
      mockImportadorExportadorComponent.validarFormulario as jest.Mock
    ).mockReturnValue(true);
    (mockCTPATComponent.validarFormulario as jest.Mock).mockReturnValue(true);

    component.solicitante = mockSolicitanteComponent as SolicitanteComponent;
    component.datosComunesComponent =
      mockDatosComunesComponent as DatosComunesComponent;
    component.tercerosRelacionadosComponent =
      mockTercerosRelacionadosComponent as TercerosRelacionadosComponent;
    component.importadorExportadorComponent =
      mockImportadorExportadorComponent as ImportadorExportadorComponent;
    component.ctpatComponent = mockCTPATComponent as CTPATComponent;

    mockSolicitanteComponent.form!.get('test')!.setErrors(null);
  });

  it('debe retornar true cuando todos los formularios son válidos', () => {
    mockSolicitanteComponent.form!.get('test')!.setValue('valid');

    const result = component.validarFormularios();

    expect(result).toBe(true);
    expect(mockDatosComunesComponent.validarFormulario).toHaveBeenCalled();
    expect(
      mockTercerosRelacionadosComponent.validarFormulario
    ).toHaveBeenCalled();
    expect(
      mockImportadorExportadorComponent.validarFormulario
    ).toHaveBeenCalled();
    expect(mockCTPATComponent.validarFormulario).toHaveBeenCalled();
  });

  it('debe retornar false cuando el formulario solicitante es inválido', () => {
    mockSolicitanteComponent.form!.get('test')!.setErrors({ required: true });
    const markAllAsTouchedSpy = jest.spyOn(
      mockSolicitanteComponent.form!,
      'markAllAsTouched'
    );

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('debe retornar false cuando solicitante es null', () => {
    component.solicitante = null as any;

    const result = component.validarFormularios();

    expect(result).toBe(false);
  });

  it('debe retornar false cuando el componente datosComunesComponent es null', () => {
    component.datosComunesComponent = null as any;

    const result = component.validarFormularios();

    expect(result).toBe(false);
  });

  it('debe retornar false cuando validarFormulario de datosComunesComponent retorna false', () => {
    (mockDatosComunesComponent.validarFormulario as jest.Mock).mockReturnValue(
      false
    );

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(mockDatosComunesComponent.validarFormulario).toHaveBeenCalled();
  });

  it('debe retornar false cuando el componente tercerosRelacionadosComponent es null', () => {
    component.tercerosRelacionadosComponent = null as any;

    const result = component.validarFormularios();

    expect(result).toBe(false);
  });

  it('debe retornar false cuando validarFormulario de tercerosRelacionadosComponent retorna false', () => {
    (
      mockTercerosRelacionadosComponent.validarFormulario as jest.Mock
    ).mockReturnValue(false);

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(
      mockTercerosRelacionadosComponent.validarFormulario
    ).toHaveBeenCalled();
  });

  it('debe retornar false cuando el componente importadorExportadorComponent es null', () => {
    component.importadorExportadorComponent = null as any;

    const result = component.validarFormularios();

    expect(result).toBe(false);
  });

  it('debe retornar false cuando validarFormulario de importadorExportadorComponent retorna false', () => {
    (
      mockImportadorExportadorComponent.validarFormulario as jest.Mock
    ).mockReturnValue(false);

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(
      mockImportadorExportadorComponent.validarFormulario
    ).toHaveBeenCalled();
  });

  it('debe retornar false cuando el componente ctpatComponent es null', () => {
    component.ctpatComponent = null as any;

    const result = component.validarFormularios();

    expect(result).toBe(false);
  });

  it('debe retornar false cuando validarFormulario de ctpatComponent retorna false', () => {
    (mockCTPATComponent.validarFormulario as jest.Mock).mockReturnValue(false);

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(mockCTPATComponent.validarFormulario).toHaveBeenCalled();
  });

  it('debe retornar false cuando múltiples componentes fallan la validación', () => {
    (mockDatosComunesComponent.validarFormulario as jest.Mock).mockReturnValue(
      false
    );
    (
      mockTercerosRelacionadosComponent.validarFormulario as jest.Mock
    ).mockReturnValue(false);
    mockSolicitanteComponent.form!.get('test')!.setErrors({ required: true });
    const markAllAsTouchedSpy = jest.spyOn(
      mockSolicitanteComponent.form!,
      'markAllAsTouched'
    );

    const result = component.validarFormularios();

    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(mockDatosComunesComponent.validarFormulario).toHaveBeenCalled();
    expect(
      mockTercerosRelacionadosComponent.validarFormulario
    ).toHaveBeenCalled();
  });

  it('debe actualizar reconocimientoMutuoValue con el valor proporcionado', () => {
    const testValue = 'Si';

    component.onReconocimientoMutuoChange(testValue);

    expect(component.reconocimientoMutuoValue).toBe(testValue);
  });

  it('debe actualizar reconocimientoMutuoValue con valor No', () => {
    const testValue = 'No';

    component.onReconocimientoMutuoChange(testValue);

    expect(component.reconocimientoMutuoValue).toBe(testValue);
  });

  it('debe manejar cadenas vacías', () => {
    const testValue = '';

    component.onReconocimientoMutuoChange(testValue);

    expect(component.reconocimientoMutuoValue).toBe(testValue);
  });

  it('debe manejar valores especiales', () => {
    const testValue = 'N/A';

    component.onReconocimientoMutuoChange(testValue);

    expect(component.reconocimientoMutuoValue).toBe(testValue);
  });

  it('debe sobrescribir valores anteriores', () => {
    component.reconocimientoMutuoValue = 'valorAnterior';
    const newValue = 'nuevoValor';

    component.onReconocimientoMutuoChange(newValue);

    expect(component.reconocimientoMutuoValue).toBe(newValue);
  });

  it('debe suscribirse al consultaQuery.selectConsultaioState$ y establecer consultaState', () => {
    const mockState = {
      procedureId: '1',
      parameter: 'param',
      department: 'AGACE',
      folioTramite: 'FOLIO123',
      tipoDeTramite: 'TIPO',
      estadoDeTramite: 'ESTADO',
      readonly: false,
      create: false,
      update: false,
      consultaioSolicitante: null,
    };


    component.ngOnInit();

    expect(component.consultaState).toEqual(mockState);
  });

  it('debe establecer esDatosRespuesta en true cuando consultaState.update es false', () => {
    const mockState = {
      procedureId: '1',
      parameter: 'param',
      department: 'AGACE',
      folioTramite: 'FOLIO123',
      tipoDeTramite: 'TIPO',
      estadoDeTramite: 'ESTADO',
      readonly: false,
      create: false,
      update: false,
      consultaioSolicitante: null,
    };

    component.esDatosRespuesta = false;

    component.ngOnInit();

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar next y complete en destroyNotifier$', () => {
    const destroyNotifierNextSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );

    component.ngOnDestroy();

    expect(destroyNotifierNextSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('debe actualizar la propiedad indice con el valor proporcionado', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe manejar valores de índice negativos', () => {
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
  });

  it('debe manejar valores de índice cero', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('debe manejar valores de índice grandes', () => {
    component.seleccionaTab(100);
    expect(component.indice).toBe(100);
  });

  it('debe tener las propiedades iniciales correctas', () => {
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBeDefined();
    expect(component.reconocimientoMutuoValue).toBe('');
    expect(component.seccionesDeLaSolicitud).toHaveLength(6);
  });

  it('debe tener la lista de secciones correcta', () => {
    const expectedSections = [
      { index: 1, title: 'Solicitante', component: 'solicitante' },
      { index: 2, title: 'Datos Comunes', component: 'datos-comunes' },
      {
        index: 3,
        title: 'Terceros Relacionados',
        component: 'terceros-relacionados',
      },
      {
        index: 4,
        title: 'Importador y/o Exportador',
        component: 'importador-exportador',
      },
      { index: 5, title: 'CTPAT', component: 'c-tpat' },
      { index: 6, title: 'Perfiles', component: 'perfiles' },
    ];

    expect(component.seccionesDeLaSolicitud).toEqual(expectedSections);
  });

  it('debe tener un Subject para destroyNotifier$', () => {
    expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
  });
});
