/**
 * @author TPei
 * created: 15/08/14.
 */
// select tx_sftapaiis_domain_model_incidents.date_incident, tx_sftapaiis_domain_model_incidents.town, tx_sftapaiis_domain_model_incidents.latitutde, tx_sftapaiis_domain_model_incidents.longitude, tx_sftapaiis_domain_model_productcategory.title as tx_sftapaiis_domain_model_productcategorytitle, tx_sftapaiis_domain_model_modusoperandi.title as tx_sftapaiis_domain_model_modusoperandititle, tx_sftapaiis_domain_model_locationtype.title as tx_sftapaiis_domain_model_locationtypetitle, static_countries.cn_short_en as static_countriescn_short_en from tx_sftapaiis_domain_model_incidents join tx_sftapaiis_domain_model_productcategory on (tx_sftapaiis_domain_model_incidents.product_category = tx_sftapaiis_domain_model_productcategory.uid) join tx_sftapaiis_domain_model_modusoperandi on (tx_sftapaiis_domain_model_incidents.modus_operandi = tx_sftapaiis_domain_model_modusoperandi.uid) join tx_sftapaiis_domain_model_locationtype on (tx_sftapaiis_domain_model_incidents.location_type = tx_sftapaiis_domain_model_locationtype.uid) join static_countries on (tx_sftapaiis_domain_model_incidents.country = static_countries.uid)

/**
 * Skyfillers GmbH
 * @author Thomas Peikert
 * created: 15/08/14.
 */
var mocha = require('mocha');
var assert = require('assert');

describe('TableRelationsManager', function(){
    describe('#generateQuery', function(){
        it('should be able to handle internal columns and solve multiple relations', function(){
            var TableRelationManager = require('../TableRelationManager');

            // base table
            var post = new TableRelationManager('posts');

            // columns I want given when querying
            post.addInternalColumn('id');
            post.addInternalColumn('title');
            post.addInternalColumn('text');

            post.addExternalColumn('user_id', 'users', 'id', ['username', 'id']);

            var query = post.generateQuery('select');

            assert.equal(query, 'select posts.id, posts.title, posts.text, users.username as usersusername, users.id as usersid from posts join users on (posts.user_id = users.id) ');

        })

        it('should work without any external relations', function(){
            var TableRelationManager = require('../TableRelationManager');

            // base table
            var post = new TableRelationManager('posts');

            // columns I want given when querying
            post.addInternalColumn('id');
            post.addInternalColumn('title');
            post.addInternalColumn('text');

            var query = post.generateQuery('select');

            assert.equal(query, 'select posts.id, posts.title, posts.text from posts');

        })

        it('should work without any external relations and without explicit internal columns', function(){
            var TableRelationManager = require('../TableRelationManager');

            var post = new TableRelationManager('posts');
            var query = post.generateQuery('select');

            assert.equal(query, 'select * from posts');
        })

        it('should work when given only external columns', function(){
            var TableRelationManager = require('../TableRelationManager');

            // base table
            var post = new TableRelationManager('posts');

            post.addExternalColumn('user_id', 'users', 'id', ['username', 'id']);

            var query = post.generateQuery('select');

            assert.equal(query, 'select users.username as usersusername, users.id as usersid from posts join users on (posts.user_id = users.id) ');

        })
    })
})


