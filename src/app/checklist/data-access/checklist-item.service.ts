import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  ChecklistItemId,
  EditChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChecklistId } from '../../shared/interfaces/checklist';
import { ChecklistStorageService } from '../../shared/data-access/checklist-storage.service';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private checklistStorageService = inject(ChecklistStorageService);
  private checklistItemsLoaded$ =
    this.checklistStorageService.loadChecklistItems();
  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
  });

  // selector
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);
  // sources
  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<ChecklistItemId>();
  reset$ = new Subject<ChecklistId>();
  remove$ = new Subject<ChecklistItemId>();
  edit$ = new Subject<EditChecklistItem>();
  checklistRemoved$ = new Subject<ChecklistId>();

  constructor() {
    this.checklistItemsLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistItems) =>
        this.state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
        }))
      );
    this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId
        ),
      }))
    );
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === update.id ? { ...item, title: update.data.title } : item
        ),
      }))
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      }))
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }))
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
    );
    // effect
    effect(() => {
      if (this.loaded()) {
        this.checklistStorageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
