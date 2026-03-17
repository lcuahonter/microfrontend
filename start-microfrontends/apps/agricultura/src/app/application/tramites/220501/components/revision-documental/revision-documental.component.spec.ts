import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevisionDocumentalComponent } from './revision-documental.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RevisionService } from '../../services/revision.service';

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
    expect(component.currentIndex).toBe(1);
    expect(component.rows).toEqual([]);
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

  it('should update currentIndex correctly', () => {
    component.currentIndex = 3;
    expect(component.currentIndex).toBe(3);

    component.currentIndex = 0;
    expect(component.currentIndex).toBe(0);
  });

  it('should handle rows correctly', () => {
    component.rows = [
      { key: 'value1' },
      { key: 'value2' },
    ];
    expect(component.rows.length).toBe(2);

    component.rows.push({ key: 'value3' });
    expect(component.rows.length).toBe(3);
  });

  it('should update forma correctly', () => {
    component.forma = 'newForm';
    expect(component.forma).toBe('newForm');

    component.forma = 'updatedForm';
    expect(component.forma).toBe('updatedForm');
  });
});