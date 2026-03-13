import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { DetalleVDictamenComponent } from './detalle-v-dictamen.component';

describe('DetalleVDictamenComponent', () => {
  let component: DetalleVDictamenComponent;
  let fixture: ComponentFixture<DetalleVDictamenComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [DetalleVDictamenComponent],
    providers: [provideHttpClient()]
  }).compileComponents();
  
  fixture = TestBed.createComponent(DetalleVDictamenComponent);
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
