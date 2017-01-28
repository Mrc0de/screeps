// The Upgrader (Beta)
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
                if (creep.spawning) { break; }
                if ( _.sum(creep.carry) < creep.carryCapacity) {
                    // console.log(creep.name + " Empty!");
                    var sources = creep.room.find(FIND_SOURCES);
                    var bestSource = funcz.chooseLeastEnergy(sources,creep);
                    var roomContainers = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 50 )) } });
                    // console.log("Containers: "+ roomContainers.length);
                    roomContainers.push(bestSource);
                    var bestest = (funcz.chooseClosest(roomContainers,creep));
                    // console.log(creep.name+": Bestest: "+ bestest);
                    if (bestest.structureType != STRUCTURE_CONTAINER) {
                        let result = creep.harvest(bestest);
                        switch(result){
                            case ERR_NOT_IN_RANGE:{
                                creep.moveTo(bestest,{reusePath:10});
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
                        let result = bestest.transfer(creep,RESOURCE_ENERGY);
                        switch(result){
                            case ERR_NOT_IN_RANGE:{
                                creep.moveTo(bestest,{reusePath:10});
                                break;
                            }
                            case ERR_BUSY: {
                                console.log(creep.name+": Transfer Energy Returned BUSY");
                                break;
                            }
                            case OK: { creep.memory.task = 'Transfering';break; }
                            default: {
                                console.log(creep.name+": Transfer Returned "+result);
                                break;
                            }
                        }
                    }
                } else {
                    // We are FULL.
                    creep.memory['state'] = 'upgradeController';
                    creep.memory.task = 'MoveTo';
                }
                break;
            }
            case 'upgradeController': {
                if (creep.spawning) { break; }
                var roomTowers = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return ( structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity * 0.75 ))} } );
                if ( roomTowers.length > 0 ) { creep.memory.state = 'FillTower'; creep.memory.task = 'moveTo'; }
                var roomControllers = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER } } );
                // console.log('Creeps Room has '+roomControllers.length+' Spawns available');
                var closestController = funcz.chooseClosest(roomControllers,creep);
                let result = creep.upgradeController(closestController);
                switch(result){
                    case ERR_NOT_IN_RANGE:{
                        creep.moveTo(closestController,{reusePath:10});
                        break;
                    }
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'HarvestNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case ERR_BUSY: {
                        console.log(creep.name+": Upgrading "+closestController+" Returned BUSY");
                        break;
                    }
                    case OK: { creep.memory.task = 'Upgrading';break; }
                    default: {
                        console.log(creep.name+": Upgrading "+closestController+" Returned "+result);
                        break;
                    }
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'HarvestNow';creep.say('More!');}
                break;
            }
            case 'FillTower': {
                if (creep.spawning) { break; }
                var roomTowers = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return ( structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity * 0.75 ))} } );
                var closestTower = funcz.chooseClosest(roomTowers,creep);
                let result = creep.transfer(closestTower,RESOURCE_ENERGY);
                switch(result){
                    case ERR_NOT_IN_RANGE:{
                        creep.moveTo(closestTower,{reusePath:10});
                        break;
                    }
                    case ERR_NOT_ENOUGH_ENERGY: { 
                        creep.memory.state = 'HarvestNow';
                        creep.memory.task = 'moveTo';
                        break;
                    }
                    case ERR_BUSY: {
                        console.log(creep.name+": Filling Tower "+closestTower+" Returned BUSY");
                        break;
                    }
                    case OK: { creep.memory.task = 'FillingTower';break; }
                    default: {
                        console.log(creep.name+": Filling Tower "+closestTower+" Returned "+result);
                        break;
                    }
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'HarvestNow';creep.say('More!');}
                break;   
            }
        }
        //
        // End Switch(state)
    }
    
};