"use client";

import { useState, useEffect } from "react";
import { ApiKeyModal } from "../components/ApiKeyModal";
import { InstructionModal } from "../components/InstructionModal";
import OpenAI from "openai";
import {
  Flex,
  Box,
  Heading,
  Text,
  TextField,
  TextArea,
  Select,
  Slider,
  Tabs,
  IconButton,
  AlertDialog,
  Flex as AlertFlex,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import {
  EnterFullScreenIcon,
  SunIcon,
  MoonIcon,
  DesktopIcon,
  GitHubLogoIcon,
  TrashIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Spinner } from "../components/Spinner";
import { ApiKeyManager } from "../components/ApiKeyManager";
import Image from "next/image";
import { useTheme } from "../components/ThemeProvider";
import { CreateAssistantModal } from "../components/CreateAssistantModal";
import { Assistant } from "../types/Assistant";
import { MODELS } from "../constants/models";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string>("");

  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [currentInstructions, setCurrentInstructions] = useState("");
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(
    null
  );

  const [tempTemperature, setTempTemperature] = useState<number | null>(null);
  const [tempTopP, setTempTopP] = useState<number | null>(null);

  const { theme, setTheme, actualTheme } = useTheme();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [assistantToDelete, setAssistantToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openaiApiKey");
    if (storedApiKey && storedApiKey.trim() !== "") {
      setApiKey(storedApiKey);
      fetchAssistants(storedApiKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (newApiKey: string) => {
    if (newApiKey && newApiKey.trim() !== "") {
      localStorage.setItem("openaiApiKey", newApiKey);
      setApiKey(newApiKey);
      fetchAssistants(newApiKey);
    } else {
      setError("API Key cannot be empty");
      setIsModalOpen(true);
    }
  };

  const fetchAssistants = async (key: string) => {
    setLoading(true);
    setIsProcessing(true);
    setProcessingMessage("Fetching Assistants data...");
    setError(null);
    try {
      const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
      const response = await openai.beta.assistants.list({ limit: 20 });
      setAssistants(response.data as unknown as Assistant[]);
      if (response.data.length > 0) {
        setSelectedAssistantId(response.data[0].id);
      }
    } catch (err) {
      setError("Failed to fetch assistants list. Please check if your API key is correct.");
      console.error("Error fetching assistants:", err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  const updateAssistant = async (updatedAssistant: Assistant) => {
    if (!apiKey) return;
    setLoading(true);
    setIsProcessing(true);
    setProcessingMessage(`Updating Assistant "${updatedAssistant.name}"...`);
    setError(null);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const updateData: any = {
        name: updatedAssistant.name,
        instructions: updatedAssistant.instructions,
        model: updatedAssistant.model,
        tools: updatedAssistant.tools,
        file_ids: updatedAssistant.file_ids,
        response_format: updatedAssistant.response_format,
      };

      if (updatedAssistant.description) {
        updateData.description = updatedAssistant.description;
      }
      if (updatedAssistant.temperature !== undefined) {
        updateData.temperature = updatedAssistant.temperature;
      }
      if (updatedAssistant.top_p !== undefined) {
        updateData.top_p = updatedAssistant.top_p;
      }

      const response = await openai.beta.assistants.update(
        updatedAssistant.id,
        updateData
      );
      setAssistants(
        assistants.map((a) =>
          a.id === response.id ? (response as unknown as Assistant) : a
        )
      );
    } catch (err) {
      setError("Failed to update assistant. Please try again later.");
      console.error("Error updating assistant:", err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  const handleTemperatureChange = (value: number[]) => {
    setTempTemperature(value[0]);
  };

  const handleTemperatureCommit = (assistant: Assistant) => {
    if (tempTemperature !== null && tempTemperature !== assistant.temperature) {
      updateAssistant({ ...assistant, temperature: tempTemperature });
    }
    setTempTemperature(null);
  };

  const handleTopPChange = (value: number[]) => {
    setTempTopP(value[0]);
  };

  const handleTopPCommit = (assistant: Assistant) => {
    if (tempTopP !== null && tempTopP !== assistant.top_p) {
      updateAssistant({ ...assistant, top_p: tempTopP });
    }
    setTempTopP(null);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon />;
      case "dark":
        return <MoonIcon />;
      case "system":
        return <DesktopIcon />;
    }
  };

  const createAssistant = async (newAssistant: Partial<Assistant>) => {
    if (!apiKey) return;
    setLoading(true);
    setIsProcessing(true);
    setProcessingMessage(`Creating new Assistant "${newAssistant.name}"...`);
    setError(null);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const response = await openai.beta.assistants.create({
        name: newAssistant.name || "",
        instructions: newAssistant.instructions || "",
        model: newAssistant.model || "gpt-4o-mini",
      });
      setAssistants([...assistants, response as unknown as Assistant]);
      setSelectedAssistantId(response.id);
    } catch (err) {
      setError("Failed to create new assistant. Please try again later.");
      console.error("Error creating assistant:", err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  const deleteAssistant = async (assistantId: string) => {
    if (!apiKey) return;
    setLoading(true);
    setIsProcessing(true);
    setProcessingMessage(`Deleting Assistant...`);
    setError(null);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      await openai.beta.assistants.del(assistantId);
      setAssistants(assistants.filter((a) => a.id !== assistantId));
      if (selectedAssistantId === assistantId) {
        setSelectedAssistantId(assistants[0]?.id || null);
      }
    } catch (err) {
      setError("Failed to delete assistant. Please try again later.");
      console.error("Error deleting assistant:", err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  const handleDeleteConfirm = () => {
    if (assistantToDelete) {
      deleteAssistant(assistantToDelete);
      setAssistantToDelete(null);
    }
  };

  if (!apiKey || apiKey.trim() === "") {
    return (
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    );
  }

  return (
    <>
      <Flex
        align="center"
        justify="center"
        style={{
          minHeight: "100vh",
          background: "transparent",
        }}
        gap="4"
      >
        <Box
          p="4"
          style={{
            width: "100%",
            maxWidth: "48rem",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
          }}
        >
          <Flex justify="between" align="center" mb="4">
            <Flex align="center" gap="3">
              <Image
                src="/icon-512x512.svg"
                alt="Logo"
                width={32}
                height={32}
                style={{
                  borderRadius: "50%",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
              <Heading size="5">OpenAI Assistants Manager</Heading>
            </Flex>
            <Flex align="center" gap="4">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="classic"
              >
                Create
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="classic" aria-label="Toggle theme">
                    {getThemeIcon()}
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content aria-describedby="theme-menu-description">
                  <DropdownMenu.Item onSelect={() => setTheme("light")}>
                    <Flex align="center" gap="2">
                      <SunIcon />
                      Light
                    </Flex>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setTheme("dark")}>
                    <Flex align="center" gap="2">
                      <MoonIcon />
                      Dark
                    </Flex>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setTheme("system")}>
                    <Flex align="center" gap="2">
                      <DesktopIcon />
                      System
                    </Flex>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <IconButton
                variant="classic"
                aria-label="GitHub Repository"
                onClick={() =>
                  window.open(
                    "https://github.com/okooo5km/openai-assistants-manager",
                    "_blank"
                  )
                }
              >
                <GitHubLogoIcon />
              </IconButton>
              <ApiKeyManager
                currentApiKey={apiKey || ""}
                onSave={handleSaveApiKey}
              />
            </Flex>
          </Flex>

          {assistants.length > 0 ? (
            <Tabs.Root
              value={selectedAssistantId || ""}
              onValueChange={setSelectedAssistantId}
            >
              <Tabs.List>
                {assistants.map((assistant) => (
                  <Tabs.Trigger key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {assistants.map((assistant) => (
                <Tabs.Content key={assistant.id} value={assistant.id}>
                  <Box
                    mt="4"
                    p="4"
                    style={{
                      border: "1px solid var(--gray-6)",
                      borderRadius: "var(--radius-3)",
                    }}
                  >
                    <Flex justify="between" align="center" mb="2">
                      <Heading size="3">{assistant.name}</Heading>
                      <IconButton
                        variant="classic"
                        color="red"
                        onClick={() => setAssistantToDelete(assistant.id)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Flex>
                    <Flex direction="column" gap="4">
                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          Name
                        </Text>
                        <TextField.Root
                          variant="classic"
                          value={assistant.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateAssistant({
                              ...assistant,
                              name: e.target.value,
                            })
                          }
                          placeholder="Assistant name"
                        />
                      </Flex>

                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          System Instructions
                        </Text>
                        <Box style={{ position: "relative" }}>
                          <TextArea
                            variant="classic"
                            value={assistant.instructions}
                            onChange={(e) =>
                              updateAssistant({
                                ...assistant,
                                instructions: e.target.value,
                              })
                            }
                            placeholder="System instructions"
                          />
                          <IconButton
                            variant="ghost"
                            onClick={() => {
                              setCurrentInstructions(assistant.instructions);
                              setCurrentAssistantId(assistant.id);
                              setIsInstructionModalOpen(true);
                            }}
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              right: "12px",
                              zIndex: 1,
                            }}
                          >
                            <EnterFullScreenIcon />
                          </IconButton>
                        </Box>
                      </Flex>

                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          Model
                        </Text>
                        <Select.Root
                          value={assistant.model}
                          onValueChange={(value) =>
                            updateAssistant({ ...assistant, model: value })
                          }
                        >
                          <Select.Trigger variant="classic" />
                          <Select.Content>
                            {MODELS.map((model) => (
                              <Select.Item key={model} value={model}>
                                {model}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Flex>

                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          Response Format
                        </Text>
                        <Select.Root
                          value={assistant.response_format.type}
                          onValueChange={(value) =>
                            updateAssistant({
                              ...assistant,
                              response_format: { type: value },
                            })
                          }
                        >
                          <Select.Trigger variant="classic" />
                          <Select.Content>
                            {["text", "json_object", "json_schema"].map(
                              (format) => (
                                <Select.Item key={format} value={format}>
                                  {format}
                                </Select.Item>
                              )
                            )}
                          </Select.Content>
                        </Select.Root>
                      </Flex>

                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          Temperature:{" "}
                          {tempTemperature !== null
                            ? tempTemperature
                            : assistant.temperature || 0}
                        </Text>
                        <Slider
                          variant="classic"
                          value={[
                            tempTemperature !== null
                              ? tempTemperature
                              : assistant.temperature || 0,
                          ]}
                          max={2}
                          step={0.1}
                          onValueChange={handleTemperatureChange}
                          onValueCommit={() =>
                            handleTemperatureCommit(assistant)
                          }
                        />
                      </Flex>

                      <Flex direction="column" gap="1">
                        <Text size="2" weight="bold">
                          Top P:{" "}
                          {tempTopP !== null ? tempTopP : assistant.top_p || 0}
                        </Text>
                        <Slider
                          variant="classic"
                          value={[
                            tempTopP !== null ? tempTopP : assistant.top_p || 0,
                          ]}
                          max={1}
                          step={0.1}
                          onValueChange={handleTopPChange}
                          onValueCommit={() => handleTopPCommit(assistant)}
                        />
                      </Flex>
                    </Flex>
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              style={{ minHeight: "200px" }}
            >
              <Text size="3" mb="4">
                You haven't created any Assistants yet
              </Text>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="classic"
              >
                <PlusIcon />
                Create New Assistant
              </Button>
            </Flex>
          )}
          {loading && <Text align="center">Loading...</Text>}
          {error && (
            <Text color="red" align="center">
              {error}
            </Text>
          )}
        </Box>
        <InstructionModal
          isOpen={isInstructionModalOpen}
          onClose={() => setIsInstructionModalOpen(false)}
          instructions={currentInstructions}
          onSave={(newInstructions: any) => {
            if (currentAssistantId) {
              const assistant = assistants.find(
                (a) => a.id === currentAssistantId
              );
              if (assistant) {
                updateAssistant({
                  ...assistant,
                  instructions: newInstructions,
                });
              }
            }
            setIsInstructionModalOpen(false);
          }}
        />
      </Flex>
      <AlertDialog.Root open={isProcessing}>
        <AlertDialog.Content style={{ maxWidth: "450px" }}>
          <AlertFlex direction="column" align="center" justify="center" gap="3">
            <Spinner />
            <AlertDialog.Title>{processingMessage}</AlertDialog.Title>
            <AlertDialog.Description>
              Please wait, we are processing your request...
            </AlertDialog.Description>
          </AlertFlex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <CreateAssistantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createAssistant}
      />
      <AlertDialog.Root
        open={!!assistantToDelete}
        onOpenChange={() => setAssistantToDelete(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this Assistant? This action cannot be undone.
          </AlertDialog.Description>
          <Flex justify="end" gap="3" mt="4">
            <AlertDialog.Cancel>
              <Button variant="classic" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="classic"
                color="red"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}