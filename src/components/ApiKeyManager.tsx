import React, { useState } from "react";
import {
  Dialog,
  Button,
  TextField,
  IconButton,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  GearIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  ClipboardIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";

interface ApiKeyManagerProps {
  currentApiKey: string;
  onSave: (newApiKey: string) => void;
}

export function ApiKeyManager({ currentApiKey, onSave }: ApiKeyManagerProps) {
  const [newApiKey, setNewApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSave = () => {
    if (newApiKey) {
      onSave(newApiKey);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newApiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setNewApiKey("");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost" aria-label="设置">
          <GearIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "400px" }}>
        <Flex direction="column" gap="3">
          <Dialog.Title>API Key 设置</Dialog.Title>
          <Text size="2">当前 API Key:</Text>
          <Flex>
            <TextField.Root
              variant="classic"
              style={{ flex: 1 }}
              type={showApiKey ? "text" : "password"}
              value={newApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewApiKey(e.target.value)
              }
              placeholder="输入新的 API Key"
            >
              <TextField.Slot>
                <IconButton
                  variant="ghost"
                  size="1"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeNoneIcon /> : <EyeOpenIcon />}
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          </Flex>
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="classic" color="gray">
                取消
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="classic" onClick={handleSave}>
                保存
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
