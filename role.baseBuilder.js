// The baseBuilder (Beta)
module.exports = {
    run(creep) {
        //First we import functions
        var funcz = require('functions.inc');
        
        //Now init any null memories to defaults for this role
        if (!creep.memory.state) { creep.memory.state = 'TransferNow'; }
        if (!creep.memory.task) { creep.memory.task = 'MoveTo'; }
        
        //////////////////
        //State Machinery
        switch(creep.memory.state) {
            case 'TransferNow': {
                //Do TransferNow
                //Builders may now only get their energy from CONTAINERS (and later storages)
                if (creep.spawning) { break; }
                if ( _.sum(creep.carry) < creep.carryCapacity ) {
                    var roomContainers = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0 || (structure.structureType == STRUCTURE_STORAGE && structure.store.energy > 0 ) )) } });
                    if ( roomContainers.length == 0 ) { creep.memory.state = 'HuddleNow'; break; }
                    var thisSource = funcz.chooseClosest(roomContainers,creep);
                    let result = thisSource.transfer(creep,RESOURCE_ENERGY);
                    switch(result) {
                        case ERR_NOT_IN_RANGE: {
                            creep.moveTo(thisSource,{reusePath:10});
                            creep.memory.task = 'moveTo';
                            break;
                        } 
                        case ERR_BUSY: {
                            console.log(creep.name+": Energy Transfer Returned BUSY");
                            break;
                        }
                        case OK: { creep.memory.task = 'Transferring';break; }
                        default: {
                            console.log(creep.name+": Energy Transfer Returned "+result);
                            break;
                        }
                    }
                } else {
                    // We are FULL.
                    creep.memory.state = 'BuildNow';
                    creep.memory.task = 'moveTo';
                }
                break;
            }
            case 'BuildNow': {
                //Do buildNow
                if (creep.spawning) { break; }
                var roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                // console.log("ConSites" + roomConstructionSites.length);
                if (  roomConstructionSites.length == 0 ) {creep.memory.state = 'RepairNow';break;}
                var thisOneClosest = funcz.chooseClosest(roomConstructionSites,creep);
                let result = creep.build(thisOneClosest);
                switch(result) {
                    case ERR_NOT_IN_RANGE: {
                        creep.moveTo(thisOneClosest,{reusePath:10});
                        creep.memory.task = 'moveTo';
                        break;
                    } 
                    case ERR_BUSY: {
                        console.log(creep.name+": Build Returned BUSY");
                        break;
                    }
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'TransferNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case OK: { creep.memory.task = 'Building';break; }
                    default: {
                        console.log(creep.name+": Build Returned "+result);
                        break;
                    }
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'TransferNow';creep.say('I\'m Empty!');}
                break;
            }
            case 'RepairNow': {
                //Do RepairNow
                if (creep.spawning) { break; }
                var roomStructures = creep.room.find(FIND_MY_STRUCTURES);
                // console.log("Structures: " + roomStructures.length);
                var roomContainers = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_CONTAINER || (structure.structureType == STRUCTURE_STORAGE ))) } });
                var roomRoads = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_ROAD )) } });
                for (var psh in roomContainers ) {
                    roomStructures.push(roomContainers[psh]);
                }
                for (var psh in roomRoads ) {
                    roomStructures.push(roomContainers[psh]);
                }
                // console.log("Containers: " + roomContainers.length);
                // console.log("Total: "+roomStructures.length);
                let needRepairs = [];
                if (roomStructures.length == 0) { break;}
                for (var q in roomStructures) {
                    // console.log(JSON.stringify(roomStructures[q]));
                    // console.log("StructureType: "+roomStructures[q].structureType);
                    // console.log("Health: "+roomStructures[q].hits + " of " + roomStructures[q].hitsMax );
                    // console.log("My? -> "+roomStructures[q].my ); //(no these are undef)
                if ( !roomStructures[q].hits ) { continue; }
                    if ( roomStructures[q].hits < (roomStructures[q].hitsMax * 0.75) ) {
                        needRepairs.push(roomStructures[q]);
                    }
                }
                // console.log("Structures Needing Repairs: "+needRepairs.length);
                if (needRepairs.length == 0) { break;}
                var thisOneClosest = funcz.chooseClosest(needRepairs,creep);
                let result = creep.repair(thisOneClosest);
                switch(result) {
                    case ERR_NOT_IN_RANGE: {
                        creep.moveTo(thisOneClosest,{reusePath:10});
                        creep.memory.task = 'moveTo';
                        break;
                    } 
                    case ERR_BUSY: {
                        console.log(creep.name+": Repair Returned BUSY");
                        break;
                    }
                    case ERR_INVALID_TARGET: {
                        console.log(creep.name+": Repair Returned ERR_INVALID_TARGET for"+thisOneClosest);
                        creep.memory.state = "BuildNow";
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'TransferNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case OK: { creep.memory.task = 'Repairing';break; }
                    default: {
                        console.log(creep.name+": Repair Returned "+result);
                        break;
                    }
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'TransferNow';creep.say('I\'m Empty!');}
                break;
            }
            case 'HuddleNow': {
                //Do RepairNow
                if (creep.spawning) { break; }
                if ( !Game.flags['huddle'] ) { creep.memory.state = 'TransferNow'; }
                let result = creep.moveTo(Game.flags['huddle']);
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'TransferNow';}
                break;
            }
            default: { creep.memory.state = 'TransferNow';break;}
        }
        //
        // End Switch(state)
    }
};