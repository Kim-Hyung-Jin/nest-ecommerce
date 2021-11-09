import { Test, TestingModule } from '@nestjs/testing';
import { fixture } from './fixture';

describe('updateProduct() 호출시', () => {
  describe('올바른 상품 정보가 주어지면', () => {
    it('수정된 상품 정보 응답', async () => {});

    class A {
      constructor(age: number) {
        this.age = age;
      }

      username: string;
      age: number;
    }

    //
    // fixture<A>(A);

    const newInstance = Object.create(A.prototype);

    console.log('!@#!@# ->' + JSON.stringify(A.name));
    // const test = new (<any>A)['A']('25');
    console.log('!@#!@#2 ->' + JSON.stringify(A.prototype.constructor));
    // eslint-disable-next-line prefer-spread
    // newInstance.constructor.apply(newInstance, { name: 'test' });
    // console.log('!@#!@# ->' + newInstance);
  });
});
