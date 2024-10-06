import React, { useState, useEffect } from "react";
import { Dialog, Button, TextArea, Flex, Text } from "@radix-ui/themes";
import { CopyIcon } from "@radix-ui/react-icons";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructions: string;
  onSave: (newInstructions: string) => void;
}

export function InstructionModal({
  isOpen,
  onClose,
  instructions,
  onSave,
}: InstructionModalProps) {
  const [editedInstructions, setEditedInstructions] = useState(instructions);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setEditedInstructions(instructions);
  }, [instructions]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedInstructions);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isChanged = editedInstructions !== instructions;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: "600px", width: "100%" }}>
        <Dialog.Title>Edit System Instructions</Dialog.Title>
        <Flex direction="column" gap="2">
          <TextArea
            value={editedInstructions}
            onChange={(e) => setEditedInstructions(e.target.value)}
            style={{ minHeight: "200px" }}
          />
          <Flex justify="between">
            <Button variant="classic" onClick={handleCopy}>
              <CopyIcon />
              {isCopied ? "Copied" : "Copy"}
            </Button>
            <Flex gap="2">
              <Dialog.Close>
                <Button variant="classic" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="classic"
                onClick={() => onSave(editedInstructions)}
                disabled={!isChanged}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
