import { Component, Input } from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/checklist-item';
@Component({
    standalone: true,
    selector: 'app-checklist-item-list',
    template: `
    <section>
        <ul>
            @for(checklistItem of checklistItems; track checklistItem.id) {
                <li>
                    <div>{{checklistItem.title}}</div>
                </li>
            } @empty { 
                <div>
                    <h2>add an item</h2>
                    <p>Click the add button to add your first item to this checklist!</p>
                </div>
            }
        </ul>
    </section>
    `,
    styles: [``]
})
export class ChecklistItemListComponent {
    @Input({required: true}) checklistItems!: ChecklistItem[]
}