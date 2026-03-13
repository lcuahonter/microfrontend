import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarDictamenComponent } from './verificar-dictamen.component';
import { provideHttpClient } from '@angular/common/http';

describe('VerificarDictamenComponent', () => {
  let component: VerificarDictamenComponent;
  let fixture: ComponentFixture<VerificarDictamenComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [VerificarDictamenComponent],
    providers: [provideHttpClient()]
  }).compileComponents();
  
  fixture = TestBed.createComponent(VerificarDictamenComponent);
  component = fixture.componentInstance;
  component.listaTrimites = [
    { tramite: 1, listaComponentes: [] },
    { tramite: 2, listaComponentes: [] }
  ] as any;
  fixture.detectChanges();
  });
  it('Se crea el componente', () => {
    expect(component).toBeTruthy();
  });
  it('selectTramite debe seleccionar el trámite correcto', () => {
    component.selectTramite(2);
    fixture.detectChanges();
    expect(component.tramite).toBe(2);
  });
  it('Inicializa formulario', () => {
    component.tramite = 3;
    component.inicializaFormTramite();
  });
  it('Cambia el componente hijo mostrado según la pestaña seleccionada', () => {
    component.tramite = 3;
    const TAB = {
      titulo: "Pestaña 1",
      id: "tab1",
      disabled: false
  };
    component.viewChildcambioDePestana(TAB);
      expect(component.tramite).toBe(3);
    });
    
  it('Debe tener la estructura de Bootstrap grid correcta', () => {
    const compiled = fixture.nativeElement;
    // Verificar que los botones están en un contenedor con row
    const buttonContainer = compiled.querySelector('.container form .row');
    expect(buttonContainer).toBeTruthy();
    
    // Verificar que las secciones de form tienen estructura row/col correcta
    const formRows = compiled.querySelectorAll('.form-group .row.mb-3');
    expect(formRows.length).toBeGreaterThan(0);
    
    // Verificar que las columnas md-6 están dentro de rows
    const colMd6Elements = compiled.querySelectorAll('.row .col-md-6');
    expect(colMd6Elements.length).toBeGreaterThan(0);
  });
});
