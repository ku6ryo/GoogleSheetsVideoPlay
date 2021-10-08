import { google } from "googleapis"
import path from "path"
import Jimp from "jimp"

const SHEET_ID = "your sheet id"
const SERVICE_ACCOUNT_EMAIL = "your service account email"
const SERVICE_ACCOUNT_PRIVATE_KEY = "your private key"

const FRAMES = 300
// Video resolution
const WITDH = 160
const HEIGHT = 90

;(async () => {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  })
  const sheet = google.sheets("v4")
  for (let i = 1; i <= FRAMES; i++) {
    const image = await Jimp.read(path.join(__dirname, "./images/", `${WITDH}x${HEIGHT}_${i}.jpg`))
    const requests: any[] = []
    for (let j = 0; j < WITDH; j++) {
      for (let k = 0; k < HEIGHT; k++) {
        const c = image.getPixelColor(j, k)
        const { r, g, b } = Jimp.intToRGBA(c)
        const req = {
          updateCells: {
            range: {
              sheetId: 0,
              startColumnIndex: j,
              endColumnIndex: j + 1,
              startRowIndex: k,
              endRowIndex: k + 1,
            },
            fields: "userEnteredFormat",
            rows: [{
              values: [{
                userEnteredFormat: {
                  backgroundColor: {
                    red: r / 255,
                    green: g / 255,
                    blue: b / 255,
                    alpha: 1,
                  }
                }
              }],
            }],
          }
        }
        requests.push(req)
      }
    }
    await sheet.spreadsheets.batchUpdate({
      auth,
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests,
      }
    })
  }
})()