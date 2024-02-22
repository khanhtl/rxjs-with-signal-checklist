import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ChecklistItem,
  ChecklistItemId,
} from '../../shared/interfaces/checklist-item';
@Component({
  standalone: true,
  selector: 'app-checklist-item-list',
  template: `
    <section>
      <ul>
        @for(checklistItem of checklistItems; track checklistItem.id) {
        <li>
          <div (click)="toggle.emit(checklistItem.id)">
            @if (checklistItem.checked){
            <span>✅</span>
            } @else {
            <span>🟩</span>
            }
            {{ checklistItem.title }}
            <div>
              <button (click)="toggle.emit(checklistItem.id)">Toggle</button>
              <button (click)="edit.emit(checklistItem)">Edit</button>
              <button (click)="delete.emit(checklistItem.id)">Delete</button>
            </div>
          </div>
        </li>
        } @empty {
        <div>
          <h2>Add an item</h2>
          <p>Click the add button to add your first item to this checklist!</p>
        </div>
        }
      </ul>
    </section>
  `,
  styles: [``],
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<ChecklistItemId>();
  @Output() delete = new EventEmitter<ChecklistItemId>();
  @Output() edit = new EventEmitter<ChecklistItem>();
}
