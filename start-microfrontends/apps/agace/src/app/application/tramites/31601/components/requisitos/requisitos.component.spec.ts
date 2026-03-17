import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { RequisitosComponent } from './requisitos.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

const mockTipos = [
  { tiposData: 'Tipo Document 1' },
  { tiposData: 'Tipo Document 2' }
];

const mockTipoCatalogResponse = {
  data: [
    { id: 1, descripcion: 'Catalogo 1', tam: 'A4', dpi: '300' }
  ]
};

const mockSolicitudState = {
  tipoDocumento: 'Tipo Document 1'
};

class MockServiciosPantallaService {
  getTiposCatalog() {
    return of(mockTipos);
  }
  getTipoCatalog() {
    return of(mockTipoCatalogResponse);
  }
}

class MockTramite31601Store {
  setTipoDocumento = jest.fn();
}

class MockTramite31601Query {
  selectSolicitud$ = of(mockSolicitudState);
}

describe('RequisitosComponent', () => {
  let component: RequisitosComponent;
  let fixture: ComponentFixture<RequisitosComponent>;
  let store: MockTramite31601Store;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    consultaioQueryMock = { selectConsultaioState$: of({ readonly: false }) };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RequisitosComponent,
        TituloComponent,
        TableComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        { provide: ServiciosPantallaService, useClass: MockServiciosPantallaService },
        { provide: Tramite31601Store, useClass: MockTramite31601Store },
        { provide: Tramite31601Query, useClass: MockTramite31601Query },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        FormBuilder
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequisitosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite31601Store) as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con el valor correcto del store', () => {
    expect(component.requisitos).toBeDefined();
    expect(component.requisitos.get('tipoDocumento')?.value).toBe('Tipo Document 1');
  });

  it('debe deshabilitar los controles del formulario si esFormularioSoloLectura es true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.requisitos.get('tipoDocumento')?.disabled).toBe(true);
  });

  it('debe habilitar los controles del formulario si esFormularioSoloLectura es false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.requisitos.get('tipoDocumento')?.enabled).toBe(true);
  });

  it('debe cargar los tipos y establecer los valores correctos', () => {
    component.loadTipos();
    expect(component.tipos).toEqual(mockTipos);
    expect(component.tipocatlog).toEqual(mockTipoCatalogResponse.data);
    expect(component.tipoHeaderData).toEqual(component.tipoTableData.tableHeader);
  });

  it('debe alternar showContent', () => {
    expect(component.showContent).toBe(false);
    component.toggleContent();
    expect(component.showContent).toBe(true);
    component.toggleContent();
    expect(component.showContent).toBe(false);
  });

  it('debe llamar a setValoresStore y actualizar el store', () => {
    component.requisitos.get('tipoDocumento')?.setValue('Tipo Document 2');
    component.setValoresStore(component.requisitos, 'tipoDocumento', 'setTipoDocumento');
    expect(store.setTipoDocumento).toHaveBeenCalledWith('Tipo Document 2');
  });

  it('debe desuscribirse y completar destroyNotifier$ en ngOnDestroy', () => {
    const destroySpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    const unsubSpy = jest.spyOn((component as any).tiposCatalogSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(unsubSpy).toHaveBeenCalled();
  });
});