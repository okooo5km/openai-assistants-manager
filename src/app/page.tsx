"use client";

import { useState, useEffect } from "react";
import { ApiKeyModal } from "../components/ApiKeyModal";
import { ApiKeyManager } from "../components/ApiKeyManager";
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
} from "@radix-ui/themes";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { Spinner } from "../components/Spinner";

interface Assistant {
  id: string;
  name: string;
  description?: string;
  model: string;
  instructions: string;
  tools: {
    type: "retrieval" | "code_interpreter" | "function";
    function?: {
      name: string;
      description: string;
      parameters: any;
    };
  }[];
  file_ids: string[];
  response_format: { type: string };
  temperature?: number;
  top_p?: number;
}

const MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-05-13",
  "gpt-4-turbo-preview",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-1106-preview",
  "gpt-4-0613",
  "gpt-4-0125-preview",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
];

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
      setError("API Key 不能为空");
      setIsModalOpen(true);
    }
  };

  const fetchAssistants = async (key: string) => {
    setLoading(true);
    setIsProcessing(true);
    setProcessingMessage("正在获取 Assistants 数据...");
    setError(null);
    try {
      const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
      const response = await openai.beta.assistants.list({ limit: 20 });
      setAssistants(response.data as unknown as Assistant[]);
      if (response.data.length > 0) {
        setSelectedAssistantId(response.data[0].id);
      }
    } catch (err) {
      setError("获取助手列表失败，请检查您的 API 密钥是否正确。");
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
    setProcessingMessage(`正在更新 Assistant "${updatedAssistant.name}"...`);
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
      setError("更新助手失败，请稍后重试。");
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
          background: "transparent", // 确保Flex容器背景是透明的
        }}
        gap="4"
      >
        <Box
          p="4"
          style={{
            width: "100%",
            maxWidth: "48rem",
            background: "rgba(255, 255, 255, 0.1)", // 半透明白色背景
            backdropFilter: "blur(10px)", // 背景模糊效果
            borderRadius: "12px", // 圆角
          }}
        >
          <Flex justify="between" align="center" mb="4">
            <Heading size="5">OpenAI Assistants 管理器</Heading>
            <ApiKeyManager currentApiKey={apiKey} onSave={handleSaveApiKey} />
          </Flex>
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
                  <Heading size="3" mb="2">
                    {assistant.name}
                  </Heading>
                  <Flex direction="column" gap="4">
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold">
                        名称
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
                        placeholder="Assistant 名称"
                      />
                    </Flex>

                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold">
                        系统指令
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
                          placeholder="系统指令"
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
                        模型
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
                        响应格式
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
                        onValueCommit={() => handleTemperatureCommit(assistant)}
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
          {loading && <Text align="center">加载中...</Text>}
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
              请稍候，我们正在处理您的请求...
            </AlertDialog.Description>
          </AlertFlex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
