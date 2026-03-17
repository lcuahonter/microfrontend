import { PasoUnoComponent } from './paso-uno.component';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;

  beforeEach(() => {
    component = new PasoUnoComponent();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el índice inicial en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe actualizar el índice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });
});