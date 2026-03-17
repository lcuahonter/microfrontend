import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FederalDeTrabajaoComponent } from './federal-de-trabajao.component';

describe('FederalDeTrabajaoComponent', () => {
  let component: FederalDeTrabajaoComponent;
  let fixture: ComponentFixture<FederalDeTrabajaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FederalDeTrabajaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FederalDeTrabajaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
