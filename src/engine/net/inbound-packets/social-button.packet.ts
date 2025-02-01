import type { PacketData } from '@engine/net/inbound-packet-handler';
import type { Player } from '@engine/world/actor/player/player';
import { PrivateMessaging } from '@engine/world/actor/player/private-messaging';

export default {
    opcode: 32,
    size: 3,
    handler: (player: Player, packet: PacketData) => {
        const { buffer } = packet;

        const currentPrivateChatMode = player.settings.privateChatMode;

        player.settings.publicChatMode = buffer.get('byte');
        player.settings.privateChatMode = buffer.get('byte');
        player.settings.tradeMode = buffer.get('byte');

        if(currentPrivateChatMode !== player.settings.privateChatMode) {
            PrivateMessaging.playerPrivateChatModeChanged(player);
        }
    }
};
