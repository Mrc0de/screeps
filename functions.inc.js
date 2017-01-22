/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('functions.inc');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    distance(thing,verbose) {
        var report = "";
        var retVal = null;
        //before return, report if verbose
        if ( verbose ) {
            console.log(report);
            console.log("Distance: "+ retVal);
        }
        return retVal;
    }, 
    report(thing) {
        var report = "";
        report += "---------------\n";
        report += "---------------\n";
        report += "Report For "+  thing + "\n";
        if (thing.structureType != null) {
            report += "Type: STRUCTURE\n";
        } else if ( thing instanceof Creep ) {
            report += "Type: CREEP\n";
        }
        report += "ID: " + thing.id + "\n";
        report += "~~~~~~~~~~\n";
        report += "STRINGIFIED:\n" + JSON.stringify(thing) + "\n";
        report += "~~~~~~~~~~\n";
        
        console.log(report);
    }
};