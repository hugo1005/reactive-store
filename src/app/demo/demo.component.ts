import { Component, OnInit } from '@angular/core';

import { DbService } from '../db.service';
import { DbObject } from '../db-object';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  /* Some-Component */

  obj: DbObject<any>;

  constructor(db: DbService) {

    // If the path doesn't exist an error is thrown
    try {
      this.obj = db.Ref('pathA/pathB/object');
      this.obj.subscribe(changes => console.log('Obj: ' + changes));
      this.MakeChange('Test 2', this.obj) ; // LOG: “Obj: Test”
    } catch (e) {
      console.log(e);
    }
    
    
  }

  MakeChange(value, obj) {
    obj.Update(value); 
  }

  ngOnInit() {
  }


}
