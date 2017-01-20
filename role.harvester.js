// The Harvester (Alpha)
module.exports = {
    run(creep) {
        creep.say(creep.name);    //tard mode
        if (!creep.memory['state'] ) {
            creep.say('Harvest');
            creep.memory['state'] = 'Harvest';
        } else {
            creep.say(creep.memory['state']);
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
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(sources[0]);
                       creep.say("goHarvest");
                    }
                } else {
                    // We are FULL.
                    var roomSpawns = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } } );
                    // console.log('Creeps Room has '+roomSpawns.length+' Spawns available');
                    if(creep.transfer(roomSpawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomSpawns[0]);
                        creep.say("goSpwnDROP");
                    } 
                    
                }
                break;
            }
        }
        //
        // End Switch(state)
    },
    pr(creep) {
        creep.say("PRHI");
    }
    
};