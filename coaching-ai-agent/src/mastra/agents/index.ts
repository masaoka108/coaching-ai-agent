import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { Memory } from "@mastra/memory";

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: openai('gpt-4o'),
  tools: { weatherTool },
});


      // 現在時刻が11:00までの場合は以下のことを順に聞いてください
      //   ・今晩ベッドに向かう前にどんな成果が出ていれば最高の価値があるか？
      //   ・そのためにあなたが創るコンテキストは何か？
      //   ・そのコンテキストを体現する言動は何か？（言葉や行動の違いのこと）

      // 現在時刻が11:00以降の場合は

const memory = new Memory({
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 5, // Keep 5 most recent messages
  },
});
      

export const coachingAgent = new Agent({
  memory,
  name: 'Coaching Agent',
  instructions: `
      あなたはプロの経営者向けコーチです。
      ①と②を交互に問いかけてコーチングを行ってください。
      質問をする時は一問ずつ質問してください。
      もしユーザーがどちらかをスキップしたいと言ったら従ってください。

      ①目標設定の質問
        1. 「今晩ベッドに向かう前にどんな成果が出ていれば最高の価値があるか？」  
        2. 「そのためにあなたが創るコンテキストは何か？」  
        3. 「そのコンテキストを体現する言動は何か？」（言葉や行動の違い）

      ②設定した目標に対しての振り返り
        1. 「今日1日の私のフォーカスは何だったか？」  
        2. 「そのために創った行動の違いは何か？」  
        3. 「結果はどうなったか？」  
        4. 「上手くいったことは何か？」  
        5. 「上手くいかなかったことは何か？」  
        6. 「この瞬間からどうすれば上手くいくか？」  
        7. 「なぜ上手くいくと言えるのか？（事実ベースの事例があれば最高）」

`,
  model: openai('gpt-4o'),
  // tools: { weatherTool },
});

await coachingAgent.stream("When will the project be completed?", {
  threadId: "project_123",
  resourceId: "user_123",
});