// Spawn Basic dot sp (spawn)
module.exports = {
    run(StructureSpawn) {
        if (StructureSpawn.energy >= (StructureSpawn.energyCapacity * 1) ) {
            // console.log(StructureSpawn.name +": Spawn Report");
            // console.log(StructureSpawn.name +": Energy/Max - "+StructureSpawn.energy+'/'+StructureSpawn.energyCapacity);
            // console.log(StructureSpawn.name +": Full");
            var harvestersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'harvester'} }}).length;
            var upgradersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'upgrader'} }}).length;
            // console.log("Structure Room: " + StructureSpawn.room.name );
            // console.log("Harvesters in this room: "+ harvestersThisRoom);
            // console.log("Upgraders in this room: "+ upgradersThisRoom);
            if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && harvestersThisRoom < 3 ) {
                console.log(StructureSpawn.name +": Creating Harvester Role Creep");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'harvester'});
            } else if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && upgradersThisRoom < 3 ) {
                console.log(StructureSpawn.name +": Creating Upgrader Role Creep");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'upgrader'});
            } else {
                // console.log(StructureSpawn.name + ": Not making a damn thing..");
            }
        }
        
    }
};