import { rest } from "msw";
import { readFileSync } from "fs";
export const handlers = [
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/script/10b62ee238aa3a5c2ac406950b8d4a8e66ef0f7d9e5cfd8d1a19124a85b50319/unspent",
    async (req, res, ctx) => {
        const read=readFileSync('./src/test/mocks/handlers/files/10b62ee238aa3a5c2ac406950b8d4a8e66ef0f7d9e5cfd8d1a19124a85b50319_unspent.json');
      return res(
        ctx.status(200),
        ctx.json(
            read
        )
      );
    }
  ),
  
];