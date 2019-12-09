# Saga migration guidelines

This is a guide for a fully safely typed redux-saga experience. As of typescript 3.6 Generators can be typed [Generators in Typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-3-6/#stricter-generators).

## Prequests

Please make sure you have read and understood clearly

- [Generators in Typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-3-6/#stricter-generators)
- [Understanding yield\*](https://stackoverflow.com/questions/17491779/delegated-yield-yield-star-yield-in-generator-functions)
- [Where does redux-saga end](https://github.com/redux-saga/redux-saga/issues/1932).
- [typed-redux-saga as a temporary solution](https://github.com/agiledigital/typed-redux-saga)

## Problems with sagas and typescript

redux-saga is fully written in javascript, [currently there is no clear support for typescript](https://github.com/redux-saga/redux-saga/issues/1932).

In order to add this support we used [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga) for our effects like `select` , `call` etc.

This `typed-redux-saga` is a wrapper libary that wraps the main `redux-saga` effects into a generator that correctly returns the type of the saga when using a delegated yield `yield *`

Since we use this library only for inferring correct types only. not all types supported by ``typed-redux-saga` are used.

### How to use

All this implementation details are hidden behind `packages/sagas`.

as a developer you will only need to import your `redux-saga` effects from `@neufund/sagas`.

The `@neufund/sagas` should take care of which type of effect should you use. Just make sure while you are yielding the sagas to use `yield *`

### Migration plan

If you find your self refactoring, changing, editing an untyped saga you are obliged as part of your task as a developer to correctly type the saga. The simplest way is to use `Generator<Any,CorrectType,Any>` as that automatically infers the final return type.

What is important for now is the final return of the saga.

### Contribution

If you find any of this information out of date please update accordingly without hesitation.
