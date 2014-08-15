/**
 * @author TPei
 * created: 15/08/14.
 */

var TableRelation = require('./TableRelation');

/**
 * easily manage TableRelations
 * @param queryType {string} ['select', 'delete'] ...
 * @param tableOfOrigin {string} baseTable
 * @constructor
 */
var TableRelationManager = function(tableOfOrigin) {
    var self = this;

    /**
     * {string} baseTable
     * @type {string}
     */
    this.table = tableOfOrigin;

    /**
     * represents all internal columns I want to get returned when I query
     * @type {Array}
     */
    this.internalColumns = new Array();

    /**
     * represents all Table relations so that I can get column values from related tables
     * @type {Array} of TableRelations
     */
    this.externalColumns = new Array();

    /**
     * adds an internal column
     * @param column
     */
    this.addInternalColumn = function(column) {
        this.internalColumns.push(self.table + '.' + column);
    }

    /**
     * creates a new TableRelation using the baseTable
     * and adds it to the external columns array
     * @param sourceColumn the column in the baseTable where a reference column_value (usually id) is stored
     * @param targetTable table that I want referenced by the sourceColumn's value
     * @param targetColumn column I want to get when pulling the referenced table
     * @param refColumn the column (usually id) that is used as reference value
     */
    this.addExternalColumn = function(sourceColumn, targetTable, targetReferenceColumn, interestingColumns) {
        this.externalColumns.push(new TableRelation(self.table, sourceColumn, targetTable, targetReferenceColumn, interestingColumns));
    }

    /**
     * generate querystring from all given columns and relations
     * @param queryType {String} type of query ['select'|'delete'] etc
     * @returns {string}
     */
    this.generateQuery = function(queryType) {
        var query = queryType + ' ';

        if(this.internalColumns.length == 0 && this.externalColumns.length == 0)
            return query + '* from ' + this.table;

        for(var i = 0; i < this.internalColumns.length; i++)
            query += this.internalColumns[i] + ', ';

        if(this.externalColumns.length == 0)
            return query.substring(0, query.length-2) + ' from ' + this.table;

        for(var i = 0; i < this.externalColumns.length; i++) {
            if(this.externalColumns[i].interestingColumns instanceof Array){
                var columns = this.externalColumns[i].interestingColumns;
                for(var j = 0; j < columns.length; j++){
                    query += this.externalColumns[i].targetTable + '.' + columns[j] + ' as ' + this.externalColumns[i].targetTable +  columns[j] + ', ';
                }
            }
            else
                query += this.externalColumns[i].targetTable + '.' + this.externalColumns[i].interestingColumns + ' as ' + this.externalColumns[i].targetTable +  this.externalColumns[i].interestingColumns + ', ';
        }

        query = query.substring(0, query.length-2) + ' from ' + this.table;

        for(var i = 0; i < this.externalColumns.length; i++) {
            query = query  +
                ' join ' + this.externalColumns[i].targetTable +
                ' on (' + this.externalColumns[i].sourceTable + '.' + this.externalColumns[i].sourceColumn +
                ' = ' + this.externalColumns[i].targetTable + '.' + this.externalColumns[i].targetReferenceColumn + ')';
        }

        return query + ' ';
    }
}

module.exports = TableRelationManager;
