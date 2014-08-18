node-mysql-relation-manager
===========================

resolves mysql relations

###Imagine the following setup
Table posts
- id
- title
- text
- user_id (foreign key (or not, doesn't matter if it is an actual foreign) targeting users.id

Table users
- id
- username

###Then you'd create a relation like this
```js
var TableRelationManager = require('mysql-relation-manager');

// base table
var Post = new TableRelationManager('posts')

// columns I want given when querying
Post.addInternalColumn('id');
Post.addInternalColumn('title');
Post.addInternalColumn('text');

/*
 * external column relations
 * @param sourceColumn the column in the baseTable where a reference column_value (usually id) is stored
 * @param targetTable table that I want referenced by the sourceColumn's value
 * @param targetReferenceColumn the column (usually id) that is used as reference value
 * @param interestingColumns the columns you'll want returned when querying the foreign table
 */
Post.addExternalColumn('user_id', 'users', 'id', ['id', 'username', 'email']);

// or
Post.addForeignKey(
    Post.foreignKey(user_id)
        .references({table: users, column: id})
        .returns(['id', 'username', 'email'])
);

// or simply generate the whole thing using a json config file
// check demoConfig.json for a demo that would result in the same Relation as the two examples above
var Configurer = require('../RelationsConfigurer');
var Post = new Configurer(require('../demoConfig.json'));

console.log(Post.generateQuery('select'));
```