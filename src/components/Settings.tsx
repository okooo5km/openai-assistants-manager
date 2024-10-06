import React, { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  TextField,
  IconButton,
  Flex,
  Text,
  Switch,
} from "@radix-ui/themes";
import { GearIcon, EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";

interface SettingsProps {
  currentApiKey: string;
  onSave: (newApiKey: string) => void;
  onToggleDeleteButton: (show: boolean) => void;
}

export function Settings({
  currentApiKey,
  onSave,
  onToggleDeleteButton,
}: SettingsProps) {
  const [newApiKey, setNewApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    // Load the showDeleteButton state from localStorage
    const savedShowDeleteButton = localStorage.getItem("showDeleteButton");
    if (savedShowDeleteButton !== null) {
      setShowDeleteButton(JSON.parse(savedShowDeleteButton));
    }
  }, []);

  const handleSave = () => {
    if (newApiKey) {
      onSave(newApiKey);
    }
  };

  const handleToggleDeleteButton = (checked: boolean) => {
    setShowDeleteButton(checked);
    localStorage.setItem("showDeleteButton", JSON.stringify(checked));
    onToggleDeleteButton(checked);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="classic" aria-label="Settings" color="orange">
          <GearIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "400px" }}>
        <Flex direction="column" gap="3">
          <Dialog.Title>Settings</Dialog.Title>
          <Text size="2">API Key:</Text>
          <Flex>
            <TextField.Root
              variant="classic"
              style={{ flex: 1 }}
              type={showApiKey ? "text" : "password"}
              value={newApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewApiKey(e.target.value)
              }
              placeholder="Enter new API Key"
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
          <Flex align="center" gap="2">
            <Switch
              checked={showDeleteButton}
              onCheckedChange={handleToggleDeleteButton}
              variant="classic"
            />
            <Text size="2">Show delete button for Assistants</Text>
          </Flex>
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="classic" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="classic" onClick={handleSave}>
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
