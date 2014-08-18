/**
 * Skyfillers GmbH
 * @author Thomas Peikert
 * created: 18/08/14.
 */

/**
 * configures TableRelationManager from info given in json file
 * @param json {File} with info for configuration; needs to be valid configuration json
 */
var RelationConfigurer = function(json) {
    this.json = json;

    var TableRelationManager = require('./TableRelationManager');

    var Relation = new TableRelationManager(json.table);

    for(column in this.json.internalColumns) {
        var col = this.json.internalColumns[column];

        Relation.addInternalColumn(col);
    }

    for(column in this.json.relations) {
        var relation = this.json.relations[column];

        Relation.addForeignKey(
            Relation.foreignKey(relation.sourceColumn)
                .references({table: relation.targetTable, column: relation.targetReferenceColumn})
                .returns(relation.columns)
        );
    }

    return Relation;
}

module.exports = RelationConfigurer;

