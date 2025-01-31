import { ContentPlugin } from '@engine/plugins/plugin.types';
import { MagicOnNPCAction } from '@engine/action';
import { CombatSpell, SPELLS_BY_ID } from '@plugins/combat/magic/config/normal-spells.constants';
import { Npc, Player } from '@engine/world/actor';
import { QueueType } from '@engine/world/actor/tick-queue';
import { colors, colorText } from '@engine/util';

const SPLASH_GFX = 85; // 339
const CAST_ANIMATION = 711;


async function initMagic(details: MagicOnNPCAction) {
    const { player, buttonId, npc } = details;
    console.log(player.delayManager.isDelayed());
    // console.log('initMagic', details);
    // throw new Error('This is an error');
    const spell = SPELLS_BY_ID[buttonId];

    if (spell == null) {
        console.error(`Unhandled spell id: ${buttonId}`);
        return;
    }

    if (player.position.distanceBetween(npc.position) > 10) {
        // Wait until the player is in range.
        player.sendMessage('TOO FAR BRUH');
        return;
    }

    if (player.skills.magic.level < spell.level) {
        player.sendMessage(
            'You do not have a high enough magic level to cast this spell.',
        );
        return;
    }


    const isInstant = !player.tickQueue.globalTimer.isActive();


    // TODO: do we still walk????
    player.face(npc, true, false, false);

    // if (!isInstant) {
    // try {
    //     console.log("I AM WAITING");
    //     await player.requestTickDelay(isInstant ? 2 : 2, { type: QueueType.WEAK })
    //     console.log("I AM DONE");
    //
    // } catch (error) {
    //     console.log(error)
    // }
    // // }
    return castSpell(player, npc, spell);

    // wait for next attack

}


const castSpell = async (player: Player, npc: Npc, spell: CombatSpell) => {
    console.log("I AM CASTING")
    player.playAnimation({ id: CAST_ANIMATION, delay: 20 });
    player.playGraphics({ id: spell.startGfx, delay: 20, height: 100 });
    // calc damage
    const damage = Math.round(Math.random() * spell.maxHit);
    const attackerX = player.position.x;
    const attackerY = player.position.y;
    const victimX = npc.position.x;
    const victimY = npc.position.y;
    const offsetX = victimY - attackerY;
    const offsetY = victimX - attackerX;

    //npc world index would be -1 for players
    player.outgoingPackets.sendProjectile(
        player.position,
        offsetX,
        offsetY,
        spell.projectileGfx,
        43,
        31,
        80,
        npc.worldIndex + 1,
        65,
    );
    try {

        // player.delayManager.applyDelay(4);
        await player.requestTickDelay(4, { type: QueueType.NORMAL });

        player.skills.magic.addExp(spell.baseExperience + damage * 2);
        player.skills.hitpoints.addExp(damage * 1.33);
        npc.playGraphics({ id: spell.endGfx, delay: 0, height: 100 });
        player.sendMessage(colorText(`You hit something for ${damage} damage`, colors.red));
        npc.hit(player, damage);

        // player.stopAnimation();
        // await player.requestTickDelay(4, { type: QueueType.NORMAL, useGlobalTimer: true })
        // return
    } catch (e) {
        player.sendMessage(e);
    }

    // do damage
    // splat

    // rerun
}

export default <ContentPlugin>{
    pluginId: 'rs:magic_normal-spells',
    hooks: {
        type: 'magic_on_npc',
        widgetId: 192,
        buttonIds: Object.keys(SPELLS_BY_ID).map((i) => Number.parseInt(i)),
        handler: async (details) => initMagic(details),
        walkTo: false,
        // task: {
        //     activate,
        //     interval: 1,
        // },
    },
};
