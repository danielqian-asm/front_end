// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { config } from "../../utils/config"

// { exec, execSync } 

type GeneratStatus = {
  url: string,
  isExist: boolean
}[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratStatus>
) {
  const { query } = req
  const { imageNumber, id } = query
  const fileList = fs.readdirSync(path.join(config.basePath, '/app/outputs'))

  let result = []
  for (let i = 0; i < (imageNumber || 0); i++) {
    // const readable = fs.readFileSync(path.join(config.basePath, 'stable_diffusion/app/outputs', `${id}_${i}.png`), 'binary');
    // let base64str = Buffer.from(readable, 'binary').toString('base64');
    result.push({
      url: path.join('/outputs', `${id}_${i}.png`),
      isExist: !!fileList.includes(`${id}_${i}.png`)
    })
  }
  return res.status(200).json(result)
}
