// The Harvester (Beta)
module.exports = {
    run(creep) {
        //First we import functions
        var funcz = require('functions.inc');
        
        //Now init any null memories to defaults for this role
        if (!creep.memory.state) { creep.memory.state = 'HarvestNow'; }
        if (!creep.memory.task) { creep.memory.task = 'MoveTo'; }
        
        ////////////////
        //State Machinery
        switch(creep.memory.state ) {
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
                    creep.memory.state = 'unloadNow';
                    creep.memory.task = 'moveTo';
                }
                break;
            }
            case 'unloadNow': {
                //Do unloadNow
                if (creep.spawning) { break; }
                var roomSpawns = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN )  && (structure.energy < structure.energyCapacity ))}});
                var roomContainers = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity )) } });
                for (var p in roomContainers) {
                    roomSpawns.push(roomContainers[p]);
                }
                // for (var pp in roomSpawns) {
                    // console.log(creep.name+": Structure " + roomSpawns[pp].id+ " - " + roomSpawns[pp].structureType + " Eligible Drop Point.");
                // }
                // console.log("Spawns+Containers+Extensions: "+ roomSpawns.length);
                var thisOneClosest = funcz.chooseClosest(roomSpawns,creep);
                // console.log(creep.name+": "+ thisOneClosest+" is closest drop. Type: "+thisOneClosest.structureType);
                let result = creep.transfer(thisOneClosest, RESOURCE_ENERGY);
                switch(result) {
                    case ERR_NOT_IN_RANGE:{
                        creep.moveTo(thisOneClosest);
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case OK: { creep.memory.task = 'unloading';break;}
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'HarvestNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case ERR_BUSY: {
                        console.log(creep.name+": Transfer Energy To "+thisOneClosest+" Returned BUSY");
                        break;
                    }
                    default: {
                        console.log(creep.name+": Transfer Energy To "+thisOneClosest+" Returned "+result);
                        break;
                    }
                }
                break;
            }
        }
        //
        // End Switch(state)
        
    } // END Run(creep)
    
};