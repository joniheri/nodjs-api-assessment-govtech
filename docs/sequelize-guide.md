# Sequelize

- `npm i sequelize sequelize-cli` --> Install the library or dependecies for ORM first
- `npx sequelize init` --> For initialization first to make some folder for ORM Database
- `npx sequelize-cli db:create` --> Create database. But, you must set the database-name in ./config/config.json

## Migration

- Make file migration or file design table to database
  `npx sequelize-cli model:generate --name Tablename --attributes firstName:string,lastName:string,email:string`
- Make migrating table from folder migration to database
  `npx sequelize-cli db:migrate`

## Seeder

- Make seeder
  `npx sequelize-cli seed:generate --name user-seeder`
- Running seeder
  `npx sequelize-cli db:seed:all`
- Running seeder specific
  `npx sequelize-cli db:seed --seed name-of-seed-as-in-data`
- Undo seeder
  `npx sequelize-cli db:seed:undo`
- Undo all seeder:
  - `npx sequelize-cli db:seed:undo:all`
- Undo seeder specific seed
  `npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data`

## Description of Relation DB using Sequelize

### One-To-One

Setting file in folder model:

- **ModelTablePertama** → `TablePertama.hasOne(TableKedua)`
- **ModelTableKedua** → `TableKedua.belongsTo(TablePertama)`

Example:

```js
// Option 1
Foo.hasOne(Bar, {
  foreignKey: "myFooId",
});
Bar.belongsTo(Foo);

// Option 2
Foo.hasOne(Bar, {
  foreignKey: {
    name: "myFooId",
  },
});
Bar.belongsTo(Foo);

// Option 3
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: "myFooId",
});

// Option 4
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: {
    name: "myFooId",
  },
});
```

### One-To-Many

Setting file in folder model:

- **ModelTablePertama** → `TablePertama.hasMany(TableKedua)`
- **ModelTableKedua** → `TableKedua.belongsTo(TablePertama)`

Example:

```js
Team.hasMany(Player, {
  foreignKey: "clubId",
});
Player.belongsTo(Team);
```

### Many-To-Many

Setting file in folder model:

- **ModelTablePertama** → `TablePertama.belongsToMany(TableKedua, { through: 'FieldForeignKey' })`
- **ModelTableKedua** → `TableKedua.belongsToMany(TablePertama, { through: 'FieldForeignKey' })`
