/**
 * Skyfillers GmbH
 * @author Thomas Peikert
 * created: 15/08/14.
 */

var TableRelation = require('./TableRelation');

/**
 * easily manage TableRelations
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
     * @param column to be returned when querying the table
     */
    this.addInternalColumn = function(column) {
        this.internalColumns.push(self.table + '.' + column);
    }

    /**
     * creates a new TableRelation using the baseTable
     * and adds it to the external columns array
     * @param sourceColumn the column in the baseTable where a reference column_value (usually id) is stored
     * @param targetTable table that I want referenced by the sourceColumn's value
     * @param targetReferenceColumn the column (usually id) that is used as reference value
     * @param interestingColumns the columns you'll want returned when querying the foreign table
     */
    this.addExternalColumn = function(sourceColumn, targetTable, targetReferenceColumn, interestingColumns) {
        this.externalColumns.push(new TableRelation(self.table, sourceColumn, targetTable, targetReferenceColumn, interestingColumns));
    }

    /**
     * creates a new TableRelation using the baseTable
     * and adds it to the external columns array
     * @param object with the following parts:
     * - sourceColumn the column in the baseTable where a reference column_value (usually id) is stored
     * - targetTable table that I want referenced by the sourceColumn's value
     * - targetColumn column I want to get when pulling the referenced table
     * - refColumn the column (usually id) that is used as reference value
     * @param interestingColumns the columns you'll want returned when querying the foreign table
     */
    this.addRelation = function(object, interestingColumns) {
        this.externalColumns.push(new TableRelation(self.table, object.sourceColumn, object.targetTable, object.targetReferenceColumn, interestingColumns))
    }

    /**
     * add a TableRelation to externalColumns array
     * @param {TableRelation} tableRelation to be added
     */
    this.addForeignKey = function (tableRelation) {
        this.externalColumns.push(tableRelation);
    }

    /**
     * create and return a tableRelation with sourceColumn
     * @param sourceColumn sourceColumn to be set in new TableRelation
     * @returns {TableRelation} a new TableRelation with set sourceColumn
     */
    this.foreignKey = function (sourceColumn) {
        var tableRelation = new TableRelation(self.table);
        tableRelation.sourceColumn = sourceColumn;

        return tableRelation;
    }

    /**
     * generate querystring from all given columns and relations
     * @param queryType {String} type of query ['select'|'delete'] etc
     * @returns {string}
     */
    this.generateQuery = function(queryType) {
        var query = queryType + ' ';


        // if no internal nor external columns where given, simply select everything from table
        if(this.internalColumns.length == 0 && this.externalColumns.length == 0)
            return query + '* from ' + this.table;

        // generate query for internal colums
        for(var i = 0; i < this.internalColumns.length; i++)
            query += this.internalColumns[i] + ', ';

        // if no external columns where given we are done
        if(this.externalColumns.length == 0)
            return query.substring(0, query.length-2) + ' from ' + this.table;

        // add select part for external columsn
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

        // add neccessary joins for external columns
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
