import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexarRequisitosComponent } from './anexar-requisitos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';

jest.mock('@libs/shared/theme/assets/json/31601/anexar.json', () => ({
  __esModule: true,
  default: {
    documentos: [
      { id: 1, nombre: 'Documento 1' },
      { id: 2, nombre: 'Documento 2' }
    ]
  }
}), { virtual: true });

jest.mock('libs/shared/theme/assets/json/31601/anexar.json', () => ({
  __esModule: true,
  default: {
    documentos: [
      {
        id: 1,
        tipo: "Contrato de maquila, de compraventa, orden de compra o de servicios, O pedidos en firme vigentes, que acrediten la continuidad del proyecto de exportación.",
        archivoDisponible: { id: 1, descripcion: "" }
      },
      {
        id: 2,
        tipo: "Para acreditar el requisito de inversión en territorio nacional deberás adjuntar títulos de propiedad, contratos de arrendamiento acompañados con sus CFDI que amparen el pago correspondiente, pedimentos de mportación de activos fijos, entre otros documentos.",
        archivoDisponible: { id: 2, descripcion: "" }
      },
      {
        id: 3,
        tipo: "Comprobante de pago de derechos",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 4,
        tipo: "Diagrama de flujo con una descripción de manera detallada del principal proceso productivo, en términos de valor o volumen de producción, en el que se muestre el flujo de las mercancías importadas temporalmente, desde el punto de origen, punto de entrada al país, su recepción en la empresa, materiales utilizados con fracción arancelaria, almacenamiento, su integración al proceso productivo, realización de su proceso productivo o servicio, punto de salida y su destino o descargo, así como los procesos complementarios y servicios que le agregan valor a su producto final (procesos de submanufactura).",
        archivoDisponible: { id: 1, descripcion: "" }
      },
      {
        id: 5,
        tipo: "Ultimo comprobante de pago de la contraprestación por el servicio recibido.",
        archivoDisponible: { id: 2, descripcion: "" }
      },
      {
        id: 6,
        tipo: "Comprobante de pago de las cuotas obrero patronales de los trabajadores que proporcionaron el servicio especializado o la ejecución de obras especializadas, del último bimestre anterior a la fecha de presentación de la solicitud, obtenido en el SIPARE",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 7,
        tipo: "Comprobante de pago de las aportaciones al INFONAVIT de los trabajadores que proporcionaron el servicio especializado o la ejecución de obras especializadas del último bimestre anterior a la fecha de presentación de la solicitud.",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 8,
        tipo: "Anexe el soporte documental del pago de cuotas obrero patronales del último bimestre anterior a la solicitud, el cual deberá ser acorde al SUA presentado",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 9,
        tipo: "Anexe de todos los registros patronales, las constancias de la totalidad de personal registrado ante el IMSS del último bimestre anterior a la fecha de presentación de la solicitud, así como estar al corriente en el cumplimiento de sus obligaciones de retener y enterar el ISR de los trabajadores",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 10,
        tipo: "Anexe copia de los comprobantes fiscales por concepto de pago de salarios de los trabajadores con los que le hayan proporcionado el servicio o ejecutado la obra correspondiente",
        archivoDisponible: { id: 3, descripcion: "" }
      },
      {
        id: 11,
        tipo: "Reporte de saldos de mercancía de importación temporal o de mercancías objeto de operaciones de comercio exterior, de un periodo de un mes, que se encuentre dentro de los tres meses anteriores a la presentación de la solicitud.",
        archivoDisponible: { id: 3, descripcion: "" }
      }
    ]
  }
}), { virtual: true });

describe('AnexarRequisitosComponent', () => {
  let component: AnexarRequisitosComponent;
  let fixture: ComponentFixture<AnexarRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        AnexarRequisitosComponent,
        CatalogoSelectComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnexarRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    expect(component.anexarForm).toBeDefined();
    expect(component.anexarForm.get('valorSeleccionado')).toBeDefined();
  });

  it('debe establecer los documentos desde el JSON', () => {
    expect(component.documentos).toBeDefined();
    expect(Array.isArray(component.documentos)).toBe(true);
    expect(component.documentos.length).toBeGreaterThan(0);
    expect(component.documentos[0]).toHaveProperty('tipo');
  });

  it('debe actualizar el valor del formulario en cambioDeArchivo', () => {
    const mockEvent = { target: { value: 'testValue' } };
    component.cambioDeArchivo(mockEvent);
    expect(component.anexarForm.get('valorSeleccionado')?.value).toBe('testValue');
  });

  it('debe establecer valor vacío si el valor del evento es vacío en cambioDeArchivo', () => {
    const mockEvent = { target: { value: '' } };
    component.cambioDeArchivo(mockEvent);
    expect(component.anexarForm.get('valorSeleccionado')?.value).toBe('');
  });

  it('no debe lanzar error si cambioDeArchivo se llama con evento indefinido', () => {
    expect(() => component.cambioDeArchivo({ target: {} })).not.toThrow();
  });

  it('debe reinicializar el formulario cuando se llama anexarEquisitosForm', () => {
    component.anexarForm.get('valorSeleccionado')?.setValue('oldValue');
    component.anexarEquisitosForm();
    expect(component.anexarForm.get('valorSeleccionado')?.value).toBe('');
  });
});