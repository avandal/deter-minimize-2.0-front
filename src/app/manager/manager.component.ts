import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  open_file: string;

  constructor() {}

  openFile(open_file: string) {
    this.open_file = open_file;
    setTimeout( () => { this.open_file = null; }, 2000 );
  }

  ngOnInit() {
  }

}
