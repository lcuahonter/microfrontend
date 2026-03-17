import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DomicilloDelDestinatarioComponent } from './domicillo-del-destinatario.component';
import { ValidarInicalmenteService } from '../../services/validar-inicalmente/validar-inicalmente.service';
import { Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';

describe('DomicilloDelDestinatarioComponent', () => {
  let component: DomicilloDelDestinatarioComponent;
  let fixture: ComponentFixture<DomicilloDelDestinatarioComponent>;
  let service: ValidarInicalmenteService;
  let store: Tramite110208Store;
  let query: Tramite110208Query;

  const mockSolicitudState = {
    ciudad: 'Ciudad Test',
    calle: 'Calle Test',
    numeroLetra: '123',
    lada: '55',
    telefono: '1234567890',
    fax: '123456789',
    correoElectronico: 'test@example.com',
    paisDestino: 'México',
  };

  const mockEstadoList = [
    { id: 1, descripcion: 'Estado 1' },
    { id: 2, descripcion: 'Estado 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilloDelDestinatarioComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: ValidarInicalmenteService,
          useValue: {
            obtenerEstadoList: jest.fn().mockReturnValue(of({ data: mockEstadoList })),
          },
        },
        {
          provide: Tramite110208Store,
          useValue: {
            setCiudad: jest.fn(),
            setCalle: jest.fn(),
            setNumeroLetra: jest.fn(),
            setLada: jest.fn(),
            setTelefono: jest.fn(),
            setFax: jest.fn(),
            setCorreoElectronico: jest.fn(),
            setPaisDestino: jest.fn(),
          },
        },
        {
          provide: Tramite110208Query,
          useValue: {
            selectSolicitud$: of(mockSolicitudState),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomicilloDelDestinatarioComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ValidarInicalmenteService);
    store = TestBed.inject(Tramite110208Store);
    query = TestBed.inject(Tramite110208Query);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario al crear el componente', () => {
    expect(component.domicilioDestinatario).toBeDefined();
    expect(component.domicilioDestinatario.get('ciudad')?.value).toBe(mockSolicitudState.ciudad);
    expect(component.domicilioDestinatario.get('calle')?.value).toBe(mockSolicitudState.calle);
    expect(component.domicilioDestinatario.get('numeroLetra')?.value).toBe(mockSolicitudState.numeroLetra);
    expect(component.domicilioDestinatario.get('correoElectronico')?.value).toBe(mockSolicitudState.correoElectronico);
  });

  it('debe llamar a obtenerEstadoList y establecer la lista de estados', () => {
    component.obtenerEstadoList();
    expect(service.obtenerEstadoList).toHaveBeenCalled();
    expect(component.estado).toEqual(mockEstadoList);
  });

  it('debe llamar a setValoresStore y actualizar el store', () => {
    const spy = jest.spyOn(store, 'setCiudad');
    component.setValoresStore(component.domicilioDestinatario, 'ciudad', 'setCiudad');
    expect(spy).toHaveBeenCalledWith(mockSolicitudState.ciudad);
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});