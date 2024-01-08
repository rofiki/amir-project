import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-checklist-add-choice',
  templateUrl: './checklist-add-choice.component.html',
  styleUrls: ['./checklist-add-choice.component.css']
})
export class ChecklistAddChoiceComponent implements OnInit,OnDestroy {

  public randomId?:any;

  ngOnInit(): void {
    console.log('FromAddChoice',this.randomId);
  }
  
  ngOnDestroy(): void {
  }

}
