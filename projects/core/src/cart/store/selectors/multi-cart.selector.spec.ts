import { StateWithMultiCart } from '../multi-cart-state';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import * as fromReducers from './../reducers/index';
import { Type } from '@angular/core';
import { Cart } from '../../../model/cart.model';
import { MultiCartSelectors } from '.';
import { CartActions } from '../actions';

describe('Multi Cart selectors', () => {
  let store: Store<StateWithMultiCart>;

  const testCart: Cart = {
    code: 'xxx',
    guid: 'xxx',
    totalItems: 0,
    entries: [{ entryNumber: 0, product: { code: '1234' } }],
    totalPrice: {
      currencyIso: 'USD',
      value: 0,
    },
    totalPriceWithTax: {
      currencyIso: 'USD',
      value: 0,
    },
    user: { uid: 'test' },
  };

  function loadCart() {
    store.dispatch(
      new CartActions.LoadMultiCartSuccess({
        cart: testCart,
        userId: 'userId',
        extraData: {
          active: true,
        },
      })
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          'multi-cart',
          fromReducers.getMultiCartReducers()
        ),
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithMultiCart>>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getMultiCartState', () => {
    it('should return multi-cart branch of the store', () => {
      let result;
      store
        .pipe(select(MultiCartSelectors.getMultiCartState))
        .subscribe(value => (result = value));

      expect(result).toEqual({
        active: '',
        carts: {
          entities: {},
        },
      });

      loadCart();

      expect(result).toEqual({
        active: testCart.code,
        carts: {
          entities: {
            [testCart.code]: {
              value: testCart,
              success: true,
              error: false,
              loading: false,
            },
          },
        },
      });
    });
  });

  describe('getMultiCartEntities', () => {
    it('should return cart entities', () => {
      let result;
      store
        .pipe(select(MultiCartSelectors.getMultiCartEntities))
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
      });

      loadCart();

      expect(result).toEqual({
        entities: {
          [testCart.code]: {
            value: testCart,
            success: true,
            error: false,
            loading: false,
          },
        },
      });
    });
  });

  describe('getCartEntitySelectorFactory', () => {
    it('should return cart entity with passed id', () => {
      let result;
      store
        .pipe(
          select(MultiCartSelectors.getCartEntitySelectorFactory(testCart.code))
        )
        .subscribe(value => (result = value));

      expect(result).toEqual({
        loading: false,
        error: false,
        success: false,
        value: undefined,
      });

      loadCart();

      expect(result).toEqual({
        value: testCart,
        success: true,
        error: false,
        loading: false,
      });
    });
  });

  describe('getCartSelectorFactory', () => {
    it('should return cart with passed id', () => {
      let result;
      store
        .pipe(select(MultiCartSelectors.getCartSelectorFactory(testCart.code)))
        .subscribe(value => (result = value));

      expect(result).toEqual(undefined);

      loadCart();

      expect(result).toEqual(testCart);
    });
  });

  describe('getCartEntriesSelectorFactory', () => {
    it('should return cart entries', () => {
      let result;
      store
        .pipe(
          select(
            MultiCartSelectors.getCartEntriesSelectorFactory(testCart.code)
          )
        )
        .subscribe(value => (result = value));

      expect(result).toEqual([]);

      loadCart();

      expect(result).toEqual(testCart.entries);
    });
  });

  describe('getCartEntrySelectorFactory', () => {
    it('should return cart entry', () => {
      let result;
      store
        .pipe(
          select(
            MultiCartSelectors.getCartEntrySelectorFactory(
              testCart.code,
              testCart.entries[0].product.code
            )
          )
        )
        .subscribe(value => (result = value));

      expect(result).toEqual(null);

      loadCart();

      expect(result).toEqual(testCart.entries[0]);
    });
  });

  describe('getActiveCartId', () => {
    it('should return active cart id', () => {
      let result;
      store
        .pipe(select(MultiCartSelectors.getActiveCartId))
        .subscribe(value => (result = value));

      expect(result).toEqual('');

      loadCart();

      expect(result).toEqual(testCart.code);
    });
  });
});
