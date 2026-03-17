import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosDeLaSolicitudPlasticaComponent } from './datos-de-la-solicitud-plastica.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Agregar270301Store } from '../../estados/tramites/agregar270301.store';
import { AgregarQuery } from '../../estados/queries/agregar.query';
import { of } from 'rxjs';
import { Solicitud270301State } from '../../estados/tramites/agregar270301.store';
import { FormBuilder } from '@angular/forms';

describe('DatosDeLaSolicitudPlasticaComponent', () => {
  let component: DatosDeLaSolicitudPlasticaComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudPlasticaComponent>;
  let solicitudServiceMock: Partial<SolicitudService>;
  let agregarQueryMock: Partial<AgregarQuery>;

  const mockSolicitudState: Solicitud270301State = {
    tipoDeOperacion: '',
    tipoDeMovimiento: '',
    motivo: '',
    pais: '',
    ciudad: '',
    medioTransporte: '',
    emprsaTransportista: '',
    destinofinal: '',
    periodoEstancia: '',
    aduanaEntrada: '',
    ObraDeArte: [], // <-- Added missing property
  };

  beforeEach(async () => {
    solicitudServiceMock = {
      getOperacionData: jest.fn().mockReturnValue(of([])),
      getMovimientoData: jest.fn().mockReturnValue(of([])),
      getPaisData: jest.fn().mockReturnValue(of([])),
      getTransporteData: jest.fn().mockReturnValue(of([])),
      getAduanaData: jest.fn().mockReturnValue(of([])),
      getMotivoData: jest.fn().mockReturnValue(of([])),
      getMonedaData: jest.fn().mockReturnValue(of([])),
      getArancelariaData: jest.fn().mockReturnValue(of([])),
      getObraDeArteTabla: jest.fn().mockReturnValue(of({ columns: [] })),
    };

    agregarQueryMock = {
      selectSolicitud$: of(mockSolicitudState),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLaSolicitudPlasticaComponent],
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Agregar270301Store, useValue: { setObraDeArte: jest.fn() } }, // <-- Add setObraDeArte mock
        { provide: AgregarQuery, useValue: agregarQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudPlasticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudFormGroup with default values', () => {
    expect(component.solicitudFormGroup).toBeDefined();
    expect(component.solicitudFormGroup.get('tipoDeOperacion')?.value).toBe('');
    expect(component.solicitudFormGroup.get('ciudad')?.value).toBe('');
  });

  it('should initialize obraDeArteFormgroup with default values', () => {
    expect(component.obraDeArteFormgroup).toBeDefined();
    expect(component.obraDeArteFormgroup.get('autor')?.value).toBe('');
    expect(component.obraDeArteFormgroup.get('titulo')?.value).toBe('');
  });

  it('should toggle showTableDiv and showObraDeArteModal', () => {
    expect(component.showTableDiv).toBe(true);
    expect(component.showObraDeArteModal).toBe(false);

    component.toggleObraDeArte();

    expect(component.showTableDiv).toBe(false);
    expect(component.showObraDeArteModal).toBe(true);
  });

  it('should call solicitudService methods on initialization', () => {
    expect(solicitudServiceMock.getOperacionData).toHaveBeenCalled();
    expect(solicitudServiceMock.getMovimientoData).toHaveBeenCalled();
    expect(solicitudServiceMock.getPaisData).toHaveBeenCalled();
    expect(solicitudServiceMock.getTransporteData).toHaveBeenCalled();
    expect(solicitudServiceMock.getAduanaData).toHaveBeenCalled();
    expect(solicitudServiceMock.getMotivoData).toHaveBeenCalled();
    expect(solicitudServiceMock.getMonedaData).toHaveBeenCalled();
    expect(solicitudServiceMock.getArancelariaData).toHaveBeenCalled();
    expect(solicitudServiceMock.getObraDeArteTabla).toHaveBeenCalled();
  });

  it('should add a new obra de arte row on submitDeArteForm', () => {
    component.obraDeArteFormgroup.setValue({
      autor: 'Autor Test',
      titulo: 'Titulo Test',
      tecnicaDeRealizacion: 'Tecnica Test',
      medidas: '1',
      alto: '100',
      ancho: '50',
      profundidad: '30',
      diametro: '20',
      variables: 'Variables Test',
      anoDeCreacion: '2023',
      avaluo: '1000',
      moneda: '1',
      propietario: 'Propietario Test',
      fraccionArancelaria: '1',
      descripcionArancelaria: 'Descripcion Test',
    });

    component.obraDeArteRowData = []; 

    component.submitDeArteForm();

    expect(component.obraDeArteRowData.length).toBe(1);
    expect(component.obraDeArteRowData[0].tbodyData).toContain('Autor Test');
    expect(component.obraDeArteRowData[0].tbodyData).toContain('Titulo Test');
  });

  it('should disable form in guardarDatosFormulario if readonly', () => {
    component.initializeSolicitudFormGroup();
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.solicitudFormGroup.disabled).toBe(true);
  });

  it('should enable form in guardarDatosFormulario if not readonly', () => {
    component.initializeSolicitudFormGroup();
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.solicitudFormGroup.enabled).toBe(true);
  });

  it('should call setValoresStore with correct arguments', () => {
    const mockSet = jest.fn();
    const mockStore: any = { setTest: mockSet };
    component.solicitudFormGroup = new FormBuilder().group({ test: ['value'] });
    component.Agregar270301Store = mockStore;
    component.setValoresStore(component.solicitudFormGroup, 'test', 'setTest' as any);
    expect(mockSet).toHaveBeenCalledWith('value');
  });

  it('should clean up on destroy', () => {
    const spy = jest.spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
