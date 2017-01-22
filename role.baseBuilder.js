// The baseBuilder (Beta)
module.exports = {
    run(creep) {
        //First we import functions
        var funcz = require('functions.inc');
        
        //Now init any null memories to defaults for this role
        if (!creep.memory.state) { creep.memory.state = 'HarvestNow'; }
        if (!creep.memory.task) { creep.memory.task = 'MoveTo'; }
        
        //////////////////
        //State Machinery
        switch(creep.memory.state) {
            case 'HarvestNow': {
                //Do harvestNow
                if (creep.spawning) { break; }
                if ( _.sum(creep.carry) < creep.carryCapacity ) {
                    var sources = creep.room.find(FIND_SOURCES);
                    var thisSource = funcz.chooseMostEnergy(sources,creep);
                    let result = creep.harvest(thisSource);
                    switch(result) {
                        case ERR_NOT_IN_RANGE: {
                            creep.moveTo(thisSource);
                            creep.memory.task = 'moveTo';
                            break;
                        } 
                        case ERR_BUSY: {
                            console.log(creep.name+": Harvest Returned BUSY");
                            break;
                        }
                        case OK: { creep.memory.task = 'Harvesting';break; }
                        default: {
                            console.log(creep.name+": Harvest Returned "+result);
                            break;
                        }
                    }
                } else {
                    // We are FULL.
                    creep.memory.state = 'buildNow';
                    creep.memory.task = 'moveTo';
                }
                break;
            }
            case 'buildNow': {
                //Do buildNow
                if (creep.spawning) { break; }
                var roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                var thisOneClosest = funcz.chooseClosest(roomConstructionSites,creep);
                let result = creep.build(thisOneClosest);
                switch(result) {
                    case ERR_NOT_IN_RANGE: {
                        creep.moveTo(thisOneClosest);
                        creep.memory.task = 'moveTo';
                        break;
                    } 
                    case ERR_BUSY: {
                        console.log(creep.name+": Build Returned BUSY");
                        break;
                    }
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'HarvestNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case OK: { creep.memory.task = 'Building';break; }
                    default: {
                        console.log(creep.name+": Build Returned "+result);
                        break;
                    }
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