import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  @Input() placeholder = 'Search videos...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  control = new FormControl<string>('', { nonNullable: true });

  ngOnInit() {
    this.control.setValue(this.value ?? '');
    this.control.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => this.valueChange.emit(v || ''));
  }

  submit() { this.valueChange.emit(this.control.value || ''); }
}
