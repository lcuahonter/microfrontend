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

  it('debe tener estructura de Bootstrap grid apropiada', () => {
    const compiled = fixture.nativeElement;
    
    // Verificar que existe el contenedor principal
    const container = compiled.querySelector('.container');
    expect(container).toBeTruthy();
    
    // Verificar que no hay elementos form-inline problemáticos
    const formInlineElements = compiled.querySelectorAll('.form-inline');
    expect(formInlineElements.length).toBe(0);
    
    // Verificar que los elementos col-md-6 están contenidos en rows mb-3
    const colElements = compiled.querySelectorAll('.col-md-6');
    colElements.forEach((col: Element) => {
      const parent = col.parentElement;
      expect(parent?.classList.contains('row')).toBeTruthy();
      expect(parent?.classList.contains('mb-3')).toBeTruthy();
    });
    
    // Verificar que los botones están en una estructura de grid apropiada
    const buttonRow = compiled.querySelector('.row .col-md-12.text-end');
    expect(buttonRow).toBeTruthy();
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
});
