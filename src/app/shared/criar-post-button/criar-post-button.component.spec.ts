import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPostButtonComponent } from './criar-post-button.component';

describe('CriarPostButtonComponent', () => {
  let component: CriarPostButtonComponent;
  let fixture: ComponentFixture<CriarPostButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarPostButtonComponent]
    });
    fixture = TestBed.createComponent(CriarPostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
