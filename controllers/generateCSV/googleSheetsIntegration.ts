import * as fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { BaseExternalAccountClient, OAuth2Client } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
//get credentials.json from new google cloud project (with sheets access)
//https://console.cloud.google.com/projectcreate
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const loadSavedCredentialsIfExist = async () => {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
};

const saveCredentials = async (client: OAuth2Client) => {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
};

const authorize = async () => {
    const client = await loadSavedCredentialsIfExist();
    if (client) return client;

    const authClient = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (authClient && authClient.credentials) {
        await saveCredentials(authClient);
    }
    return authClient;
};

const clearAndUpdateRows = async (
    auth: BaseExternalAccountClient | OAuth2Client,
    values: string[][]
) => {
    const {
        spreadsheets: { values: spreadsheet },
    } = google.sheets({ version: "v4", auth });
    const { SPREADSHEET_ID: spreadsheetId } = process.env;

    await spreadsheet.clear({
        spreadsheetId,
        range: "Sheet1",
    });
    await spreadsheet.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: "RAW",
            data: [
                {
                    range: "Sheet1",
                    majorDimension: "ROWS",
                    values,
                },
            ],
        },
    });
    return true;
};

const updateGoogleSpreadSheet = async (values: string[][]) => {
    try {
        const auth = await authorize();
        return clearAndUpdateRows(auth, values);
    } catch (err) {
        throw new Error("Failed on google sheet integration");
    }
};

export { updateGoogleSpreadSheet };
