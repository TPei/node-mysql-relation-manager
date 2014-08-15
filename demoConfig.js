/**
 * @author TPei
 * created: 15/08/14.
 */

var TableRelationManager = require('./TableRelationManager');

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
