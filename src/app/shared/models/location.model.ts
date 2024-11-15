class AddressModel {
  region: string;
  locality: string;
  street: string;
  postal_code: string;
  address: string;
  country: string;

  constructor(data: any) {
    this.region = data?.region??'';
    this.locality = data?.locality??'';
    this.street = data?.street??'';
    this.postal_code = data?.postal_code??'';
    this.address = data?.address??'';
    this.country = data?.country??'';
  }
}

class GeoModel {
  latitude: number;
  longitude: number;
  elevation_millimeters: number;

  constructor(data: any) {
    this.latitude = data?.latitude??0;
    this.longitude = data?.longitude??0;
    this.elevation_millimeters = data?.elevation_millimeters??0;
  }
}

export class LocationModel {
  address: AddressModel;
  geo: GeoModel;

  constructor(data: any) {
    this.address = data.address
      ? new AddressModel(data.address) 
      : new AddressModel({});
    this.geo = data.geo
      ? new GeoModel(data.geo)
      : new GeoModel({});
  }
}
