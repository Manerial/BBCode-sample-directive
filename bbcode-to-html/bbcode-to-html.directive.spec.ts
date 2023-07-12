import {Component, DebugElement} from "@angular/core";
import {BbcodeToHtmlDirective} from "./bbcode-to-html.directive";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from "@angular/platform-browser";


@Component({
  template: `
  <h2 appBBCode [text]="'I am some text'"></h2>
  <h2 appBBCode [text]="'I am some text [B]with format[/B] [#FF0000]and color[/#]'"></h2>
  <h2 appBBCode [text]="'I am some text [B][#FF0000]with format and color inside[/#][/B]'"></h2>
  <h2 appBBCode [text]="'I am some text [B]with format [#FF0000]and color inside[/#][/B]'"></h2>
  <h2>I have no directive</h2>`,
})
class TestComponent {
}

describe('BbcodeToHtmlDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];
  let bareH2: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, BbcodeToHtmlDirective],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding
    component = fixture.componentInstance;
    des = fixture.debugElement.queryAll(By.directive(BbcodeToHtmlDirective));
    bareH2 = fixture.debugElement.query(By.css('h2:not([appBBCode])'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three appBBCode elements', () => {
    expect(des.length).toBe(4);
  });

  it('should display 1st h2 with one inner node', () => {
    const childNodes = (des[0].nativeElement as HTMLElement).childNodes;
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].textContent).toBe("I am some text");
    expect(childNodes[0].nodeName).toBe("#text");
  });

  it('should display 2nd h2 with perfect style', () => {
    const childNodes = (des[1].nativeElement as HTMLElement).childNodes;
    expect(childNodes.length).toBe(5);
    expect(childNodes[0].textContent).toBe("I am some text ");
    expect(childNodes[0].nodeName).toBe("#text");

    expect(childNodes[1].textContent).toBe("with format");
    expect(childNodes[1].nodeName).toBe("B");

    expect(childNodes[2].textContent).toBe(" ");
    expect(childNodes[2].nodeName).toBe("#text");

    expect(childNodes[3].textContent).toBe("and color");
    expect(childNodes[3].nodeName).toBe("SPAN");
    expect(childNodes[3].childNodes.length).toBe(1);
    expect((childNodes[3] as HTMLElement).style.color).toBe("rgb(255, 0, 0)");

    expect(childNodes[4].textContent).toBe("");
    expect(childNodes[4].nodeName).toBe("#text");
  });

  it('should display 3rd h2 with perfect style', () => {
    const childNodes = (des[2].nativeElement as HTMLElement).childNodes;
    expect(childNodes.length).toBe(3);

    expect(childNodes[0].textContent).toBe("I am some text ");
    expect(childNodes[0].nodeName).toBe("#text");
    expect(childNodes[0].childNodes.length).toBe(0);

    expect(childNodes[1].textContent).toBe("with format and color inside");
    expect(childNodes[1].nodeName).toBe("B");
    expect(childNodes[1].childNodes.length).toBe(3);

    expect(childNodes[2].textContent).toBe("");
    expect(childNodes[2].nodeName).toBe("#text");
    expect(childNodes[2].childNodes.length).toBe(0);

    // 0 and 2 are empty text
    expect(childNodes[1].childNodes[0].textContent).toBe("");
    expect(childNodes[1].childNodes[1].textContent).toBe("with format and color inside");
    expect(childNodes[1].childNodes[2].textContent).toBe("");

    expect((childNodes[1].childNodes[1] as HTMLElement).nodeName).toBe("SPAN");
    expect((childNodes[1].childNodes[1] as HTMLElement).style.color).toBe("rgb(255, 0, 0)");
  });

  it('should display 4th h2 with perfect style', () => {
    const childNodes = (des[3].nativeElement as HTMLElement).childNodes;
    expect(childNodes.length).toBe(3);

    expect(childNodes[0].textContent).toBe("I am some text ");
    expect(childNodes[0].nodeName).toBe("#text");
    expect(childNodes[0].childNodes.length).toBe(0);

    expect(childNodes[1].textContent).toBe("with format and color inside");
    expect(childNodes[1].nodeName).toBe("B");
    expect(childNodes[1].childNodes.length).toBe(3);

    expect(childNodes[2].textContent).toBe("");
    expect(childNodes[2].nodeName).toBe("#text");
    expect(childNodes[2].childNodes.length).toBe(0);

    // 0 and 2 are empty text
    expect(childNodes[1].childNodes[0].textContent).toBe("with format ");
    expect(childNodes[1].childNodes[1].textContent).toBe("and color inside");
    expect(childNodes[1].childNodes[2].textContent).toBe("");

    expect((childNodes[1].childNodes[1] as HTMLElement).nodeName).toBe("SPAN");
    expect((childNodes[1].childNodes[1] as HTMLElement).style.color).toBe("rgb(255, 0, 0)");
  });

  it('bare h2 should not have a customProperty', () => {
    expect(bareH2.properties['customProperty']).toBeUndefined();
  });
});
