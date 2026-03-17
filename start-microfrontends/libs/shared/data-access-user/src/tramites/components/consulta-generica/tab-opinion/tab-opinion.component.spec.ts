import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TabOpinionComponent } from "./tab-opinion.component";


describe('TabOpinionComponent', () => {
  let component: TabOpinionComponent;
  let fixture: ComponentFixture<TabOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabOpinionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});