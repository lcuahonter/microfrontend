import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosResiduosPeligrososComponent } from './datos-residuos-peligrosos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioResiduoQuery } from '../../estados/queries/datos-residuos.query';
import { FormularioResiduoStore } from '../../estados/tramites/datos-residuos.store';

jest.mock('@libs/shared/theme/assets/json/231003/solicitud.json', () => ({
  __esModule: true,
  default: {
    radioOptions: [{ label: 'Sí', value: 'si' }],
    clasificacionRadioOptions: [{ label: 'Tipo A', value: 'A' }],
    nombre: [{ id: 1, descripcion: 'Nombre 1' }],
    arancelaria: [{ id: 1, descripcion: 'Fracción 1' }],
    nico: [{ id: 1, descripcion: 'Nico 1' }],
    unidad: [{ id: 1, descripcion: 'Unidad 1' }],
    residuo: [{ id: 1, descripcion: 'Residuo 1' }],
    tipoNombre: [{ id: 1, descripcion: 'Tipo Nombre' }],
    descripcion: [{ id: 1, descripcion: 'Descripción' }],
    creti: [{ id: 1, descripcion: 'CRETIB' }],
    estadoFisico: [{ id: 1, descripcion: 'Líquido' }],
    tipoContenedor: [{ id: 1, descripcion: 'Tambor' }],
    PrimasRelacionadas: [
      {
        encabezadoDeTabla: ['Columna1', 'Columna2'],
        cuerpoTabla: [{ tbodyData: ['Valor1', 'Valor2'] }]
      }
    ],
    Immex: [],
    table: []
  }
}));

describe('DatosResiduosPeligrososComponent', () => {
  let component: DatosResiduosPeligrososComponent;
  let fixture: ComponentFixture<DatosResiduosPeligrososComponent>;
  let mockQuery: jest.Mocked<FormularioResiduoQuery>;
  let mockStore: jest.Mocked<FormularioResiduoStore>;

  const estadoInicial = {
    formularioDatos: {
      numero: '001',
      nombreMateriaPrima: 'Materia',
      cantidad: '100',
      cantidadLetra: 'Cien',
      unidadDeMedida: 'Kg',
      fraccionArancelaria: '1234.56.78'
    },
    formularioResiduo: {
      fraccionArancelaria: '1234.56.78',
      nico: '001',
      acotacion: 'Acotación',
      residuoPeligroso: 'Sí',
      cantidad: '200',
      cantidadLetra: 'Doscientos',
      unidadMedida: 'Kg',
      clasificacion: 'A',
      claveResiduo: 'RES123',
      nombre: 'Residuo X',
      descripcion: 'Descripción',
      creti: 'CRETIB',
      estadoFisico: 'Líquido',
      tipoContenedor: 'Tambor',
      capacidad: '50'
    }
  };

  beforeEach(async () => {
    mockQuery = {
      getValue: jest.fn().mockReturnValue(estadoInicial)
    } as unknown as jest.Mocked<FormularioResiduoQuery>;

    mockStore = {
      actualizarFormularioDatos: jest.fn(),
      actualizarFormularioResiduo: jest.fn()
    } as unknown as jest.Mocked<FormularioResiduoStore>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DatosResiduosPeligrososComponent],
      providers: [
        FormBuilder,
        { provide: FormularioResiduoQuery, useValue: mockQuery },
        { provide: FormularioResiduoStore, useValue: mockStore },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosResiduosPeligrososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar catálogos desde el archivo JSON', () => {
    expect(component.etiquetasForm.nombre.length).toBeGreaterThan(0);
    expect(component.etiquetasForm.arancelaria.length).toBeGreaterThan(0);
    expect(component.etiquetasForm.nico.length).toBeGreaterThan(0);
    expect(component.etiquetasForm.tipoContenedor[0]?.descripcion).toBe('Tambor');
  });
  

  it('debería inicializar los formularios con datos del store', () => {
    expect(component.formularioDatos.value.numero).toBe('001');
    expect(component.formularioResiduo.value.nombre).toBe('Residuo X');
  });

  it('debería tener los encabezados y cuerpo de tabla establecidos', () => {
    expect(component.etiquetasForm.PrimasRelacionadas[0].encabezadoDeTabla).toEqual(['Columna1', 'Columna2']);
    expect(component.etiquetasForm.PrimasRelacionadas[0].cuerpoTabla).toEqual([{ tbodyData: ['Valor1', 'Valor2'] }]);
  });

  it('debería actualizar el campo de formularioDatos usando el método actualizarCampoFormularioDatos', () => {
    component.formularioDatos.get('cantidad')?.setValue('300');
    component.actualizarCampoFormularioDatos('cantidad');
    expect(mockStore.actualizarFormularioDatos).toHaveBeenCalledWith(
      expect.objectContaining({ cantidad: '300' })
    );
  });

  it('debería actualizar el campo de formularioResiduo usando el método actualizarCampoFormularioResiduo', () => {
    component.formularioResiduo.get('capacidad')?.setValue('100');
    component.actualizarCampoFormularioResiduo('capacidad');
    expect(mockStore.actualizarFormularioResiduo).toHaveBeenCalledWith(
      expect.objectContaining({ capacidad: '100' })
    );
  });

});
