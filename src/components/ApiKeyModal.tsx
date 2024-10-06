import { useState } from "react";
import { Dialog, Button, TextField, Flex, Text } from "@radix-ui/themes";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (apiKey.trim() === "") {
      setError("API Key cannot be empty");
      return;
    }
    onSave(apiKey);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: "400px" }}>
        <Dialog.Title>Set OpenAI API Key</Dialog.Title>
        <Flex direction="column" gap="2">
          <TextField.Root
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          ></TextField.Root>
          {error && <Text color="red">{error}</Text>}
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="classic" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleSave} variant="classic">
              Save
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
