import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklist, Checklist, ChecklistId } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChecklistStorageService } from './checklist-storage.service';

export interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklistStorageService = inject(ChecklistStorageService);
  private checklistsLoaded$ = this.checklistStorageService.loadChecklists();
  // state
  private state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });
  // selector
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);

  // sources

  add$ = new Subject<AddChecklist>();
  constructor() {
    // reducer
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
    );
    // load persistent data
    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.state.update((state) => ({ ...state, checklists, loaded: true })),
      error: (err) => this.state.update((state) => ({ ...state, error: err })),
    });
    // effect
    effect(() => {
        if(this.loaded()) {
            this.checklistStorageService.saveChecklists(this.checklists());
        }
    })
  }

  addIdToChecklist(checklist: AddChecklist): Checklist {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  generateSlug(title: Checklist['title']): string {
    let slug = title.toLowerCase().replace(/\s+/g, '-');
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
