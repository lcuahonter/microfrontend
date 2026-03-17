import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDelPersonalComponent } from './seguridad-del-personal.component';

describe('SeguridadDelPersonalComponent', () => {
  let component: SeguridadDelPersonalComponent;
  let fixture: ComponentFixture<SeguridadDelPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadDelPersonalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDelPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
