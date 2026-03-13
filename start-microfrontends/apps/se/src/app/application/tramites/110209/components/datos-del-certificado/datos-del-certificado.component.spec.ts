import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { DatosDelCertificadoComponent } from './datos-del-certificado.component';
import { TituloComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { MercanciasService } from '../../services/mercancias/mercancias.service';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDelCertificadoComponent', () => {
  let component: DatosDelCertificadoComponent;
  let fixture: ComponentFixture<DatosDelCertificadoComponent>;
  let service: MercanciasService;
  let store: Tramite110209Store;
  let query: Tramite110209Query;
  let consultaQuery: ConsultaioQuery;
  let router: Router;

  beforeEach(async () => {
    const SERVICE_MOCK = {
      getMercancias: jest.fn().mockReturnValue(of([
        { id: 1, fraccionArancelaria: 'Mercancia 1', nombreComercial: 'Comercial 1' },
        { id: 2, fraccionArancelaria: 'Mercancia 2', nombreComercial: 'Comercial 2' }
      ])),
      getTipoDeFactura: jest.fn().mockReturnValue(of([])),
      getUnidad: jest.fn().mockReturnValue(of([]))
    };

    const STORE_MOCK = {
      setTramite110209: jest.fn()
    };

    const QUERY_MOCK = {
      selectTramite110209$: of({
        observaciones: 'Observación inicial',
        mercanciasSeleccionadas: {
          numeroDeOrden: '001',
          fraccionArancelaria: '1234.56.78',
          nombreTecnico: 'Técnico test',
          nombreComercial: 'Comercial test',
          nombreIngles: 'English test',
          numeroDeRegistro: 'REG001'
        }
      })
    };

    const CONSULTA_QUERY_MOCK = {
      selectConsultaioState$: of({
        readonly: false,
        update: false
      })
    };

    const ROUTER_MOCK = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DatosDelCertificadoComponent,
        ReactiveFormsModule,
        TituloComponent,
        TablaDinamicaComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: MercanciasService, useValue: SERVICE_MOCK },
        { provide: Tramite110209Store, useValue: STORE_MOCK },
        { provide: Tramite110209Query, useValue: QUERY_MOCK },
        { provide: ConsultaioQuery, useValue: CONSULTA_QUERY_MOCK },
        { provide: Router, useValue: ROUTER_MOCK }
      ]
    }).compileComponents();

    service = TestBed.inject(MercanciasService);
    store = TestBed.inject(Tramite110209Store);
    query = TestBed.inject(Tramite110209Query);
    consultaQuery = TestBed.inject(ConsultaioQuery);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDelCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores del store', () => {
    expect(component.datosDelCertificadoForm).toBeDefined();
    expect(component.datosDelCertificadoForm.get('observaciones')?.value).toBe('Observación inicial');
  });

  it('debe obtener mercancías del store al inicializar', () => {
    component.ngOnInit();
    expect(component.datosTabla.length).toBe(1);
    expect(component.datosTabla[0].fraccionArancelaria).toBe('1234.56.78');
    expect(component.datosTabla[0].nombreComercial).toBe('Comercial test');
  });

  it('debe obtener y asignar valores del store al formulario al inicializar', () => {
    component.ngOnInit();
    expect(component.datosDelCertificadoForm.get('observaciones')?.value).toBe('Observación inicial');
  });

  it('debe actualizar el store cuando cambian los valores del formulario', () => {
    component.datosDelCertificadoForm.get('observaciones')?.setValue('Nueva observación');
    component.setValoresStore(component.datosDelCertificadoForm, 'observaciones');
    expect(store.setTramite110209).toHaveBeenCalledWith({ observaciones: 'Nueva observación' });
  });

  it('debe establecer esFormularioSoloLectura según el estado de consulta', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('debe completar el subject destroyed$ al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });

  it('debe asignar la mercancía seleccionada al llamar getMercanciasSeleccionadas', () => {
    const MERCANCIA = {
      id: 1,
      nombre: 'Mercancia 1',
      numeroDeOrden: '1',
      fraccionArancelaria: '1234.56.78',
      nombreTecnico: 'Tecnico 1',
      nombreComercial: 'Comercial 1',
      cantidad: 10,
      unidad: 'kg',
      nombreIngles: 'Merchandise 1',
      numeroDeRegistro: 'REG123'
    };
    component.getMercanciasSeleccionadas(MERCANCIA);
    expect(component.mercanciasSeleccionadas).toBe(MERCANCIA);
  });

  it('debe validar el formulario correctamente', () => {
    component.datosDelCertificadoForm.get('observaciones')?.setValue('Observación válida');
    expect(component.validarFormulario()).toBe(true);

    component.datosDelCertificadoForm.get('observaciones')?.setValue('  '); 
    expect(component.validarFormulario()).toBe(false);
  });

});