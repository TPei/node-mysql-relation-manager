mysql-relation-query
====================

###resolves mysql relations
create a TableRelationManager, add internal and external columns and have it generate mysql queries, complete with joins and everything

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
var TableRelationManager = require('mysql-relation-query');

// base table
var Post = new TableRelationManager('posts')

// columns I want given when querying
Post.addInternalColumn('id');
Post.addInternalColumn('title');
Post.addInternalColumn('text');

// external column relations
// name of column where key (usually primary key, usually id) of reference table is stored
// referenced table
// column (usually primary key, usually id) that is used as reference
// columns I want given when querying that table
Post.addExternalColumn('user_id', 'users', 'id', ['username', 'id']);

console.log(Post.generateQuery('select'));
```
would generate the following sql statement
select posts.id, posts.title, posts.text, users.username as usersusername, users.id as usersid from posts join users on (posts.user_id = users.id)