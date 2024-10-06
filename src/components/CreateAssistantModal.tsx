import React, { useState } from "react";
import {
  Dialog,
  Button,
  TextField,
  Flex,
  Text,
  Select,
  TextArea,
} from "@radix-ui/themes";
import { Assistant } from "../types/Assistant";
import { MODELS } from "../constants/models";

interface CreateAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newAssistant: Partial<Assistant>) => void;
}

export function CreateAssistantModal({
  isOpen,
  onClose,
  onCreate,
}: CreateAssistantModalProps) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (name.trim() === "") {
      setError("Assistant 名称不能为空");
      return;
    }
    onCreate({
      name,
      instructions,
      model,
    });
    onClose();
    // 重置表单
    setName("");
    setInstructions("");
    setModel("gpt-3.5-turbo");
    setError("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: "500px" }}>
        <Dialog.Title>创建新 Assistant</Dialog.Title>
        <Flex direction="column" gap="3">
          <TextField.Root
            variant="classic"
            placeholder="Assistant 名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></TextField.Root>
          <TextArea
            placeholder="系统指令"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <Select.Root value={model} onValueChange={setModel}>
            <Select.Trigger variant="classic" />
            <Select.Content>
              {MODELS.map((modelOption) => (
                <Select.Item key={modelOption} value={modelOption}>
                  {modelOption}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          {error && <Text color="red">{error}</Text>}
          <Flex justify="end" gap="3">
            <Dialog.Close>
              <Button variant="classic" color="gray">
                取消
              </Button>
            </Dialog.Close>
            <Button onClick={handleCreate} variant="classic">
              创建
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}