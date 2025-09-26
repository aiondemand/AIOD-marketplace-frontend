import 'jest-preset-angular/setup-jest';
import { TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

const _origConfigure = TestBed.configureTestingModule.bind(TestBed);
TestBed.configureTestingModule = (moduleDef?: any) => {
  moduleDef = moduleDef || {};
  moduleDef.declarations = [
    ...(moduleDef.declarations || []),
    MockTranslatePipe,
  ];
  return _origConfigure(moduleDef);
};
