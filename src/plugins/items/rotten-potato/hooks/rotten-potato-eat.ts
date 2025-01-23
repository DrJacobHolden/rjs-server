import { itemInteractionActionHandler } from '@engine/action';
import { dialogue, execute } from '@engine/world/actor/dialogue';

enum DialogueOption {
    SET_ALL_STATS = 0,
    WIPE_INVENTORY = 1,
    SETUP_POH = 2,
    TELEPORT_TO_PLAYER = 3,
    SPAWN_AGGRESSIVE_NPC = 4,
}

const eatPotato: itemInteractionActionHandler = async (details) => {
    let chosenOption: DialogueOption;

    await dialogue(
        [details.player],
        [
            (options) => [
                'Set all stats',
                [execute(() => (chosenOption = DialogueOption.SET_ALL_STATS))],
                'Wipe inventory',
                [execute(() => (chosenOption = DialogueOption.WIPE_INVENTORY))],
                'Setup POH',
                [execute(() => (chosenOption = DialogueOption.SETUP_POH))],
                'Teleport to player',
                [
                    execute(
                        () =>
                            (chosenOption = DialogueOption.TELEPORT_TO_PLAYER),
                    ),
                ],
                'Spawn aggressive NPC',
                [
                    execute(
                        () =>
                            (chosenOption =
                                DialogueOption.SPAWN_AGGRESSIVE_NPC),
                    ),
                ],
            ],
        ],
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    switch (chosenOption!) {
        case DialogueOption.SET_ALL_STATS:
            break;
        case DialogueOption.TELEPORT_TO_PLAYER:
            break;
        default:
            break;
    }
};

export default eatPotato;
