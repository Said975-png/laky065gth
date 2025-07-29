import { RequestHandler } from "express";
import {
  CreateContractRequest,
  CreateContractResponse,
  ContractData,
} from "@shared/api";
import * as fs from "fs";
import * as path from "path";

// Path to contracts data file
const contractsPath = path.join(
  process.cwd(),
  "data",
  "contracts",
  "contracts.json",
);

// In-memory storage for contracts (for serverless deployment)
let contractsStore: ContractData[] = [];

// Load contracts from file system
function loadContracts(): ContractData[] {
  try {
    if (fs.existsSync(contractsPath)) {
      const data = fs.readFileSync(contractsPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading contracts:", error);
  }
  return [];
}

// Save contracts to file system
function saveContracts(contracts: ContractData[]): void {
  try {
    const dir = path.dirname(contractsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2));
  } catch (error) {
    console.error("Error saving contracts:", error);
  }
}

// Save contract HTML file
function saveContractHTML(contractData: ContractData): void {
  try {
    const contractHTML = generateContractHTML(contractData);
    const htmlPath = path.join(
      process.cwd(),
      "data",
      "contracts",
      contractData.fileName,
    );
    const dir = path.dirname(htmlPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(htmlPath, contractHTML, "utf-8");
  } catch (error) {
    console.error("Error saving contract HTML:", error);
  }
}

// Initialize contracts store
contractsStore = loadContracts();

// Contract template
const generateContractHTML = (contractData: ContractData): string => {
  const currentDate = new Date().toLocaleDateString("ru-RU");

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Договор ${contractData.id}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .contract-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .contract-number {
          font-size: 16px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2563eb;
        }
        .contract-details {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: bold;
          width: 200px;
          flex-shrink: 0;
        }
        .detail-value {
          flex: 1;
        }
        .footer {
          margin-top: 40px;
          border-top: 2px solid #333;
          padding-top: 20px;
          text-align: center;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-block {
          text-align: center;
          width: 300px;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          height: 50px;
          margin-bottom: 10px;
        }
        @media print {
          body { margin: 0; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="contract-title">ДОГОВОР НА РАЗРАБОТКУ</div>
        <div class="contract-number">№ ${contractData.id}</div>
        <div>от ${currentDate}</div>
      </div>

      <div class="section">
        <div class="section-title">1. СТОРОНЫ ДОГОВОРА</div>
        <p><strong>Исполнитель:</strong> JARVIS INTERCOMA</p>
        <p><strong>Заказчик:</strong> ${contractData.clientName}</p>
        <p><strong>Email:</strong> ${contractData.clientEmail}</p>
      </div>

      <div class="section">
        <div class="section-title">2. ПРЕДМЕТ ДОГОВОР��</div>
        <div class="contract-details">
          <div class="detail-row">
            <div class="detail-label">Тип проекта:</div>
            <div class="detail-value">${contractData.projectType}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Описание:</div>
            <div class="detail-value">${contractData.projectDescription}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Стоимость:</div>
            <div class="detail-value">Предварительная стоимость: ${contractData.price.toLocaleString("ru-RU")} сум</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">3. УСЛОВИЯ ВЫПОЛНЕНИЯ</div>
        <p>3.1. Исполнитель обязуется выполнить работы согласно техническому заданию.</p>
        <p>3.2. Срок выполнения работ: 15-20 рабочих дней с момента подписания договора.</p>
        <p>3.3. Заказчик обязуется предоставить всю необходимую информацию для выполнения работ.</p>
      </div>

      <div class="section">
        <div class="section-title">4. ПОРЯДОК ОПЛАТЫ</div>
        <p>4.1. Общая стоимость работ составляет ${contractData.price.toLocaleString("ru-RU")} сум.</p>
        <p>4.2. Оплата производится в следующем порядке:</p>
        <ul>
          <li>50% предоплата при подписании договора</li>
          <li>50% после завершения работ и передачи результата</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">5. ОТВЕТСТВЕННОСТЬ СТОРОН</div>
        <p>5.1. За невыполнение или ненадлежащее выполнение обязательств стороны несут ответственность в соответствии с действующим законодательством.</p>
        <p>5.2. Исполнитель гарантирует качество выполненных работ в течение 6 месяцев.</p>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div><strong>ИСПОЛНИТЕЛЬ</strong></div>
          <div class="signature-line"></div>
          <div>JARVIS INTERCOMA</div>
          <div>Создатель: Хусаинов Саид</div>
        </div>
        <div class="signature-block">
          <div><strong>ЗАКАЗЧИК</strong></div>
          <div class="signature-line"></div>
          <div>${contractData.clientName}</div>
        </div>
      </div>

      <div class="footer">
        <p><em>Договор сгенерирован автоматически системой Jarvis AI</em></p>
        <p><em>Дата создания: ${new Date(contractData.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}</em></p>
      </div>
    </body>
    </html>
  `;
};

export const createContract: RequestHandler = async (req, res) => {
  console.log("📝 [CONTRACT] Создание контракта - запрос получен");
  console.log("📝 [CONTRACT] Method:", req.method);
  console.log("📝 [CONTRACT] URL:", req.url);
  console.log("📝 [CONTRACT] Headers:", req.headers);
  console.log("📝 [CONTRACT] Body:", req.body);

  try {
    const {
      projectType,
      projectDescription,
      clientName,
      clientEmail,
      estimatedPrice,
    }: CreateContractRequest = req.body;

    // Generate contract ID
    const contractId = `JAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Get current user from request (you might need to implement auth middleware)
    const userId = (req.headers["user-id"] as string) || "anonymous";

    // Create contract data
    const contractData: ContractData = {
      id: contractId,
      userId,
      clientName,
      clientEmail,
      projectType,
      projectDescription,
      price: estimatedPrice,
      createdAt: new Date().toISOString(),
      status: "draft",
      fileName: `contract-${contractId}.html`,
    };

    // Store contract in memory and file system
    contractsStore.push(contractData);
    saveContracts(contractsStore);

    // Save contract HTML file
    saveContractHTML(contractData);

    const response: CreateContractResponse = {
      success: true,
      message: "Договор успешно создан",
      contractId,
      contractUrl: `/api/contracts/${contractId}`,
    };

    res.json(response);
  } catch (error) {
    console.error("Contract creation error:", error);
    const response: CreateContractResponse = {
      success: false,
      message: "Ошибка при создании договора",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

export const getUserContracts: RequestHandler = async (req, res) => {
  console.log(
    "📋 [CONTRACT] Получение контрактов пользователя - запрос получен",
  );
  console.log("📋 [CONTRACT] Method:", req.method);
  console.log("📋 [CONTRACT] URL:", req.url);
  console.log("📋 [CONTRACT] Headers:", req.headers);

  try {
    const userId = req.headers["user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Пользователь не авторизован",
      });
    }

    // Reload contracts from file system for latest data
    contractsStore = loadContracts();

    // Filter contracts by user ID
    const userContracts = contractsStore.filter(
      (contract) => contract.userId === userId,
    );

    res.json({
      success: true,
      contracts: userContracts,
    });
  } catch (error) {
    console.error("Error fetching user contracts:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении договоров",
    });
  }
};

export const getContract: RequestHandler = async (req, res) => {
  console.log("📄 [CONTRACT] Получение контракта - запрос получен");
  console.log("📄 [CONTRACT] Method:", req.method);
  console.log("📄 [CONTRACT] URL:", req.url);
  console.log("📄 [CONTRACT] Params:", req.params);

  try {
    const { contractId } = req.params;

    // Reload contracts from file system for latest data
    contractsStore = loadContracts();

    // Find contract
    const contract = contractsStore.find((c) => c.id === contractId);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Договор не найден",
      });
    }

    // Generate HTML for the contract
    const contractHTML = generateContractHTML(contract);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(contractHTML);
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении договора",
    });
  }
};
