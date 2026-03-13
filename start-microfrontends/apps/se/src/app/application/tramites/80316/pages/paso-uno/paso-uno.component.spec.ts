import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoUnoComponent } from './paso-uno.component';
import { provideHttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, PasoUnoComponent],
      providers: [provideHttpClient()]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.ngAfterViewInit();
  });

  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab(1);
  });

  it('should run #ngOnInit()', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

});