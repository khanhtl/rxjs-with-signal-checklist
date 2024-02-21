import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist';
@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-checklist-header',
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>
        {{ checklist.title }}
      </h1>
      <button (click)="addItem.emit()">Add item</button>
    </header>
  `,
  styles: [``],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
}
