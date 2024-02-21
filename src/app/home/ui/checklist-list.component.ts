import { Component, Input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';
@Component({
    standalone: true,
    imports: [RouterLink],
    selector: 'app-checklist-list',
    template: `
    <ul>
        @for(checklist of checklists; track checklist.id) {
            <a routerLink="/checklist/{{checklist.id}}">{{ checklist.title }}</a>
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