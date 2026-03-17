import { By } from '@angular/platform-browser';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
  TableComponent,
} from '@ng-mf/data-access-user';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MedioTransporteComponent } from './medio-transporte.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TituloComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [MedioTransporteComponent, ReactiveFormsModule, CommonModule],
  template: `<form [formGroup]="form">
    <app-medio-transporte
      [claveDeControl]="'testControl'"
      [hMercanciaTabla]="hMercanciaTabla"
      [dMercanciaBody]="dMercanciaBody"
      [mediodetransporte]="mediodetransporte"
    ></app-medio-transporte>
  </form>`,
})
class TestHostComponent {
  form: FormGroup;
  hMercanciaTabla: string[] = [
    'Fracción arancelaria',
    'Descripción de la fracción',
    'Nico',
    'Descripción Nico',
    'Cantidad solicitada en UMT',
    'Unidad de medida de tarifa (UMT)',
    'Cantidad total UMT',
    'Saldo pendiente',
  ];

  dMercanciaBody = [
    {
      tbodyData: [
        '1001.10.10',
        'Trigo duro',
        'Sí',
        'Trigo para molienda',
        50,
        'kg',
        500,
        100,
      ],
    },
  ];

  mediodetransporte: CatalogosSelect = {
    labelNombre: 'Medio de transporte',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [
      { id: 1, descripcion: 'transporte 1' },
      { id: 2, descripcion: 'transporte 2' },
      { id: 3, descripcion: 'transporte 3' },
    ],
  };

  constructor() {
    this.form = new FormGroup({});
  }
}

