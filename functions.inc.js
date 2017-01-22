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
        report += "ID: " + thing.id + "\n";
        report += "Room: "+ thing.room.name + "\n";
        if (thing.structureType != null) {
            report += "Type: STRUCTURE\n";
        } else if ( thing instanceof Creep ) {
            report += "Type: CREEP\n";
            report += "Name: " + thing.name + "\n";
            report += "Body: [";
            for(var b in thing.body ) {
                report += " " + thing.body[b].type + " ";
            }
            report += "]\n";
            report += "ticksToLive: "+ thing.ticksToLive + "\n";
            report += "Carrying Energy: "+ thing.carry.energy + "/" + thing.carryCapacity + "\n";
            report += "Owner: "+ thing.owner.username + "\n";
            report += "------\nMEMORY\n-----\n"
            report += "role: " + thing.memory.role + "\n";
            report += "state: " + thing.memory.state + "\n";
            report += "task: " + thing.memory.task + "\n";
        }
        report += "~~~~~~~~~~\n";
        report += "STRINGIFIED:\n" + JSON.stringify(thing) + "\n";
        report += "~~~~~~~~~~\n";
        report += "STRINGIFIED Memory:\n" + JSON.stringify(thing.memory ) + "\n";
        report += "~~~~~~~~~~\n";
        console.log(report);
    },
    chooseClosest(targets,creep) {
        chosen = targets[0];
        for(var t in targets) {
            // console.log(JSON.stringify(targets));
            // console.log(targets[t]);
            var r = creep.pos.getRangeTo(targets[t].pos);
            if (r < creep.pos.getRangeTo(chosen).pos) {
                chosen = targets[t];
            }
        }
        // console.log(chosen+" is closest");
        return chosen;
    },
    chooseMostEnergy(targets,creep) {
        var fz = require('functions.inc');
        chosen = targets[0];
        for(var t in targets) {
            if ( targets[t].id  == chosen.id   ) {continue;}
            // console.log(chosen + "vs" + targets[t]);
            // console.log(JSON.stringify(targets));
            // console.log(targets[t]);
            var r = targets[t].energy;
            var diff = (r - chosen.energy);
            // console.log("Difference: "+diff);
            // console.log("r = "+ r+" chosen = "+chosen.energy);
            
            if ((r > chosen.energy) && Math.abs(diff) > 50) {
                
                if (  _.sum(creep.carry) == 0 ) {
                    var oldChoice = chosen;
                    chosen = targets[t];
                    // console.log(creep.name+": Range To Source: "+ creep.pos.getRangeTo(chosen)  + " vs "+creep.pos.getRangeTo(oldChoice));
                    // console.log("Choosing: "+chosen+" over " +oldChoice);
                } else {
                    //stay here with CLOSEST
                    var oldChoice = chosen;
                    chosen = fz.chooseClosest(targets,creep);
                    // console.log("Staying: "+chosen+" oldChoice: " +oldChoice);
                }
                
            } else if ( r == chosen.energy) {
                var oldChoice=chosen;
                chosen = fz.chooseClosest(targets,creep);
                // console.log("Choosing: "+chosen+" over " +oldChoice+" (EQUAL so Closest)");
            } else if ( r < chosen.energy) {
                // chosen = chosen;
                // console.log("Choosing: "+chosen+" over " +targets[t]+" (Has More)");
            } else {
                var oldChoice = chosen;
                chosen = fz.chooseClosest(targets,creep);
                // console.log("Choosing: "+chosen+" over " +oldChoice+" (Defaulted to Closest)");
            }
        }
        // console.log(chosen+" Has The Most Energy: "+chosen.energy);
        return chosen;
    }
};