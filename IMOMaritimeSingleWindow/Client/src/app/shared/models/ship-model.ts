export class ShipModel {
  shipId: number;
  shipHullTypeId: number;
  shipStatusId: number;
  shipPowerTypeId: number;
  shipBreadthTypeId: number;
  shipLengthTypeId: number;
  shipSourceId: number;
  shipFlagCodeId: number;
  organizationId: number;
  shipTypeId: number;
  imoNo: number;
  yearOfBuild: number;
  mmsiNo: number;
  name: string;
  callSign: string;
  deadweightTonnage: number;
  grossTonnage: number;
  length: number;
  breadth: number;
  power: number;
  height: number;
  draught: number;
  hasSideThrusters: boolean;
  hasSideThrustersFront: boolean;
  hasSideThrustersBack: boolean;
  remark: string;
  certificateOfRegistryId: number;
  inmarsatCallNumber: string;
  dateOfKeelLaying: Date;
}
