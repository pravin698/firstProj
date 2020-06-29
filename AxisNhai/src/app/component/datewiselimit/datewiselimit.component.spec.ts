import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiselimitComponent } from './datewiselimit.component';

describe('DatewiselimitComponent', () => {
  let component: DatewiselimitComponent;
  let fixture: ComponentFixture<DatewiselimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatewiselimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatewiselimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
