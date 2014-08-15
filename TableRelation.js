/**
 * @author TPei
 * created: 15/08/14.
 */

/**
 * a TableRelation represents the relation of one table to another
 * @param sourceTable (the table which holds the column referencing another table)
 * @param sourceColumn (the column in the source table which references the other table (usually something like targetTable_id))
 * @param targetTable (the referenced table)
 * @param targetReferenceColumn (the column in the target table which is referenced by the source column (usually id))
 * @param interestingColumns (the columns I want returned when fetching the data from the referenced table)
 * @constructor
 */
var TableRelation = function(sourceTable, sourceColumn, targetTable, targetReferenceColumn, interestingColumns) {
    this.sourceTable = sourceTable;
    this.sourceColumn = sourceColumn;
    this.targetTable = targetTable;
    this.targetReferenceColumn = targetReferenceColumn;
    this.interestingColumns = interestingColumns;
}

module.exports = TableRelation;