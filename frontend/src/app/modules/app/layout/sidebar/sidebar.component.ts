import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;


  constructor(private appService: AppService){}

  ngOnInit(): void {}

}
