// The Upgrader (Alpha)
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
        //State Machinez
        switch(state) {
            case 'Harvest': {
                // console.log(creep.name + " Is Carrying: "+_.sum(creep.carry)+" Total Of Max "+creep.carryCapacity);
                if ( _.sum(creep.carry) < creep.carryCapacity) {
                    // console.log(creep.name + " Empty!");
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(sources[0]);
                       creep.say("goHarvest");
                    }
                } else  if ( _.sum(creep.carry) == creep.carryCapacity) {
                    // We are FULL.
                    creep.say('upgrade');
                    creep.memory['state'] = 'upgradeController';
                }
                break;
            }
            case 'upgradeController': {
                var roomControllers = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER } } );
                // console.log('Creeps Room has '+roomControllers.length+' Spawns available');
                if(creep.upgradeController(roomControllers[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roomControllers[0]);
                    creep.say("goUpgrade");
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'Harvest';creep.say('More!');}
                break;
            }
        }
        //
        // End Switch(state)
    }
    
};