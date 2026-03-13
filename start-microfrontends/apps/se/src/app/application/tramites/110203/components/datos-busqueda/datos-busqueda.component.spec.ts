
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosBusquedaComponent } from './datos-busqueda.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Solocitud110203Service } from '../../service/service110203.service';
import { ConsultaioQuery, CatalogoServices } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import datosBusquedaDropdown from '@libs/shared/theme/assets/json/110203/datos-busqueda.json';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosBusquedaComponent', () => {
  let componente: DatosBusquedaComponent;
  let fixture: ComponentFixture<DatosBusquedaComponent>;
  let tramite110203StoreMock: Partial<Tramite110203Store>;
  let routerMock: Partial<Router>;

  const mockSolicitudState = {
    numeroDeCertificado: '12345',
    tratadoAcuerdo: '',
    paisBloque: '',
    valorSeleccionado: 'Por número de certificado',
    tratado: '', bloque: '', origen: '', destino: '', expedicion: '', vencimiento: '',
    nombre: '', primer: '', segundo: '', fiscal: '', razon: '', calle: '', letra: '',
    ciudad: '', correo: '', fax: '', telefono: '', medio: '', observaciones: '',
    precisa: '', presenta: '', medida: '', comercializacion: '', tipo: '',
    idSolicitud: null, complemento: '', marca: '', valor: '', bruta: '', factura: '',
    orden: '', arancelaria: '', tecnico: '', comercial: '', ingles: '', registro: '',
    cantidad: '', fechaFactura: '', pasoActivo: 1, formValidity: {}
  };

  beforeEach(async (): Promise<void> => {
    const tramite110203QueryMock = {
      valorSeleccionado$: of('Por número de certificado'),
      selectSolicitud$: of(mockSolicitudState),
    };

    tramite110203StoreMock = {
      setValorSeleccionado: jest.fn(),
      setNumeroDeCertificado: jest.fn(),
      setTratadoAcuerdo: jest.fn(),
      setPaisBloque: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    };

    const solocitud110203ServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of(mockSolicitudState)),
      actualizarEstadoFormulario: jest.fn(),
      buscarCertificado: jest.fn(() => of({ datos: [] }))
    };

    const consultaioQueryMock = {
      selectConsultaioState$: of({ update: false })
    };

    const catalogoServiceMock = {
      tratadosAcuerdosCatalogoDatosNew: jest.fn(() => of({ datos: [] })),
      getPaisesPorTratado: jest.fn(() => of({ datos: [] })),
      getTratadosAcuerdosPorPais: jest.fn(() => of({ datos: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [DatosBusquedaComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Tramite110203Query, useValue: tramite110203QueryMock },
        { provide: Tramite110203Store, useValue: tramite110203StoreMock },
        { provide: Router, useValue: routerMock },
        { provide: Solocitud110203Service, useValue: solocitud110203ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: CatalogoServices, useValue: catalogoServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map() },
            params: of({ id: '123' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(DatosBusquedaComponent);
    componente = fixture.componentInstance;
    
    componente.configuracionesDropdown = [
      { catalogos: datosBusquedaDropdown?.tratado || [] },
      { catalogos: datosBusquedaDropdown?.pais || [] }
    ];
    
    fixture.detectChanges();
  });

  it('debería crear el componente', (): void => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario con valores del store', (): void => {
    expect(componente.datosBusquedaFormulario.value).toEqual({
      numeroDeCertificado: '12345',
      tratadoAcuerdo: '',
      paisBloque: '',
    });
  });

  it('debería actualizar el valor seleccionado cuando se cambia el botón de radio', (): void => {
    componente.enCambioValorRadio('Por Tratado/Acuerdo País/Bloque');
    
    expect(componente.valorSeleccionado).toBe('Por Tratado/Acuerdo País/Bloque');
    expect(tramite110203StoreMock.setValorSeleccionado).toHaveBeenCalledWith('Por Tratado/Acuerdo País/Bloque');
  });

  it('debería establecer verTabla en true cuando buscar() es válido', (): void => {
    componente.datosBusquedaFormulario.patchValue({ numeroDeCertificado: '12345' });
    componente.valorSeleccionado = 'Por número de certificado';
    
    componente.buscar();
    
    expect(componente.verTabla).toBe(true);
  });

  it('should navigate when row is selected', (): void => {
    componente.filaSeleccionada = true;
    
    componente.navigateToSeleccionTramite();
    
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['../tecnicosdatos'],
      expect.objectContaining({ relativeTo: expect.any(Object) })
    );
  });
});