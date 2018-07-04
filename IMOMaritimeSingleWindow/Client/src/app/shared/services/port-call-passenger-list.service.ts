import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormMetaData } from '../interfaces/form-meta-data.interface';
import { PassengerModel } from '../models/port-call-passenger-model';

@Injectable()
export class PortCallPassengerListService {

  constructor() { }

  private passengerListSource = new BehaviorSubject<any>(null);
  passengerList$ = this.passengerListSource.asObservable();

  private passengerListMeta = new BehaviorSubject<any>({
    valid: true
  });
  passengerListMeta$ = this.passengerListMeta.asObservable();

  private dataIsPristine = new BehaviorSubject<Boolean>(true);
  dataIsPristine$ = this.dataIsPristine.asObservable();

  private passengerModelSource = new BehaviorSubject<PassengerModel>(new PassengerModel());
  passengerModel$ = this.passengerModelSource.asObservable();

  private embarkationModelDataSource = new BehaviorSubject<any>(null);
  embarkationModelData$ = this.embarkationModelDataSource.asObservable();

  private disembarkationModelDataSource = new BehaviorSubject<any>(null);
  disembarkationModelData$ = this.disembarkationModelDataSource.asObservable();

  setPassengersList(data) {
    this.passengerListSource.next(data);
  }

  setPassengerListMeta(metaData: FormMetaData) {
    this.passengerListMeta.next(metaData);
  }

  setDataIsPristine(isPristine) {
    this.dataIsPristine.next(isPristine);
  }

  setPortOfEmbarkation(data) {
    const tempPortModel = this.createPortObject(data);

    this.embarkationModelDataSource.next(tempPortModel);
    const tempPassengerModel = this.passengerModelSource.getValue();
    tempPassengerModel.portOfEmbarkation = tempPortModel;
    this.passengerModelSource.next(tempPassengerModel);
  }

  setPortOfDisembarkation(data) {
    const tempPortModel = this.createPortObject(data);

    this.disembarkationModelDataSource.next(tempPortModel);
    const tempPassengerModel = this.passengerModelSource.getValue();
    tempPassengerModel.portOfDisembarkation = tempPortModel;
    console.log(tempPassengerModel);
    this.passengerModelSource.next(tempPassengerModel);
  }

  setPassengerModel(data) {
    this.passengerModelSource.next(data);
  }

  deletePassengerEntry(data) {
    let copyPassengerList = this.passengerListSource.getValue();
    data = JSON.stringify(this.createComparableObject(data));

    // Find clicked item
    copyPassengerList.forEach((item, index) => {
      item = JSON.stringify(this.createComparableObject(item));
      if (item === data) {
        copyPassengerList.splice(index, 1);
      }
    });

    copyPassengerList = this.setPassengerIds(copyPassengerList);
    this.setPassengersList(copyPassengerList);

    this.setDataIsPristine(false);
  }

  createComparableObject(item) {
    const object = {
      familyName: item.familyName,
      givenName: item.givenName,
      nationality: item.nationality,
      dateOfBirth: item.dateOfBirth,
      placeOfBirth: item.placeOfBirth,
      countryOfBirth: item.countryOfBirth,
      natureOfIdentityDoc: item.natureOfIdentityDoc,
      numberOfIdentityDoc: item.numberOfIdentityDoc,
      permitNumber: item.permitNumber,
      portOfEmbarkation: item.portOfEmbarkation,
      portOfDisembarkation: item.portOfDisembarkation,
      transit: item.transit,
      passengerId: item.passengerId,
      portCallId: item.portCallId
    };
    return object;
  }

  setPassengerIds(list) {
    let tempPassengerId = 1;
    list.forEach(passenger => {
      passenger.passengerId = tempPassengerId;
      tempPassengerId++;
    });
    return list;
  }

  createPortObject(data) {
    if (data) {
      const tempPortModel = {
        locationId: data.locationId,
        countryId: data.countryId,
        locationTypeId: data.locationTypeId,
        locationSourceId: data.locationSourceId,
        municipalityId: data.municipalityId,
        locationCode: data.locationCode,
        locationNo: data.locationNo,
        postCode: data.postCode,
        name: data.name,
        country: {
          countryId: data.country.countryId,
          callCode: data.country.callCode,
          name: data.country.name,
          threeCharCode: data.country.threeCharCode,
          twoCharCode: data.country.twoCharCode
        },
        locationSource: data.locationSource,
        municipality: data.municipality
        };
      return tempPortModel;
    } else {
      return null;
    }
  }
}
