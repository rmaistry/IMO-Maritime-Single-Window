import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortCallService } from 'app/shared/services/port-call.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-confirmation-view',
  templateUrl: './confirmation-view.component.html',
  styleUrls: ['./confirmation-view.component.css']
})
export class ConfirmationViewComponent implements OnInit, OnDestroy {
  iconPath = 'assets/images/icons/128x128/white/';
  falForms: any;

  reportingForThisPortCallDataSubcription: Subscription;

  constructor(private portCallService: PortCallService) {}

  ngOnInit() {
    this.reportingForThisPortCallDataSubcription = this.portCallService.reportingForThisPortCallData$.subscribe(
      reportingData => {
        if (reportingData != null) {
          this.falForms = [
            {
              name: 'DPG',
              icon: 'hazard.png',
              checked: reportingData.reportingDpg || false
            },
            {
              name: 'Cargo',
              icon: 'cargo.png',
              checked: reportingData.reportingCargo || false
            },
            {
              name: 'Ship Stores',
              icon: 'alcohol.png',
              checked: reportingData.reportingShipStores || false
            },
            {
              name: 'Crew',
              icon: 'crew.png',
              checked: reportingData.reportingCrew || false
            },
            {
              name: 'Pax',
              icon: 'pax.png',
              checked: reportingData.reportingPax || false
            }
          ];
        }
      }
    );
  }

  ngOnDestroy() {
    this.reportingForThisPortCallDataSubcription.unsubscribe();
  }
}
