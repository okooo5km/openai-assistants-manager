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
      setError("API Key 不能为空");
      return;
    }
    onSave(apiKey);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: "400px" }}>
        <Dialog.Title>设置 OpenAI API 密钥</Dialog.Title>
        <Flex direction="column" gap="2">
          <TextField.Root
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="输入您的 API 密钥"
          ></TextField.Root>
          {error && <Text color="red">{error}</Text>}
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="classic" color="gray">
                取消
              </Button>
            </Dialog.Close>
            <Button onClick={handleSave} variant="classic">
              保存
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
