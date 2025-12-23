import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-activate-progComponent} from "./contactile-gripper-activate-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperStateErrorProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperActivateProgComponent>;
  let component: ContactileGripperActivateProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperActivateProgComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactileGripperActivateProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
