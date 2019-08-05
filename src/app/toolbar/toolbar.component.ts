import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AutomatonService } from '../providers/automaton/automaton.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() openFile: EventEmitter<string> = new EventEmitter();

  constructor() {}

  open(event: any) {
    let reader = new FileReader();
    let openFile = this.openFile;
    reader.addEventListener('load', function() {
      openFile.emit(<string>reader.result);
    }, false);
    reader.readAsText(event.target.files[0]);
  }

  ngOnInit() {
  }

}
