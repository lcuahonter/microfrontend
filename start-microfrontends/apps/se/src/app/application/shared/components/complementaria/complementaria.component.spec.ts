import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplementariaComponent } from './complementaria.component';

describe('ComplementariaComponent', () => {
  let component: ComplementariaComponent<any>;
  let fixture: ComponentFixture<ComplementariaComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementariaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplementariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
