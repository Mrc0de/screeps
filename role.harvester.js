// The Harvester (Alpha)
module.exports = {
    run(creep) {
        
        if (!creep.memory['state'] ) {
            // creep.say('Harvest');
            creep.memory['state'] = 'Harvest';
        } else {
            // creep.say(creep.memory['state']);
        }
        var state = creep.memory['state'];
        
        ////////////////
        //Overdid it...
        switch(state) {
            case 'Harvest': {
                //Verbosity ftw (and the lag)
                // console.log(creep.name + " Is Carrying: "+_.sum(creep.carry)+" Total Of Max "+creep.carryCapacity);
                if ( _.sum(creep.carry) < creep.carryCapacity ) {
                    // console.log(creep.name + " NEEDS MORE!");
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(chooseMostEnergy(sources)) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(chooseMostEnergy(sources));
                    //   creep.say("goHarvest");
                    }
                } else {
                    // We are FULL.
                    var roomSpawns = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)  && structure.energy < structure.energyCapacity)}});
                    // console.log('Creeps Room has '+roomSpawns.length+' Non Full Spawns/Exts available');
                    if(creep.transfer(chooseClosest(roomSpawns,creep), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(chooseClosest(roomSpawns,creep));
                        // creep.say("goSpwnDROP");
                    } 
                    
                }
                break;
            }
        }
        //
        // End Switch(state)
        function chooseClosest(targets,creep) {
            chosen = targets[0];
            for(var t in targets) {
                // console.log(JSON.stringify(targets));
                // console.log(targets[t]);
                var r = creep.pos.getRangeTo(targets[t]);
                if (r < creep.pos.getRangeTo(chosen)) {
                    chosen = targets[t];
                }
            }
            // console.log(chosen+" is closest");
            return chosen;
        }
        function chooseMostEnergy(targets) {
            chosen = targets[0];
            for(var t in targets) {
                // console.log(JSON.stringify(targets));
                // console.log(targets[t]);
                var r = targets[t].energy;
                if (r > chosen.energy) {
                    chosen = targets[t];
                }
            }
            // console.log(chosen+" Has The Most Energy: "+chosen.energy);
            
            return chosen;
        }
    },
    pr(creep) {
        creep.say("PRHI");
    }
    
};