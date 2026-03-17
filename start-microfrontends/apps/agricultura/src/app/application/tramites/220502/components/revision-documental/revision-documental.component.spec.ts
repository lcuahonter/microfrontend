import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevisionDocumentalComponent } from './revision-documental.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RevisionDocumentalComponent', () => {
  let component: RevisionDocumentalComponent;
  let fixture: ComponentFixture<RevisionDocumentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule,RevisionDocumentalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.indice).toBe(1);
    expect(component.colapsable).toBe(true);
    expect(component.indiceActual).toBe(1);
    expect(component.forma).toBe('');
  });

  it('should select a specific tab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('should toggle colapsable state', () => {
    expect(component.colapsable).toBe(true);

    component.colapsable = false;
    expect(component.colapsable).toBe(false);

    component.colapsable = true;
    expect(component.colapsable).toBe(true);
  });

  it('should update indiceActual correctly', () => {
    component.indiceActual = 3;
    expect(component.indiceActual).toBe(3);

    component.indiceActual = 0;
    expect(component.indiceActual).toBe(0);
  });

  it('should update forma correctly', () => {
    component.forma = 'newForm';
    expect(component.forma).toBe('newForm');

    component.forma = 'updatedForm';
    expect(component.forma).toBe('updatedForm');
  });
});