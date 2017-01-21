// The baseBuilder (Alpha)
module.exports = {
    run(creep) {
        if (!creep.memory['state'] ) {
            // creep.say('HarvestNow');
            creep.memory['state'] = 'HarvestNow';
        } else {
            // creep.say(creep.memory['state']);
        }
        var state = creep.memory['state'];
        
        ////////////////
        //State Machinez
        switch(state) {
            case 'HarvestNow': {
                // console.log(creep.name + " Is Carrying: "+_.sum(creep.carry)+" Total Of Max "+creep.carryCapacity);
                if ( _.sum(creep.carry) < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(sources[0]);
                       //creep.say("goHarvest");
                    }
                } else  if ( _.sum(creep.carry) == creep.carryCapacity) {
                    // We are FULL.
                    // creep.say('buildNow');
                    creep.memory['state'] = 'buildNow';
                }
                break;
            }
            case 'buildNow': {
                var roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                console.log(creep.name+': My Current Room has '+roomConstructionSites.length+' Construction Sites.');
                if(creep.build(roomConstructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roomConstructionSites[0]);
                    // creep.say("goBuild");
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'HarvestNow';creep.say('I\'m Empty!');}
                break;
            }
            default: { creep.memory.state = 'HarvestNow';break;}
        }
        //
        // End Switch(state)
    }
    
};