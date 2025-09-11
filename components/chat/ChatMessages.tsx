"use client";

import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/conversation";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai/source";
import { Message, MessageContent } from "@/components/ai/message";
import { Response } from "@/components/ai/response";
import { Actions, Action } from "@/components/ai/actions";
import { ChatMessagesProps } from "@/lib/types";
import { Loader } from "../ai/loader";
import Image from "next/image";
import FileChatCard from "./FileChatCard";
import { RefreshCcwIcon, CopyIcon, CheckIcon } from "lucide-react";
import { Fragment } from "react";

export default function ChatMessages({ messages, status, regenerate }: ChatMessagesProps) {
  const [isMessageCopied, setIsMessageCopied] = useState<boolean>(false);

  const handleMessageCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsMessageCopied(true);
    setTimeout(() => setIsMessageCopied(false), 1000);
  };

  return (
    <Conversation className="[mask-image:linear-gradient(to_bottom,transparent,black_0%,var(--background)98%,transparent)] h-full scrollbar-thin">
      <ConversationContent className="max-w-[720px] mx-auto">
        {messages.map((message, messageIndex) => (
          <Fragment key={message.id}>
            <Message from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      const isLastMessage =
                        messageIndex === messages.length - 1;
                      return (
                        <div key={`${message.role}-${message.id}-${i}`}>
                          <Response>
                            {part.text}
                          </Response>
                        {message.role === "assistant" &&
                          message.parts.some((part) => part.type === "source-url") && (
                            <Sources className="mt-4">
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (part) => part.type === "source-url"
                                  ).length
                                }
                              />
                              <SourcesContent>
                                {message.parts
                                  .filter((part) => part.type === "source-url")
                                  .map((part, i) => (
                                    <Source
                                      key={`${message.id}-source-${i}`}
                                      href={part.url}
                                      title={part.url}
                                    />
                                  ))}
                              </SourcesContent>
                            </Sources>
                          )}
                          {message.role === "assistant" &&
                            isLastMessage &&
                            status !== "streaming" && (
                              <Actions className="mt-2 [&>button]:cursor-pointer">
                                <Action
                                  tooltip="Retry"
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                tooltip="Copy"
                                  onClick={() =>
                                    handleMessageCopy(
                                      message.parts
                                        .filter((part) => part.type === "text")
                                        .map((part) => part.text)
                                        .join(" ")
                                    )
                                  }
                                  label="Copy"
                                >
                                  {isMessageCopied ? (
                                    <CheckIcon className="size-3" />
                                  ) : (
                                    <CopyIcon className="size-3" />
                                  )}
                                </Action>
                              </Actions>
                            )}
                        </div>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    case "source-url":
                      return null;
                    case "file":
                      if (part.mediaType?.startsWith("image/")) {
                        return (
                          <div key={`${message.id}-${i}`} className="my-2">
                            <Image
                              src={part.url}
                              width={400}
                              height={300}
                              alt={`attachment-${i}`}
                              className="rounded-lg border max-w-full h-auto"
                            />
                          </div>
                        );
                      }
                      if (part.mediaType === "application/pdf") {
                        return (
                          <FileChatCard
                            key={`${message.id}-${i}`}
                            url={part.url}
                            filename={part.filename || ""}
                          />
                        );
                      }
                      return (
                        <FileChatCard
                          key={`${message.id}-${i}`}
                          url={part.url}
                          filename={part.filename || ""}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </MessageContent>
            </Message>
          </Fragment>
        ))}
        {status === "submitted" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
