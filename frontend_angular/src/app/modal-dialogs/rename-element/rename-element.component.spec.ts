import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameElementComponent } from './rename-element.component';

describe('RenameElementComponent', () => {
  let component: RenameElementComponent;
  let fixture: ComponentFixture<RenameElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenameElementComponent]
    });
    fixture = TestBed.createComponent(RenameElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
