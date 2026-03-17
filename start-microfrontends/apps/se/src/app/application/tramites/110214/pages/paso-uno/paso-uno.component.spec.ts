import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { DestinatarioComponent } from '../../components/destinatario/destinatario.component';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { provideHttpClient } from '@angular/common/http';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { firstValueFrom, of } from 'rxjs';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { HistProductoresComponent } from '../../components/hist-productores/hist-productores.component';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let validarInicialmenteCertificadoServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;


  beforeEach(async () => {
    validarInicialmenteCertificadoServiceMock = {
      getDatosConsulta: jest.fn().mockReturnValue(
        of({
          success: true,
          datos: {
            observaciones: 'Test Observaciones',
            idioma: 'Español',
            entidadFederativa: 'Entidad Test',
            representacionFederal: 'Representación Test',
            grupoReceptor: { nombre: 'Receptor Test' },
            grupoDeDirecciones: { direccion: 'Dirección Test' },
            grupoRepresentativo: { representante: 'Representante Test' },
            tercerOperador: true,
            blnPeriodo: false,
            grupoTratado: { tratado: 'Tratado Test' },
            mercanciaSeleccionadasTablaDatos: [{ id: 1, descripcion: 'Mercancia Seleccionada' }],
            mercanciaDisponsiblesTablaDatos: [{ id: 2, descripcion: 'Mercancia Disponible' }],
            datosConfidencialesProductor: { confidencial: true },
            productorMismoExportador: true,
            productoresExportador: [{ id: 3, nombre: 'Productor Exportador' }],
            historicoMercanciaSeleccionadasTablaDatos: [{ id: 4, descripcion: 'Historico Mercancia' }],
          },
        })
      ),
      fetchMostrarApi: jest.fn().mockReturnValue(of({ codigo: '00', datos: {} })),
      obtenerIdioma: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Español' }] })),
      obtenerEntidadFederativa: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Entidad 1' }] })),
      obtenerRepresentacionFederal: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Representación 1' }] })),
      getTipoFactura: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Factura A' }] })),
      obtenerProductorPorExportador: jest.fn().mockReturnValue(of({ datos: [] })),
    };

    tramiteStoreMock = {
      setObservaciones: jest.fn(),
      setPestanaActiva: jest.fn(),
      setIdioma: jest.fn(),
      setEntidadFederativa: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setGrupoReceptor: jest.fn(),
      setGrupoDeDirecciones: jest.fn(),
      setGrupoRepresentativo: jest.fn(),
      setTercerOperador: jest.fn(),
      setPeriodo: jest.fn(),
      setGrupoTratado: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
      setMercanciaDisponsiblesTablaDatos: jest.fn(),
      setDatosConfidencialesProductor: jest.fn(),
      setProductorMismoExportador: jest.fn(),
      setProductoresExportador: jest.fn(),
      setHistoricoMercanciaSeleccionadasTablaDatos: jest.fn(),
      setFormValidity: jest.fn(),
      update: jest.fn(),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        observaciones: 'Observaciones de prueba',
        idioma: 1,
        entidadFederativa: 1,
        representacionFederal: 1,
        optionsTipoFactura: [],
      }),
      formulario$: of({
        datosConfidencialesProductor: { confidencial: true },
        productorMismoExportador: true,
        productoresExportador: [{ id: 1, nombre: 'Productor Test' }]
      }),
      formDatosCertificado$: of({
        certificado: { id: 1 },
        destinatario: { nombre: 'Destinatario Test' }
      }),
      datosProductorFormulario$: of({}),
      getValue: jest.fn().mockReturnValue({
        formValidity: {
          certificadoOrigen: false,
          datosCertificado: true,
          destinatario: true,
          histProductores: false,
        },
      }),
    };
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SolicitanteComponent,
        HistProductoresComponent,
        DestinatarioComponent,
        DatosCertificadoComponent,
        PasoUnoComponent
      ],
      providers: [provideHttpClient(),
      { provide: ValidarInicialmenteCertificadoService, useValue: validarInicialmenteCertificadoServiceMock },
      { provide: Tramite110214Store, useValue: tramiteStoreMock },
      { provide: Tramite110214Query, useValue: tramiteQueryMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.certificadoOrigenComponent = { validarFormulario: jest.fn() } as any;
    component.datosCertificadoComponent = { validarFormulario: jest.fn() } as any;
    component.destinatarioComponent = { validarFormulario: jest.fn() } as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active tab to 1 when seleccionaTab(1) is called', () => {
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should set the active tab to 3 when seleccionaTab(3) is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should render the SolicitanteComponent when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const solicitanteElement = fixture.debugElement.nativeElement.querySelector('solicitante');
    expect(solicitanteElement).toBeTruthy();
  });

  it('should render the HistoricoProductoresComponent when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    const historicoProductoresElement = fixture.debugElement.nativeElement.querySelector('app-hist-productores');
    expect(historicoProductoresElement).toBeTruthy();
  });

  it('should render the DestinatarioComponent when indice is 4', () => {
    component.indice = 4;
    fixture.detectChanges();
    const destinatarioElement = fixture.debugElement.nativeElement.querySelector('app-destinatario');
    expect(destinatarioElement).toBeTruthy();
  });

  it('should render the DatosCertificadoComponent when indice is 5', () => {
    component.indice = 5;
    fixture.detectChanges();
    const datosCertificadoElement = fixture.debugElement.nativeElement.querySelector('app-datos-certificado');
    expect(datosCertificadoElement).toBeTruthy();
  });

  it('should call continuar only if all forms valid', () => {
    tramiteQueryMock.getValue.mockReturnValue({
      formValidity: {
        certificadoOrigen: true,
        datosCertificado: true,
        destinatario: true,
        histProductores: true,
      },
    });
    const validarSpy = jest.spyOn(component, 'validarFormularios');
    component.continuar();
    expect(validarSpy).toHaveBeenCalled();
  });

  it('should fetch data and update the store when fetchGetDatosConsulta is called', async () => {
    component.fetchGetDatosConsulta();
    await firstValueFrom(validarInicialmenteCertificadoServiceMock.getDatosConsulta());
    expect(validarInicialmenteCertificadoServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(tramiteStoreMock.update).toHaveBeenCalled();
  });

  it('should destroy notifier on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});