import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-difficulty-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './difficulty-filter.component.html',
  styleUrls: ['./difficulty-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DifficultyFilterComponent {
  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  levels = ['Beginner', 'Intermediate', 'Advanced'];

  onChange(vals: string[]) { this.selectedChange.emit(vals); }
}
