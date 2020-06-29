import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ROProjectDirectorsComponent } from './roproject-directors.component';

describe('ROProjectDirectorsComponent', () => {
  let component: ROProjectDirectorsComponent;
  let fixture: ComponentFixture<ROProjectDirectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ROProjectDirectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROProjectDirectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
