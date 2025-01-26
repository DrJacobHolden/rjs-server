import { TaskExecutor } from '@engine/action';
import {
    AttackAction,
    AttackActionHook,
} from '@engine/action/pipe/attack.action';
import { findItem } from '@engine/config';
import { animationIds } from '@engine/world/config';
import { logger } from '@runejs/common';

export const activate = (task: TaskExecutor<AttackAction>) => {
    const { npc, player } = task.actionData;

    let attackAnimation: number = animationIds.combat.punch;

    const weapon = player.getEquippedItem('main_hand');
    if (weapon) {
        const itemDetails = findItem(weapon.itemId);
        if (!itemDetails) {
            logger.error(
                `Failed to find item details for item id: ${weapon.itemId}`,
            );
            return task.stop();
        }
        attackAnimation = getWeaponAnimation(itemDetails.name);
    }

    if (player.position.distanceBetween(npc.position) > 2) {
        return;
    }

    // Here we gooooooo! 🚀
    if (task.session.targetLock == null) {
        const targetLock = npc.maybeGetTargetLock(1600);
        if (!targetLock) {
            player.sendMessage('Unable to acquire target lock.');
            return task.stop();
        }

        task.session.targetLock = targetLock;
        task.session.combatTick = 0;

        player.face(npc, true, false, true);

        player.playAnimation(attackAnimation);
        return;
    }

    task.session.combatTick++;

    if (task.session.combatTick === 2) {
        // TODO: Calculate max-hit accurately
        const hit = Math.round(Math.random() * 10);

        // TODO: Set the correct skill based on attack style.
        player.skills.attack.addExp(hit * 4);

        npc.hit(task.session.targetLock, player, hit);

        // Reset target lock after use.
        task.session.targetLock = null;
    }
};

export default {
    pluginId: 'rs:combat',
    hooks: {
        type: 'attack',
        task: {
            activate,
            interval: 1,
        },
    } as AttackActionHook,
};

// Shamelessly ripped from Project Insanity.
const getWeaponAnimation = (inputWeaponName: string) => {
    const weaponName = inputWeaponName.toLowerCase();

    if (
        weaponName.includes('knife') ||
        weaponName.includes('dart') ||
        weaponName.includes('javelin') ||
        weaponName.includes('thrownaxe')
    ) {
        return 806;
    }
    if (weaponName.includes('halberd')) {
        return 440;
    }
    if (weaponName.startsWith('dragon dagger')) {
        return 402;
    }
    if (weaponName.endsWith('dagger')) {
        return 412;
    }
    if (
        weaponName.includes('2h sword') ||
        weaponName.includes('godsword') ||
        weaponName.includes('saradomin sword')
    ) {
        return 4307;
    }
    if (weaponName.includes('sword')) {
        return 451;
    }
    if (weaponName.includes('bow') && !weaponName.includes("'bow")) {
        return 426;
    }
    if (weaponName.includes("'bow")) {
        return 4230;
    }
    if (weaponName.includes('toktz-xil-ul')) {
        return 2614;
    }
    if (weaponName.includes('granite maul')) {
        return 1665;
    }
    if (weaponName.includes('guthan')) {
        return 2080;
    }
    if (weaponName.includes('torag')) {
        return 0x814;
    }
    if (weaponName.includes('dharok')) {
        return 2067;
    }
    if (weaponName.includes('ahrim')) {
        return 406;
    }
    if (weaponName.includes('verac')) {
        return 2062;
    }
    if (weaponName.includes('karil')) {
        return 2075;
    }
    if (weaponName.includes('whip')) {
        return 1658;
    }
    if (weaponName.includes('Tzhaar-ket-om')) {
        return 2661;
    }
    return 451;
};
