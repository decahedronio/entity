# CHANGELOG

## v4.0.0

### Major changes

- ✨ Source data for `EntityBuilder.build*` methods and the returned object of `Entity.prototype.toJson` is now fully typed.
- 🗑 Removed asynchronous entity building. `EntityBuilder.buildOneAsync` and `EntityBuilder.buildManyAsync` methods are removed.
- 🗑 Removed the ability to pass `import()` function to `@Type` decorator, simply as a result of removing async building.
- 🗑 Removed global case conversion. `EntityBuilder.enableCamelConversion` flag is removed.
- 🗑 Removed `@AliasFor` decorator. It provides no additional value on top of what `@Type` decorator can do.
- 🗑 Removed `@Default` decorator. Defaults can simply be defined in the entity class definitions.
