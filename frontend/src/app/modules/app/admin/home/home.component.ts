import { Component, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public xtoggle: boolean = true;
  public BASE_URL: string = this.appService.BASE_URL;

  constructor(private appService: AppService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,) { }

  ngOnInit(): void {

  }

}
