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
                    var thisSource = chooseMostEnergy(sources,creep);
                    if(creep.harvest(thisSource) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(thisSource );
                    //   creep.say("goHarvest");
                    }
                } else {
                    // We are FULL.
                    var roomSpawns = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN )  && (structure.energy < structure.energyCapacity ))}});
                    var roomContainers = Game.rooms[creep.room.name].find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity )) } });
                    console.log("Containers: "+ roomContainers.length);
                    for (var p in roomContainers) {
                        // console.log(roomContainers[p]);
                        roomSpawns.push(roomContainers[p]);
                        // console.log ('pushed'+ roomContainers[p]+" For "+roomSpawns.length);
                    }
                    console.log("Spawns+Containers+Extensions: "+ roomSpawns.length);
                    var thisOneClosest = chooseClosest(roomSpawns,creep);
                    console.log(thisOneClosest+" is closest drop. Type: "+thisOneClosest.structureType);
                    if(creep.transfer(thisOneClosest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(thisOneClosest);
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
        function chooseMostEnergy(targets,creep) {
            chosen = targets[0];
            for(var t in targets) {
                // console.log(JSON.stringify(targets));
                // console.log(targets[t]);
                var r = targets[t].energy;
                var diff = Math.abs(r - targets[t].energy);
                if (r > chosen.energy && diff > creep.energyCapacity ) {
                    chosen = targets[t];
                } else if ( r == chosen.energy) {
                    chosen = chooseClosest(targets,creep);
                } else {
                    chosen = chooseClosest(targets,creep);
                }
            }
            // console.log(chosen+" Has The Most Energy: "+chosen.energy);
            return chosen;
        }
    }
    
};