describe('MedioTransporteComponent', () => {
  let component: MedioTransporteComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        TestHostComponent,
        MedioTransporteComponent,
        TituloComponent,
        TableComponent,
        InputRadioComponent,
        CatalogoSelectComponent,
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ControlContainer,
          useValue: { control: new FormGroup({}) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.query(
      By.directive(MedioTransporteComponent)
    )?.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls on ngOnInit', () => {
    component.ngOnInit();
    expect(component.grupoFormularioPadre).toBeTruthy();

    const FORMGROUP = component.grupoFormularioPadre.get(
      component.claveDeControl
    ) as FormGroup;
    expect(FORMGROUP).toBeTruthy();
    expect(FORMGROUP.get('transporteIdMedio')).toBeTruthy();
    expect(FORMGROUP.get('identificacionTransporte')).toBeTruthy();
    expect(FORMGROUP.get('esSolicitudFerros')).toBeTruthy();
    expect(FORMGROUP.get('totalDeGuiasAmparadas')).toBeTruthy();
  });

  it('should remove control on ngOnDestroy', () => {
    component.ngOnInit();
    expect(
      component.grupoFormularioPadre.contains(component.claveDeControl)
    ).toBe(true);

    component.ngOnDestroy();
    expect(
      component.grupoFormularioPadre.contains(component.claveDeControl)
    ).toBe(false);
  });

  it('should handle catalog selection correctly', () => {
    component.ngOnInit();
    const CATALOGO = {
      id: 1,
      descripcion: 'transporte 1',
      tam: 'transporte 1',
      dpi: 'transporte 1',
    };
    component.seleccionMedioDeTransporte(CATALOGO);

    const FORMGROUP = component.grupoFormularioPadre.get(
      component.claveDeControl
    ) as FormGroup;
    expect(FORMGROUP.get('transporteIdMedio')?.value).toBe('transporte 1');
  });

  it('should render table headers correctly', () => {
    const COMPILED = fixture.nativeElement;
    const HEADERS = COMPILED.querySelectorAll('th');

    expect(HEADERS.length).toBe(8);
    expect(HEADERS[0].textContent.trim()).toBe('');
    expect(HEADERS[1].textContent.trim()).toBe('Fracción arancelaria');
    expect(HEADERS[2].textContent.trim()).toBe('Descripción de la fracción');
    expect(HEADERS[3].textContent.trim()).toBe('Nico');
    expect(HEADERS[4].textContent.trim()).toBe('Descripción Nico');
    expect(HEADERS[5].textContent.trim()).toBe(
      'Unidad de medida de tarifa (UMT)'
    );
    expect(HEADERS[6].textContent.trim()).toBe('Cantidad total UMT');
    expect(HEADERS[7].textContent.trim()).toBe('Saldo pendiente');
  });

  it('should update tableData on ngOnChanges', () => {
    const CHANGES: SimpleChanges = {
      hMercanciaTabla: {
        currentValue: ['Header1', 'Header2'],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
      dMercanciaBody: {
        currentValue: [
          {
            fraccionArancelaria: '1001.10.10',
            descripcionFraccion: 'Trigo duro',
          },
        ],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(CHANGES);

    expect(component.tableData.tableHeader).toEqual(['Header1', 'Header2']);
    expect(component.tableData.tableBody).toEqual([
      { fraccionArancelaria: '1001.10.10', descripcionFraccion: 'Trigo duro' },
    ]);
  });

  it('should call setTransporteIdMedio on store when setTransporteIdMedio is called', () => {
    component.solicitud220501Store = {
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn(),
      setEsSolicitudFerros: jest.fn(),
    } as any;

    const catalogo = { id: 123, descripcion: 'desc' };
    component.setTransporteIdMedio(catalogo as any);
    expect(
      component.solicitud220501Store.setTransporteIdMedio
    ).toHaveBeenCalledWith(123);
  });

  it('should call setIdentificacionTransporte on store with input value', () => {
    component.solicitud220501Store = {
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn(),
      setEsSolicitudFerros: jest.fn(),
    } as any;

    const mockEvent = {
      target: { value: 'ABC123' },
    } as unknown as Event;

    component.setIdentificacionTransporte(mockEvent);
    expect(
      component.solicitud220501Store.setIdentificacionTransporte
    ).toHaveBeenCalledWith('ABC123');
  });

  it('should call setTotalDeGuiasAmparadas on store with input value', () => {
    component.solicitud220501Store = {
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn(),
      setEsSolicitudFerros: jest.fn(),
    } as any;

    const mockEvent = {
      target: { value: '999' },
    } as unknown as Event;

    component.setTotalDeGuiasAmparadas(mockEvent);
    expect(
      component.solicitud220501Store.setTotalDeGuiasAmparadas
    ).toHaveBeenCalledWith('999');
  });

  it('should call setEsSolicitudFerros on store when enCambioDeValor is called', () => {
    component.solicitud220501Store = {
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn(),
      setEsSolicitudFerros: jest.fn(),
    } as any;

    component.enCambioDeValor('SÍ');
    expect(
      component.solicitud220501Store.setEsSolicitudFerros
    ).toHaveBeenCalledWith('SÍ');
  });

  it('should not update tableData if changes are empty', () => {
    const CHANGES: SimpleChanges = {};

    component.ngOnChanges(CHANGES);

    expect(component.tableData.tableHeader).toEqual([
      'Fracción arancelaria',
      'Descripción de la fracción',
      'Nico',
      'Descripción Nico',
      'Cantidad solicitada en UMT',
      'Unidad de medida de tarifa (UMT)',
      'Cantidad total UMT',
      'Saldo pendiente',
    ]);
    expect(component.tableData.tableBody).toEqual([
      {
        tbodyData: [
          '1001.10.10',
          'Trigo duro',
          'Sí',
          'Trigo para molienda',
          50,
          'kg',
          500,
          100,
        ],
      },
    ]);
  });
  it('should assign selected mercancias to mercanciaSeleccionLista when obtenerMercanciaLista is called', () => {
    const mercancias = [
      { id: 1, nombre: 'Producto A' },
      { id: 2, nombre: 'Producto B' },
    ];
    component.obtenerMercanciaLista(mercancias as any);
    expect(component.mercanciaSeleccionLista).toEqual(mercancias);
  });

  it('should call abrirModal and push pedimento if no mercanciaSeleccionLista but mercanciaLista has items', () => {
    component.mercanciaSeleccionLista = [];
    component.mercanciaLista = [{ id: 1 } as any];
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.pedimentos = [];
    component.modificarSaldosMercancia();
    expect(abrirModalSpy).toHaveBeenCalledWith('Seleccione una mercancía');
    expect(component.pedimentos.length).toBe(1);
    expect(component.pedimentos[0].descTipoPedimento).toBe('Por evaluar');
  });

  it('should update mercancia in mercanciaLista and reset selection in actualizarMercanciaEnTabla', () => {
    const hideMock = jest.fn();
    component.MODAL_INSTANCE = { hide: hideMock } as any;
    component.mercanciaLista = [
      { id: 1, nombre: 'A', cantidad: 10 } as any,
      { id: 2, nombre: 'B', cantidad: 20 } as any,
    ];
    component.inputMercanciaSelection = 5;
    component.mercanciaSeleccionLista = [{ id: 1 } as any];
    const updated = { id: 1, nombre: 'A', cantidad: 99 };
    component.actualizarMercanciaEnTabla(updated as any);
    expect(component.inputMercanciaSelection).toBe(-1);
    expect(component.mercanciaSeleccionLista).toEqual([]);
    expect(hideMock).toHaveBeenCalled();
  });

  it('should not update mercanciaLista if evento is undefined in actualizarMercanciaEnTabla', () => {
    const hideMock = jest.fn();
    component.MODAL_INSTANCE = { hide: hideMock } as any;
    component.mercanciaLista = [{ id: 1, nombre: 'A' } as any];
    component.inputMercanciaSelection = 2;
    component.mercanciaSeleccionLista = [{ id: 1 } as any];
    component.actualizarMercanciaEnTabla(undefined);
    expect(component.mercanciaLista).toEqual([{ id: 1, nombre: 'A' }]);
    expect(component.inputMercanciaSelection).toBe(-1);
    expect(component.mercanciaSeleccionLista).toEqual([]);
    expect(hideMock).toHaveBeenCalled();
  });

  it('should set nuevaNotificacion and elementoParaEliminar when abrirModal is called', () => {
    component.abrirModal('Mensaje de prueba', 3);
    expect(component.nuevaNotificacion).toMatchObject({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      mensaje: 'Mensaje de prueba',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
    expect(component.elementoParaEliminar).toBe(3);
  });

  it('should remove pedimento at elementoParaEliminar when eliminarPedimento(true) is called', () => {
    component.pedimentos = [
      { patente: 1 } as any,
      { patente: 2 } as any,
      { patente: 3 } as any,
    ];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos).toEqual([{ patente: 1 }, { patente: 3 }]);
  });

  it('should not remove pedimento if eliminarPedimento(false) is called', () => {
    component.pedimentos = [{ patente: 1 } as any, { patente: 2 } as any];
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(2);
  });
});
