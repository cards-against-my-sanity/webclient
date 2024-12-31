import GameSettings from "@/types/GameSettings";

export default function GameSettingsPanel({ settings, onUpdateSettings }: { settings: GameSettings, onUpdateSettings: (settings: Partial<GameSettings>) => void }) {
  // TODO: create the panel and send change events to socket
  return (
    <>
      <p>{JSON.stringify(settings)}</p>
    </>
  )
}