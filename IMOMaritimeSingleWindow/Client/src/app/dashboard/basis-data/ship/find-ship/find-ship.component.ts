import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ShipService } from '../../../../shared/services/ship.service';
import { PortCallService } from '../../../../shared/services/port-call.service';

@Component({
  selector: 'app-find-ship',
  templateUrl: './find-ship.component.html',
  styleUrls: ['./find-ship.component.css'],
  providers: [ShipService]
})
export class FindShipComponent implements OnInit {

  shipModel: any;
  shipFound = false;
  
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private portCallService: PortCallService, private shipService: ShipService) { }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term => term.length < 2 ? [] :
        this.shipService.search(term)
      )
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);

  formatter = (x: {shipId: string}) => x.shipId;

  selectShip($event){
    this.shipFound = true;
    this.portCallService.setShipData($event.item);
  }

  deselectShip(){
    this.shipFound = false;
    this.shipModel = null;
    this.portCallService.setShipData(this.shipModel);
  }

  ngOnInit() {
  }
}
