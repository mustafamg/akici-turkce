import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clickable-text',
  templateUrl: './clickable-text.html',
  styleUrls: ['./clickable-text.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ClickableTextComponent {
  @Input() lineText = '';
  @Output() wordSelected = new EventEmitter<string>();

  get lineParts(): string[] {
    return this.lineText.match(/[\p{L}\p{M}’'-]+|[^\s\p{L}\p{M}]+|\s+/gu) ?? [];
  }

  private static readonly LETTER_RE = new RegExp('[\\p{L}\\p{M}]', 'u');

  isWord(part: string): boolean {
    return ClickableTextComponent.LETTER_RE.test(part);
  }

  isSpace(part: string): boolean {
    return /^\s+$/.test(part);
  }

  selectWord(word: string): void {
    if (this.isWord(word)) this.wordSelected.emit(word);
  }

  readonly trackByPart = (_: number, part: string) => part;
}
