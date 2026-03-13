import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import {
  CatalogoSelectComponent,
  InputFechaComponent,
  InputRadioComponent,
  ConsultaioQuery,
  TituloComponent
} from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { CommonModule } from '@angular/common';

describe('PagoDeDerechosComponent', () => {
  let componente: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let servicioMock: any;
  let consultaioMock: any;

  const catalogoMock = [{ id: 1, descripcion: 'Banco1' }];
  const formularioPagoMock = {
    exentoPago: 'Si',
    justificacion: '',
    claveReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llavePago: '',
    fechaPago: '',
    importePago: ''
  };

  beforeEach(async () => {
    servicioMock = {
      obtenerDatos: jest.fn().mockReturnValue(of({ formularioPago: formularioPagoMock })),
      obtenerDetallesDelCatalogo: jest.fn().mockReturnValue(of({ data: catalogoMock })),
      actualizarFormaValida: jest.fn(),
      actualizarFormularioPago: jest.fn()
    };

    consultaioMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PagoDeDerechosComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CatalogoSelectComponent,
        InputRadioComponent,
        InputFechaComponent,
        TituloComponent,
        CommonModule
      ],
      providers: [
        { provide: ImportacionDeAcuiculturaService, useValue: servicioMock },
        { provide: ConsultaioQuery, useValue: consultaioMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    componente = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });
});
