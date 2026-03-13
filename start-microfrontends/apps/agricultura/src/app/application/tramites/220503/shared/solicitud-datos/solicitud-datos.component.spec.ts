import { SolicitudDatosTabComponent } from './solicitud-datos.component';
import { TEXTOS } from '../../enums/texto-enum';
import { Solicitud } from '../../models/solicitud-pantallas.model';

describe('SolicitudDatosTabComponent', () => {
  let component: SolicitudDatosTabComponent;

  beforeEach(() => {
    component = new SolicitudDatosTabComponent();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener valores por defecto', () => {
    expect(component.colapsable).toBe(true);
    expect(component.tablaHeadData).toEqual([]);
    expect(component.tablaFilaDatos).toEqual([]);
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('debe alternar el valor de colapsable al llamar mostrarColapsable', () => {
    expect(component.colapsable).toBe(true);
    component.mostrarColapsable();
    expect(component.colapsable).toBe(false);
    component.mostrarColapsable();
    expect(component.colapsable).toBe(true);
  });

  it('debe aceptar datos de entrada para tablaHeadData y tablaFilaDatos', () => {
    const dummyHead = ['Col1', 'Col2'];
    const dummyRows: Solicitud[] = [{
      fechaCreacion: '2024-06-01',
      mercancia: 'Maíz',
      cantidad: '1000',
      proovedor: 'Proveedor S.A.'
    }];

    component.tablaHeadData = dummyHead;
    component.tablaFilaDatos = dummyRows;

    expect(component.tablaHeadData).toBe(dummyHead);
    expect(component.tablaFilaDatos).toBe(dummyRows);
  });
});
