import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from "@angular/core";
@Directive({ standalone: false, selector: "[dnd-draggable]" })
export class DragContactDirective {
  @Input() dragEnabled = true;
  @Input() dragData: any;
  @Input() dropZones: string[] = [];
  @HostBinding("attr.draggable") get draggable() {
    return this.dragEnabled;
  }
  @HostListener("dragstart", ["$event"]) start(event: DragEvent) {
    event.dataTransfer?.setData(
      "application/x-cms-contact",
      JSON.stringify(this.dragData),
    );
  }
}
@Directive({ standalone: false, selector: "[dnd-droppable]" })
export class DropContactDirective {
  @Input() dropZones: string[] = [];
  @Output() onDropSuccess = new EventEmitter<any>();
  @HostListener("dragover", ["$event"]) over(event: DragEvent) {
    if (
      Array.from(event.dataTransfer?.types || []).includes(
        "application/x-cms-contact",
      )
    )
      event.preventDefault();
  }
  @HostListener("drop", ["$event"]) drop(event: DragEvent) {
    event.preventDefault();
    try {
      const dragData = JSON.parse(
        event.dataTransfer?.getData("application/x-cms-contact") || "",
      );
      if (typeof dragData?.id === "string")
        this.onDropSuccess.emit({ dragData });
    } catch {}
  }
}
