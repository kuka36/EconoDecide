
import { GoogleGenAI, Type } from "@google/genai";
import { DecisionState, AIAdvice } from "../types";

export const analyzeDecision = async (decision: DecisionState): Promise<AIAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    作为一名资深经济学家，请基于曼昆《经济学原理》中的“人们如何做出决策”的四大原理，对以下决策场景进行深度分析：

    决策主题：${decision.title}
    场景描述：${decision.description}
    候选方案：${decision.options.map(o => `${o.label}(收益:${o.benefits.join('/')}, 成本:${o.costs.join('/')})`).join('; ')}
    机会成本：${decision.opportunityCost}
    边际考量：针对"${decision.marginalAnalysis.action}"，当前的边际收益为"${decision.marginalAnalysis.marginalBenefit}"，边际成本为"${decision.marginalAnalysis.marginalCost}"。
    激励因素：${decision.incentives.join(', ')}

    请给出专业的评估，包括一个简短总结、对逻辑漏洞的批判、最终建议，以及一个1-100的理性决策分。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "决策逻辑总结" },
          critique: { type: Type.STRING, description: "基于经济学原理的逻辑漏洞分析" },
          recommendation: { type: Type.STRING, description: "最终行动建议" },
          score: { type: Type.NUMBER, description: "理性程度评分 (0-100)" }
        },
        required: ["summary", "critique", "recommendation", "score"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
