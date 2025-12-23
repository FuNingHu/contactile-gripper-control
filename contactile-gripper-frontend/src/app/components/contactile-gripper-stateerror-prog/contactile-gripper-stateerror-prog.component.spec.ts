import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-stateerror-progComponent} from "./contactile-gripper-stateerror-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperStateErrorProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperStateErrorProgComponent>;
  let component: ContactileGripperStateErrorProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperStateErrorProgComponent],
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

    fixture = TestBed.createComponent(ContactileGripperStateErrorProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
