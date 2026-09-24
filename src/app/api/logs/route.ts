import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(data);
  } catch(e) {
    return [];
  }
}

function writeDB(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { encryptedData } = body;
    
    if (!encryptedData) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const logs = readDB();
    logs.unshift({ // Add to beginning for newest first
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      encryptedData
    });
    
    writeDB(logs);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const logs = readDB();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
