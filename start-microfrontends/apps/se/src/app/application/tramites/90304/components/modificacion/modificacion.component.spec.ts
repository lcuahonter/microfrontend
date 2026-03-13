import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ModificacionComponent } from './modificacion.component';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProsecService } from '../../services/prosec/prosec.service';
import { ModificacionResquesta } from '../../models/prosec.model';
import { TABLA_EMPRESAS_LISTA } from '../../constantes/prosec.enum';

jest.mock('../../services/prosec/prosec.service');

describe('ModificacionComponent', () => {
  let component: ModificacionComponent;
  let mockProsecService: jest.Mocked<ProsecService>;
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockFormBuilder: FormBuilder;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    mockProsecService = new ProsecService(mockHttpClient) as jest.Mocked<ProsecService>;
    mockProsecService.obtenerModificacionDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));
    mockProsecService.obtenerEmpresasListaDatos = jest.fn().mockReturnValue(of({ code: 200, data: [], message: 'Success' }));

    mockFormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        TablaDinamicaComponent, 
        TituloComponent, 
        ProducirMercanciasComponent,
        ModificacionComponent
      ],
      providers: [
        { provide: ProsecService, useValue: mockProsecService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: FormBuilder, useValue: mockFormBuilder },
      ],
    });

    component = TestBed.createComponent(ModificacionComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize empty form and data lists', () => {
    expect(component.modificacionForm).toBeUndefined();
    expect(component.empresasLista).toEqual([]);
    expect(component.configuracionTabla).toEqual(TABLA_EMPRESAS_LISTA);
  });

  test('should initialize form in ngOnInit()', () => {
    const crearModificacionFormSpy = jest.spyOn(component, 'crearModificacionForm');
    component.ngOnInit();
    expect(crearModificacionFormSpy).toHaveBeenCalled();
  });

  test('should fetch and set modification data', () => {
    const mockModificacionRes: ModificacionResquesta = {
      code: 200,
      data: [{ registroFederalContribuyentes: 'RFC123', representacionFederal: 'RepFed', tipoModificacion: 'Tipo', modificacionPrograma: 'ModProg' }],
      message: 'Success',
    };
    mockProsecService.obtenerModificacionDatos.mockReturnValue(of(mockModificacionRes));

    component.crearModificacionForm();
    component.obtenerModificacionDatos();

    expect(component.modificacionForm.value).toEqual(mockModificacionRes.data[0]);
  });

  test('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});