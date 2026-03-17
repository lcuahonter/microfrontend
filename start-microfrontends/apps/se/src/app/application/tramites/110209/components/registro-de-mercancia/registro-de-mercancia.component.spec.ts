import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroDeMercanciaComponent } from './registro-de-mercancia.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { MercanciasService } from '../../services/mercancias/mercancias.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const NOMBRE_COMERCIAL = 'nombreComercial';
const NOMBRE_INGLES = 'nombreIngles';
const DESCRIPCION = 'descripcion';
const MARCA = 'marca';
const VALOR_MERCANCIA = 'valorMercancia';
const UNIDAD_MEDIDA = 'unidadMedida';
const NUMERO_FACTURA = 'numeroFactura';
const TIPO_FACTURA = 'tipoFactura';

describe('RegistroDeMercanciaComponent', () => {
  let component: RegistroDeMercanciaComponent;
  let fixture: ComponentFixture<RegistroDeMercanciaComponent>;
  let serviceMock: any;
  let queryMock: any;
  let storeMock: any;
  let routerMock: any;

  beforeEach(async () => {
    serviceMock = {
      getTipoDeFactura: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Factura A' }])),
      getUnidad: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Unidad A' }])),
    };

    queryMock = {
      selectTramite110209$: of({
        mercanciasSeleccionadas: {
          [NOMBRE_COMERCIAL]: 'Comercial X',
          [NOMBRE_INGLES]: 'Ingles X'
        },
        [DESCRIPCION]: 'Desc X',
        [MARCA]: 'Marca X',
        [VALOR_MERCANCIA]: '1000',
        [UNIDAD_MEDIDA]: 'Unidad X',
        [NUMERO_FACTURA]: 'F123',
        [TIPO_FACTURA]: 'Factura A'
      })
    };

    storeMock = {
      setTramite110209: jest.fn()
    };

    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistroDeMercanciaComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: MercanciasService, useValue: serviceMock },
        { provide: Tramite110209Query, useValue: queryMock },
        { provide: Tramite110209Store, useValue: storeMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroDeMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.mercanciaFrom).toBeDefined();
    expect(component.mercanciaFrom.get(NOMBRE_COMERCIAL)).toBeDefined();
    expect(component.mercanciaFrom.get(NOMBRE_INGLES)).toBeDefined();
  });

  it('debe obtener y asignar valores de mercancía en getMercanciasValor', () => {
    component.getMercanciasValor();
    expect(component.mercanciaFrom.get(NOMBRE_COMERCIAL)?.value).toBe('Comercial X');
    expect(component.mercanciaFrom.get(NOMBRE_INGLES)?.value).toBe('Ingles X');
    expect(component.mercanciaFrom.get(DESCRIPCION)?.value).toBe('Desc X');
    expect(component.mercanciaFrom.get(MARCA)?.value).toBe('Marca X');
    expect(component.mercanciaFrom.get(VALOR_MERCANCIA)?.value).toBe('1000');
    expect(component.mercanciaFrom.get(UNIDAD_MEDIDA)?.value).toBe('Unidad X');
    expect(component.mercanciaFrom.get(NUMERO_FACTURA)?.value).toBe('F123');
    expect(component.mercanciaFrom.get(TIPO_FACTURA)?.value).toBe('Factura A');
  });

  it('debe actualizar el store al llamar setValoresStore', () => {
    component.mercanciaFrom.get(MARCA)?.setValue('Nueva Marca');
    component.setValoresStore(component.mercanciaFrom, MARCA);
    expect(storeMock.setTramite110209).toHaveBeenCalledWith({ [MARCA]: 'Nueva Marca' });
  });


  it('debe limpiar las suscripciones al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});