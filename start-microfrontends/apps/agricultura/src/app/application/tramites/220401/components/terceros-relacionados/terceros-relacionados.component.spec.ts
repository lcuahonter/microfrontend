jest.mock(
  'libs/shared/theme/assets/json/220401/establecimiento-table.json',
  () => ({
    __esModule: true,
    default: {
      tableHeader: ['Column A', 'Column B'],
      tableBody: [{ tbodyData: ['Data A1', 'Data B1'] }]
    }
  })
);

jest.mock(
  'libs/shared/theme/assets/json/220401/destinatario-table.json',
  () => ({
    __esModule: true,
    default: {
      tableHeader: ['Column X', 'Column Y'],
      tableBody: []
    }
  })
);

jest.mock(
  'libs/shared/theme/assets/json/220401/importador-table.json',
  () => ({
    __esModule: true,
    default: {
      tableHeader: ['Column M', 'Column N'],
      tableBody: []
    }
  })
);


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';


describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;
  let destroyNotifier$: Subject<void>;

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: true })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosComponent],
      providers: [{ provide: ConsultaioQuery, useValue: mockConsultaioQuery }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    destroyNotifier$ = (component as any).destroyNotifier$;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize readonly state from query', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should call getEstablecimiento and populate data', () => {
    component.getEstablecimiento();
    expect(component.establecimientoHeaderData.length).toBeGreaterThan(0);
    expect(component.establecimientoBodyData.length).toBeGreaterThan(0);
  });

  it('should call getDestinatario and populate data', () => {
    component.getDestinatario();
    expect(component.destinatarioHeaderData.length).toBeGreaterThan(0);
    expect(component.destinatarioBodyData.length).toBe(0); 
  });

  it('should call getImportador and populate data', () => {
    component.getImportador();
    expect(component.importadorHeaderData.length).toBeGreaterThan(0);
    expect(component.importadorBodyData.length).toBe(0); 
  });

it('should toggle showTableDiv and showAgregarDestinatario when toggleAgregarDestinatario is called', () => {
  component.showTableDiv = true;
  component.showAgregarDestinatario = false;
  component.toggleAgregarDestinatario();
  expect(component.showTableDiv).toBe(false);
  expect(component.showAgregarDestinatario).toBe(true);

  component.toggleAgregarDestinatario();
  expect(component.showTableDiv).toBe(true);
  expect(component.showAgregarDestinatario).toBe(false);
});


it('should toggle showTableDiv and showAgregarImportador when toggleAgregarImportador is called', () => {
  component.showTableDiv = true;
  component.showAgregarImportador = false;
  component.toggleAgregarImportador();
  expect(component.showTableDiv).toBe(false);
  expect(component.showAgregarImportador).toBe(true);

  component.toggleAgregarImportador();
  expect(component.showTableDiv).toBe(true);
  expect(component.showAgregarImportador).toBe(false);
});

it('should set showAgregarDestinatario to false and showTableDiv to true when cerrarAgregarDestinatario is called', () => {
  component.showAgregarDestinatario = true;
  component.showTableDiv = false;
  component.cerrarAgregarDestinatario();
  expect(component.showAgregarDestinatario).toBe(false);
  expect(component.showTableDiv).toBe(true);
});

it('should set showAgregarImportador to false and showTableDiv to true when cerrarAgregarImportador is called', () => {
  component.showAgregarImportador = true;
  component.showTableDiv = false;
  component.cerrarAgregarImportador();
  expect(component.showAgregarImportador).toBe(false);
  expect(component.showTableDiv).toBe(true);
});

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
