import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebackdatedComponent } from './homebackdated.component';

describe('HomebackdatedComponent', () => {
  let component: HomebackdatedComponent;
  let fixture: ComponentFixture<HomebackdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomebackdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebackdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
