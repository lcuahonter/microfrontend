import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScianTablaContenedoraComponent } from './scian-tabla-contenedora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScianTablaContenedoraComponent', () => {
  let component: ScianTablaContenedoraComponent;
  let fixture: ComponentFixture<ScianTablaContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScianTablaContenedoraComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ScianTablaContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toMatchSnapshot();
  });

  it('should have a defined component instance', () => {
    expect(component).toBeDefined();
  });

  it('should call a specific method when invoked', () => {
    const spy = jest.spyOn(component, 'obtenerSeleccionado');
    const event = {
      clave: 'test',
      descripcion: 'test description'
      }
    component.obtenerSeleccionado(event);
    expect(spy).toHaveBeenCalled();
  });
});
