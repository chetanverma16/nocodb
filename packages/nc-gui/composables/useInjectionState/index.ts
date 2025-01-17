import type { InjectionKey } from 'vue'
import { inject, provide, tryOnScopeDispose } from '#imports'

export function useInjectionState<Arguments extends any[], Return>(
  composable: (...args: Arguments) => Return,
  keyName = 'InjectionState',
): readonly [useInjectionState: (...args: Arguments) => Return, useInjectedState: () => Return | undefined] {
  const key: string | InjectionKey<Return> = Symbol(keyName)

  let providableState: Return | undefined

  const useProvidingState = (...args: Arguments) => {
    const providedState = composable(...args)

    provide(key, providedState)

    providableState = providedState

    return providedState
  }

  const useInjectedState = () => {
    let injection = inject(key, undefined)

    if (typeof injection === 'undefined') {
      injection = providableState
    }

    return injection
  }

  tryOnScopeDispose(() => {
    providableState = undefined
  })

  return [useProvidingState, useInjectedState]
}
