export type StartLoadingAction = {type: 'LOAD_ACTION'};
export type LoadCompleteAction = {type: 'LOAD_COMPLETE_ACTION', data: string[], foo: string};
export type SomeOtherAction = {type: 'SOME_OTHER_ACTION', data: string[], foo: string};

type Action = StartLoadingAction | LoadCompleteAction | SomeOtherAction;

export function dispatch<T extends Action>(type: T['type'], payload: Omit<Action, 'type'>): void {};