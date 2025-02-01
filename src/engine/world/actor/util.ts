import type { Actor } from './actor';
import type { Npc } from './npc';
import type { Player } from './player/player';

export const isPlayer = (actor: Actor): actor is Player => actor.type === 'player';
export const isNpc = (actor: Actor): actor is Npc => actor.type === 'npc';
