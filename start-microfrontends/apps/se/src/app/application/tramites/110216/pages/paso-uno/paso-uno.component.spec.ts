import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { DestinatarioComponent } from '../../components/destinatario/destinatario.component';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { HistProductoresComponent } from '../../components/hist-productores/hist-productores.component';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let certificadosOrigenServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    certificadosOrigenServiceMock = {
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
            grupoDeTransporte: { transporte: 'Transporte Test' },
            tercerOperador: { operador: 'Operador Test' },
            grupoOperador: { operadorGrupo: 'Operador Grupo Test' },
            grupoTratado: { tratado: 'Tratado Test' },
            grupoDeDomicilio: { domicilio: 'Domicilio Test' },
            mercanciaSeleccionadasTablaDatos: [{ id: 1, descripcion: 'Mercancia Seleccionada' }],
            mercanciaDisponsiblesTablaDatos: [{ id: 2, descripcion: 'Mercancia Disponible' }],
            datosConfidencialesProductor: { confidencial: true },
            productorMismoExportador: true,
            productoresExportador: [{ id: 3, nombre: 'Productor Exportador' }],
          },
        })
      ),
      obtenerIdioma: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Español' }] })),
      obtenerEntidadFederativa: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Entidad 1' }] })),
      obtenerRepresentacionFederal: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Representación 1' }] }))
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        observaciones: 'Observaciones de prueba',
        idioma: 1,
        entidadFederativa: 1,
        representacionFederal: 1
      }),
      formulario$: of({}),
      getValue: jest.fn().mockReturnValue({
        formValidity: {
          certificadoOrigen: false,
          datosCertificado: false,
          destinatario: false,
          histProductores: false
        }
      })
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
      setGrupoDeTransporte: jest.fn(),
      setTercerOperador: jest.fn(),
      setGrupoOperador: jest.fn(),
      setGrupoTratado: jest.fn(),
      setGrupoDeDomicilio: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
      setMercanciaDisponsiblesTablaDatos: jest.fn(),
      setDatosConfidencialesProductor: jest.fn(),
      setProductorMismoExportador: jest.fn(),
      setProductoresExportador: jest.fn(),
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
      { provide: CertificadosOrigenService, useValue: certificadosOrigenServiceMock },
      { provide: Tramite110216Store, useValue: tramiteStoreMock },
      { provide: Tramite110216Query, useValue: tramiteQueryMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
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

  it('should render the DestinatarioComponent when indice is 4', () => {
    component.indice = 4;
    fixture.detectChanges();
    const destinatarioElement = fixture.debugElement.nativeElement.querySelector('app-destinatario');
    expect(destinatarioElement).toBeTruthy();
  });

  it('should fetch data and update the store when fetchGetDatosConsulta is called', () => {
    component.fetchGetDatosConsulta();

    expect(certificadosOrigenServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(tramiteStoreMock.setObservaciones).toHaveBeenCalledWith('Test Observaciones');
    expect(tramiteStoreMock.setIdioma).toHaveBeenCalledWith('Español');
    expect(tramiteStoreMock.setEntidadFederativa).toHaveBeenCalledWith('Entidad Test');
    expect(tramiteStoreMock.setRepresentacionFederal).toHaveBeenCalledWith('Representación Test');
    expect(tramiteStoreMock.setGrupoReceptor).toHaveBeenCalledWith({ nombre: 'Receptor Test' });
    expect(tramiteStoreMock.setGrupoDeDirecciones).toHaveBeenCalledWith({ direccion: 'Dirección Test' });
    expect(tramiteStoreMock.setGrupoRepresentativo).toHaveBeenCalledWith({ representante: 'Representante Test' });
    expect(tramiteStoreMock.setGrupoDeTransporte).toHaveBeenCalledWith({ transporte: 'Transporte Test' });
    expect(tramiteStoreMock.setTercerOperador).toHaveBeenCalledWith({ operador: 'Operador Test' });
    expect(tramiteStoreMock.setGrupoOperador).toHaveBeenCalledWith({ operadorGrupo: 'Operador Grupo Test' });
    expect(tramiteStoreMock.setGrupoTratado).toHaveBeenCalledWith({ tratado: 'Tratado Test' });
    expect(tramiteStoreMock.setGrupoDeDomicilio).toHaveBeenCalledWith({ domicilio: 'Domicilio Test' });
    expect(tramiteStoreMock.setMercanciaTablaDatos).toHaveBeenCalledWith([{ id: 1, descripcion: 'Mercancia Seleccionada' }]);
    expect(tramiteStoreMock.setMercanciaDisponsiblesTablaDatos).toHaveBeenCalledWith([{ id: 2, descripcion: 'Mercancia Disponible' }]);
    expect(tramiteStoreMock.setDatosConfidencialesProductor).toHaveBeenCalledWith({ confidencial: true });
    expect(tramiteStoreMock.setProductorMismoExportador).toHaveBeenCalledWith(true);
    expect(tramiteStoreMock.setProductoresExportador).toHaveBeenCalledWith([{ id: 3, nombre: 'Productor Exportador' }]);
    expect(component.esDatosRespuesta).toBe(true);
  });

    it('validarFormularios should call validarFormulario on all child components and return false when invalid', () => {
      component.certificadoOrigenComponent = { validarFormulario: jest.fn() } as any;
      component.datosCertificadoComponent = { validarFormulario: jest.fn() } as any;
      component.destinatarioComponent = { validarFormulario: jest.fn() } as any;
      component.histProductoresComponent = { validarFormulario: jest.fn() } as any;

      const result = component.validarFormularios();
      expect(component.certificadoOrigenComponent.validarFormulario).toHaveBeenCalled();
      expect(component.datosCertificadoComponent.validarFormulario).toHaveBeenCalled();
      expect(component.destinatarioComponent.validarFormulario).toHaveBeenCalled();
      expect(component.histProductoresComponent.validarFormulario).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('ngOnDestroy should complete the destroyNotifier$', () => {
      const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
      const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });

});