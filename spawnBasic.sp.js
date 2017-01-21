// Spawn Basic dot sp (spawn)
module.exports = {
    run(StructureSpawn) {
        if (StructureSpawn.energy >= (StructureSpawn.energyCapacity * 1) ) {
            // console.log(StructureSpawn.name +": Spawn Report");
            // console.log(StructureSpawn.name +": Energy/Max - "+StructureSpawn.energy+'/'+StructureSpawn.energyCapacity);
            // console.log(StructureSpawn.name +": Full");
            for(var creepz in Game.creeps) {
                // console.log(creepz + " Will Die In " +Game.creeps[creepz].ticksToLive);
            }
            var harvestersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'harvester'} }}).length;
            var upgradersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'upgrader'} }}).length;
            var baseBuildersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'baseBuilder'} }}).length;
            // console.log("Structure Room: " + StructureSpawn.room.name );
            console.log("Harvesters in this room: "+ harvestersThisRoom);
            console.log("Upgraders in this room: "+ upgradersThisRoom);
            console.log("Builders in this room: "+ baseBuildersThisRoom);
            if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && harvestersThisRoom < 10 ) {
                console.log(StructureSpawn.name +": Creating Harvester Role Creep ("+harvestersThisRoom+ " Exist)");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'harvester'});
            } else if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && upgradersThisRoom < 10 ) {
                console.log(StructureSpawn.name +": Creating Upgrader Role Creep");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'upgrader'});
            } else if ( StructureSpawn.canCreateCreep([WORK,MOVE,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && baseBuildersThisRoom < 5 ) {
                console.log(StructureSpawn.name +": Creating baseBuilder Role Creep");
                StructureSpawn.createCreep([WORK,MOVE,CARRY,MOVE,MOVE],null,{role:'baseBuilder'});
            } else if ( StructureSpawn.canCreateCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && baseBuildersThisRoom < 10 ) {
                //baseBuilderTURBO
                console.log(StructureSpawn.name +": Creating baseBuilder (e400Faster) Role Creep");
                StructureSpawn.createCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE],null,{role:'baseBuilder'});
            } else {
                // console.log(StructureSpawn.name + ": Not making a damn thing..");
            }
        }
        
    }
};