'use client'

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { getDecks } from "@/lib/http/deckerLib";
import { GameServerContext } from "@/lib/socket/context";
import { selectAwaitingDecksAck, selectAwaitingSettingsAck, setAwaitingDecksAck, setAwaitingSettingsAck } from "@/lib/store/feature/activeGameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import Game from "@/types/Game";
import GameConstants from "@/types/GameConstants";
import GameSettings from "@/types/GameSettings";
import { formOptions, useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext } from "react";

export default function LobbyScreen({ game }: { game: Game }): ReactNode {
  const { user } = useCurrentUser()
  const { ready, actions } = useContext(GameServerContext)
  const dispatch = useAppDispatch()

  const awaitingSettingsAck = useAppSelector(selectAwaitingSettingsAck)
  const awaitingDecksAck = useAppSelector(selectAwaitingDecksAck)

  const disabled = !ready || user?.id !== game.hostId
  const settingsDisabled = disabled || awaitingSettingsAck
  const decksDisabled = disabled || awaitingDecksAck

  const settingsForm = useForm({
    ...formOptions<GameSettings>({
      defaultValues: game.settings
    })
  })

  function handleSettingsChange(settings: Partial<GameSettings>) {
    if (settingsDisabled) return
    actions?.updateSettings(game.id, settings)
    dispatch(setAwaitingSettingsAck(true))
  }

  function handleDeckClick(deckId: string, active: boolean) {
    if (decksDisabled) return
    actions?.updateDeck(game.id, deckId, active)
    dispatch(setAwaitingDecksAck(true))
  }

  function gameHasDeck(deckId: string): boolean {
    return game.decks.map(d => d.id).includes(deckId)
  }

  const { data: decks } = useQuery({
    queryKey: ['decks'],
    queryFn: () => {
      return getDecks()
    }
  })

  return (
    <div className="flex gap-x-2">
      <div className="w-full border-2 border-dotted rounded-md p-3">
        <div className="grid grid-cols-2 gap-y-6">
          <settingsForm.Field name="maxPlayers" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < GameConstants.MINIMUM_PLAYERS) {
                return `There must be at least ${GameConstants.MINIMUM_PLAYERS} players`
              }

              handleSettingsChange({ maxPlayers: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Players</label>
                  <Input id={field.name} name={field.name} type="number" min={GameConstants.MINIMUM_PLAYERS} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="maxObservers" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 0) {
                return `You cannot have negative observers`
              }

              handleSettingsChange({ maxObservers: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Observers</label>
                  <Input id={field.name} name={field.name} type="number" min={0} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="maxScore" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 1) {
                return `Maximum score must be at least 1`
              }

              handleSettingsChange({ maxScore: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Score</label>
                  <Input id={field.name} name={field.name} type="number" min={1} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="roundIntermissionTimer" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }

              handleSettingsChange({ roundIntermissionTimer: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Round Intermission Timer</label>
                  <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="gameWinIntermissionTimer" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }

              handleSettingsChange({ gameWinIntermissionTimer: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Game Win Intermission Timer</label>
                  <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="playingTimer" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }

              handleSettingsChange({ playingTimer: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Playing Timer</label>
                  <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="judgingTimer" validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }

              handleSettingsChange({ judgingTimer: value })
            }
          }}>
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Judging Timer</label>
                  <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} disabled={settingsDisabled} />
                  <div className="col-span-full">
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="allowPlayersToJoinMidGame">
            {(field) => {
              return (
                <div className="grid grid-cols-subgrid col-span-full items-center">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Allow Players to Join Mid-Game</label>
                  <Checkbox id={field.name} name={field.name} checked={field.state.value} onBlur={() => field.handleBlur()} onCheckedChange={(e) => {
                    field.handleChange(!!e)
                    handleSettingsChange({ allowPlayersToJoinMidGame: !!e })
                  }} disabled={settingsDisabled} />
                </div>
              )
            }}
          </settingsForm.Field>
        </div>
      </div>
      <div className="w-full border-2 border-dotted rounded-md p-3">
        <div className="grid grid-cols-2">
          {(decks?.map(deck => (
            <div key={deck.id} className="flex items-center gap-x-2">
              <Checkbox
                id={deck.id}
                checked={gameHasDeck(deck.id)}
                onCheckedChange={(e) => handleDeckClick(deck.id, !!e)}
                disabled={decksDisabled}
              />
              <label htmlFor={deck.id}>{deck.name}</label>
            </div>
          )))}
        </div>
      </div>
    </div>
  )
}
