import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public xtoggle:boolean = true;

  public BASE_URL: string = this.appService.BASE_URL;

  constructor(private appService: AppService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,){}

  ngOnInit(): void {
    
}

// ngOnDestroy(): void {
//     this.renderer.removeClass(this.document.body, 'sb-sidenav-toggled');
// }

toggle(){

  this.xtoggle = this.xtoggle ? false : true;

  if(this.xtoggle){
    this.renderer.removeClass(this.document.body, 'sb-sidenav-toggled');
  }

  if(!this.xtoggle){
    this.renderer.addClass(this.document.body, 'sb-sidenav-toggled');
  }
  
}

}
