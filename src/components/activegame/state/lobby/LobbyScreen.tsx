'use client'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getDecks } from "@/lib/http/deckerLib";
import { GameServerContext } from "@/lib/socket/context";
import { setAwaitingSettingsAck } from "@/lib/store/feature/activeGameSlice";
import { useAppDispatch } from "@/lib/store/store";
import Game from "@/types/Game";
import GameConstants from "@/types/GameConstants";
import GameSettings from "@/types/GameSettings";
import { formOptions, useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext } from "react";

export default function LobbyScreen({ game }: { game: Game }): ReactNode {
  const { ready, actions } = useContext(GameServerContext)
  const dispatch = useAppDispatch()

  const settingsForm = useForm({
    ...formOptions<GameSettings>({
      defaultValues: game.settings
    }),
    onSubmit: ({ value }) => {
      actions?.updateSettings(game.id, value)
      dispatch(setAwaitingSettingsAck(true))
    }
  })

  const decksForm = useForm({
    ...formOptions<{ decks: string[] }>({
      defaultValues: { decks: [] }
    }),
    onSubmit: ({ value }) => {
      console.log(value)
    }
  })

  const { data: decks } = useQuery({
    queryKey: ['decks'],
    queryFn: () => {
      return getDecks()
    }
  })

  return (
    <div className="flex gap-x-2">
      <div className="w-full border-2 border-dotted rounded-md p-3">
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          settingsForm.handleSubmit()
        }} className="grid grid-cols-1 items-center justify-center gap-x-2">
          <settingsForm.Field name="maxPlayers" validators={{
            onChange: ({ value }) => {
              if (value < GameConstants.MINIMUM_PLAYERS) {
                return `There must be at least ${GameConstants.MINIMUM_PLAYERS} players`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Players</label>
                    <Input id={field.name} name={field.name} type="number" min={GameConstants.MINIMUM_PLAYERS} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="maxObservers" validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return `You cannot have negative observers`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Observers</label>
                    <Input id={field.name} name={field.name} type="number" min={0} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="maxScore" validators={{
            onChange: ({ value }) => {
              if (value < 1) {
                return `Maximum score must be at least 1`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Score</label>
                    <Input id={field.name} name={field.name} type="number" min={1} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="roundIntermissionTimer" validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Round Intermission Timer</label>
                    <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="gameWinIntermissionTimer" validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Game Win Intermission Timer</label>
                    <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="playingTimer" validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Playing Timer</label>
                    <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Field name="judgingTimer" validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return `Timer values must be at least 0 (i.e., no timer)`
              }

              if (value > GameConstants.MAX_TIMER_VALUE) {
                return `Timer values cannot exceed ${GameConstants.MAX_TIMER_VALUE} seconds`
              }
            }
          }}>
            {(field) => {
              return (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Judging Timer</label>
                    <Input id={field.name} name={field.name} type="number" min={0} max={GameConstants.MAX_TIMER_VALUE} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
                  </div>
                  <div>
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
                <div className="flex gap-x-2">
                  <Checkbox id={field.name} name={field.name} checked={field.state.value} onCheckedChange={(e) => field.handleChange(e as boolean)} />
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Allow Players to join Mid-Game</label>
                </div>
              )
            }}
          </settingsForm.Field>
          <settingsForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div>
                <Button variant="default" type="submit" disabled={!ready || !canSubmit}>
                  {isSubmitting ? '...' : 'Update settings'}
                </Button>
              </div>
            )}
          </settingsForm.Subscribe>
        </form>
      </div>
      <div className="w-full border-2 border-dotted rounded-md p-3">
        <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          decksForm.handleSubmit()
        }}>
          <decksForm.Field name="decks">
            {(field) => (
              <div className="grid grid-cols-2">
                {(decks?.map(deck => (
                  <div key={deck.id} className="flex items-center gap-x-2">
                    <Checkbox
                      id={deck.id}
                      name={field.name}
                      value={deck.id}
                      checked={field.state.value.includes(deck.id)}
                      onCheckedChange={(e) => field.handleChange(u => {
                        if (e) {
                          return [deck.id, ...u]
                        } else {
                          const idx = u.findIndex(id => id === deck.id)
                          if (idx === -1) return u
                          u.splice(idx, 1)
                          return u
                        }
                      })}
                    />
                    <label htmlFor={deck.id}>{deck.name}</label>
                  </div>
                )))}
              </div>
            )}
          </decksForm.Field>
          <decksForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div>
                <Button variant="default" type="submit" disabled={!ready || !canSubmit}>
                  {isSubmitting ? '...' : 'Update decks'}
                </Button>
              </div>
            )}
          </decksForm.Subscribe>
        </form>
      </div>
    </div>
  )
}
