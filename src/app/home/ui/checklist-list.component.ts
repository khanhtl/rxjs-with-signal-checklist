import { Component, Input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
@Component({
    standalone: true,
    selector: 'app-checklist-list',
    template: `
    <ul>
        @for(checklist of checklists; track checklist.id) {
            <li>{{ checklist.title }}</li>
        } @empty {
            <p>Click the add button to create your first checklist!</p>
        }
    </ul>
    `,
    styles: [``]
})
export class ChecklistListComponent {
    @Input({required: true}) checklists!: Checklist[];
}