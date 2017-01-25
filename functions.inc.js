// Functions.inc
module.exports = {
    
    distance(thingOne,thingTwo,verbose=0) {
        let report = "___\nThingOne: "+thingOne+"\nThingTwo: "+thingTwo+"\n___";
        let retVal = thingOne.pos.RangeTo(thingTwo);
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
        //Choose Closest of target. No Exceptions.
        let choiceA = targets[0];
        let choice = choiceA;
        for(var t in targets) {
            choiceA = choice;
            if ( targets[t] == choiceA ) { continue;}
            let choiceB = targets[t];
            // console.log(creep.name+"~~~\n"+creep.name+": Choice A: "+choiceA);
            // console.log(creep.name+": Choice B:"+ choiceB);
            let rangeA = creep.pos.getRangeTo(choiceA);
            let rangeB = creep.pos.getRangeTo(choiceB);
            // console.log(creep.name+": Choice A RangeTo Creep: "+rangeA);
            // console.log(creep.name+": Choice B RangeTo Creep: "+rangeB);
            choice = rangeA < rangeB ? choiceA : choiceB;
            // console.log(creep.name+": Closest is "+ choice+"\n~~~\n");
        }
        // console.log(chosen+" is closest");
        return choice;
    },
    chooseMostEnergy(targets,creep) {
        //Choose The SOURCE with the Most Energy (does not include containers,etc..)
        //EXCEPTION: If they are already harvesting here, dont switch until finished (stick to closest)
        var fz = require('functions.inc');
        let choiceA = targets[0];
        let choice = choiceA; 
        for(var t in targets) {
            choiceA = choice;
            if ( targets[t] == choiceA ) {continue;}
            let choiceB = targets[t];
            // console.log("---\nChoice A: "+choiceA);
            // console.log("Choice B:"+ choiceB);
            let energyA = choiceA.energy ;
            let energyB = choiceB.energy ;
            let diff = Math.abs(energyA - energyB);
            // console.log("Energy Choice A: "+energyA);
            // console.log("Energy Choice B:"+energyB);
            // console.log("Difference: "+diff);
            choice = energyA > energyB ? choiceA : choiceB;
            choice = energyA == energyB ? fz.chooseClosest(targets,creep) : choice;
            choice = creep.memory.task == 'Harvesting' ? fz.chooseClosest(targets,creep) : choice;
            // console.log("Choosing "+choice+"\n---\n");
        }
        return choice;
    },
    chooseLeastEnergy(targets,creep) {
        //Choose The SOURCE with the Most Energy (does not include containers,etc..)
        //EXCEPTION: If they are already harvesting here, dont switch until finished (stick to closest)
        var fz = require('functions.inc');
        let choiceA = targets[0];
        let choice = choiceA; 
        for(var t in targets) {
            choiceA = choice;
            if ( targets[t] == choiceA ) {continue;}
            let choiceB = targets[t];
            // console.log("---\nChoice A: "+choiceA);
            // console.log("Choice B:"+ choiceB);
            let energyA = choiceA.energy ;
            let energyB = choiceB.energy ;
            let diff = Math.abs(energyA - energyB);
            // console.log("Energy Choice A: "+energyA);
            // console.log("Energy Choice B:"+energyB);
            // console.log("Difference: "+diff);
            choice = energyA < energyB ? choiceA : choiceB;
            choice = energyA == energyB ? fz.chooseClosest(targets,creep) : choice;
            choice = creep.memory.task == 'Harvesting' ? fz.chooseClosest(targets,creep) : choice;
            // console.log("Choosing "+choice+"\n---\n");
        }
        return choice;
    }
};