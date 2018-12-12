const Vec3 = require('tera-vec3');

module.exports = function Solodungeon(mod) {
	// No autoreset on this zones
    const blacklist = [9777, 9713, 9916];
	// Autoreset and swap zones
    const whitelist = [9031, 9032];

    let zone, loot, dungeon;
	let enabled = false;
	
    mod.hook('S_LOAD_TOPO', 3, event => {
        zone = event.zone;
        loot = {};
        dungeon = [];

        mod.toServer('C_DUNGEON_COOL_TIME_LIST', 1, {});
    });

    mod.hook('S_DUNGEON_COOL_TIME_LIST', 1, event => {
        dungeon = event.dungeons;
    });
        
    mod.hook('S_SPAWN_ME', 3, event => {
		if(enabled) {
        switch(zone) {
            case 9713: // 奇利安森林
				event.loc = new Vec3(52233, 117319, 4382)
                return true;
            case 9031: // 單人阿卡莎
				event.loc = new Vec3(72424, 133968, -502)
                return true;
            case 9032: // 單人黃金迷宫
				event.loc = new Vec3(28214, 178550, -1675)
                return true;
			case 9777: // 下水道
				event.loc = new Vec3(-112670, -33091, 461)
                return true;
			case 9716: // 飛船
				event.loc = new Vec3(49500, 129289, 3722)
                return true;
			case 9044: // 火神
				event.loc = new Vec3(-100925, 115070, 4022)
				return true;
            default: return;
        }
	}
	});

	// New packet definition which uses gameId instead of Id
    mod.hook('S_SPAWN_DROPITEM', 6, event => {
        if(!(blacklist.indexOf(event.item) > -1)) loot[event.gameId.toString()] = 1;
    });
	// New packet definition which uses gameId instead of Id
    mod.hook('S_DESPAWN_DROPITEM', 4, event => {
        if(event.gameId.toString() in loot) delete loot[event.gameId.toString()];
        if(Object.keys(loot).length < 1 && zone > 9000) Resetinstance();
    });
	// Reset works but no swap if all entries are consumed
    function Resetinstance() {

        if((zone == 9031 || zone == 9032) && whitelist.indexOf(zone) > -1)  mod.toServer('C_RESET_ALL_DUNGEON', 1, null);

    }

	mod.command.add('fly' ,() => {
		enabled = !enabled;
		mod.command.message(`你他媽快 ${enabled ? '<font color="#56B4E9">[開啟]' : '<font color="#E69F00">[關閉]'}`);
	});
}