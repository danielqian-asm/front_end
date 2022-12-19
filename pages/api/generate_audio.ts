import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { config } from "../../utils/config"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const modulePath = path.join(config.basePath, 'style_filter_fe/utils/modules.json')
  const {id, name, desc, steps} = req.query
  const data = await fs.readFileSync(modulePath, 'utf8');
  const configration = JSON.parse(data);
  configration.push({
    name,
    desc,
    id
  })
  await fs.writeFileSync(modulePath, JSON.stringify(configration))
  try {
    axios.get(`http://localhost:5001/train?id=${id}&desc=${desc}&steps=${steps}`)
    return res.status(200).json({})
  } catch (err) {
    console.log(err)
  }
}
export default handler