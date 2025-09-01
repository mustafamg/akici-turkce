import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../models/video';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent {
  @Input() options: Category[] = [];
  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  onChange(ids: number[]) { this.selectedChange.emit(ids); }

  selectedLabels(): string {
    if (!this.selected?.length) return '';
    const names = this.options.filter(o => this.selected.includes(o.id)).map(o => o.name);
    const head  = names.slice(0, 2).join(', ');
    return names.length > 2 ? `${head} +${names.length - 2}` : head;
  }
}
