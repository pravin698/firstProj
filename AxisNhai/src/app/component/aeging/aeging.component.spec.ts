import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AegingComponent } from './aeging.component';

describe('AegingComponent', () => {
  let component: AegingComponent;
  let fixture: ComponentFixture<AegingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AegingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AegingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
