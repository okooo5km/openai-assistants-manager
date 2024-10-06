export interface Assistant {
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
