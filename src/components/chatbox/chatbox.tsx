'use client'

import ChatboxInput from "./chatbox-input";
import { RootState, useAppSelector } from "@/lib/store/store";
import { useContext, useState } from "react";
import { GameServerContext } from "@/lib/socket/context";
import { selectGlobalChatMessages } from "@/lib/store/feature/gameBrowserSlice";
import { selectActiveGame, selectLocalChatMessages } from "@/lib/store/feature/activeGameSlice";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Chatbox() {
  const { ready, actions } = useContext(GameServerContext)

  const activeGame = useAppSelector(selectActiveGame)
  const hasActiveGame = !!activeGame

  const [tab, setTab] = useState<string>("local")

  function MessagesWrapper({ messageSelector, sendChat }: { messageSelector: (state: RootState) => string[], sendChat: (msg: string) => void }) {
    const messages = useAppSelector(messageSelector)
    return (
      <div className="border-2 border-dotted rounded-md p-3 h-48 max-h-48 flex flex-col">
        <ScrollArea className="mb-4 rounded-sm flex-grow flex flex-col-reverse">
          {messages.map((message, idx) => (
            <p key={`message-${idx}`}>{message}</p>
          ))}
        </ScrollArea>
        <ChatboxInput ready={ready} sendMessage={msg => sendChat(msg)} />
      </div>
    )
  }

  const globalChat = <MessagesWrapper messageSelector={selectGlobalChatMessages} sendChat={(msg) => actions?.sendGlobalChat(msg)} />

  function TabWrapper() {
    return (
      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="global" onClick={() => setTab('global')}>Global Chat</TabsTrigger>
          <TabsTrigger value="local" onClick={() => setTab('local')}>Local Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          {globalChat}
        </TabsContent>
        <TabsContent value="local">
          <MessagesWrapper messageSelector={selectLocalChatMessages} sendChat={(msg) => actions?.sendLocalChat(activeGame!.id, msg)} />
        </TabsContent>
      </Tabs>
    )
  }

  return hasActiveGame ? <TabWrapper /> : globalChat;
}