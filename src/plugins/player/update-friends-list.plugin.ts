import type { playerInitActionHandler } from '@engine/action/pipe/player-init.action';
import { PrivateMessaging } from '@engine/world/actor/player/private-messaging';

export const handler: playerInitActionHandler = ({ player }) => {
    PrivateMessaging.playerLoggedIn(player);
    player.outgoingPackets.sendFriendServerStatus(2);
};

export default {
    pluginId: 'rs:update_friends_list',
    hooks: [{ type: 'player_init', handler }],
};
