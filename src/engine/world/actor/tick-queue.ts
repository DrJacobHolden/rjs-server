import { Actor } from '@engine/world/actor/actor';



/**
 * Represents different processing lanes for tick tasks
 */
export enum TickLane {
    /**
     * Default lane for world interaction like skilling and combat
     */
    WORLD_INTERACTION = 'world_interaction',
}


export interface RequestTickOptions {
    /**
     * Number of game ticks to wait
     */
    ticks: number;

    /**
     * If true, prevents other tick requests from being processed while this one is active
     * @default false
     */
    blocking?: boolean;

    /**
     * If true, replaces the current task but maintains its remaining ticks.
     * If no current task exists, starts with the full tick count.
     * @default false
     */
    replace?: boolean;

    /**
     * The lane this task should run in
     * @default TickLane.WORLD_INTERACTION
     */
    lane?: TickLane;
}


export interface TickTask {
    ticks: number;
    promise: Promise<void>;
    resolve: () => void;
    reject: (reason?: any) => void;
    blocking: boolean;
    startTick: number;
    lane: TickLane;
}

/**
 * Manages tick-based timing and scheduling for an Actor.
 *
 * The TickQueue allows actors to schedule actions that should occur after a specific number of game ticks.
 * It automatically handles movement cancellation and supports blocking/replacing existing tasks.
 *
 * Each tick represents 600ms in the game world.
 */
export class TickQueue {
    private tasksByLane: Map<TickLane, TickTask[]> = new Map();
    private currentTick: number = 0;
    private movementSubscription: any;

    /**
     * Creates a new TickQueue for the given actor
     * @param actor The actor this queue belongs to
     */
    constructor(private actor: Actor) {
        Object.values(TickLane).forEach(lane => {
            this.tasksByLane.set(lane, []);
        });
        // Automatically cancel tasks when actor moves
        this.movementSubscription = this.actor.walkingQueue.movementEvent.subscribe(() => {
            this.rejectAllTasks('Movement interrupted action');
        });
    }

    /**
     * Request to wait for a specific number of ticks
     *
     * @param options Configuration options for the tick request
     * @returns Promise that resolves when the ticks have elapsed or rejects if interrupted
     * @throws Error if trying to add a task while a blocking task exists
     *
     * @example
     * ```typescript
     * try {
     *   // Wait 3 ticks with blocking
     *   await actor.tickQueue.requestTicks({ ticks: 3, blocking: true });
     *
     *   // Action after 3 ticks
     *   actor.doSomething();
     * } catch (error) {
     *   // Handle interruption
     * }
     * ```
     */
    public async requestTicks(options: RequestTickOptions): Promise<void> {
        const {
            ticks,
            blocking = false,
            replace = false,
            lane = TickLane.WORLD_INTERACTION
        } = options;

        const laneTasks = this.tasksByLane.get(lane)!;
        let startTick = this.currentTick;
        let remainingTicks = ticks;

        if (replace && laneTasks.length > 0) {
            const currentTask = laneTasks[laneTasks.length - 1];
            const elapsedTicks = this.currentTick - currentTask.startTick;
            const currentRemaining = currentTask.ticks - elapsedTicks;

            if (currentRemaining > 0) {
                remainingTicks = currentRemaining;
                startTick = ticks;
            }

            currentTask.reject('Task replaced');
            laneTasks.pop();
        } else if (this.isLaneBlocked(lane)) {
            throw new Error(`Lane ${lane} is blocked by an existing task`);
        }

        let resolveFunc: () => void;
        let rejectFunc: (reason?: any) => void;

        const promise = new Promise<void>((resolve, reject) => {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        const task: TickTask = {
            ticks: remainingTicks,
            promise,
            resolve: resolveFunc!,
            reject: rejectFunc!,
            blocking,
            startTick,
            lane
        };

        laneTasks.push(task);
        return promise;
    }

    /**
     * Advances the tick counter and resolves any completed tasks.
     * Called automatically by the actor's tick system.
     */
    public tick(): void {
        this.currentTick++;

        for (const [lane, tasks] of this.tasksByLane.entries()) {
            for (let i = tasks.length - 1; i >= 0; i--) {
                const task = tasks[i];
                if (this.currentTick >= task.startTick + task.ticks) {
                    task.resolve();
                    tasks.splice(i, 1);
                }
            }
        }
    }

    /**
     * Cleans up the tick queue when the actor is destroyed.
     * Cancels all pending tasks and unsubscribes from movement events.
     */
    public destroy(): void {
        if (this.movementSubscription) {
            this.movementSubscription.unsubscribe();
            this.movementSubscription = null;
        }

        // Reject all tasks in all lanes
        this.rejectAllTasks('Actor destroyed');
    }

    private isLaneBlocked(lane: TickLane): boolean {
        const tasks = this.tasksByLane.get(lane);
        return tasks?.some(task => task.blocking) ?? false;
    }

    /**
     * Resets all tasks in all lanes to start from the current tick.
     * Does not cancel or reject tasks, just resets their start time.
     */
    public resetAllTicks(): void {
        for (const lane of this.tasksByLane.keys()) {
            this.resetLaneTicks(lane);
        }
    }

    /**
     * Rejects all tasks in all lanes
     * @param reason The reason for rejection
     */
    public rejectAllTasks(reason: string = 'Tasks cancelled'): void {
        for (const lane of this.tasksByLane.keys()) {
            this.rejectLaneTasks(lane, reason);
        }
    }

    /**
     * Resets the ticks for tasks in a specific lane
     * @param lane The lane to reset
     */
    public resetLaneTicks(lane: TickLane): void {
        const tasks = this.tasksByLane.get(lane);
        if (tasks) {
            tasks.forEach(task => {
                task.startTick = this.currentTick;
            });
        }
    }

    /**
     * Rejects all tasks in a specific lane
     * @param lane The lane to reject tasks from
     * @param reason The reason for rejection
     */
    private rejectLaneTasks(lane: TickLane, reason: string = 'Task cancelled'): void {
        const tasks = this.tasksByLane.get(lane);
        if (tasks) {
            tasks.forEach(task => task.reject(reason));
            tasks.length = 0;
        }
    }
}
