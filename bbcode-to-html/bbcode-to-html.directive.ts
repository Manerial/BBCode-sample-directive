import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBBCode]',
})
export class BbcodeToHtmlDirective implements OnInit {
  @Input() text = '';

  private readonly BBCODE_OPEN_CLOSE_REGEX: RegExp = /\[([BUIS]+)](.*?)\[\/(\1)]|\[(#[A-F0-9]+)](.*?)\[\/#]/g;
  // REGEX EXPLANATIONS :
  // \[([BUIS]+)](.*?)\[\/(\1)] -> 3 capturing groups :
  //    \[([BUIS]+)] : the BBCode,
  //    (.*?) : the inner text,
  //    \[\/(\1)] : the close tag of the BBCode
  // \[(#[A-F0-9]+)](.*?)\[\/#] -> 2 capturing groups :
  //    \[(#[A-F0-9]+)] : the BBCode for the color,
  //    (.*?) : the inner text,
  //    \[\/#] : the close tag of the BBCode

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const label = this.el.nativeElement as HTMLElement;
    const textToDomElement = this.parseBBCode(this.text.trim());
    label.append(textToDomElement);
  }

  /**
   * <pre>
   * Parse a string to construct a stash of nodes using the BBCodes that it contains.
   * Allowed tags are :
   * [B], [U], [I], [S] and [#000]/[#000000] (any hexadecimal color)
   * The BBCodes will be destroyed, and the text will be inserted in a matching HTML tags (<b>, <u>, <i>, <s>, <span style="color:#0000">)
   * This method is recursive to allow stacks of BBCodes
   * </pre>
   * @param text the text to parse, containing BBCodes
   */
  private parseBBCode(text: string): DocumentFragment {
    const container = document.createDocumentFragment();
    const regex = new RegExp(this.BBCODE_OPEN_CLOSE_REGEX);
    const match: RegExpExecArray | null = regex.exec(text);

    if (match == null) {
      const textNode = document.createTextNode(text);
      container.append(textNode);
    } else {
      // What we may have : (some text without BBCode)[BBCode](some text with.out BBCode 1)[/BBCode](some text with.out BBCode 2)
      const index = match.index;
      const [fullMatch, currentBBCode, innerText, ignored, currentBBCodeColor, innerTextColor] = match;
      const previousText = text.substring(0, index);
      const remainingText = text.substring(index + fullMatch.length);
      // previousText contains (some text without BBCode)
      // currentBBCode / currentBBCodeColor contains the BBCode itself
      // innerText / innerTextColor contains (some text with.out BBCode 1)
      // remainingText contains (some text with.out BBCode 2)

      const previousDomElement = document.createTextNode(previousText);
      const currentDomElement = this.createDomElement(currentBBCode != undefined ? currentBBCode : currentBBCodeColor);
      const innerDomElement = this.parseBBCode(innerText != undefined ? innerText : innerTextColor);
      const nextDomElement = this.parseBBCode(remainingText);

      currentDomElement.append(innerDomElement);
      container.append(previousDomElement);
      container.appendChild(currentDomElement);
      container.append(nextDomElement);
    }

    return container;
  }

  /**
   * Use a tag name to create a new DOM element and fill it
   *
   * @param tagName the name of the HTML tag to create
   */
  private createDomElement(tagName: string): HTMLElement {
    let element: HTMLElement;
    // If tagName contains a #, it is a color
    if (tagName.indexOf('#') >= 0) {
      element = document.createElement('span');
      element.style.color = tagName;
    } else {
      element = document.createElement(tagName);
    }
    return element;
  }
}
