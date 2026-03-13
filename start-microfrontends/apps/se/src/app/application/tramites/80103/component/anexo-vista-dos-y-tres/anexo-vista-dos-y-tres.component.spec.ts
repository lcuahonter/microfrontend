import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexoVistaDosYTresComponent } from './anexo-vista-dos-y-tres.component';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { AnexoDosYTresComponent } from '../../../../shared/components/anexo-dos-y-tres.component/anexo-dos-y-tres.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AnexoEncabezado } from '../../../../shared/models/nuevo-programa-industrial.model';
import { of } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { ANEXO_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';

describe('AnexoVistaDosYTresComponent', () => {
  let component: AnexoVistaDosYTresComponent;
  let fixture: ComponentFixture<AnexoVistaDosYTresComponent>;

const MOCK_ANEXO_DOS: AnexoEncabezado[] = [
  {
    encabezadoFraccion: '0101.21.01',
    encabezadoDescripcion: 'Caballos pura sangre',
    estatus: true,
  },
];

const MOCK_ANEXO_TRES: AnexoEncabezado[] = [
  {
    encabezadoFraccion: '0202.30.00',
    encabezadoDescripcion: 'Carne congelada de bovino',
    estatus: false,
  },
];

  const mockQuery = {
    anexoDosTableLista$: of(MOCK_ANEXO_DOS),
    anexoTresTablaLista$: of(MOCK_ANEXO_TRES),
  };

  const mockStore = {
    setAnnexoDosTableLista: jest.fn(),
    setAnnexoTresTableLista: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AnexoDosYTresComponent, AnexoVistaDosYTresComponent],
      providers: [
        { provide: Tramite80101Query, useValue: mockQuery },
        { provide: Tramite80101Store, useValue: mockStore },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AnexoVistaDosYTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize anexoDosTablaLista from observable if data exists', () => {
    expect(component.anexoDosTablaLista).toEqual(MOCK_ANEXO_DOS);
  });

  it('should initialize anexoTresTablaLista from observable if data exists', () => {
    expect(component.anexoTresTablaLista).toEqual(MOCK_ANEXO_TRES);
  });

it('should call setAnnexoDosTableLista and update local state', () => {
  const mockEvent: AnexoEncabezado[] = [
    {
      encabezadoFraccion: '0101.21.01',
      encabezadoDescripcion: 'Caballos pura sangre',
      estatus: true,
    },
  ];
  component.obtenerAnexoDosDevolverLaLlamada(mockEvent);
  expect(component.anexoDosTablaLista).toEqual(mockEvent);
  expect(mockStore.setAnnexoDosTableLista).toHaveBeenCalledWith(mockEvent);
});

it('should call setAnnexoTresTableLista and update local state', () => {
  const mockEvent: AnexoEncabezado[] = [
    {
      encabezadoFraccion: '0202.30.00',
      encabezadoDescripcion: 'Carne congelada de bovino',
      estatus: false,
    },
  ];
  component.obtenerAnexoTresDevolverLaLlamada(mockEvent);
  expect(component.anexoTresTablaLista).toEqual(mockEvent);
  expect(mockStore.setAnnexoTresTableLista).toHaveBeenCalledWith(mockEvent);
});

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should define anexoConfig with correct table headers and selection', () => {
    expect(component.anexoConfig).toEqual({
      anexoDosTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
      anexoDosEncabezadoDeTabla: ANEXO_SERVICIO,
      anexoTresTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
      anexoTresEncabezadoDeTabla: ANEXO_SERVICIO,
    });
  });
});
